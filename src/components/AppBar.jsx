import { NavLink } from "react-router-dom";
import "./AppBar.css";

function AppBar({ title }) {
  return (
    <header className="appbar">
      <div className="appbar-inner">
        <div className="appbar-brand">
          <span className="appbar-kicker">Beauty Booking</span>
          <h2 className="appbar-title">{title}</h2>
        </div>

        <nav className="appbar-nav">
          <NavLink
            to="/"
            end
            className={({ isActive }) =>
              isActive ? "appbar-link active" : "appbar-link"
            }
          >
            Home
          </NavLink>

          <NavLink
            to="/booking"
            className={({ isActive }) =>
              isActive ? "appbar-link active" : "appbar-link"
            }
          >
            Prenotazioni
          </NavLink>

          <NavLink
            to="/admin"
            className={({ isActive }) =>
              isActive ? "appbar-link active" : "appbar-link"
            }
          >
            Dashboard
          </NavLink>
        </nav>
      </div>
    </header>
  );
}

export default AppBar;
