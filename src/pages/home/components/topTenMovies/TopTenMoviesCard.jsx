import axios from 'axios';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const BASE_URL = 'https://bookmyshow-backend-o592.onrender.com/';
const CACHE_KEY = 'top-10-movies';

const TopTenSkeleton = () => (
  <div className="flex gap-6 overflow-x-auto px-3 py-4 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden md:gap-8">
    {Array.from({ length: 6 }).map((_, idx) => (
      <div key={idx} className="relative flex w-36 shrink-0 items-end pl-6 md:w-52 md:pl-8">
        <span className="pointer-events-none absolute bottom-1 left-0 select-none text-5xl font-black leading-none text-slate-200 dark:text-slate-800 md:text-7xl">
          {idx + 1}
        </span>
        <div className="h-52 w-full animate-pulse rounded-2xl border border-amber-500/20 bg-gradient-to-br from-amber-500/15 via-rose-500/10 to-slate-800/40 md:h-72" />
      </div>
    ))}
  </div>
);

const TopTenMoviesCard = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [response, setResponse] = useState(() => {
    try {
      const cachedData = sessionStorage.getItem(CACHE_KEY);
      return cachedData ? JSON.parse(cachedData) : null;
    } catch {
      return null;
    }
  });
  const [responseStatus, setResponseStatus] = useState(() =>
    sessionStorage.getItem(CACHE_KEY) ? 200 : undefined
  );

  useEffect(() => {
    if (Array.isArray(response)) return;

    let cancelled = false;

    const fetchMovies = async () => {
      setLoading(true);
      try {
        const res = await axios.get(`${BASE_URL}apis/movies/top-ten-movies`);
        if (cancelled) return;
        setResponse(res.data);
        setResponseStatus(res.status);
        try {
          sessionStorage.setItem(CACHE_KEY, JSON.stringify(res.data));
        } catch {
          // Ignore storage quota errors
        }
      } catch (error) {
        if (cancelled) return;
        setResponse(error?.response?.data ?? null);
        setResponseStatus(error?.response?.status ?? 500);
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    const scheduleFetch = () => {
      if ('requestIdleCallback' in window) {
        return window.requestIdleCallback(fetchMovies, { timeout: 600 });
      }
      return window.setTimeout(fetchMovies, 120);
    };

    const handle = scheduleFetch();

    return () => {
      cancelled = true;
      if ('cancelIdleCallback' in window && typeof handle === 'number') {
        window.cancelIdleCallback(handle);
      } else {
        window.clearTimeout(handle);
      }
    };
  }, [response]);

  const movies = Array.isArray(response) ? response.slice(0, 10) : [];
  const hasError = typeof responseStatus === 'number' && responseStatus >= 400;

  return (
    <section className="mx-auto mt-16 w-[90%] max-w-7xl py-6 md:mt-24 md:w-[80%]">
      <div className="mb-5 flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <span className="inline-block h-6 w-1.5 rounded-full bg-gradient-to-b from-amber-400 to-rose-500" />
          <h2 className="text-xl font-extrabold tracking-tight text-slate-900 dark:text-white md:text-2xl">
            Trending Now
          </h2>
          <span className="rounded-full border border-amber-400/30 bg-amber-400/10 px-2.5 py-0.5 text-[11px] font-semibold uppercase tracking-wider text-amber-600 dark:text-amber-300">
            Top 10
          </span>
        </div>
      </div>

      {loading && !movies.length && <TopTenSkeleton />}

      {!loading && hasError && (
        <div className="rounded-2xl border border-rose-500/20 bg-rose-500/5 px-6 py-10 text-center">
          <p className="text-base font-medium text-slate-700 dark:text-slate-200 md:text-lg">
            No bookings found in last 30 days.
          </p>
        </div>
      )}

      {movies.length > 0 && (
        <div className="flex gap-6 overflow-x-auto px-3 pb-5 pt-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden md:gap-8">
          {movies.map((data, idx) => (
            <article
              key={data.id ?? idx}
              onClick={() => {
                if (data.id) {
                  navigate('/movie/shows', { state: { movieId: data.id } });
                }
              }}
              className="group relative flex w-36 shrink-0 cursor-pointer items-end pl-6 transition-transform duration-200 hover:-translate-y-1.5 md:w-52 md:pl-8"
            >
              {/* Overlapping Rank Number */}
              <span
                aria-hidden="true"
                className="pointer-events-none absolute bottom-1 left-0 z-10 select-none text-5xl font-black leading-none tracking-tighter text-slate-950/90 drop-shadow-[0_4px_12px_rgba(0,0,0,0.45)] transition-transform duration-300 group-hover:scale-110 [-webkit-text-stroke:1.5px_rgba(255,255,255,0.85)] dark:text-black md:text-7xl"
              >
                {idx + 1}
              </span>

              {/* Poster / Spotlight Card */}
              <div className="relative h-52 w-full overflow-hidden rounded-2xl border border-amber-400/25 bg-gradient-to-br from-rose-950 via-slate-900 to-amber-950 shadow-md transition-all duration-300 group-hover:border-amber-400/60 group-hover:shadow-xl group-hover:shadow-amber-500/10 md:h-72">
                {data.posterUrl && (
                  <img
                    src={data.posterUrl}
                    alt={data.name || `Rank ${idx + 1} movie`}
                    loading="lazy"
                    className="h-full w-full object-cover object-center transition-transform duration-300 group-hover:scale-105"
                  />
                )}

                {/* Subtle Bottom Gradient for Readability */}
                <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-transparent" />

                {/* Top-Right Rating Pill */}
                {data.rating !== undefined && data.rating !== null && (
                  <div className="absolute right-2.5 top-2.5 flex items-center gap-1 rounded-full bg-black/70 px-2.5 py-1 text-xs font-semibold text-amber-300 backdrop-blur-sm">
                    <span>★</span>
                    <span>{data.rating}</span>
                  </div>
                )}

                {/* Optional Movie Title at Bottom */}
                {data.name && (
                  <div className="absolute inset-x-0 bottom-0 p-3 pl-8 md:pl-10">
                    <h3 className="line-clamp-1 text-xs font-semibold text-white md:text-sm">
                      {data.name}
                    </h3>
                  </div>
                )}
              </div>
            </article>
          ))}
        </div>
      )}
    </section>
  );
};

export default TopTenMoviesCard;