import React from "react";
import { Link, NavLink } from "react-router-dom";
import logo from "./logo.png";
import { useTheme } from "../hooks/useTheme";

function Navbar() {
  const { isDark, toggleTheme } = useTheme();

  return (
    <header className="sticky top-0 z-50 border-b border-slate-200/60 bg-white/75 backdrop-blur dark:border-slate-800/60 dark:bg-slate-950/65">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6">
        <Link to="/" className="flex items-center gap-3">
          <img src={logo} alt="MoviesPlus+ Logo" className="h-11 w-11 rounded-lg" />
          <span className="text-xl font-extrabold tracking-tight text-slate-900 dark:text-slate-100 sm:text-2xl">
            MoviesPlus+
          </span>
        </Link>

        <nav className="hidden items-center gap-2 md:flex">
          {[
            { to: "/", label: "Home" },
            { to: "/movies", label: "Movies" },
            { to: "/watchlist", label: "Watchlist" },
            { to: "/mood", label: "Mood" },
          ].map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                `rounded-lg px-3 py-2 text-base font-semibold transition ${
                  isActive
                    ? "bg-slate-900 text-white dark:bg-slate-100 dark:text-slate-900"
                    : "text-slate-700 hover:bg-slate-100 dark:text-slate-200 dark:hover:bg-slate-900/60"
                }`
              }
            >
              {item.label}
            </NavLink>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={toggleTheme}
            className="inline-flex items-center justify-center rounded-lg border border-slate-200 bg-white px-4 py-2 text-base font-semibold text-slate-800 shadow-sm transition hover:bg-slate-50 dark:border-slate-800 dark:bg-slate-950 dark:text-slate-100 dark:hover:bg-slate-900"
            aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
            title={isDark ? "Light mode" : "Dark mode"}
          >
            {isDark ? "Light" : "Dark"}
          </button>
        </div>
      </div>

      <nav className="mx-auto flex max-w-7xl items-center justify-between gap-2 px-4 pb-3 md:hidden sm:px-6">
        {[
          { to: "/", label: "Home" },
          { to: "/movies", label: "Movies" },
          { to: "/watchlist", label: "Watchlist" },
          { to: "/mood", label: "Mood" },
        ].map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            className={({ isActive }) =>
              `flex-1 rounded-lg px-2 py-2 text-center text-xs font-semibold transition ${
                isActive
                  ? "bg-slate-900 text-white dark:bg-slate-100 dark:text-slate-900"
                  : "text-slate-700 hover:bg-slate-100 dark:text-slate-200 dark:hover:bg-slate-900/60"
              }`
            }
          >
            {item.label}
          </NavLink>
        ))}
      </nav>
    </header>
  );
}

export default Navbar;
