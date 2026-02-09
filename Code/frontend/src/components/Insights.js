import React, {useState, useEffect,useRef} from 'react';
import {useLocation,useNavigate} from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from './Footer';
import './Insights.css';
import {
  TrendingUpIcon,
  TrendingDownIcon,
  SleepIcon,
  ZapIcon,
  YogaIcon,
  HydrationIcon,
  WalkingIcon,
  NutritionIcon,
  SunIcon,
  BrainIcon,
  ActivityIcon,
  ChartIcon,
  HeartRateIcon,
} from './Icons';

//Mock HRV Data
const HRV_DATA = {
  current:50,
  baseline:60,
  trend:'improving',
  change:-10,
  lastUpdated:'Today at 10:00 AM',
  weeklyAverage:55,
  monthlyAverage:58,
  history:[
    { date: 'Mon', value: 48 },
    { date: 'Tue', value: 52 },
    { date: 'Wed', value: 49 },
    { date: 'Thu', value: 55 },
    { date: 'Fri', value: 53 },
    { date: 'Sat', value: 57 },
    { date: 'Today', value: 58 },
  ],
};

// Insights based on HRV data - with icon components
const INSIGHTS = [
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
  },
  {
    id: 3,
    type: 'warning',
    Icon: ZapIcon,
    iconColor: '#f59e0b',
    title: 'Training load is optimal',
    description: 'Your current exercise intensity matches your recovery capacity. Avoid increasing workout intensity this week.',
    metric: 'Balanced',
    metricLabel: 'strain/recovery',
  },
  {
    id: 4,
    type: 'positive',
    Icon: YogaIcon,
    iconColor: '#8b5cf6',
    title: 'Stress management working',
    description: 'Regular meditation sessions are correlating with improved HRV readings. Keep up the mindfulness practice.',
    metric: '15min',
    metricLabel: 'daily meditation',
  },
];

// Health Tips with icon components
const HEALTH_TIPS = [
  {
    id: 1,
    category: 'recovery',
    Icon: SleepIcon,
    color: '#6366f1',
    title: 'Prioritize Rest Tonight',
    shortDesc: 'Your body needs recovery time',
    fullDesc: 'Based on your recent activity levels and HRV trends, your body would benefit from extra rest. Aim for 8 hours of sleep tonight and avoid intense exercise.',
    actions: ['Go to bed 30 minutes earlier', 'Avoid screens 1 hour before sleep', 'Keep room temperature cool (65-68°F)'],
    priority: 'high',
  },
  {
    id: 2,
    category: 'hydration',
    Icon: HydrationIcon,
    color: '#3b82f6',
    title: 'Stay Hydrated',
    shortDesc: 'Optimize your daily water intake',
    fullDesc: 'Proper hydration directly impacts HRV and recovery. Your activity level suggests you need approximately 3 liters of water today.',
    actions: ['Start your day with a glass of water', 'Drink water before each meal', 'Carry a water bottle throughout the day'],
    priority: 'medium',
  },
  {
    id: 3,
    category: 'exercise',
    Icon: WalkingIcon,
    color: '#10b981',
    title: 'Light Movement Recommended',
    shortDesc: 'A gentle walk can boost recovery',
    fullDesc: 'Light activity like walking or gentle stretching can actually enhance recovery without taxing your system. Aim for 20-30 minutes of easy movement.',
    actions: ['Take a 20-minute walk after lunch', 'Do 10 minutes of gentle stretching', 'Try a restorative yoga session'],
    priority: 'medium',
  },
  {
    id: 4,
    category: 'stress',
    Icon: BrainIcon,
    color: '#8b5cf6',
    title: 'Practice Deep Breathing',
    shortDesc: 'Activate your parasympathetic system',
    fullDesc: 'Deep breathing exercises can immediately boost your HRV by activating your parasympathetic nervous system. Try the 4-7-8 breathing technique.',
    actions: ['Inhale for 4 seconds', 'Hold for 7 seconds', 'Exhale for 8 seconds', 'Repeat 4 times'],
    priority: 'low',
  },
  {
    id: 5,
    category: 'nutrition',
    Icon: NutritionIcon,
    color: '#f59e0b',
    title: 'Anti-Inflammatory Foods',
    shortDesc: 'Support recovery with nutrition',
    fullDesc: 'Including anti-inflammatory foods in your diet can support recovery and improve HRV over time. Focus on omega-3 rich foods and leafy greens.',
    actions: ['Add fatty fish like salmon twice a week', 'Include leafy greens with each meal', 'Snack on nuts and berries'],
    priority: 'low',
  },
  {
    id: 6,
    category: 'mindfulness',
    Icon: SunIcon,
    color: '#ec4899',
    title: 'Morning Sunlight Exposure',
    shortDesc: 'Regulate your circadian rhythm',
    fullDesc: 'Getting 10-15 minutes of morning sunlight helps regulate your circadian rhythm, which positively impacts sleep quality and HRV.',
    actions: ['Step outside within 1 hour of waking', 'Have your morning coffee outdoors', 'Take a brief morning walk'],
    priority: 'medium',
  },
];

