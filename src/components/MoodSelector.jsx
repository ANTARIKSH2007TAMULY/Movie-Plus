import { useEffect, useMemo, useState } from "react";
import MovieCard from "./MovieCard";
import Pagination from "./Pagination";
import { useLocalStorage } from "../hooks/useLocalStorage";
import { discoverMovies } from "../lib/tmdb";
//moodselector
const MOODS = [
  { value: "happy", label: "Happy", genres: [35, 16, 10751] }, // Comedy, Animation, Family
  { value: "sad", label: "Sad", genres: [18, 10749] }, // Drama, Romance
  { value: "excited", label: "Excited", genres: [28, 12, 53] }, // Action, Adventure, Thriller
  { value: "relaxed", label: "Relaxed", genres: [10751, 16, 10402] }, // Family, Animation, Music
  { value: "romantic", label: "Romantic", genres: [10749, 35] }, // Romance, Comedy
  { value: "scared", label: "Scared", genres: [27, 53] }, // Horror, Thriller
];

function MoodSelector() {
  const [mood, setMood] = useLocalStorage("mood.selected", "happy");
  const [sortBy, setSortBy] = useLocalStorage("mood.sortBy", "popularity.desc");
  const [minRating, setMinRating] = useLocalStorage("mood.minRating", 6);
  const [year, setYear] = useLocalStorage("mood.year", "");
  const [currentPage, setCurrentPage] = useState(1);
  const [shuffleToken, setShuffleToken] = useState(() => Date.now());

  const [movies, setMovies] = useState([]);
  const [totalPages, setTotalPages] = useState(1000);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const moodConfig = useMemo(
    () => MOODS.find((m) => m.value === mood) || MOODS[0],
    [mood]
  );

  const years = useMemo(() => {
    const now = new Date().getFullYear();
    return Array.from({ length: 30 }, (_, i) => String(now - i));
  }, []);

  // Shuffle on every refresh (mount) and when user clicks Shuffle
  useEffect(() => {
    setShuffleToken(Date.now());
    setCurrentPage(1);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    async function run() {
      try {
        setLoading(true);
        setError("");

        const with_genres = moodConfig.genres.join(",");
        const mappedPage = ((currentPage - 1 + (shuffleToken % 7)) % 500) + 1;

        const data = await discoverMovies({
          page: mappedPage,
          with_genres,
          sort_by: sortBy,
          vote_average_gte: Number(minRating) || undefined,
          primary_release_year: year ? Number(year) : undefined,
        });

        setMovies(data.results || []);
        setTotalPages(1000);
      } catch (err) {
        console.error(err);
        setError(err?.message || "Failed to fetch mood recommendations.");
      } finally {
        setLoading(false);
      }
    }

    run();
  }, [moodConfig, sortBy, minRating, year, currentPage, shuffleToken]);

  useEffect(() => {
    setCurrentPage(1);
  }, [mood, sortBy, minRating, year]);

  return (
    <div className="min-h-screen text-slate-900 dark:text-slate-100">
      <div className="mx-auto w-full max-w-[2000px] px-4 py-8 sm:px-6">
        <div className="mb-8 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h1 className="text-3xl font-extrabold tracking-tight !text-slate-900 dark:!text-slate-100">
              Mood picks
            </h1>
            <p className="mt-1 text-sm !text-slate-700 dark:!text-slate-300">
              Pick a mood, tune filters, and discover movies. Refreshing this page shuffles results.
            </p>
          </div>

          <button
            type="button"
            onClick={() => {
              setShuffleToken(Date.now());
              setCurrentPage(1);
            }}
            className="inline-flex items-center justify-center rounded-xl bg-slate-900 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-slate-800 dark:bg-slate-100 dark:text-slate-900 dark:hover:bg-white"
          >
            Shuffle
          </button>
        </div>

        <div className="mb-8 grid grid-cols-1 gap-3 rounded-2xl border border-slate-300 bg-white p-4 shadow-soft dark:border-slate-800 dark:bg-slate-950 sm:grid-cols-2 lg:grid-cols-4">
          <label className="grid gap-1 text-sm font-semibold !text-slate-900 dark:!text-slate-200">
            Mood
            <select
              value={mood}
              onChange={(e) => setMood(e.target.value)}
              className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-slate-900 outline-none ring-blue-400/30 focus:ring-4 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-100"
            >
              {MOODS.map((m) => (
                <option key={m.value} value={m.value}>
                  {m.label}
                </option>
              ))}
            </select>
          </label>

          <label className="grid gap-1 text-sm font-semibold !text-slate-900 dark:!text-slate-200">
            Sort by
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-slate-900 outline-none ring-blue-400/30 focus:ring-4 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-100"
            >
              <option value="popularity.desc">Popularity</option>
              <option value="vote_average.desc">Rating</option>
              <option value="primary_release_date.desc">Newest</option>
              <option value="revenue.desc">Revenue</option>
            </select>
          </label>

          <label className="grid gap-1 text-sm font-semibold !text-slate-900 dark:!text-slate-200">
            Min rating: <span className="font-extrabold">{minRating}</span>
            <input
              type="range"
              min={0}
              max={9}
              step={1}
              value={minRating}
              onChange={(e) => setMinRating(Number(e.target.value))}
              className="h-10 w-full"
            />
          </label>

          <label className="grid gap-1 text-sm font-semibold !text-slate-900 dark:!text-slate-200">
            Year
            <select
              value={year}
              onChange={(e) => setYear(e.target.value)}
              className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-slate-900 outline-none ring-blue-400/30 focus:ring-4 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-100"
            >
              <option value="">Any</option>
              {years.map((y) => (
                <option key={y} value={y}>
                  {y}
                </option>
              ))}
            </select>
          </label>
        </div>

        {error ? (
          <div className="rounded-xl border border-rose-200 bg-rose-50 p-4 text-rose-900 dark:border-rose-900/40 dark:bg-rose-950/40 dark:text-rose-100">
            {error}
          </div>
        ) : loading ? (
          <div className="flex justify-center py-16">
            <div className="h-14 w-14 animate-spin rounded-full border-b-4 border-t-4 border-blue-500" />
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6">
              {movies.map((movie) => (
                <MovieCard
                  key={movie.id}
                  movie={movie}
                  watchlist={[]}
                  addToWatchlist={() => {}}
                  hideWatchlistButton
                />
              ))}
            </div>

            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={(page) =>
                setCurrentPage(Math.max(1, Math.min(totalPages, page)))
              }
            />
          </>
        )}
      </div>
    </div>
  );
}

export default MoodSelector;
