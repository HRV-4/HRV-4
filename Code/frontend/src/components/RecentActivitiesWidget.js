import React from 'react';
import { StrengthIcon, YogaIcon, ChevronRightIcon } from './Icons'; // Ensure Icons path is correct relative to this file
import './RecentActivitiesWidget.css';

// Local hardcoded data for the widget (updated to match request)
const WIDGET_ACTIVITIES = [
  {
    id: 3,
    type: "Strength Training",
    time: "18:45",
    duration: "50 min",
    Icon: StrengthIcon, // Using specific icon consistent with Activities page logic
    color: "#10b981", // Green (matches exercise category)
    intensity: "Vigorous"
  },
  {
    id: 2,
    type: "Meditation",
    time: "12:00",
    duration: "15 min",
    Icon: YogaIcon, // Using YogaIcon as proxy for Mindfulness (or import MindfulnessIcon if it exists in Icons.js)
    color: "#8b5cf6", // Purple (matches mindfulness category)
    intensity: "Light"
  }
];

export default function RecentActivitiesWidget() {
  // This component now returns ONLY the internal content.
  // The outer 'card' box is provided by the parent (Dashboard.js).
  return (
    <div className="activity-widget-content">
      <div className="widget-header">
        <h3>Recent Activities</h3>
        {/* We can't navigate here easily if we don't use hook,
            but the parent card has the onClick handler!
            So this is just visual text. */}
        <span className="view-all-link">View All</span>
      </div>

      <div className="widget-list">
        {WIDGET_ACTIVITIES.map((activity) => {
          const IconComponent = activity.Icon;
          return (
            <div
              key={activity.id}
              className="activity-mini-item"
              style={{ '--accent-color': activity.color }}
            >
              <div className="activity-mini-icon">
                 <IconComponent size={20} color={activity.color} />
              </div>

              <div className="activity-mini-info">
                <span className="activity-mini-title">{activity.type}</span>
                <div className="activity-mini-meta">
                  <span>{activity.time}</span>
                  <span className="dot">•</span>
                  <span>{activity.duration}</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}