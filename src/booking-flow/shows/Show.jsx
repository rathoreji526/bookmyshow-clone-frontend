import axios from "axios";
import { useEffect, useState } from "react";
import { Navigate, useLocation, useNavigate } from "react-router-dom"
import Loader from "../../components/loader/Loader";

const baseURL = "https://bookmyshow-backend-o592.onrender.com";

const Show = () => {
  const navigate = useNavigate();
  const token = localStorage.getItem('token');
  const location = useLocation();
  const movieId = location.state?.movieId;
  const [loading, setLoading] = useState(false);
  const [response, setResponse] = useState(() => {
    const data = sessionStorage.getItem(`shows-${movieId}`);
    return data ? JSON.parse(data) : null;
  });
  const [responseStatus, setResponseStatus] = useState();

  const getMonth = (n) => {
    if (n < 0 || n > 12) return null;
    const arr = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    return arr[n - 1];
  }
  const getDateTime = (dateTime) => {
    if (!dateTime) return null;
    //2026-11-25T12:00:00
    return `${dateTime.slice(8, 10)}-${getMonth(dateTime.slice(5, 7))} ${dateTime.slice(11, 16)}`;
  }
  useEffect(() => {
    if (response) {
      return;
    }
    const getShows = async () => {
      // console.log(movieId);
      setLoading(true);
      try {
        const response = await axios.get(
          baseURL + '/apis/show/find-show',
          {
            params: {
              'movieId': movieId
            }
          }
        )
        sessionStorage.setItem(`shows-${movieId}`, JSON.stringify(response.data));
        setResponse(response.data);
        setResponseStatus(response.status);
      } catch (e) {
        setResponse(e.response?.data ?? e.message);
        setResponseStatus(e.status);
      } finally {
        setLoading(false);
      }
    }
    getShows();
  }, [movieId])

  // console.log('show id: '+ showId);
  
  return (
    <div className="min-h-screen w-full bg-slate-950 px-6 py-10 text-slate-100 flex justify-center">
      {loading && <Loader />}
      <div className="w-full max-w-5xl flex flex-col gap-8">
        <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-white p-1">
          {response ? 'Select Show' : 'Sorry! No Shows found!'}
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 p-2">
          {response &&
            response.map((data, idx) => {
              return (
                <div
                  key={idx}
                  className="group relative flex flex-col justify-between gap-3 rounded-xl border border-slate-800 bg-slate-900/90 p-5 shadow-md transition-all duration-200 hover:-translate-y-0.5 hover:border-indigo-500/60 hover:bg-slate-900 hover:shadow-lg hover:shadow-indigo-950/30 cursor-pointer"
                  onClick={()=>{
                    navigate('/movie/show/show-seats',{
                      state:{
                        showId:data.id
                      }
                    })
                  }}
                >
                  <div className="flex items-center justify-between gap-2">
                    <h5 className="text-sm font-semibold tabular-nums tracking-wide text-indigo-300">
                      {getDateTime(data.startTime)} - {getDateTime(data.endTime).slice(7)}
                    </h5>
                    <span className="inline-flex items-center rounded-md border border-indigo-500/30 bg-indigo-500/10 px-2 py-0.5 text-[11px] font-semibold uppercase tracking-wider text-indigo-300">
                      {data.format?.replace('FORMAT_', '') || '2D'}
                    </span>
                  </div>

                  <h6 className="text-lg font-bold tracking-tight text-white">
                    {data.theaterName ? data.theaterName : 'Theater not provided'}
                  </h6>

                  <h6 className="flex items-center gap-1.5 pt-2 border-t border-slate-800/80 text-xs font-medium text-slate-400">
                    <span className="text-sm leading-none">📍</span>
                    <span className="capitalize">{data.city?.toLowerCase()}</span>
                    <span className="text-slate-500 tabular-nums">({data.zipcode})</span>
                  </h6>
                </div>
              );
            })}
        </div>
      </div>
    </div>
  )
}

export default Show