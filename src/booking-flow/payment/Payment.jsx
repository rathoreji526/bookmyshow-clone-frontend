import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { Navigate, useLocation, useNavigate } from 'react-router-dom'
import Loader from '../../components/loader/Loader';
import Notification from '../../components/notification/Notification';

const baseURL = "https://bookmyshow-backend-o592.onrender.com";

const Payment = () => {
  const navigate = useNavigate();
  const token = localStorage.getItem('token');
  const location = useLocation();
  const transactionId = location.state?.transactionId;
  const [loading, setLoading] = useState(false);
  const [showNotification, setShowNotification] = useState(false);
  const [transactionResponse, setTransactionResponse] = useState();
  const [transactionResponseStatus, setTransactionResponseStatus] = useState();
  const [transactionSuccess, setTransactionSuccess] = useState(false);

  // console.log(transactionId);

  const handleTransaction = async (completed) => {
    const body = {
      transactionId,
      'transactionCompleted': completed
    }
    console.log(completed);
    setLoading(true);
    try {
      const response = await axios.post(
        baseURL + '/apis/transaction/make-payment',
        body, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      })
      console.log(response.data);
      setTransactionResponse(response.data+",\nRedirecting to home page...");
      setTransactionResponseStatus(response.status);
      setTransactionSuccess(true);

    } catch (e) {
      setTransactionResponse(e.response.data);
      setTransactionResponseStatus(e.status);
      console.log(transactionResponse);

    } finally {
      setShowNotification(true);
      setTimeout(() => {
        setShowNotification(false);
      }, 5000)
      setLoading(false);
    }
  }
  useEffect(() => {
    if (!transactionSuccess) {
      return;
    }
    const timerId = setTimeout(() => {
      navigate('/');
    }, 5000)
    return () => clearTimeout(timerId);
  }, [transactionSuccess])
  return (
    <div className="min-h-full w-full bg-slate-900 flex items-center justify-center p-4">
      {
        loading && <Loader />
      }
      {
        showNotification &&
        <Notification
          message={transactionResponse}
          status={transactionResponseStatus >= 400 ? 'Error' : 'Success'}
          key={Date.now()}
        />
      }
      <div className="w-full max-w-sm rounded-2xl bg-white p-6 shadow-xl border border-slate-200">
        <div className="mb-5 text-center">
          <h2 className="text-lg font-semibold text-slate-900">
            Confirm Your Payment
          </h2>
          <p className="mt-1 text-sm text-slate-500">
            Complete the transaction or cancel to return to seats.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 p-1">
          <button
            type="button"
            className="w-full sm:w-auto flex-1 rounded-lg bg-emerald-600 px-4 py-2.5 text-sm font-medium text-white shadow-sm transition hover:bg-emerald-700 active:scale-[0.99] focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 cursor-pointer"
            onClick={() => {
              handleTransaction(true)
            }}
          >
            Complete Payment
          </button>

          <button
            type="button"
            className="w-full sm:w-auto flex-1 rounded-lg border border-rose-200 bg-rose-50 px-4 py-2.5 text-sm font-medium text-rose-700 transition hover:bg-rose-100 active:scale-[0.99] focus:outline-none focus:ring-2 focus:ring-rose-500 focus:ring-offset-2 cursor-pointer"
            onClick={() => {
              handleTransaction(false)
            }}
          >
            Cancel Payment
          </button>
        </div>
      </div>
    </div>
  )
}

export default Payment
