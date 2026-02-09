import React from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from './Footer';
import './Dashboard.css';
import SmartStack from './SmartStack';
import RecentActivitiesWidget from './RecentActivitiesWidget';
import InsightsWidget from './InsightsWidget';
import StatusWidget from './StatusWidget';

function Dashboard() {
  const navigate = useNavigate();

  return (
    <>
      <Navbar />

      <div className="dashboard-container">
        <div className="dashboard-grid">

          {/* Top Left Box: Smart Stack widget */}
          <div className="card empty-box">
            <SmartStack />
          </div>

          {/* Top Right Column */}
          <div className="right-column-stack">

            {/* Top Right Upper Box: General State -> Link to Graphs */}
            <div className="card clickable-card" onClick={() => navigate('/insights')}>
               <StatusWidget />
            </div>

            {/* Top Right Lower Box: Activities -> Link to Activities */}
            <div className="card clickable-card" onClick={() => navigate('/activities')}>
               <RecentActivitiesWidget />
            </div>

          </div>

          {/* Bottom Box: Insights -> Link to Graphs */}
          <div className="card bottom-card clickable-card" onClick={() => navigate('/insights')}>
             <InsightsWidget />
          </div>

        </div>
      </div>
      <Footer />
    </>
  );
}

export default Dashboard;