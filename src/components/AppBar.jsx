import { useState } from "react";
import { NavLink, Link } from "react-router-dom";

function AppBar({ title }) {
  const [open, setOpen] = useState(false);

  const navLinkBase =
    "px-3 py-2 rounded-md font-medium transition-colors text-sm";
  const navLinkClass = ({ isActive }) =>
    `${navLinkBase} ${isActive ? "bg-purple-100 text-purple-700" : "text-gray-600 hover:bg-purple-50"}`;

  return (
    <header className="sticky top-0 z-30 bg-white/80 backdrop-blur-md border-b border-purple-100">
      <div className="max-w-6xl mx-auto flex items-center justify-between gap-3 px-4 py-2">
        {/* Brand */}
        <div className="flex items-center gap-3 min-w-0">
          <Link to="/" className="flex flex-col min-w-0">
            <span className="text-[10px] sm:text-xs font-semibold text-purple-500 tracking-widest uppercase">
              Beauty Booking
            </span>
            <h2 className="text-base sm:text-xl font-bold text-gray-800 leading-tight truncate">
              {title}
            </h2>
          </Link>
        </div>

        {/* Desktop nav */}
        <nav className="hidden md:flex items-center gap-2">
          <NavLink to="/" end className={navLinkClass}>
            Home
          </NavLink>
          <NavLink to="/booking" className={navLinkClass}>
            Prenotazioni
          </NavLink>
          <NavLink to="/admin" className={navLinkClass}>
            Dashboard
          </NavLink>
        </nav>

        {/* Right actions */}
        <div className="hidden sm:flex items-center gap-2">
          <Link
            to="/booking"
            className="px-3 py-2 rounded-md bg-purple-600 text-white text-sm font-semibold hover:bg-purple-700 transition shadow-sm"
          >
            Nuova prenotazione
          </Link>
        </div>

        {/* Mobile toggle */}
        <button
          type="button"
          aria-label="Apri menu"
          className="md:hidden inline-flex items-center justify-center p-2 rounded-md text-purple-700 hover:bg-purple-50 focus:outline-none"
          onClick={() => setOpen((v) => !v)}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="currentColor"
            className="w-6 h-6"
          >
            {open ? (
              <path
                fillRule="evenodd"
                d="M5.47 5.47a.75.75 0 011.06 0L12 10.94l5.47-5.47a.75.75 0 111.06 1.06L13.06 12l5.47 5.47a.75.75 0 11-1.06 1.06L12 13.06l-5.47 5.47a.75.75 0 11-1.06-1.06L10.94 12 5.47 6.53a.75.75 0 010-1.06z"
                clipRule="evenodd"
              />
            ) : (
              <path
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                d="M4 6h16M4 12h16M4 18h16"
              />
            )}
          </svg>
        </button>
      </div>

      {/* Mobile menu panel */}
      {open && (
        <div className="md:hidden border-t border-purple-100 bg-white/90 backdrop-blur-sm">
          <div className="max-w-6xl mx-auto px-4 py-2 flex flex-col gap-2">
            <NavLink to="/" end className={navLinkClass} onClick={() => setOpen(false)}>
              Home
            </NavLink>
            <NavLink to="/booking" className={navLinkClass} onClick={() => setOpen(false)}>
              Prenotazioni
            </NavLink>
            <NavLink to="/admin" className={navLinkClass} onClick={() => setOpen(false)}>
              Dashboard
            </NavLink>
            <Link
              to="/booking"
              className="mt-1 px-3 py-2 rounded-md bg-purple-600 text-white text-sm font-semibold hover:bg-purple-700 transition text-center"
              onClick={() => setOpen(false)}
            >
              Nuova prenotazione
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}

export default AppBar;
