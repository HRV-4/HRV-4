// SmartStack: iOS Smart Stack-like widget with vertical pages and dots
// - Uses scroll snapping and dot navigation
// - Cards/tiles are clickable and navigate to /graphs
// - All display values are centralized in DEFAULT_METRICS so backend wiring is easy
import React, {useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './SmartStack.css';

// Icon components to be used
const SvgIcon = ({ name, color = "currentColor", size = 20 }) => {
  const icons = {
    HeartFilled: <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z" />,
    Moon: <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />,
    Gauge: <path d="M12 2a10 10 0 1 0 10 10H12V2z" />,
    Activity: <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />,
    Zap: <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />,
    ArrowUp: <polyline points="6 15 12 9 18 15" />,
    ArrowDown: <polyline points="6 9 12 15 18 9" />,
    Brain: (
      <path 
        fill={color} 
        stroke="none" 
        d="M21.085 13.343a4.35 4.35 0 0 1-1.812 3.788l.738 1.429c.22.431.25.94.058 1.39a1.68 1.68 0 0 1-1.017.959l-.758.24a1.62 1.62 0 0 1-1.784-.527l-2.032-2.398a5.1 5.1 0 0 1-2.34-1.055a5 5 0 0 1-1.438.22a4.2 4.2 0 0 1-2.398-.757a5 5 0 0 1-1.553.211a5.6 5.6 0 0 1-2.206-.431a3.94 3.94 0 0 1-2.33-3.462c-.077-.69.038-1.39.336-2.024a3.3 3.3 0 0 1-.068-2.234a4.3 4.3 0 0 1 1.86-2.148c.557-1.62 2.12-2.704 3.837-2.589a4.404 4.404 0 0 1 5.59-.355a5 5 0 0 1 1.247-.163A4.16 4.16 0 0 1 18.37 5.01a4.61 4.61 0 0 1 3.433 4.286a5.05 5.05 0 0 1-.825 3.002c.067.345.106.69.106 1.045m-4.795-1.352c.547.067.978.48.978 1.026a.96.96 0 0 1-.959.959h-.604a4.97 4.97 0 0 1-1.553 2.196c.24.086.489.134.738.201c4.92-.067 4.344-3.068 4.344-3.116a2.486 2.486 0 0 0-2.58-2.388a.96.96 0 0 1-.958-.959a.96.96 0 0 1 .958-.959c1.18.029 2.312.47 3.194 1.247a5 5 0 0 0 .076-.854c-.057-1.189-.594-2.224-2.752-2.426c-1.198-2.838-4.22-1.266-4.22-.383c-.028.22.202.69.24.719a.96.96 0 0 1 .96.959a.96.96 0 0 1-.96.959a2.25 2.25 0 0 1-1.37-.537c-.461.297-.988.48-1.535.537c-.547.048-.997-.336-1.026-.863a.93.93 0 0 1 .844-1.055c.153-.02.901-.134.901-.739c0-.632.24-1.237.652-1.716c-.882-.24-1.831.077-2.79 1.237c-1.765-.278-2.484-.038-3.011 1.832c-.911.45-1.39.767-1.602 1.726a5.65 5.65 0 0 1 3.088.24a.97.97 0 0 1 .566 1.236a.96.96 0 0 1-1.237.566a2.93 2.93 0 0 0-2.206-.057c-.307.259-.307.796-.307 1.218c0 .71.355 1.37.96 1.754a3.5 3.5 0 0 0 1.64.384a6 6 0 0 1-.375-.777a.995.995 0 0 1 1.88-.652c.383 1.093 1.361 1.841 2.512 1.966a3.59 3.59 0 0 0 3.06-2.043c.22-1.323 1.284-1.438 2.454-1.438m1.918 7.163l-.595-1.246l-.68.153l.958 1.199zm-4.46-8.256a.96.96 0 0 0-.872-.988a2.56 2.56 0 0 0-1.85.643a2.85 2.85 0 0 0-.806 2.1a.96.96 0 0 0 .959.959a.95.95 0 0 0 .959-.96c0-.258.067-.517.22-.728a.64.64 0 0 1 .413-.144c.527.029.978-.364.978-.882z"
      />
    ),
    Leaf: <path d="M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.48 19 2c1 2 2 4.18 2 8 0 5.5-4.77 10-10 10Z M2 21c0-3 1.85-5.36 5.08-6C9.5 14.52 12 13 13 12" />,
    Battery: (
      <g fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="2" y="7" width="18" height="10" rx="2" ry="2" />
        <line x1="22" y1="11" x2="22" y2="13" />
        <line x1="6" x2="10" y1="12" y2="12" />
      </g>
    ),
    HeartImpulse: (
      <g fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        {/* 1. Heart Outline */}
        <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z" />
        <path d="M3 12h5.5 L10 9 L12 15 L14 9 L15.5 12h5.5" />
      </g>
    ),

    Sun: (
      <>
        <circle cx="12" cy="12" r="5" />
        <path d="M12 1v2" />
        <path d="M12 21v2" />
        <path d="M4.22 4.22l1.42 1.42" />
        <path d="M18.36 18.36l1.42 1.42" />
        <path d="M1 12h2" />
        <path d="M21 12h2" />
        <path d="M4.22 19.78l1.42-1.42" />
        <path d="M18.36 5.64l1.42-1.42" />
      </>
    ),
  };
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill={name === "HeartFilled" ? color : "none"} stroke={name === "HeartFilled" ? "none" : color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      {icons[name] || <circle cx="12" cy="12" r="10" />}
    </svg>
  );
};

// Reusable Metric Tile for Slide 2 & 3
const MetricTile = ({ label, value, subLabel, icon, color, onClick }) => (
  <div className={`ss-tile ${onClick ? 'clickable' : ''}`} onClick={onClick}>
    <div className="ss-tile-header">
      {icon && <div className="ss-tile-icon" style={{ color: color }}>{icon}</div>}
      <span className="ss-tile-label">{label}</span>
    </div>
    <div className="ss-tile-value-row">
      <span className="ss-tile-value">{value}</span>
      {subLabel && <span className="ss-tile-sub">{subLabel}</span>}
    </div>
  </div>
);

// Centralized default values so we can later swap with backend data easily
// Replace these with props or fetched values when backend is ready
const DEFAULT_METRICS = {
  performancePotential: '94%',
  burnoutResistance10: 8.2,
  stressProcessing10: 6.8,
  impulse: 65,
  regenerationScore10: 7.5,
  overallRegeneration: '3h 20m',

  maxHr: 185,
  minHr: 54,
  avgHrDay: 82,
  avgHrNight: 58,
  dynamicA_bpm: 12.0,
  dynamicB_bpm: 450.0,
};

export default function SmartStack({
  // TODO: These values are hardcoded for now, it will take sensor data from the backend
  biologicalAge = 30,
  comparisonScore = 40,
  avgHeartRate = 78,
  sleepDuration = '7h 20m',
  sleepQuality = 82,
}) {
  const containerRef = useRef(null);
  const [active, setActive] = useState(0);
  const slides = [0, 1, 2];
  const navigate = useNavigate();

  const onScroll = () => {
    const el = containerRef.current;
    if (!el) return;
    const idx = Math.round(el.scrollTop / el.clientHeight);
    if (idx !== active) setActive(idx);
  };
  const scrollToIndex = (idx) => {
    containerRef.current?.scrollTo({ top: idx * containerRef.current.clientHeight, behavior: 'smooth' });
  };

  // --- Gauge Component (percent ring inside the biological-age card) ---
  const Gauge = ({ score, text }) => {
    const radius = 70;
    const stroke = 12; //thickness of the ring
    const size = 170;
    const center = size / 2;
    const normalizedScore = Math.min(Math.max(score, -100), 100);
    const isPositive = normalizedScore >= 0;
    
    // Calculate stroke offset
    const circumference = 2 * Math.PI * radius;
    const progress = Math.abs(normalizedScore) / 100;
    const dashoffset = circumference * (1 - progress);
    
    const color = isPositive ? '#34C759' : '#FF3B30';

    return (
      <div className="ss-gauge-wrapper">
        <svg 
          height={size} 
          width={size} 
          viewBox={`0 0 ${size} ${size}`} 
        >
          {/* Background Track */}
          <circle
                stroke="#E5E5EA"
                fill="transparent"
                strokeWidth={stroke}
                r={radius}
                cx={center}
                cy={center} />
          {/* Active Ring */}
          <circle
            stroke={color}
            fill="transparent"
            strokeWidth={stroke}
            strokeDasharray={circumference}
            strokeDashoffset={dashoffset}
            strokeLinecap="round"
            r={radius}
            cx={center}
            cy={center}
            transform={`rotate(-90 ${center} ${center})`} 
          />
        </svg>
        
        {/* Text Container */}
        <div 
          className="ss-gauge-content"
        >
           <div className="ss-gauge-stack">
             <div className="ss-gauge-value" style={{ color: color }}>{Math.abs(score)}%</div>
             <div className="ss-gauge-note">{text}</div>
           </div>
        </div>
      </div>
    );
  };

  return (
    <div className="ss-widget">
      <div className="ss-scroll" ref={containerRef} onScroll={onScroll}>
        {/* TODO: All Widgets now navigate to /graphs only, it will be changed when graphs are implemented */}
        {/* --- Slide 1: Bio Age, HR, Sleep --- */}
        <section className="ss-page">
          <div className="ss-grid-main">
            {/* Biological Age Widget*/}
            <div className="ss-card ss-age-card clickable" onClick={() => navigate('/graphs')}>
              <span className="ss-title">Biological age</span>
              <div className="ss-age-layout">
                <span className="ss-big-number">{biologicalAge}</span>
                <Gauge score={comparisonScore} text={comparisonScore >= 0 ? 'better than your age' : 'worse than your age'} />
              </div>
            </div>

            {/* Heart Rate Widget*/}
            <div className="ss-card ss-hr-card clickable" onClick={() => navigate('/graphs')}>
              <div className="ss-header-row">
                <span className="ss-title">Avg Heart Rate</span>
                <div className="ss-icon-bg"><SvgIcon name="HeartFilled" color="#FF2D55" size={16} /></div>
              </div>
              <div className="ss-hr-content">
                <span className="ss-hr-big">{avgHeartRate}</span>
                <span className="ss-hr-unit">
                bpm <SvgIcon name="HeartFilled" color="#FF2D55" size={12} />
                </span>
              </div>
            </div>

            {/* Sleep Widget*/}
            <div className="ss-card ss-sleep clickable" onClick={() => navigate('/graphs')}>
              <span className="ss-title">Sleep</span>
              <div className="ss-sleep-row">
                  <span className="ss-hr-big">{sleepDuration} <SvgIcon name="Moon" size={30} color="#a6bef4ff" /></span>
                  <div className="ss-hr-content" style={{ marginTop: '6px' }}>
                  <div className="ss-pill" 
                        style={{ 
                            // If >80 Green background, else Yellow background
                            backgroundColor: sleepQuality > 80 ? '#ecfdf5' : '#fff7ed', 
                            color: sleepQuality > 80 ? '#047857' : '#c2410c',
                            border: '1px solid transparent'
                        }}
                        > 
                        Sleep Quality: <span style={{ fontWeight: '700' }}>{sleepQuality}%</span>
                        </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* --- Slide 2: Performance & Regeneration --- */}
        <section className="ss-page">
          <div className="ss-grid-tiles">
             <MetricTile label="Performance Potential" value={DEFAULT_METRICS.performancePotential} icon={<SvgIcon name="Zap"/>} color="#FF9500" onClick={() => navigate('/graphs')} />
             <MetricTile label="Burnout Resistance" value={DEFAULT_METRICS.burnoutResistance10} subLabel="/10" icon={<SvgIcon name="Activity"/>} color="#efd516ff" onClick={() => navigate('/graphs')} />
             
             <MetricTile label="Processing of Stress" value={DEFAULT_METRICS.stressProcessing10} subLabel="/10" icon={<SvgIcon name="Brain" color="#eda697ff"/>} onClick={() => navigate('/graphs')} />
             <MetricTile label="Impulse" value={DEFAULT_METRICS.impulse} icon={<SvgIcon name="HeartImpulse" color="#FF2D55"/>} onClick={() => navigate('/graphs')} />
             
             <MetricTile label="Regeneration Score" value={DEFAULT_METRICS.regenerationScore10} subLabel="/10" icon={<SvgIcon name="Battery"/>} color="#30B0C7" onClick={() => navigate('/graphs')} />
             <MetricTile label="Overall Regeneration" value={DEFAULT_METRICS.overallRegeneration} icon={<SvgIcon name="Leaf" size={15} color="#a3eb61ff"/>} onClick={() => navigate('/graphs')} />
          </div>
        </section>

        {/* --- Slide 3: Heart Rate Details --- */}
        <section className="ss-page">
           <div className="ss-grid-tiles">
              {/* Max / Min HR with arrows */}
              <MetricTile label="Max HR" value={DEFAULT_METRICS.maxHr} subLabel="bpm" color="#FF2D55" icon={<SvgIcon name="ArrowUp"/>} onClick={() => navigate('/graphs')} />
              <MetricTile label="Min HR" value={DEFAULT_METRICS.minHr} subLabel="bpm" color="#30B0C7" icon={<SvgIcon name="ArrowDown"/>} onClick={() => navigate('/graphs')} />

              {/* Day / Night Avg */}
              <MetricTile label="Avg HR (Day)" value={DEFAULT_METRICS.avgHrDay} subLabel="bpm" color="#efeb6aff" icon={<SvgIcon name="Sun" size={20}/> } onClick={() => navigate('/graphs')} />
              <MetricTile label="Avg HR (Night)" value={DEFAULT_METRICS.avgHrNight} subLabel="bpm" color="#1c4ce9ff" icon={<SvgIcon name="Moon" size={20}/> } onClick={() => navigate('/graphs')} />
              
              {/* Dynamics */}
              <MetricTile label="Dynamic A" value={DEFAULT_METRICS.dynamicA_bpm.toFixed(2)} subLabel="bpm" onClick={() => navigate('/graphs')} />
              <MetricTile label="Dynamic B" value={DEFAULT_METRICS.dynamicB_bpm.toFixed(2)} subLabel="bpm" onClick={() => navigate('/graphs')} />
           </div>
        </section>

      </div>

      {/* Widget Dots (Navigation) */}
      <div className="ss-dots">
        {slides.map((i) => (
          <button key={i} className={`ss-dot ${active === i ? 'active' : ''}`} onClick={() => scrollToIndex(i)} />
        ))}
      </div>
    </div>
  );
}