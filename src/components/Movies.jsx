import React, { useEffect, useState } from "react";
import MovieCard from "./MovieCard";
import Banner from "./Banner";
import Pagination from "./Pagination";
import { useLocalStorage } from "../hooks/useLocalStorage";
import {
  fetchPopularMovies,
  fetchTopRatedMovies,
  searchMovies,
  getImageUrl,
  fetchMovieTrailerKey,
} from "../lib/tmdb";

function Movies() {
  const [topMovies, setTopMovies] = useState([]);
  const [bannerMovie, setBannerMovie] = useState(null);
  const [popularMovies, setPopularMovies] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1000);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [bannerTrailerKey, setBannerTrailerKey] = useState(null);

  // Watchlist state
  const [watchlist, setWatchlist] = useLocalStorage("watchlist", []);

  // Fetch top-rated movies for banner
  useEffect(() => {
    async function fetchTopMovies() {
      try {
        setLoading(true);
        setError("");
        const data = await fetchTopRatedMovies({ page: 1 });
        const results = data.results || [];
        setTopMovies(results);
        if (!bannerMovie && results.length > 0) {
          const picked = results[Math.floor(Math.random() * results.length)];
          setBannerMovie(picked);
        }
      } catch (err) {
        console.error(err);
        setError(err?.message || "Failed to fetch movies.");
      } finally {
        setLoading(false);
      }
    }
    fetchTopMovies();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // Fetch popular movies or search results
  useEffect(() => {
    async function fetchMovies(page = 1) {
      try {
        setLoading(true);
        setError("");
        const mappedPage = ((page - 1) % 500) + 1;
        const data = searchQuery
          ? await searchMovies({ query: searchQuery, page: mappedPage })
          : await fetchPopularMovies({ page: mappedPage });

        if (searchQuery) setSearchResults(data.results || []);
        else setPopularMovies(data.results || []);
        setTotalPages(1000);
      } catch (err) {
        console.error(err);
        setError(err?.message || "Failed to fetch movies.");
      } finally {
        setLoading(false);
      }
    }
    fetchMovies(currentPage);
  }, [currentPage, searchQuery]);

  useEffect(() => {
    let cancelled = false;
    async function loadTrailer() {
      if (!bannerMovie?.id) return;
      try {
        const key = await fetchMovieTrailerKey(bannerMovie.id);
        if (!cancelled) setBannerTrailerKey(key);
      } catch (e) {
        console.error(e);
      }
    }
    loadTrailer();
    return () => {
      cancelled = true;
    };
  }, [bannerMovie?.id]);

  const handleSearch = (e) => {
    e.preventDefault();
    setCurrentPage(1);
  };

  // Add movie to watchlist with genres
  const addToWatchlist = (movie) => {
    if (!watchlist.find((m) => m.id === movie.id)) {
      const movieToAdd = {
        ...movie,
        genres: movie.genre_ids || [], // map genre_ids to genres array
      };
      const updated = [...watchlist, movieToAdd];
      setWatchlist(updated);
    }
  };

  const moviesToShow = searchQuery ? searchResults : popularMovies;

  return (
    <div className="min-h-screen">
      {bannerMovie && (
        <Banner
          title={bannerMovie.title}
          description={bannerMovie.overview}
          image={getImageUrl(bannerMovie.backdrop_path, "original")}
          link={`https://www.themoviedb.org/movie/${bannerMovie.id}`}
          trailerKey={bannerTrailerKey}
        />
      )}

      <div className="mx-auto w-full max-w-[2000px] px-4 py-8 sm:px-6">
        {/* Search */}
        <form onSubmit={handleSearch} className="mb-6 flex justify-center">
          <input
            type="text"
            placeholder="Search movies..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full max-w-xl rounded-l-lg border border-slate-200 bg-white px-4 py-2 text-slate-900 shadow-sm outline-none ring-blue-400/30 focus:ring-4 dark:border-slate-800 dark:bg-slate-950 dark:text-slate-100"
          />
          <button
            type="submit"
            className="rounded-r-lg bg-blue-600 px-4 py-2 font-semibold text-white shadow-sm transition hover:bg-blue-700"
          >
            Search
          </button>
        </form>

        <h2 className="text-3xl font-bold mb-6">
          {searchQuery
            ? `Search Results for "${searchQuery}"`
            : "Popular Movies"}
        </h2>

        {error ? (
          <div className="rounded-xl border border-rose-200 bg-rose-50 p-4 text-rose-900 dark:border-rose-900/40 dark:bg-rose-950/40 dark:text-rose-100">
            {error}
          </div>
        ) : loading ? (
          <div className="flex justify-center mt-16">
            <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-blue-500"></div>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6">
              {moviesToShow.map((movie) => (
                <MovieCard
                  key={movie.id}
                  movie={movie}
                  watchlist={watchlist}
                  addToWatchlist={addToWatchlist}
                />
              ))}
            </div>

            {moviesToShow.length > 0 && (
              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={(page) =>
                  setCurrentPage(Math.max(1, Math.min(totalPages, page)))
                }
              />
            )}
          </>
        )}
      </div>
    </div>
  );
}

export default Movies;