import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { API } from "../api";
import './Landing.css';

function RegisterPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    setError(null);

    try {
      const response = await fetch(`${API.users()}/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      if (!response.ok) {
        const msg = await response.text();
        throw new Error(msg || 'Registration failed');
      }

      navigate('/'); 
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="landing-page-wrapper" style={{ justifyContent: 'center', alignItems: 'center', display: 'flex', height: '100vh' }}>
      <div className="auth-card">
        <div className="auth-header">
          <h2>Create Account</h2>
          <p>Start tracking your HRV today</p>
        </div>
        <form onSubmit={handleRegister} className="auth-placeholder-area">
          <div className="input-group">
            <label>Email</label>
            <input
              type="email"
              placeholder="name@example.com"
              className="mock-input"
              required
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
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <button type="submit" className="auth-btn-primary">Sign Up</button>
          {error && <p style={{ color: 'red', marginTop: '10px' }}>{error}</p>}
          <button type="button" className="auth-btn-secondary" onClick={() => navigate('/')} style={{ marginTop: '10px' }}>
            Back to Login
          </button>
        </form>
      </div>
    </div>
  );
}

export default RegisterPage;