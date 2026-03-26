import React from "react";

function Banner({ title, description, image, link, trailerKey }) {
  return (
    <div
      className="relative h-[850px] w-full bg-cover bg-center flex items-center"
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

      <div className="relative z-20 text-white px-12 max-w-2xl">
        <h1 className="text-8xl font-bold mb-4">{title}</h1>

        <p className="text-lg mb-6">
          {description}
        </p>

        <a
          href={link}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-block bg-yellow-500 hover:bg-yellow-600 text-black font-semibold px-6 py-3 rounded-lg transition"
        >
          ▶ Watch Now
        </a>
      </div>
    </div>
  );
}

export default Banner;