//HRV Chart Component
function HRVChart({data}) {
  const maxVal = Math.max(...data.map(d => d.value));
  const minVal = Math.min(...data.map(d => d.value));
  const range = maxVal - minVal || 1;
   return (
    <div className="hrv-chart">
      <div className="hrv-chart__bars">
        {data.map((point, i) => {
          const height = ((point.value - minVal) / range) * 60 + 20;
          const isToday = i === data.length - 1;
          return (
            <div key={i} className="hrv-chart__bar-wrapper">
              <div 
                className={`hrv-chart__bar ${isToday ? 'is-today' : ''}`}
                style={{ height: `${height}%` }}
              >
                <span className="hrv-chart__value">{point.value}</span>
              </div>
              <span className="hrv-chart__label">{point.date}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
// Insight Card Component
function InsightCard({insight}){
  const IconComponent = insight.Icon;
  return (
    <div className={`insight-card insight-card--${insight.type}`}>
      <div className="insight-card__icon" style={{ '--icon-bg': `${insight.iconColor}15` }}>
        <IconComponent size={28} color={insight.iconColor} />
      </div>
      <div className="insight-card__content">
        <h3 className="insight-card__title">{insight.title}</h3>
        <p className="insight-card__desc">{insight.description}</p>
      </div>
      <div className="insight-card__metric">
        <span className="insight-card__metric-value">{insight.metric}</span>
        <span className="insight-card__metric-label">{insight.metricLabel}</span>
      </div>
    </div>
  );
}
// Tip Card Component with SVG icons
function TipCard({ tip, isExpanded, onToggle }) {
  const IconComponent = tip.Icon;
  
  return (
    <div 
      className={`tip-card ${isExpanded ? 'is-expanded' : ''}`}
      style={{ '--tip-color': tip.color }}
    >
      <div className="tip-card__header" onClick={onToggle}>
        <div className="tip-card__icon">
          <IconComponent size={24} color={tip.color} />
        </div>
        <div className="tip-card__info">
          <h3 className="tip-card__title">{tip.title}</h3>
          <p className="tip-card__short">{tip.shortDesc}</p>
        </div>
        {tip.priority === 'high' && (
          <span className="tip-card__priority">Priority</span>
        )}
        <button className="tip-card__toggle" aria-label="Expand">
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
            <path d="M5 7.5L10 12.5L15 7.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </button>
      </div>
      
      {isExpanded && (
        <div className="tip-card__body">
          <p className="tip-card__full-desc">{tip.fullDesc}</p>
          <div className="tip-card__actions">
            <h4 className="tip-card__actions-title">Action Steps:</h4>
            <ul className="tip-card__actions-list">
              {tip.actions.map((action, i) => (
                <li key={i} className="tip-card__action-item">
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                    <path d="M13.333 4L6 11.333 2.667 8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                  {action}
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </div>
  );
}


function Insights() {
  const location = useLocation();
  const navigate = useNavigate();
  const tipsRef = useRef(null);
  const [expandedTip, setExpandedTip] = useState(null);
  const [activeTab, setActiveTab] = useState('insights');

  // Handle navigation to tips section
  useEffect(() => {
    if (location.hash === '#tips' || location.state?.scrollToTips) {
      setActiveTab('tips');
      setTimeout(() => {
        tipsRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 100);
    }
  }, [location]);

  const getStatusMessage = () => {
    if (HRV_DATA.trend === 'improving') {
      return {
        Icon: TrendingUpIcon,
        title: 'You\'re Getting Better!',
        subtitle: 'Your body is responding well to your lifestyle choices.',
        color: '#10b981',
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
  const status = getStatusMessage();
  const StatusIcon = status.Icon;
  return (
    <div className="insights-page">
      <Navbar />

      <main className="insights-main">
        {/* Hero Status */}
        <section className="insights-hero">
          <div className="hero-status" style={{ '--status-color': status.color }}>
            <div className="hero-status__icon-wrapper">
              <StatusIcon size={32} color="#fff" />
            </div>
            <div className="hero-status__text">
              <h1 className="hero-status__title">{status.title}</h1>
              <p className="hero-status__subtitle">{status.subtitle}</p>
            </div>
          </div>
        </section>

        {/* HRV Overview */}
        <section className="hrv-overview">
          <div className="hrv-overview__header">
            <div className="hrv-overview__title-group">
              <div className="hrv-overview__title-row">
                <HeartRateIcon size={20} color="#007AFF" />
                <h2 className="hrv-overview__title">Heart Rate Variability</h2>
              </div>
              <span className="hrv-overview__updated">Last updated: {HRV_DATA.lastUpdated}</span>
            </div>
            <div className="hrv-overview__badge" data-trend={HRV_DATA.trend}>
              {HRV_DATA.trend === 'improving' ? (
                <TrendingUpIcon size={14} />
              ) : HRV_DATA.trend === 'declining' ? (
                <TrendingDownIcon size={14} />
              ) : (
                <span>→</span>
              )}
              {Math.abs(HRV_DATA.change)}%
            </div>
          </div>

          <div className="hrv-stats">
            <div className="hrv-stat hrv-stat--primary">
              <span className="hrv-stat__value">{HRV_DATA.current}</span>
              <span className="hrv-stat__unit">ms</span>
              <span className="hrv-stat__label">Current HRV</span>
            </div>
            <div className="hrv-stat">
              <span className="hrv-stat__value">{HRV_DATA.baseline}</span>
              <span className="hrv-stat__unit">ms</span>
              <span className="hrv-stat__label">Baseline</span>
            </div>
            <div className="hrv-stat">
              <span className="hrv-stat__value">{HRV_DATA.weeklyAverage}</span>
              <span className="hrv-stat__unit">ms</span>
              <span className="hrv-stat__label">7-Day Avg</span>
            </div>
            <div className="hrv-stat">
              <span className="hrv-stat__value">{HRV_DATA.monthlyAverage}</span>
              <span className="hrv-stat__unit">ms</span>
              <span className="hrv-stat__label">30-Day Avg</span>
            </div>
          </div>

          <HRVChart data={HRV_DATA.history} />
        </section>

        {/* Tab Navigation */}
        <div className="insights-tabs">
          <button 
            className={`insights-tab ${activeTab === 'insights' ? 'is-active' : ''}`}
            onClick={() => setActiveTab('insights')}
          >
            <ChartIcon size={18} />
            AI Insights
          </button>
          <button 
            className={`insights-tab ${activeTab === 'tips' ? 'is-active' : ''}`}
            onClick={() => setActiveTab('tips')}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M9 18h6"/>
              <path d="M10 22h4"/>
              <path d="M15.09 14c.18-.98.65-1.74 1.41-2.5A4.65 4.65 0 0 0 18 8 6 6 0 0 0 6 8c0 1 .23 2.23 1.5 3.5A4.61 4.61 0 0 1 8.91 14"/>
            </svg>
            Health Tips
          </button>
        </div>

        {/* Insights Section */}
        {activeTab === 'insights' && (
          <section className="insights-section">
            <div className="section-header">
              <h2 className="section-title">Personalized Insights</h2>
              <p className="section-subtitle">Based on your HRV data and activity patterns</p>
            </div>
            <div className="insights-list">
              {INSIGHTS.map((insight) => (
                <InsightCard key={insight.id} insight={insight} />
              ))}
            </div>
          </section>
        )}

        {/* Tips Section */}
        {activeTab === 'tips' && (
          <section className="tips-section" ref={tipsRef} id="tips">
            <div className="section-header">
              <h2 className="section-title">Health Tips</h2>
              <p className="section-subtitle">Actionable recommendations to improve your wellbeing</p>
            </div>
            <div className="tips-grid">
              {HEALTH_TIPS.map((tip) => (
                <TipCard 
                  key={tip.id} 
                  tip={tip}
                  isExpanded={expandedTip === tip.id}
                  onToggle={() => setExpandedTip(expandedTip === tip.id ? null : tip.id)}
                />
              ))}
            </div>
          </section>
        )}

        {/* Quick Actions */}
        <section className="quick-actions">
          <h3 className="quick-actions__title">Quick Actions</h3>
          <div className="quick-actions__grid">
            <button className="quick-action" onClick={() => navigate('/activities')}>
              <span className="quick-action__icon">
                <ActivityIcon size={28} color="#10b981" />
              </span>
              <span className="quick-action__label">Log Activity</span>
            </button>
            <button className="quick-action">
              <span className="quick-action__icon">
                <SleepIcon size={28} color="#6366f1" />
              </span>
              <span className="quick-action__label">Log Sleep</span>
            </button>
            <button className="quick-action">
              <span className="quick-action__icon">
                <YogaIcon size={28} color="#8b5cf6" />
              </span>
              <span className="quick-action__label">Start Meditation</span>
            </button>
            <button className="quick-action">
              <span className="quick-action__icon">
                <ChartIcon size={28} color="#3b82f6" />
              </span>
              <span className="quick-action__label">View Trends</span>
            </button>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}

export default Insights;






  
  
