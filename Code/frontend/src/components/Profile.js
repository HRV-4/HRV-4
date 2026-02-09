import React from 'react';
import Navbar from '../components/Navbar';
import Footer from './Footer';
import './Profile.css';

function Profile() {
  return (
    <div className="profile-page-wrapper">
      <Navbar />
      <div className="profile-content">
        <h1>Profile Settings</h1>
      </div>
      <Footer />
    </div>
  );
}

export default Profile;