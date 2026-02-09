import React, { useState, useEffect, useRef } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import './Navbar.css';
import { HeartIcon, UserIcon, SettingsIcon } from './Icons';

function Navbar() {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const navigate = useNavigate();
  const dropdownRef = useRef(null);

  // Close dropdown if clicked outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [dropdownRef]);

  const handleLogout = () => {
    // Placeholder for logout logic
    console.log("Logging out...");
    navigate('/');
  };

  return (
    <nav className="navbar">
      <div className="navbar-content">

        {/* LEFT: BRAND LOGO */}
        <div className="navbar-brand" onClick={() => navigate('/dashboard')}>
          <HeartIcon size={26} color="#007AFF" />
          <span className="brand-text">HRV-4</span>
        </div>

        {/* CENTER: NAVIGATION LINKS */}
        <div className="nav-links-center">
          <NavLink to="/dashboard" className="nav-item" end>
            Dashboard
          </NavLink>
          <NavLink to="/graphs" className="nav-item">
            Graphs
          </NavLink>
          <NavLink to="/insights" className="nav-item">
            Insights
          </NavLink>
          <NavLink to="/activities" className="nav-item">
            Activities
          </NavLink>
          <NavLink to="/sensors" className="nav-item">
            My Sensors
          </NavLink>
        </div>

        {/* RIGHT: USER DROPDOWN */}
        <div className="navbar-user" ref={dropdownRef}>
          <div
            className={`user-circle ${dropdownOpen ? 'active' : ''}`}
            onClick={() => setDropdownOpen(!dropdownOpen)}
          >
            <UserIcon size={20} color={dropdownOpen ? "#007AFF" : "#555"} />
          </div>

          {dropdownOpen && (
            <div className="user-dropdown">
              <div className="dropdown-arrow"></div>

              <div
                className="dropdown-item"
                onClick={() => { navigate('/profile'); setDropdownOpen(false); }}
              >
                <SettingsIcon size={16} color="#555" />
                <span>Profile Settings</span>
              </div>

              <div className="dropdown-divider"></div>

              <div className="dropdown-item logout-item" onClick={handleLogout}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/>
                  <polyline points="16 17 21 12 16 7"/>
                  <line x1="21" y1="12" x2="9" y2="12"/>
                </svg>
                <span>Log Out</span>
              </div>
            </div>
          )}
        </div>

      </div>
    </nav>
  );
}

export default Navbar;