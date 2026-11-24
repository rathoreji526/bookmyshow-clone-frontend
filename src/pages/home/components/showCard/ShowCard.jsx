import { useNavigate } from 'react-router-dom';

const ShowCard = ({ header, cardData }) => {
  const navigate = useNavigate();
  const isNowShowing = header === 'Now Showing';

  return (
    <section className="mx-auto w-[90%] max-w-7xl py-6 md:w-[80%]">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-lg font-bold tracking-tight text-slate-900 dark:text-white md:text-2xl">
          {header}
        </h2>
      </div>

      <div className="flex gap-4 overflow-x-auto pb-4 pt-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden md:gap-6">
        {Array.isArray(cardData) &&
          cardData.map((data, idx) => (
            <article
              key={data.id ?? idx}
              onClick={() => {
                if (isNowShowing) {
                  navigate('/movie/shows', {
                    state: { movieId: data.id },
                  });
                }
              }}
              className={`group flex w-40 shrink-0 flex-col gap-2.5 rounded-xl p-1.5 transition-all duration-200 md:w-60 ${
                isNowShowing
                  ? 'cursor-pointer hover:-translate-y-1 active:translate-y-0'
                  : ''
              }`}
            >
              <div className="aspect-[2/3] w-full overflow-hidden rounded-xl border border-slate-200/80 bg-slate-900 shadow-sm transition-shadow duration-200 group-hover:shadow-lg dark:border-slate-700">
                {data.posterUrl ? (
                  <img
                    src={data.posterUrl}
                    alt={data.name || 'Movie poster'}
                    loading="lazy"
                    className="h-full w-full object-cover object-center transition-transform duration-300 group-hover:scale-105"
                  />
                ) : (
                  <div className="flex h-full w-full items-center justify-center px-3 text-center text-xs text-slate-400">
                    No Poster Available
                  </div>
                )}
              </div>

              <div className="flex flex-col gap-1 px-0.5">
                <h3 className="line-clamp-1 text-sm font-semibold text-slate-900 transition-colors group-hover:text-indigo-600 dark:text-slate-100 dark:group-hover:text-indigo-400 md:text-base">
                  {data.name}
                </h3>
                <p className="line-clamp-2 text-xs font-normal leading-relaxed text-slate-500 dark:text-slate-400 md:text-sm">
                  {data.description ?? 'Description not provided'}
                </p>
              </div>
            </article>
          ))}
      </div>
    </section>
  );
};

export default ShowCard;