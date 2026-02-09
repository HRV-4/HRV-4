import React from 'react';
import './LandingNavbar.css';
import { HeartIcon } from './Icons';

function LandingNavbar() {

  // Helper to smooth scroll to specific sections
  const scrollToSection = (id) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <nav className="landing-navbar">
      <div className="landing-nav-content">

        {/* Brand Logo */}
        <div className="landing-nav-brand" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
          <HeartIcon size={28} color="#007AFF" />
          <span className="brand-text">HRV-4</span>
        </div>

        {/* Right Side Actions */}
        <div className="landing-nav-actions">
          <button
            className="nav-link-simple"
            onClick={() => scrollToSection('features')}
          >
            Features
          </button>

          <button
            className="nav-btn-signin"
            onClick={() => scrollToSection('login-form')}
          >
            Sign In
          </button>
        </div>

      </div>
    </nav>
  );
}

export default LandingNavbar;