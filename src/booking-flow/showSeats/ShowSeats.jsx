import axios from 'axios';
import React, { useEffect, useMemo, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Loader from '../../components/loader/Loader';
import Notification from '../../components/notification/Notification';
import { isAuthenticated } from '../../utils/Auth';
import NavigateToLoginPage from '../../utils/NavigateToLoginPage';

const baseURL = "https://bookmyshow-backend-o592.onrender.com";

const ShowSeats = () => {
  const token = localStorage.getItem('token');
  const location = useLocation();
  const navigate = useNavigate();
  const showId = location.state?.showId;
  // console.log('showId: ' + showId);

  const [loading, setLoading] = useState(false);
  const [response, setResponse] = useState(() => {
    const data = sessionStorage.getItem(`show-seats-${showId}`);
    return data ? JSON.parse(data) : null;
  });
  const [responseStatus, setResponseStatus] = useState();
  const [selectedSeatIds, setSelectedSeatIds] = useState([]);
  const [showLoginRedirect, setShowLoginRedirect] = useState(false);
  const [loginRedirectMessage, setLoginRedirectMessage] = useState();

  useEffect(() => {
    if (!showId || response) {
      return;
    }
    const getShowSeats = async () => {
      setLoading(true);
      try {
        const res = await axios.get(`${baseURL}/apis/seat/getAllShowSeats`, {
          params: { showId },
        });
        console.log(res);
        sessionStorage.setItem(`show-seats-${showId}`, JSON.stringify(res.data));
        setResponse(res.data);
        setResponseStatus(res.status);
      } catch (e) {
        setResponse(e.response?.data || null);
        setResponseStatus(e.response?.status);
      } finally {
        setLoading(false);
      }
    };

    getShowSeats();
  }, [showId, response]);

  // Seats ko rowName (aur optionally seatType) ke hisaab se group karna
  const groupedRows = useMemo(() => {
    const seatsArray = Array.isArray(response)
      ? response
      : Array.isArray(response?.data)
        ? response.data
        : [];

    if (!seatsArray.length) return [];

    const rowMap = new Map();

    seatsArray.forEach((seat) => {
      if (seat.active === false) return;
      const rowKey = seat.rowName || seat.seatNumber?.[0] || 'Other';
      if (!rowMap.has(rowKey)) {
        rowMap.set(rowKey, {
          rowName: rowKey,
          seatType: seat.seatType || 'STANDARD',
          price: seat.price ?? 0,
          seats: [],
        });
      }
      rowMap.get(rowKey).seats.push(seat);
    });

    // Row (A, B, C...) aur seat number ke hisaab se sort karna
    // Row ko original order mein rakhein, aur har row ke andar seats ko sort karein
    return Array.from(rowMap.values())
      .sort((a, b) => b.rowName.localeCompare(a.rowName))
      .map((group) => ({
        ...group,
        seats: [...group.seats].sort((a, b) => {
          const numA = parseInt(a.seatNumber?.replace(/\D/g, ''), 10) || 0;
          const numB = parseInt(b.seatNumber?.replace(/\D/g, ''), 10) || 0;
          return numA - numB;
        }),
      }));
  }, [response]);

  // Seat select / unselect toggle
  const handleToggleSeat = (seat) => {
    if (seat.seatStatus !== 'AVAILABLE') return;

    setSelectedSeatIds((prev) =>
      prev.includes(seat.id)
        ? prev.filter((id) => id !== seat.id)
        : [...prev, seat.id]
    );
  };

  // Selected seats ke full objects aur total amount
  const selectedSeats = useMemo(() => {
    const allSeats = groupedRows.flatMap((r) => r.seats);
    return allSeats.filter((seat) => selectedSeatIds.includes(seat.id));
  }, [groupedRows, selectedSeatIds]);

  const totalAmount = useMemo(
    () => selectedSeats.reduce((sum, seat) => sum + (Number(seat.price) || 0), 0),
    [selectedSeats]
  );

  // Next step (seat lock / booking page)
  const [initiatePaymentResponse, setInitiatePaymentResponse] = useState();
  const [initiatePaymentResponseStatus, setInitiatePaymentResponseStatus] = useState();
  const [showErrorNotification, setShowErrorNotification] = useState(false);
  const handleProceed = async () => {
    if (!selectedSeatIds.length) return;
    // Authenticate
    if (!isAuthenticated()) {
      setLoginRedirectMessage('Please login to continue, Redirecting to login page...');
      setShowLoginRedirect(true);
      return;
    }

    const body = {
      'showSeatIds': selectedSeatIds,
      showId
    }
    setLoading(true);
    try {
      const response = await axios.post(
        baseURL + '/apis/booking/initiate-payment',
        body, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      })
      setInitiatePaymentResponse(response.data);
      setInitiatePaymentResponseStatus(response.status);
      // console.log(response);

      navigate('/movie/show/show-seats/payment', {
        state: {
          'transactionId': response.data.txnId
        }
      })
    } catch (e) {
      if (e.status < 500) {//user side issue
        // console.log(e.response.data);

        setInitiatePaymentResponse(e.status == 403 ? 'Unauthorised!' : e.response?.data);
        setInitiatePaymentResponseStatus(e.status);
      } else {//server side issue
        setInitiatePaymentResponse('Internal Server Error!');
        setInitiatePaymentResponseStatus(e.status);
      }
      setShowErrorNotification(true);
      // console.log(initiatePaymentResponse);

    } finally {
      setLoading(false);
      const timeout = setTimeout(() => {
        setShowErrorNotification(false);
      }, 5000);
      return () => clearTimeout(timeout);
    }
  };

  return (
    <div className="min-h-screen w-full bg-slate-950 px-4 py-8 pb-32 text-slate-100 flex flex-col items-center">
      {showLoginRedirect && <NavigateToLoginPage message={loginRedirectMessage} />}
      {loading && <Loader />}

      {showErrorNotification &&
        <Notification
          message={initiatePaymentResponse}
          type={'Error'}
          key={Date.now()}
        />}

      {!loading && (!showId || groupedRows.length === 0) && (
        <div className="w-full max-w-4xl rounded-2xl border border-slate-800 bg-slate-900/70 p-10 text-center">
          <h2 className="text-2xl font-bold text-white">
            {!showId ? 'Invalid Show Selected' : 'Sorry! No Seats Found'}
          </h2>
          <p className="mt-2 text-sm text-slate-400">
            Please go back and select another show.
          </p>
        </div>
      )}

      {!loading && groupedRows.length > 0 && (
        <div className="w-full max-w-5xl flex flex-col gap-8">
          {/* Header */}
          <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-800 pb-4">
            <div>
              <h2 className="text-2xl md:text-3xl font-bold tracking-tight text-white">
                Select Your Seats
              </h2>
              <p className="text-xs text-slate-400 mt-1">
                Tap available seats to select multiple seats
              </p>
            </div>

            {/* Legend */}
            <div className="flex flex-wrap items-center gap-4 text-xs font-medium text-slate-300">
              <div className="flex items-center gap-2">
                <span className="h-4 w-4 rounded border border-emerald-500/60 bg-slate-900 inline-block" />
                <span>Available</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="h-4 w-4 rounded border border-indigo-400 bg-indigo-600 inline-block" />
                <span>Selected</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="h-4 w-4 rounded border border-slate-800 bg-slate-800/70 opacity-60 inline-block" />
                <span>Booked</span>
              </div>
            </div>
          </div>

          {/* Row-wise Seat Map */}
          <div className="w-full overflow-x-auto pb-4">
            <div className="min-w-fit mx-auto flex flex-col gap-4 px-2 items-center">
              {groupedRows.map((group, groupIdx) => {
                const prevType = groupIdx > 0 ? groupedRows[groupIdx - 1].seatType : null;
                const showTierHeader = group.seatType !== prevType;

                return (
                  <React.Fragment key={group.rowName}>
                    {showTierHeader && (
                      <div className="flex items-center justify-between border-b border-slate-800/80 pb-1.5 mt-2">
                        <span className="text-xs font-semibold uppercase tracking-widest text-indigo-300">
                          {group.seatType} — ₹{group.price}
                        </span>
                      </div>
                    )}

                    <div className="flex items-center gap-4">
                      {/* Row Label */}
                      <span className="w-6 text-center text-sm font-bold text-slate-400 select-none">
                        {group.rowName}
                      </span>

                      {/* Seats in Row */}
                      <div className="flex items-center gap-3 flex-nowrap p-1">
                        {group.seats.map((seat) => {
                          const isBooked = seat.seatStatus !== 'AVAILABLE';
                          const isSelected = selectedSeatIds.includes(seat.id);

                          let seatStyle =
                            'border-emerald-500/50 bg-slate-900 text-emerald-200 hover:border-emerald-400 hover:bg-emerald-500/15 cursor-pointer';

                          if (isBooked) {
                            seatStyle =
                              'border-slate-800 bg-slate-800/60 text-slate-600 cursor-not-allowed opacity-60';
                          } else if (isSelected) {
                            seatStyle =
                              'border-indigo-400 bg-indigo-600 text-white shadow-md shadow-indigo-950/60 scale-105 cursor-pointer';
                          }

                          return (
                            <button
                              key={seat.id}
                              type="button"
                              disabled={isBooked}
                              onClick={() => handleToggleSeat(seat)}
                              title={`${seat.seatNumber} • ${seat.seatType} • ₹${seat.price} (${seat.seatStatus})`}
                              className={`h-9 w-9 sm:h-10 sm:w-10 rounded-lg border text-[11px] sm:text-xs font-semibold tabular-nums transition-all duration-150 flex items-center justify-center select-none ${seatStyle}`}
                            >
                              {seat.seatNumber}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  </React.Fragment>
                );
              })}
            </div>
          </div>

          {/* Bottom Cinema Screen */}
          <div className="w-full max-w-2xl mx-auto mt-6 flex flex-col items-center gap-2 select-none">
            <div className="h-2.5 w-full rounded-t-full bg-gradient-to-r from-indigo-500/20 via-indigo-400 to-indigo-500/20 shadow-[0_6px_28px_rgba(99,102,241,0.55)]" />
            <div className="h-8 w-11/12 bg-gradient-to-b from-indigo-500/15 to-transparent clip-path-screen" />
            <span className="text-[11px] font-semibold uppercase tracking-[0.25em] text-slate-400 -mt-5">
              All eyes this way — Screen
            </span>
          </div>
        </div>
      )}

      {/* Sticky Bottom Bar for Selected Seats & Proceed */}
      {selectedSeatIds.length > 0 && (
        <div className="fixed bottom-0 inset-x-0 z-30 border-t border-slate-800 bg-slate-900/95 backdrop-blur-md px-4 py-3.5 shadow-2xl">
          <div className="mx-auto flex max-w-5xl items-center justify-between gap-4">
            <div className="flex flex-col gap-1 min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-xs font-semibold uppercase tracking-wider text-indigo-300">
                  Selected ({selectedSeats.length}):
                </span>
                <span className="text-sm font-bold text-white truncate">
                  {selectedSeats.map((s) => s.seatNumber).join(', ')}
                </span>
              </div>
              <p className="text-xs text-slate-400 tabular-nums">
                Total Amount:{' '}
                <span className="text-sm font-bold text-emerald-400">
                  ₹{totalAmount}
                </span>
              </p>
            </div>

            <button
              type="button"
              onClick={handleProceed}
              className="shrink-0 rounded-xl bg-indigo-600 px-5 py-2.5 text-sm font-semibold text-white shadow-lg shadow-indigo-950/50 transition hover:bg-indigo-500 active:scale-[0.99] cursor-pointer"
            >
              Next • Lock Seats
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ShowSeats;