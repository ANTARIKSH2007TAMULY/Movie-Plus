import React, { useEffect } from "react";

function TrailerModal({ open, title, youtubeKey, onClose }) {
  useEffect(() => {
    if (!open) return;
    const onKeyDown = (e) => {
      if (e.key === "Escape") onClose?.();
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[100]">
      <button
        type="button"
        aria-label="Close trailer"
        className="absolute inset-0 bg-black/70"
        onClick={onClose}
      />

      <div className="absolute left-1/2 top-1/2 w-[min(1000px,92vw)] -translate-x-1/2 -translate-y-1/2 overflow-hidden rounded-2xl border border-white/10 bg-slate-950 shadow-soft">
        <div className="flex items-center justify-between gap-3 border-b border-white/10 px-4 py-3">
          <div className="truncate text-sm font-semibold text-slate-100">
            {title || "Trailer"}
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg bg-white/10 px-3 py-1.5 text-sm font-semibold text-white hover:bg-white/15"
          >
            Close
          </button>
        </div>

        <div className="aspect-video w-full bg-black">
          {youtubeKey ? (
            <iframe
              src={`https://www.youtube.com/embed/${youtubeKey}?autoplay=1&mute=0&controls=1&modestbranding=1&rel=0`}
              title={title ? `${title} Trailer` : "Trailer"}
              className="h-full w-full"
              allow="autoplay; encrypted-media"
              allowFullScreen
              style={{ border: "none" }}
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center px-6 text-center text-sm text-slate-200">
              Trailer not available for this movie.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default TrailerModal;

