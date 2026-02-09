import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  TrendingUpIcon,
  TrendingDownIcon,
  ChartIcon,
  SleepIcon,
  ChevronRightIcon
} from './Icons';
import './StatusWidget.css';

// Mock HRV Data (Same structure as Insights.js)
const HRV_DATA = {
  trend: 'improving',
};

// Helper function to determine status message (Logic & Colors from Insights.js)
const getStatusMessage = () => {
  if (HRV_DATA.trend === 'improving') {
    return {
      Icon: TrendingUpIcon,
      title: 'You\'re Getting Better!',
      subtitle: 'Your body is responding well to your lifestyle choices.',
      color: '#10b981', // Base status color
    };
  } else if (HRV_DATA.trend === 'declining') {
    return {
      Icon: TrendingDownIcon,
      title: 'Time to Rest',
      subtitle: 'Your body needs more recovery time.',
      color: '#f59e0b',
    };
  }
  return {
    Icon: ChartIcon,
    title: 'Holding Steady',
    subtitle: 'Maintain your current routine.',
    color: '#3b82f6',
  };
};

// Local hardcoded tip data (Can be dynamic later)
const WIDGET_TIP = {
  title: 'Prioritize Rest Tonight',
  shortDesc: 'Your body needs recovery time',
  color: '#6366f1', // Purple/Blue for sleep
  Icon: SleepIcon
};

export default function StatusWidget() {
  const navigate = useNavigate();

  // Get the dynamic status based on HRV_DATA
  const status = getStatusMessage();
  const StatusIcon = status.Icon;

  // Construct the gradient background exactly like Insights.css
  const heroBackground = `linear-gradient(135deg, ${status.color} 0%, color-mix(in srgb, ${status.color} 80%, #000) 100%)`;

  return (
    // Content only container - parent Dashboard.js provides the 'card' wrapper
    <div className="status-widget-content">

      {/* 1. Status Section (Hero Style - White Text on Gradient) */}
      <div
        className="status-hero"
        style={{
          background: heroBackground,
          color: 'white' // Hero style always uses white text
        }}
      >
        {/* Icon wrapper with semi-transparent white background */}
        <div className="status-hero-icon">
          <StatusIcon size={24} color="#fff" /> {/* Icon is white in Hero style */}
        </div>
        <div className="status-hero-text">
          <h3 className="status-hero-title">{status.title}</h3>
          <p className="status-hero-sub">{status.subtitle}</p>
        </div>
      </div>

      {/* 2. Tip Section (Styled like Tip Card) */}
      <div className="status-tip-container">
        <div className="status-tip-card" style={{ '--tip-color': WIDGET_TIP.color }}>
          <div className="status-tip-icon">
            <WIDGET_TIP.Icon size={20} color={WIDGET_TIP.color} />
          </div>
          <div className="status-tip-info">
            <h4 className="status-tip-title">{WIDGET_TIP.title}</h4>
            <p className="status-tip-desc">{WIDGET_TIP.shortDesc}</p>
          </div>
        </div>
      </div>

      {/* 3. Footer Link */}
      <div className="status-footer">
        <span className="see-more-link" onClick={(e) => {
          e.stopPropagation();
          navigate('/insights', { state: { scrollToTips: true } });
        }}>
          See more tips <ChevronRightIcon size={14} />
        </span>
      </div>

    </div>
  );
}