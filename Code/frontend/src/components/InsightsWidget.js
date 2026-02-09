import React from 'react';
import { TrendingUpIcon, SleepIcon, ChevronRightIcon } from './Icons';
import './InsightsWidget.css';

// Local hardcoded data for the widget (First 2 insights as requested)
const WIDGET_INSIGHTS = [
  {
    id: 1,
    type: 'positive',
    Icon: TrendingUpIcon,
    iconColor: '#10b981',
    title: 'Your recovery is improving',
    description: 'Your HRV has increased by 11.5% compared to your baseline. This indicates your body is adapting well to your current routine.',
    metric: '+11.5%',
    metricLabel: 'vs baseline',
  },
  {
    id: 2,
    type: 'info',
    Icon: SleepIcon,
    iconColor: '#6366f1',
    title: 'Sleep quality impact detected',
    description: 'Your HRV readings are highest after nights with 7+ hours of sleep. Consider maintaining a consistent sleep schedule.',
    metric: '7h+',
    metricLabel: 'optimal sleep',
  }
];

export default function InsightsWidget() {
  // This component returns ONLY the internal content (Header + List).
  // The outer 'card' box is provided by the parent (Dashboard.js).
  return (
    <div className="insights-widget-content">
      <div className="widget-header">
        <h3>Insights</h3>
        <span className="view-all-link">View All</span>
      </div>

      <div className="insights-list">
        {WIDGET_INSIGHTS.map((insight) => {
          const IconComponent = insight.Icon;
          return (
            <div key={insight.id} className="insight-mini-item">
              {/* Icon */}
              <div className="insight-mini-icon" style={{ backgroundColor: `${insight.iconColor}15` }}>
                <IconComponent size={20} color={insight.iconColor} />
              </div>

              {/* Text */}
              <div className="insight-mini-info">
                <span className="insight-mini-title">{insight.title}</span>
                <span className="insight-mini-desc">{insight.description}</span>
              </div>

              {/* Metric & Label */}
              <div className="insight-mini-meta">
                <div className="insight-metric-group">
                  <span className="insight-metric" style={{ color: insight.iconColor }}>
                    {insight.metric}
                  </span>
                  <span className="insight-metric-label">
                    {insight.metricLabel}
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}