import React from 'react';
import { useNavigate } from 'react-router-dom';
import './Footer.css';
import {
  HeartIcon,
  EmailIcon,
  MessageIcon,
} from './Icons';

function Footer() {
  const navigate = useNavigate();
  const currentYear = new Date().getFullYear();

  const handleNav = (path) => {
    navigate(path);
    window.scrollTo(0, 0);
  };

  return (
    <footer className="site-footer">
      <div className="footer-content">

        {/* Brand Column */}
        <div className="footer-column brand-column">
          <div className="footer-logo">
            <HeartIcon size={24} color="#007AFF" />
            <span className="brand-name">HRV-4</span>
          </div>
          <p className="footer-desc">
            Empowering your wellness journey through advanced heart rate variability analysis.
          </p>
        </div>

        {/* Support Column (Simplified) */}
        <div className="footer-column support-column">
          <h4 className="column-title">Support</h4>
          <ul className="footer-links">
            <li onClick={() => handleNav('/FAQ')}>FAQ & Help Center</li>
          </ul>
        </div>

        {/* Contact Column */}
        <div className="footer-column contact-column">
          <h4 className="column-title">Contact</h4>
          <div className="contact-info">
            <div className="contact-item">
              <EmailIcon size={16} color="#8e8e93" />
              <a href="mailto:support@healthapp.com">support@healthapp.com</a>
            </div>
            <div className="contact-item">
              <MessageIcon size={16} color="#8e8e93" />
              <span>Live Chat (9am - 6pm)</span>
            </div>
          </div>
        </div>

      </div>

      <div className="footer-bottom">
        <p>&copy; {currentYear} HRV-4. All rights reserved.</p>
      </div>
    </footer>
  );
}

export default Footer;