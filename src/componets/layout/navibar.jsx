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
        <NavLink to="/tourist" className={({ isActive }) => isActive ? "active" : ""}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{marginRight:"5px",verticalAlign:"middle"}}>
            <polygon points="3 6 9 3 15 6 21 3 21 18 15 21 9 18 3 21"/>
            <line x1="9" y1="3" x2="9" y2="18"/>
            <line x1="15" y1="6" x2="15" y2="21"/>
          </svg>
          Tourist
        </NavLink>
        <NavLink to="/about" className={({ isActive }) => isActive ? "active" : ""}>About</NavLink>
      </div>
    </nav>
  );
}

export default Navbar;
