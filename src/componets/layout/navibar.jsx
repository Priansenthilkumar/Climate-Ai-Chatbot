import { NavLink } from "react-router-dom";

function Navbar() {
  return (
    <nav className="navbar">
      <div className="navbar-brand">
        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="url(#navGrad)" strokeWidth="2">
          <defs>
            <linearGradient id="navGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#38bdf8"/>
              <stop offset="100%" stopColor="#818cf8"/>
            </linearGradient>
          </defs>
          <circle cx="12" cy="12" r="10"/>
          <path d="M2 12h20M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/>
        </svg>
        <span>Climate AI</span>
      </div>

      <div className="nav-links">
        <NavLink to="/" end className={({ isActive }) => isActive ? "active" : ""}>Home</NavLink>
        <NavLink to="/dashboard" className={({ isActive }) => isActive ? "active" : ""}>Dashboard</NavLink>
        <NavLink to="/chatbot" className={({ isActive }) => isActive ? "active" : ""}>Chatbot</NavLink>
        <NavLink to="/alerts" className={({ isActive }) => isActive ? "active" : ""}>Alerts</NavLink>
        <NavLink to="/carbon" className={({ isActive }) => isActive ? "active" : ""}>Carbon</NavLink>
        <NavLink to="/tourist" className={({ isActive }) => isActive ? "active" : ""}>🗺️ Tourist</NavLink>
        <NavLink to="/about" className={({ isActive }) => isActive ? "active" : ""}>About</NavLink>
      </div>
    </nav>
  );
}

export default Navbar;
