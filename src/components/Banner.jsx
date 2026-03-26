import React from "react";

function Banner({ title, description, image, link, trailerKey }) {
  return (
    <div
      className="relative flex h-[62vh] min-h-[420px] w-full items-center bg-cover bg-center sm:h-[72vh] sm:min-h-[520px] lg:h-[850px]"
      style={{
        backgroundImage: `url(${image})`,
      }}
    >
      {trailerKey ? (
        <div className="absolute inset-0 z-0 overflow-hidden">
          <iframe
            src={`https://www.youtube.com/embed/${trailerKey}?autoplay=1&mute=1&controls=0&modestbranding=1&rel=0&loop=1&playlist=${trailerKey}`}
            title={`${title} Trailer`}
            className="h-full w-full scale-[1.06]"
            allow="autoplay; encrypted-media"
            allowFullScreen
            style={{ border: "none" }}
          />
        </div>
      ) : null}

      <div className="absolute inset-0 z-10 bg-black/60"></div>

      <div className="relative z-20 max-w-2xl px-5 text-white sm:px-8 lg:px-12">
        <h1 className="mb-3 line-clamp-4 text-4xl font-extrabold leading-tight sm:text-6xl lg:text-8xl">
          {title}
        </h1>

        <p className="mb-6 line-clamp-3 text-sm text-white/90 sm:text-base lg:text-lg">
          {description}
        </p>

        <a
          href={link}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-block rounded-lg bg-yellow-500 px-5 py-2.5 text-sm font-semibold text-black transition hover:bg-yellow-600 sm:px-6 sm:py-3 sm:text-base"
        >
          ▶ Watch Now
        </a>
      </div>
    </div>
  );
}

export default Banner;
