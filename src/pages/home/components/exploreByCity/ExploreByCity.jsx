import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const BASE_URL = 'https://bookmyshow-backend-o592.onrender.com';
const CACHE_KEY = 'cities-upcoming-shows';

const CitySkeleton = () => (
  <div className="flex flex-wrap gap-3">
    {Array.from({ length: 10 }).map((_, idx) => (
      <div
        key={idx}
        className="h-11 w-28 animate-pulse rounded-full border border-slate-200/70 bg-slate-100 dark:border-slate-800 dark:bg-slate-800/60 md:w-36"
      />
    ))}
  </div>
);

const ExploreByCity = ({ onSelectCity }) => {
  const navigate = useNavigate();
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(false);
  const [cities, setCities] = useState(() => {
    try {
      const cached = sessionStorage.getItem(CACHE_KEY);
      const parsed = cached ? JSON.parse(cached) : null;
      return Array.isArray(parsed) ? parsed : [];
    } catch {
      return [];
    }
  });
  const [responseStatus, setResponseStatus] = useState(() =>
    sessionStorage.getItem(CACHE_KEY) ? 200 : undefined
  );

  useEffect(() => {
    if (cities.length > 0) return;

    let cancelled = false;

    const fetchCities = async () => {
      setLoading(true);
      try {
        const res = await axios.get(`${BASE_URL}/apis/show/cities-with-upcoming-shows`);
        if (cancelled) return;
        const list = Array.isArray(res.data) ? res.data : [];
        setCities(list);
        setResponseStatus(res.status);
        try {
          sessionStorage.setItem(CACHE_KEY, JSON.stringify(list));
        } catch {
          // Ignore storage quota errors
        }
      } catch (error) {
        if (cancelled) return;
        setResponseStatus(error?.response?.status ?? 500);
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    const scheduleFetch = () => {
      if ('requestIdleCallback' in window) {
        return window.requestIdleCallback(fetchCities, { timeout: 800 });
      }
      return window.setTimeout(fetchCities, 180);
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
  }, [cities.length]);

  const filteredCities = cities.filter((item) =>
    item?.city?.toLowerCase().includes(search.trim().toLowerCase())
  );

  const hasError = typeof responseStatus === 'number' && responseStatus >= 400;

  const handleCityClick = (cityName) => {
    if (typeof onSelectCity === 'function') {
      onSelectCity(cityName);
      return;
    }
    navigate('/movie/shows', { state: { city: cityName } });
  };

  return (
    <section className="mx-auto mt-12 w-[90%] max-w-7xl py-6 md:mt-16 md:w-[80%]">
      <div className="rounded-3xl border border-slate-200/80 bg-gradient-to-br from-slate-50 via-white to-indigo-50/40 p-6 shadow-sm dark:border-slate-800 dark:from-slate-900 dark:via-slate-900 dark:to-indigo-950/30 md:p-8">
        {/* Header + Optional Quick Filter */}
        <div className="mb-6 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
          <div>
            <div className="flex items-center gap-2.5">
              <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-indigo-500/10 text-indigo-600 dark:bg-indigo-400/15 dark:text-indigo-400">
                <svg
                  className="h-4 w-4"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M12 21s-6-5.33-6-10a6 6 0 1 1 12 0c0 4.67-6 10-6 10Z"
                  />
                  <circle cx="12" cy="11" r="2.5" />
                </svg>
              </span>
              <h2 className="text-xl font-bold tracking-tight text-slate-900 dark:text-white md:text-2xl">
                Explore by City
              </h2>
            </div>
            <p className="mt-1 text-xs text-slate-500 dark:text-slate-400 md:text-sm">
              Discover theaters and upcoming shows near you
            </p>
          </div>

          {cities.length > 6 && (
            <div className="relative w-full sm:w-64">
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Filter cities..."
                aria-label="Filter cities"
                className="w-full rounded-full border border-slate-200 bg-white px-4 py-2 text-sm text-slate-800 placeholder-slate-400 outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 dark:border-slate-700 dark:bg-slate-800/80 dark:text-slate-100 dark:placeholder-slate-500"
              />
              {search && (
                <button
                  type="button"
                  onClick={() => setSearch('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
                >
                  ✕
                </button>
              )}
            </div>
          )}
        </div>

        {/* Loading State */}
        {loading && cities.length === 0 && <CitySkeleton />}

        {/* Error State */}
        {!loading && hasError && (
          <p className="rounded-xl border border-rose-500/20 bg-rose-500/5 px-4 py-6 text-center text-sm text-slate-600 dark:text-slate-300">
            Unable to load cities right now. Please try again later.
          </p>
        )}

        {/* City Pills Grid */}
        {!loading && !hasError && filteredCities.length > 0 && (
          <div className="flex flex-wrap gap-2.5 md:gap-3 p-2">
            {filteredCities.map((data, idx) => (
              <button
                key={data.id ?? data.city ?? idx}
                type="button"
                onClick={() => handleCityClick(data.city)}
                className="group inline-flex items-center gap-2 rounded-full border border-slate-200/90 bg-white px-4 py-2.5 text-sm font-medium text-slate-700 shadow-2xs transition-all duration-200 hover:-translate-y-0.5 hover:border-indigo-500 hover:bg-indigo-600 hover:text-white hover:shadow-md active:translate-y-0 dark:border-slate-700/80 dark:bg-slate-800/90 dark:text-slate-200 dark:hover:border-indigo-400 dark:hover:bg-indigo-500 dark:hover:text-white"
              >
                <span className="h-1.5 w-1.5 rounded-full bg-indigo-500 transition-colors group-hover:bg-white" />
                <span className="capitalize">{data.city}</span>
                {data.showCount !== undefined && (
                  <span className="rounded-full bg-slate-100 px-2 py-0.5 text-[11px] font-semibold text-slate-500 transition-colors group-hover:bg-white/20 group-hover:text-white dark:bg-slate-700 dark:text-slate-300">
                    {data.showCount}
                  </span>
                )}
                <span
                  aria-hidden="true"
                  className="-mr-1 max-w-0 overflow-hidden opacity-0 transition-all duration-200 group-hover:max-w-[1rem] group-hover:opacity-100"
                >
                  →
                </span>
              </button>
            ))}
          </div>
        )}

        {!loading && !hasError && cities.length > 0 && filteredCities.length === 0 && (
          <p className="py-6 text-center text-sm text-slate-500 dark:text-slate-400">
            No cities matching &ldquo;{search}&rdquo;.
          </p>
        )}
      </div>
    </section>
  );
};

export default ExploreByCity;