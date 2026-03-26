import React, { useEffect, useState } from "react";
import { useLocalStorage } from "../hooks/useLocalStorage";
import { fetchMovieGenres, fetchMovieTrailerKey, getImageUrl } from "../lib/tmdb";
import TrailerModal from "./TrailerModal";

function Watchlist() {
  const [watchlist, setWatchlist] = useLocalStorage("watchlist", []);
  const [searchQuery, setSearchQuery] = useState("");
  const [genresMap, setGenresMap] = useState({});
  const [selectedGenre, setSelectedGenre] = useState("All");
  const [trailerMovie, setTrailerMovie] = useState(null);
  const [trailerKey, setTrailerKey] = useState(null);

  // Fetch genres list
  useEffect(() => {
    async function fetchGenres() {
      try {
        const response = await fetchMovieGenres();
        const map = {};
        response.genres.forEach((g) => (map[g.id] = g.name));
        setGenresMap(map);
      } catch (err) {
        console.error(err);
      }
    }
    fetchGenres();
  }, []);

  // Remove movie
  const handleRemove = (id) => {
    const updated = watchlist.filter((m) => m.id !== id);
    setWatchlist(updated);
  };

  // Filter movies based on genre and search query
  const filtered = watchlist
    .filter((m) => {
      const movieGenres = m.genres || [];
      if (selectedGenre === "All") return true;
      const genreId = parseInt(
        Object.keys(genresMap).find((k) => genresMap[k] === selectedGenre)
      );
      return movieGenres.includes(genreId);
    })
    .filter((m) => m.title.toLowerCase().includes(searchQuery.toLowerCase()));

  // Genre options dynamically
  const genreOptions = [
    "All",
    ...new Set(
      watchlist.flatMap((m) => (m.genres || []).map((id) => genresMap[id]))
    ),
  ];

  const openTrailer = async (movie) => {
    setTrailerMovie(movie);
    try {
      const key = await fetchMovieTrailerKey(movie.id);
      setTrailerKey(key);
    } catch (e) {
      console.error(e);
      setTrailerKey(null);
    }
  };

  return (
    <div className="min-h-screen text-slate-900 dark:text-slate-100">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6">
        <h1 className="mb-6 text-3xl font-extrabold tracking-tight text-slate-950 dark:text-slate-100">
          My Watchlist
        </h1>

        {/* Genre Filter */}
        <div className="mb-4 flex flex-wrap gap-2">
          {genreOptions
            .filter(Boolean)
            .map((genre) => (
              <button
                key={genre}
                onClick={() => setSelectedGenre(genre)}
                className={`rounded-lg px-3 py-2 text-sm font-semibold transition ${
                  selectedGenre === genre
                    ? "bg-blue-600 text-white"
                    : "border border-slate-200 bg-white text-slate-800 hover:bg-slate-50 dark:border-slate-800 dark:bg-slate-950 dark:text-slate-100 dark:hover:bg-slate-900"
                }`}
              >
                {genre}
              </button>
            ))}
        </div>

        {/* Search */}
        <input
          type="text"
          placeholder="Search in watchlist..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="mb-6 w-full max-w-xl rounded-xl border border-slate-200 bg-white px-4 py-2 text-slate-900 shadow-sm outline-none ring-blue-400/30 focus:ring-4 dark:border-slate-800 dark:bg-slate-950 dark:text-slate-100"
        />

        {/* Desktop Table */}
        <div className="hidden overflow-x-auto rounded-2xl border border-slate-200 bg-white shadow-soft dark:border-slate-800 dark:bg-slate-950 md:block">
          <table className="min-w-full table-auto">
            <thead className="bg-slate-100 text-slate-700 dark:bg-slate-900 dark:text-slate-200">
              <tr>
                <th className="p-3 w-32 text-left">Poster</th>
                <th className="p-3 w-64 text-left">Name</th>
                <th className="p-3 w-24 text-center">Rating</th>
                <th className="p-3 w-64 text-left">Genres</th>
                <th className="p-3 w-24 text-right">Popularity</th>
                <th className="p-3 w-56 text-center">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((movie) => (
                <tr
                  key={movie.id}
                  className="border-t border-slate-200/70 hover:bg-slate-50 dark:border-slate-800/70 dark:hover:bg-slate-900/40"
                >
                  <td className="p-3">
                    <img
                      src={getImageUrl(movie.poster_path || movie.backdrop_path, "w200")}
                      alt={movie.title}
                      className="h-24 w-auto rounded-lg object-cover"
                    />
                  </td>
                  <td className="p-3 font-semibold text-slate-900 dark:text-slate-100">
                    {movie.title}
                  </td>
                  <td className="p-3 text-center text-slate-700 dark:text-slate-200">
                    {movie.vote_average}
                  </td>
                  <td className="p-3 text-slate-700 dark:text-slate-200">
                    {(movie.genres || [])
                      .map((id) => genresMap[id])
                      .filter(Boolean)
                      .join(", ")}
                  </td>
                  <td className="p-3 text-right text-slate-700 dark:text-slate-200">
                    {movie.popularity ? movie.popularity.toFixed(2) : "N/A"}
                  </td>
                  <td className="p-3">
                    <div className="flex items-center justify-center gap-2">
                      <a
                        href={`https://www.themoviedb.org/movie/${movie.id}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="rounded-lg bg-yellow-400 px-3 py-2 text-xs font-bold text-slate-900 transition hover:bg-yellow-300"
                      >
                        Watch
                      </a>
                      <button
                        type="button"
                        onClick={() => openTrailer(movie)}
                        className="rounded-lg bg-slate-900 px-3 py-2 text-xs font-bold text-white transition hover:bg-slate-800 dark:bg-slate-100 dark:text-slate-900 dark:hover:bg-white"
                      >
                        Trailer
                      </button>
                      <button
                        onClick={() => handleRemove(movie.id)}
                        className="rounded-lg bg-rose-600 px-3 py-2 text-xs font-bold text-white shadow-sm transition hover:bg-rose-700"
                      >
                        Remove
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr>
                  <td colSpan="6" className="p-10 text-center text-slate-500 dark:text-slate-400">
                    No movies found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Mobile Cards */}
        <div className="grid grid-cols-1 gap-4 md:hidden">
          {filtered.map((movie) => (
            <div
              key={movie.id}
              className="rounded-2xl border border-slate-200 bg-white p-3 shadow-soft dark:border-slate-800 dark:bg-slate-950"
            >
              <div className="flex gap-3">
                <img
                  src={getImageUrl(movie.poster_path || movie.backdrop_path, "w200")}
                  alt={movie.title}
                  className="h-28 w-20 rounded-lg object-cover"
                />
                <div className="min-w-0 flex-1">
                  <h3 className="line-clamp-2 text-base font-bold text-slate-900 dark:text-slate-100">
                    {movie.title}
                  </h3>
                  <p className="mt-1 text-xs text-slate-600 dark:text-slate-300">
                    Rating: {movie.vote_average || "N/A"} | Popularity:{" "}
                    {movie.popularity ? movie.popularity.toFixed(1) : "N/A"}
                  </p>
                  <p className="mt-1 line-clamp-1 text-xs text-slate-600 dark:text-slate-300">
                    {(movie.genres || [])
                      .map((id) => genresMap[id])
                      .filter(Boolean)
                      .join(", ") || "No genres"}
                  </p>
                </div>
              </div>

              <div className="mt-3 grid grid-cols-3 gap-2">
                <a
                  href={`https://www.themoviedb.org/movie/${movie.id}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="rounded-lg bg-yellow-400 px-2 py-2 text-center text-xs font-bold text-slate-900"
                >
                  Watch
                </a>
                <button
                  type="button"
                  onClick={() => openTrailer(movie)}
                  className="rounded-lg bg-slate-900 px-2 py-2 text-xs font-bold text-white dark:bg-slate-100 dark:text-slate-900"
                >
                  Trailer
                </button>
                <button
                  onClick={() => handleRemove(movie.id)}
                  className="rounded-lg bg-rose-600 px-2 py-2 text-xs font-bold text-white"
                >
                  Remove
                </button>
              </div>
            </div>
          ))}

          {filtered.length === 0 && (
            <div className="rounded-2xl border border-slate-200 bg-white p-8 text-center text-slate-500 dark:border-slate-800 dark:bg-slate-950 dark:text-slate-400">
              No movies found
            </div>
          )}
        </div>
      </div>

      <TrailerModal
        open={Boolean(trailerMovie)}
        title={trailerMovie?.title}
        youtubeKey={trailerKey}
        onClose={() => {
          setTrailerMovie(null);
          setTrailerKey(null);
        }}
      />
    </div>
  );
}

export default Watchlist;