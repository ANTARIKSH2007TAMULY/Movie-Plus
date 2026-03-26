import React, { useCallback, useEffect, useRef, useState } from "react";
import TrailerModal from "./TrailerModal";
import { fetchMovieTrailerKey, getImageUrl } from "../lib/tmdb";

function MovieCard({
  movie,
  watchlist = [],
  addToWatchlist,
  hideWatchlistButton = false,
}) {
  const isAdded = watchlist?.some?.((m) => m.id === movie.id) ?? false;
  const [hovered, setHovered] = useState(false);
  const [trailerKey, setTrailerKey] = useState(null);
  const [loadingTrailer, setLoadingTrailer] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const hoverTimerRef = useRef(null);

  const ensureTrailerKey = useCallback(async () => {
    if (!movie?.id) return null;
    if (trailerKey !== null) return trailerKey;

    setLoadingTrailer(true);
    try {
      const key = await fetchMovieTrailerKey(movie.id);
      setTrailerKey(key);
      return key;
    } catch (e) {
      console.error(e);
      setTrailerKey(null);
      return null;
    } finally {
      setLoadingTrailer(false);
    }
  }, [movie?.id, trailerKey]);

  useEffect(() => {
    return () => {
      if (hoverTimerRef.current) clearTimeout(hoverTimerRef.current);
    };
  }, []);

  const onEnter = () => {
    setHovered(true);
    hoverTimerRef.current = setTimeout(() => {
      ensureTrailerKey();
    }, 500);
  };

  const onLeave = () => {
    setHovered(false);
    if (hoverTimerRef.current) {
      clearTimeout(hoverTimerRef.current);
      hoverTimerRef.current = null;
    }
  };

  // Prefer poster_path; if TMDB returns none for a result, fall back to backdrop_path.
  const posterPath = movie?.poster_path || movie?.backdrop_path;
  const poster = getImageUrl(posterPath, "w500");
  const title = movie?.title || "Untitled";
  const year = movie?.release_date ? movie.release_date.split("-")[0] : null;
  const rating =
    typeof movie?.vote_average === "number" ? movie.vote_average.toFixed(1) : null;

  return (
    <>
      <div
        className="group flex flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-soft transition hover:-translate-y-1 hover:shadow-lg dark:border-slate-800 dark:bg-slate-950"
        onMouseEnter={onEnter}
        onMouseLeave={onLeave}
      >
        <div className="relative aspect-[2/3] w-full overflow-hidden bg-slate-100 dark:bg-slate-900">
          {/* Trailer hover overlay (desktop) */}
          {hovered && trailerKey && (
            <div className="absolute inset-0 z-20 bg-black">
              <iframe
                src={`https://www.youtube.com/embed/${trailerKey}?autoplay=1&mute=1&controls=0&modestbranding=1&rel=0`}
                title={`${title} Trailer`}
                className="absolute inset-0 h-full w-full scale-[2.1]"
                allow="autoplay; encrypted-media"
                allowFullScreen
                style={{ border: "none" }}
              />
            </div>
          )}

          {/* Loading overlay */}
          {hovered && !trailerKey && loadingTrailer && (
            <div className="absolute inset-0 z-20 flex items-center justify-center bg-black/70">
              <div className="h-10 w-10 animate-spin rounded-full border-b-4 border-t-4 border-yellow-400" />
            </div>
          )}

          {/* Hover hint */}
          <div className="absolute inset-0 z-10 flex items-center justify-center bg-black/0 opacity-0 transition group-hover:bg-black/40 group-hover:opacity-100">
            <div className="flex items-center gap-2 rounded-full bg-white/15 px-4 py-2 text-sm font-semibold text-white backdrop-blur">
              Hover to preview trailer
            </div>
          </div>

          {poster ? (
            <img
              src={poster}
              alt={title}
              className="h-full w-full object-cover transition duration-500 group-hover:scale-[1.03]"
              loading="lazy"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center px-6 text-center text-sm text-slate-500 dark:text-slate-300">
              No poster available
            </div>
          )}

          {rating && (
            <div className="absolute right-3 top-3 z-30 rounded-xl bg-black/70 px-2.5 py-1 text-xs font-extrabold text-yellow-300">
              ⭐ {rating}
            </div>
          )}
        </div>

        <div className="flex flex-1 flex-col p-4">
          <div className="mb-3">
            <h3 className="line-clamp-2 text-base font-extrabold leading-snug text-slate-900 dark:text-slate-100">
              {title}
            </h3>
            <div className="mt-1 flex items-center gap-2 text-xs font-semibold text-slate-600 dark:text-slate-300">
              {year && <span>{year}</span>}
              {movie?.popularity && (
                <span className="rounded-full bg-slate-100 px-2 py-0.5 text-[11px] text-slate-700 dark:bg-slate-900 dark:text-slate-200">
                  Popularity {Number(movie.popularity).toFixed(0)}
                </span>
              )}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2">
            <a
              href={`https://www.themoviedb.org/movie/${movie.id}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-yellow-400 px-3 py-2 text-sm font-extrabold text-slate-900 shadow-sm transition hover:bg-yellow-300"
            >
              <span>▶</span>
              <span>Watch</span>
            </a>

            <button
              type="button"
              onClick={async () => {
                await ensureTrailerKey();
                setModalOpen(true);
              }}
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-slate-900 px-3 py-2 text-sm font-extrabold text-white shadow-sm transition hover:bg-slate-800 dark:bg-slate-100 dark:text-slate-900 dark:hover:bg-white"
            >
              <span>🎬</span>
              <span>Trailer</span>
            </button>
          </div>

          {!hideWatchlistButton && (
            <button
              type="button"
              onClick={() => addToWatchlist?.(movie)}
              disabled={isAdded}
              className={`mt-3 inline-flex w-full items-center justify-center gap-2 rounded-xl px-3 py-2 text-sm font-extrabold shadow-sm transition ${
                isAdded
                  ? "cursor-not-allowed bg-slate-200 text-slate-600 dark:bg-slate-900 dark:text-slate-300"
                  : "bg-blue-600 text-white hover:bg-blue-700"
              }`}
            >
              {isAdded ? "✓ In Watchlist" : "➕ Add to Watchlist"}
            </button>
          )}
        </div>
      </div>

      <TrailerModal
        open={modalOpen}
        title={title}
        youtubeKey={trailerKey}
        onClose={() => setModalOpen(false)}
      />
    </>
  );
}

export default MovieCard;