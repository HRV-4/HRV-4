import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Footer from './Footer';
import Navbar from './LandingNavbar';
import './Landing.css';
import {
  HeartIcon,
  BrainIcon,
  ChartIcon,
  ZapIcon
} from './Icons';
import { API } from "../api";

function LandingPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);

  const navigate = useNavigate();

  const handleLogin = async () => {
    setError(null);

    try {
      const response = await fetch(`${API.users()}/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({
          email,
          password,
        }),
      });

      if (!response.ok) {
        const msg = await response.text();
        throw new Error(msg || 'Login failed');
      }
      console.log(response)

      const accessToken = await response.text();

      // store access token (short-lived)
      localStorage.setItem('accessToken', accessToken);

      navigate('/dashboard');
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="landing-page-wrapper">
      <Navbar /> {/* You might conditionally render "Login" button here if needed */}

      <div className="landing-content">

        {/* Main Hero & Features Column */}
        <div className="landing-left">

          {/* Hero Section */}
          <section className="hero-section">
            <div className="hero-badge">New: Personalized Insights</div>
            <h1 className="hero-title">
              Master Your Health with <span className="highlight-text">HRV-4</span>
            </h1>
            <p className="hero-subtitle">
              Unlock the secrets of your body. We track, analyze, and interpret your Heart Rate Variability using cutting-edge Machine Learning to optimize your recovery and performance.
            </p>
            <div className="hero-stats-row">
              <div className="hero-stat">
                <span className="stat-value">98%</span>
                <span className="stat-label">Accuracy</span>
              </div>
              <div className="hero-stat">
                <span className="stat-value">24/7</span>
                <span className="stat-label">Monitoring</span>
              </div>
              <div className="hero-stat">
                <span className="stat-value">10k+</span>
                <span className="stat-label">Users</span>
              </div>
            </div>
          </section>

          {/* Features Grid */}
          <section className="features-grid" id="features">
            <div className="feature-card">
              <div className="feature-icon bg-blue">
                <HeartIcon size={24} color="#007AFF" />
              </div>
              <h3>What is HRV?</h3>
              <p>Heart Rate Variability is the #1 biomarker for stress and recovery. We measure the time gaps between your heartbeats to decode your nervous system.</p>
            </div>

            <div className="feature-card">
              <div className="feature-icon bg-purple">
                <BrainIcon size={24} color="#8b5cf6" />
              </div>
              <h3>ML-Powered Analysis</h3>
              <p>Our advanced Machine Learning algorithms detect patterns hidden in the noise, predicting fatigue before you even feel it.</p>
            </div>

            <div className="feature-card">
              <div className="feature-icon bg-green">
                <ChartIcon size={24} color="#10b981" />
              </div>
              <h3>Actionable Trends</h3>
              <p>Don't just see data—understand it. Get daily scores and feedback that tell you exactly how hard to push.</p>
            </div>

            <div className="feature-card">
              <div className="feature-icon bg-orange">
                <ZapIcon size={24} color="#f59e0b" />
              </div>
              <h3>Optimize Performance</h3>
              <p>Align your workouts, sleep, and lifestyle with your body's true capacity.</p>
            </div>
          </section>
        </div>

        {/* Right Column: Login/Register Placeholder */}
        <div className="landing-right">
          <div className="auth-card" id="login-form">
            <div className="auth-header">
              <h2>Get Started</h2>
              <p>Join HRV-4 today</p>
            </div>

            {/* Placeholder Area for Auth Forms */}
            <div className="auth-placeholder-area">
              <div className="input-group">
                <label>Email</label>
                <input
                  type="email"
                  placeholder="name@example.com"
                  className="mock-input"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
              <div className="input-group">
                <label>Password</label>
                  <input
                    type="password"
                    placeholder="••••••••"
                    className="mock-input"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
              </div>

              <button className="auth-btn-primary" onClick={handleLogin}>
                Log In to Dashboard
              </button>
              {error && <p style={{ color: 'red', marginTop: '10px' }}>{error}</p>}
              <div className="auth-divider">or</div>

              <button 
                className="auth-btn-secondary" 
                onClick={() => navigate('/register')}
              >
                Create New Account
              </button>
            </div>

            <p className="auth-footer-text">
              By continuing, you agree to our Terms of Service and Privacy Policy.
            </p>
          </div>
        </div>

      </div>

      <Footer />
    </div>
  );
}

export default LandingPage;