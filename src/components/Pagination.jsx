import React, { useMemo } from "react";

function buildPages(currentPage, totalPages) {
  if (totalPages <= 7) {
    return Array.from({ length: totalPages }, (_, i) => i + 1);
  }

  const pages = [1];
  const left = Math.max(2, currentPage - 1);
  const right = Math.min(totalPages - 1, currentPage + 1);

  if (left > 2) pages.push("...");
  for (let p = left; p <= right; p += 1) pages.push(p);
  if (right < totalPages - 1) pages.push("...");
  pages.push(totalPages);

  return pages;
}

function Pagination({ currentPage, totalPages, onPageChange }) {
  const pages = useMemo(
    () => buildPages(currentPage, Math.max(1, Math.min(totalPages, 1000))),
    [currentPage, totalPages]
  );

  if (totalPages <= 1) return null;

  return (
    <div className="mt-8 flex flex-wrap items-center justify-center gap-2">
      <button
        type="button"
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm font-semibold text-slate-700 shadow-sm disabled:opacity-50 dark:border-slate-800 dark:bg-slate-950 dark:text-slate-200"
      >
        Prev
      </button>

      {pages.map((item, idx) =>
        item === "..." ? (
          <span
            key={`dots-${idx}`}
            className="px-2 py-1 text-sm text-slate-500 dark:text-slate-400"
          >
            ...
          </span>
        ) : (
          <button
            key={item}
            type="button"
            onClick={() => onPageChange(item)}
            className={`rounded-lg px-3 py-2 text-sm font-bold transition ${
              item === currentPage
                ? "bg-blue-600 text-white shadow-sm"
                : "border border-slate-200 bg-white text-slate-700 hover:bg-slate-50 dark:border-slate-800 dark:bg-slate-950 dark:text-slate-200 dark:hover:bg-slate-900"
            }`}
          >
            {item}
          </button>
        )
      )}

      <button
        type="button"
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm font-semibold text-slate-700 shadow-sm disabled:opacity-50 dark:border-slate-800 dark:bg-slate-950 dark:text-slate-200"
      >
        Next
      </button>
    </div>
  );
}

export default Pagination;

