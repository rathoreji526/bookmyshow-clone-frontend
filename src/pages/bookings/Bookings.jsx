import axios from "axios";
import { useEffect, useState } from "react";
import { isAuthenticated } from "../../utils/Auth";
import Loader from "../../components/loader/Loader";

const baseURL = "https://bookmyshow-backend-o592.onrender.com";
const Bookings = () => {
  if(!isAuthenticated){
    return;
  }
  const token = localStorage.getItem('token');
  const [loading, setLoading] = useState(false);
  const [bookingResponse, setBookingResponse] = useState(()=>{
    const data = sessionStorage.getItem('bookings');
    return data ? JSON.parse(data) : null;
  });
  const [responseStatus, setResponseStatus] = useState();
  useEffect(() => {
    if(bookingResponse){
      return;
    }
    const fetchBookings = async () => {
      setLoading(true);
      try {
        const response = await axios.get(
          baseURL+'/apis/booking/find-bookings',{
            headers:{
              Authorization:`Bearer ${token}`
            }
          }
        )
        sessionStorage.setItem('bookings',JSON.stringify(response.data));
        setBookingResponse(response.data);
        setResponseStatus(response.status);
      }catch(e){
        setBookingResponse(e.response.data);
        setResponseStatus(e.status);
      }finally{
        setLoading(false);
      }
    }
    fetchBookings();
  },[])
  const formatPrice = (amount) => {
  if (amount == null) return "₹0";
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(amount);
};

const formatDateTime = (isoString) => {
  if (!isoString) return "—";
  const date = new Date(isoString);
  if (Number.isNaN(date.getTime())) return isoString;
  return date.toLocaleString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

const StatusBadge = ({ status }) => {
  const normalized = (status || "").toUpperCase();

  if (normalized === "CONFIRMED") {
    return (
      <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-500/15 px-3 py-1 text-xs font-semibold text-emerald-300 border border-emerald-500/30">
        <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
        CONFIRMED
      </span>
    );
  }

  if (normalized === "PENDING") {
    return (
      <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-500/15 px-3 py-1 text-xs font-semibold text-amber-300 border border-amber-500/30">
        <span className="h-1.5 w-1.5 rounded-full bg-amber-400 animate-pulse" />
        PENDING
      </span>
    );
  }

  return (
    <span className="inline-flex items-center rounded-full bg-slate-700 px-3 py-1 text-xs font-medium text-slate-300">
      {normalized || "UNKNOWN"}
    </span>
  );
};
const handleResumePayment = () =>{
  console.log('resuming....');
  
}

return (
  <div className="min-h-screen w-full bg-slate-950 text-slate-100 px-4 py-8 sm:px-6 lg:px-8">
    <div className="mx-auto max-w-5xl">
      {/* Page Header */}
      <div className="mb-8 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-white sm:text-3xl">
            My Bookings
          </h1>
          <p className="mt-1 text-sm text-slate-400">
            View your confirmed tickets and complete any pending seat bookings.
          </p>
        </div>
        {Array.isArray(bookingResponse) && bookingResponse.length > 0 && (
          <span className="text-xs font-medium text-slate-400">
            Total Bookings: {bookingResponse.length}
          </span>
        )}
      </div>

      {/* Loading State */}
      {loading && (
        <div className="flex min-h-[240px] items-center justify-center rounded-2xl border border-slate-800 bg-slate-900/60 p-6">
          <Loader />
        </div>
      )}

      {/* Empty State */}
      {!loading && (!bookingResponse || bookingResponse.length === 0) && (
        <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-10 text-center">
          <p className="text-base font-medium text-slate-200">
            No bookings found yet
          </p>
          <p className="mt-1 text-sm text-slate-400">
            Once you select seats and initiate a booking, it will appear here.
          </p>
        </div>
      )}

      {/* Bookings List */}
      {!loading && Array.isArray(bookingResponse) && bookingResponse.length > 0 && (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          {bookingResponse.map((booking, idx) => {
            const seats = Array.isArray(booking.bookedSeats)
              ? booking.bookedSeats
              : [];
            const isPending =
              (booking.bookingStatus || "").toUpperCase() === "PENDING";

            return (
              <div
                key={booking.id || idx}
                className="flex flex-col justify-between rounded-2xl border border-slate-800 bg-slate-900 p-5 shadow-lg transition hover:border-slate-700"
              >
                <div>
                  {/* Top Row: Status + Amount */}
                  <div className="flex items-start justify-between gap-3">
                    <StatusBadge status={booking.bookingStatus} />
                    <div className="text-right">
                      <p className="text-xs text-slate-400">Total Amount</p>
                      <p className="text-lg font-bold text-white">
                        {formatPrice(booking.totalPrice)}
                      </p>
                    </div>
                  </div>

                  {/* Booking ID */}
                  <div className="mt-4 rounded-xl bg-slate-950/70 px-3 py-2 border border-slate-800/80">
                    <p className="text-[11px] uppercase tracking-wider text-slate-500">
                      Booking ID
                    </p>
                    <p className="mt-0.5 truncate font-mono text-xs text-slate-300">
                      {booking.id}
                    </p>
                  </div>

                  {/* Metadata Details */}
                  <div className="mt-4 space-y-2 text-sm">
                    <div className="flex items-center justify-between text-slate-300">
                      <span className="text-slate-400">Booked Seats</span>
                      <span className="font-medium">
                        {seats.length > 0
                          ? seats
                              .map((s) => s.seatNumber || s.seat?.seatNumber || s.id)
                              .join(", ")
                          : "—"}
                      </span>
                    </div>

                    <div className="flex items-center justify-between text-slate-300">
                      <span className="text-slate-400">Created At</span>
                      <span className="text-xs text-slate-300">
                        {formatDateTime(booking.createdAt)}
                      </span>
                    </div>

                    {isPending && booking.bookingExpiry && (
                      <div className="flex items-center justify-between text-amber-300/90">
                        <span className="text-amber-400/80">Lock Expires</span>
                        <span className="text-xs font-medium">
                          {formatDateTime(booking.bookingExpiry)}
                        </span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Action Footer for PENDING Bookings */}
                {isPending && (
                  <div className="mt-5 border-t border-slate-800 pt-4 flex items-center justify-end gap-2">
                    <button
                      type="button"
                      onClick={() => handleResumePayment?.(booking)}
                      className="w-full rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-indigo-500 cursor-pointer"
                    >
                      Complete Payment
                    </button>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  </div>
);
}

export default Bookings