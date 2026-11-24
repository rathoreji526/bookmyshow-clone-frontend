import axios from "axios";
import { useEffect, useState } from "react";
import { Navigate, useLocation, useNavigate } from "react-router-dom"
import Loader from "../../components/loader/Loader";

const baseURL = "https://bookmyshow-backend-o592.onrender.com";

const Show = () => {
  const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

  const getMonth = (monthNumber) => {
    const index = Number(monthNumber) - 1;
    return index >= 0 && index < 12 ? MONTHS[index] : null;
  };

  const getDateTime = (dateTime) => {
    if (!dateTime || typeof dateTime !== 'string') return null;
    // Expected format: "2026-11-25T12:00:00"
    const day = dateTime.slice(8, 10);
    const month = getMonth(dateTime.slice(5, 7));
    const time = dateTime.slice(11, 16);
    return month ? `${day}-${month} ${time}` : null;
  };

  const getShowRequestConfig = (movieId, city) => {
    if (movieId) {
      return {
        url: `${baseURL}/apis/show/find-show`,
        params: { movieId },
        cacheKey: `shows-movie-${movieId}`,
      };
    }

    const cleanCity = typeof city === 'string' ? city.trim() : '';
    if (cleanCity) {
      return {
        url: `${baseURL}/apis/show/find-by-city/${encodeURIComponent(cleanCity)}`,
        params: {}, // Path param already sent in URL; agar query param chahiye toh { city: cleanCity } rakhein
        cacheKey: `shows-city-${cleanCity.toLowerCase()}`,
      };
    }

    return null;
  };

  const readCache = (cacheKey) => {
    if (!cacheKey) return null;
    try {
      const cached = sessionStorage.getItem(cacheKey);
      return cached ? JSON.parse(cached) : null;
    } catch {
      return null;
    }
  };

  const navigate = useNavigate();
  const token = localStorage.getItem('token');
  const location = useLocation();
  const movieId = location.state?.movieId;
  const city = location.state?.city;
  console.log(city);
  

  const initialConfig = getShowRequestConfig(movieId, city);

  const [shows, setShows] = useState(() => readCache(initialConfig?.cacheKey));
  const [loading, setLoading] = useState(false);
  const [responseStatus, setResponseStatus] = useState(() =>
    initialConfig && readCache(initialConfig.cacheKey) ? 200 : undefined
  );

  useEffect(() => {
    const activeConfig = getShowRequestConfig(movieId, city);

    if (!activeConfig) {
      setShows(null);
      setResponseStatus(undefined);
      setLoading(false);
      return;
    }

    const cachedData = readCache(activeConfig.cacheKey);
    if (cachedData) {
      setShows(cachedData);
      setResponseStatus(200);
      setLoading(false);
      return;
    }

    let ignore = false;

    const getShows = async () => {
      setLoading(true);
      try {
        const response = await axios.get(activeConfig.url, {
          params: activeConfig.params,
        });
        console.log(response.data);
        
        if (ignore) return;

        const data = Array.isArray(response.data) ? response.data : [];
        sessionStorage.setItem(activeConfig.cacheKey, JSON.stringify(data));
        setShows(data);
        setResponseStatus(response.status);
      } catch (e) {
        if (ignore) return;
        setShows(null);
        setResponseStatus(e.response?.status ?? 500);
      } finally {
        if (!ignore) setLoading(false);
      }
    };

    getShows();

    return () => {
      ignore = true;
    };
  }, [movieId, city]);

  // console.log('show id: '+ showId);

  return (
    <div className="min-h-screen w-full bg-slate-950 px-6 py-10 text-slate-100 flex justify-center">
      {loading && <Loader />}
      <div className="w-full max-w-5xl flex flex-col gap-8">
        <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-white p-1">
          {shows ? 'Select Show' : 'Sorry! No Shows found!'}
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 p-2">
          {shows &&
            shows.map((data, idx) => {
              return (
                <div
                  key={idx}
                  className="group relative flex flex-col justify-between gap-3 rounded-xl border border-slate-800 bg-slate-900/90 p-5 shadow-md transition-all duration-200 hover:-translate-y-0.5 hover:border-indigo-500/60 hover:bg-slate-900 hover:shadow-lg hover:shadow-indigo-950/30 cursor-pointer"
                  onClick={() => {
                    navigate('/movie/show/show-seats', {
                      state: {
                        showId: data.id
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