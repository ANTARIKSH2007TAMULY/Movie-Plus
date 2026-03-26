import React, { useEffect, useState } from "react";
import { fetchTopRatedMovies, getImageUrl, fetchMovieTrailerKey } from "../lib/tmdb";

function Home() {
  const [bannerImageUrl, setBannerImageUrl] = useState(
    "https://images.unsplash.com/photo-1581905764498-18c3d1a7a1c8?auto=format&fit=crop&w=1470&q=80"
  );
  const [bannerTrailerKey, setBannerTrailerKey] = useState(null);

  useEffect(() => {
    async function fetchBannerMovie() {
      try {
        const data = await fetchTopRatedMovies({ page: 1 });
        const topMovies = data.results || [];
        if (topMovies.length > 0) {
          const randomMovie =
            topMovies[Math.floor(Math.random() * topMovies.length)];
          setBannerImageUrl(
            getImageUrl(randomMovie.backdrop_path, "original")
          );

          const key = await fetchMovieTrailerKey(randomMovie.id);
          setBannerTrailerKey(key);
        }
      } catch (err) {
        console.error("Failed to fetch banner movie:", err);
      }
    }

    fetchBannerMovie();
  }, []);

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section
        className="relative flex min-h-[520px] items-center justify-center bg-cover bg-center text-center sm:min-h-[620px]"
        style={{ backgroundImage: `url(${bannerImageUrl})` }}
      >
        {bannerTrailerKey ? (
          <div className="absolute inset-0 z-0 overflow-hidden">
            <iframe
              src={`https://www.youtube.com/embed/${bannerTrailerKey}?autoplay=1&mute=1&controls=0&modestbranding=1&rel=0&loop=1&playlist=${bannerTrailerKey}`}
              title="Home Trailer"
              className="h-full w-full scale-[1.06]"
              allow="autoplay; encrypted-media"
              allowFullScreen
              style={{ border: "none" }}
            />
          </div>
        ) : null}
        <div className="absolute inset-0 bg-black/60"></div>
        <div className="relative z-10 text-white px-6 md:px-12 max-w-3xl">
          <h1 className="text-5xl md:text-6xl font-bold mb-6">MoviesPlus+</h1>
          <p className="text-lg md:text-xl mb-8">
            Your ultimate React movie app! Discover popular movies, watch trailers,
            manage your personal watchlist, and select movies based on your mood.
          </p>
          <a
            href="/movies"
            className="inline-block bg-yellow-500 hover:bg-yellow-600 text-black font-semibold px-6 py-3 rounded-lg transition"
          >
            Explore Movies
          </a>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 sm:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <h2 className="mb-10 text-center text-3xl font-extrabold tracking-tight text-slate-900 dark:text-slate-100 sm:text-4xl">
            App Features
          </h2>
          <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          {/* Feature 1 */}
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-soft transition hover:-translate-y-0.5 hover:shadow-lg dark:border-slate-800 dark:bg-slate-900">
            <h3 className="mb-3 text-2xl font-semibold text-slate-900 dark:text-slate-100">Discover Movies</h3>
            <p className="text-slate-600 dark:text-slate-300">
              Browse trending and top-rated movies with high-quality posters and details.
            </p>
          </div>

          {/* Feature 2 */}
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-soft transition hover:-translate-y-0.5 hover:shadow-lg dark:border-slate-800 dark:bg-slate-900">
            <h3 className="mb-3 text-2xl font-semibold text-slate-900 dark:text-slate-100">Watchlist</h3>
            <p className="text-slate-600 dark:text-slate-300">
              Add your favorite movies to your personal watchlist and manage them easily.
            </p>
          </div>

          {/* Feature 3 */}
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-soft transition hover:-translate-y-0.5 hover:shadow-lg dark:border-slate-800 dark:bg-slate-900">
            <h3 className="mb-3 text-2xl font-semibold text-slate-900 dark:text-slate-100">Mood Selector</h3>
            <p className="text-slate-600 dark:text-slate-300">
              Choose movies based on your current mood – fun, thrilling, or relaxing.
            </p>
          </div>

          {/* Feature 4 */}
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-soft transition hover:-translate-y-0.5 hover:shadow-lg dark:border-slate-800 dark:bg-slate-900">
            <h3 className="mb-3 text-2xl font-semibold text-slate-900 dark:text-slate-100">Trailers & Links</h3>
            <p className="text-slate-600 dark:text-slate-300">
              Watch trailers and explore more about each movie directly from the app.
            </p>
          </div>

          {/* Feature 5 */}
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-soft transition hover:-translate-y-0.5 hover:shadow-lg dark:border-slate-800 dark:bg-slate-900">
            <h3 className="mb-3 text-2xl font-semibold text-slate-900 dark:text-slate-100">Search & Filter</h3>
            <p className="text-slate-600 dark:text-slate-300">
              Easily search for movies or filter by genre to find what you love.
            </p>
          </div>

          {/* Feature 6 */}
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-soft transition hover:-translate-y-0.5 hover:shadow-lg dark:border-slate-800 dark:bg-slate-900">
            <h3 className="mb-3 text-2xl font-semibold text-slate-900 dark:text-slate-100">Responsive Design</h3>
            <p className="text-slate-600 dark:text-slate-300">
              Fully responsive design ensures a smooth experience on desktop and mobile.
            </p>
          </div>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-16 sm:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <div className="rounded-3xl bg-gradient-to-r from-blue-600 to-indigo-600 p-10 text-center text-white shadow-soft">
            <h2 className="mb-4 text-3xl font-extrabold sm:text-4xl">
              Ready to Explore Movies?
            </h2>
            <p className="mx-auto mb-7 max-w-2xl text-base text-white/90 sm:text-lg">
              Start browsing now and create your personalized watchlist.
            </p>
            <a
              href="/movies"
              className="inline-flex items-center justify-center rounded-xl bg-yellow-400 px-6 py-3 font-semibold text-slate-900 shadow-sm transition hover:bg-yellow-300"
            >
              Browse Movies
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}

export default Home;