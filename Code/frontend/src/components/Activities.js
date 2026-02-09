import React, { useMemo, useState } from "react";
import Navbar from "../components/Navbar";
import Footer from './Footer';
import { useNavigate } from "react-router-dom";
import "./Activities.css";
import {
  ActivityIcon,
  YogaIcon,
  SleepIcon,
  NutritionIcon,
  HydrationIcon,
  MedicationIcon,
  TimerIcon,
  FireIcon,
  HeartIcon,
  EditIcon,
  TrashIcon,
  ChevronDownIcon,
  PlusIcon,
  CheckCircleIcon,
} from "./Icons";
const RANGES = [
  { key: "12h", label: "12h" },
  { key: "24h", label: "24h" },
  { key: "1w", label: "1w" },
  { key: "1m", label: "1m" },
  { key: "1y", label: "1y" },
];
// Intensity options for activities
const INTENSITY_OPTIONS = ["", "Low", "Moderate", "High"];
// Activity categories with SVG icon components
const ACTIVITY_CATEGORIES = [
  { id: "exercise", name: "Exercise", Icon: ActivityIcon, color: "#10b981" },
  { id: "mindfulness", name: "Mindfulness", Icon: YogaIcon, color: "#8b5cf6" },
  { id: "sleep", name: "Sleep", Icon: SleepIcon, color: "#6366f1" },
  { id: "nutrition", name: "Nutrition", Icon: NutritionIcon, color: "#f59e0b" },
  { id: "hydration", name: "Hydration", Icon: HydrationIcon, color: "#3b82f6" },
  { id: "medication", name: "Medication", Icon: MedicationIcon, color: "#ef4444" },
];
// Helper to pad numbers to 2 digits
function pad2(n) {
  return String(n).padStart(2, "0");
}
// Helper to get current time in HH:MM format
function nowTimeHHMM() {
  const d = new Date();
  return `${pad2(d.getHours())}:${pad2(d.getMinutes())}`;
}
// Helper to format date as "Wed, Sep 15"
function formatDate(date) {
  return new Intl.DateTimeFormat('en-US', { 
    weekday: 'short', 
    month: 'short', 
    day: 'numeric' 
  }).format(date);
}
// Helper to get relative time from now
function getRelativeTime(timeStr) {
  const [h, m] = timeStr.split(':').map(Number);
  const now = new Date();
  const activity = new Date();
  activity.setHours(h, m, 0, 0);
  
  const diff = now - activity;
  const mins = Math.floor(diff / 60000);
  
  if (mins < 1) return 'Just now';
  if (mins < 60) return `${mins}m ago`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours}h ago`;
  return timeStr;
}
// Seed data for activities
const SEED_ACTIVITIES = [
  { 
    id: 1, 
    date: new Date().toISOString().split('T')[0],
    time: "07:30", 
    type: "Morning Run", 
    category: "exercise",
    durationMin: 35, 
    intensity: "Vigorous", 
    calories: 320,
    heartRate: { avg: 142, max: 168 },
    note: "5K run around the park. Felt energized!" 
  },
  { 
    id: 2, 
    date: new Date().toISOString().split('T')[0],
    time: "12:00", 
    type: "Meditation", 
    category: "mindfulness",
    durationMin: 15, 
    intensity: "Light", 
    note: "Guided breathing session" 
  },
  { 
    id: 3, 
    date: new Date().toISOString().split('T')[0],
    time: "18:45", 
    type: "Strength Training", 
    category: "exercise",
    durationMin: 50, 
    intensity: "Vigorous", 
    calories: 280,
    heartRate: { avg: 128, max: 155 },
    note: "Upper body focus - chest and triceps" 
  },
  { 
    id: 4, 
    date: new Date(Date.now() - 86400000).toISOString().split('T')[0],
    time: "06:00", 
    type: "Yoga Flow", 
    category: "mindfulness",
    durationMin: 45, 
    intensity: "Moderate", 
    calories: 150,
    note: "" 
  },
  { 
    id: 5, 
    date: new Date(Date.now() - 86400000).toISOString().split('T')[0],
    time: "20:00", 
    type: "Evening Walk", 
    category: "exercise",
    durationMin: 30, 
    intensity: "Light", 
    calories: 120,
    note: "Relaxing walk with podcast" 
  },
];
// to display daily summary statistics
function DailySummary({activities,range}){
  const stats = useMemo(() => {
    const today = new Date().toISOString().split('T')[0];
    const todayActivities = activities.filter(a => a.date === today);
    return {
      totalDuration: todayActivities.reduce((sum, a) => sum + a.durationMin, 0),
      totalCalories: todayActivities.reduce((sum, a) => sum + (a.calories || 0), 0),
      activityCount: todayActivities.length,
      avgHeartRate: Math.round(
        todayActivities.filter(a => a.heartRate).reduce((sum, a) => sum + a.heartRate.avg, 0) / 
        (todayActivities.filter(a => a.heartRate).length || 1)
      ) || 0,
    };
  }, [activities]);
  return (
    <div className="daily-summary">
      <div className="summary-card summary-card--primary">
        <div className="summary-icon">
          <TimerIcon size={24} color="#fff" />
        </div>
        <div className="summary-content">
          <span className="summary-value">{stats.totalDuration}</span>
          <span className="summary-label">Minutes Active</span>
        </div>
        <div className="summary-ring">
          <svg viewBox="0 0 36 36">
            <path
              className="ring-bg"
              d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
            />
            <path
              className="ring-fill"
              strokeDasharray={`${Math.min(stats.totalDuration / 60 * 100, 100)}, 100`}
              d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
            />
          </svg>
        </div>
      </div>
      
      <div className="summary-card">
        <div className="summary-icon summary-icon--fire">
          <FireIcon size={24} color="#f97316" />
        </div>
        <div className="summary-content">
          <span className="summary-value">{stats.totalCalories}</span>
          <span className="summary-label">Calories Burned</span>
        </div>
      </div>
      
      <div className="summary-card">
        <div className="summary-icon summary-icon--heart">
          <HeartIcon size={24} color="#ef4444" />
        </div>
        <div className="summary-content">
          <span className="summary-value">{stats.avgHeartRate || '—'}</span>
          <span className="summary-label">Avg Heart Rate</span>
        </div>
      </div>
      
      <div className="summary-card">
        <div className="summary-icon summary-icon--check">
          <CheckCircleIcon size={24} color="#10b981" />
        </div>
        <div className="summary-content">
          <span className="summary-value">{stats.activityCount}</span>
          <span className="summary-label">Activities</span>
        </div>
      </div>
    </div>
  );
}

// Activity card component
function ActivityCard({ activity, onDelete, getCategoryInfo }) {
  const [expanded, setExpanded] = useState(false);
  const category = getCategoryInfo(activity.category);
  const IconComponent = category.Icon;
  
  return (
    <div 
      className={`activity-card ${expanded ? 'is-expanded' : ''}`}
      style={{ '--accent-color': category.color }}
    >
      <div className="activity-card__main" onClick={() => setExpanded(!expanded)}>
        <div className="activity-card__icon">
          <IconComponent size={24} color={category.color} />
        </div>
        
        <div className="activity-card__info">
          <h3 className="activity-card__title">{activity.type}</h3>
          <div className="activity-card__meta">
            <span className="activity-card__time">{getRelativeTime(activity.time)}</span>
            <span className="activity-card__dot">•</span>
            <span className="activity-card__duration">{activity.durationMin} min</span>
            {activity.calories && (
              <>
                <span className="activity-card__dot">•</span>
                <span className="activity-card__calories">{activity.calories} cal</span>
              </>
            )}
          </div>
        </div>
        
        <div className="activity-card__right">
          {activity.intensity && (
            <span className={`intensity-badge intensity-badge--${activity.intensity.toLowerCase()}`}>
              {activity.intensity}
            </span>
          )}
          <button className="expand-btn" aria-label="Expand">
            <ChevronDownIcon size={20} />
          </button>
        </div>
      </div>
      
      {expanded && (
        <div className="activity-card__details">
          {activity.heartRate && (
            <div className="detail-row">
              <span className="detail-label">
                <HeartIcon size={16} color="#ef4444" />
                Heart Rate
              </span>
              <span className="detail-value">
                {activity.heartRate.avg} avg / {activity.heartRate.max} max bpm
              </span>
            </div>
          )}
          
          {activity.note && (
            <div className="detail-row detail-row--note">
              <span className="detail-label">Notes</span>
              <p className="detail-note">{activity.note}</p>
            </div>
          )}
          
          <div className="activity-card__actions">
            <button className="action-btn action-btn--edit">
              <EditIcon size={16} />
              Edit
            </button>
            <button 
              className="action-btn action-btn--delete"
              onClick={(e) => { e.stopPropagation(); onDelete(activity.id); }}
            >
              <TrashIcon size={16} />
              Delete
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

function Activities() {
  const navigate = useNavigate();
  const [range, setRange] = useState("24h");
  const [items, setItems] = useState(() =>
    [...SEED_ACTIVITIES].sort((a, b) => {
      if (a.date !== b.date) return a.date < b.date ? 1 : -1;
      return a.time < b.time ? 1 : -1;
    })
  );
// Modal and form state
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formError, setFormError] = useState("");
  const [form, setForm] = useState({
    date: new Date().toISOString().split('T')[0],
    time: nowTimeHHMM(),
    type: "",
    category: "exercise",
    durationMin: 15,
    intensity: "Low",
    calories: "",
    note: "",
  });
  const getCategoryInfo = (categoryId) => {
    return ACTIVITY_CATEGORIES.find(c => c.id === categoryId) || ACTIVITY_CATEGORIES[0];
  };
  const filteredActivities = useMemo(() => {
    let filtered = items;
    
    if (selectedCategory) {
      filtered = filtered.filter(a => a.category === selectedCategory);
    }
    
    const now = new Date();
    const today = now.toISOString().split('T')[0];
    
    switch (range) {
      case '12h':
        const twelveHoursAgo = new Date(now - 12 * 3600000).toISOString().split('T')[0];
        filtered = filtered.filter(a => a.date >= twelveHoursAgo);
        break;
      case '24h':
        filtered = filtered.filter(a => a.date === today);
        break;
      case '1w':
        const week = new Date(now - 7 * 86400000).toISOString().split('T')[0];
        filtered = filtered.filter(a => a.date >= week);
        break;
      case '1m':
        const month = new Date(now - 30 * 86400000).toISOString().split('T')[0];
        filtered = filtered.filter(a => a.date >= month);
        break;
      default:
        break;
    }
    
    return filtered;
  }, [items, range, selectedCategory]);
  // Group activities by date
  const groupedActivities = useMemo(() => {
    const groups = {};
    filteredActivities.forEach(activity => {
      if (!groups[activity.date]) {
        groups[activity.date] = [];
      }
      groups[activity.date].push(activity);
    });
    return Object.entries(groups).sort(([a], [b]) => b.localeCompare(a));
  }, [filteredActivities]);
  


  function openModal() {
    setFormError("");
    setForm({
      date: new Date().toISOString().split('T')[0],
      time: nowTimeHHMM(),
      type: "",
      category: "exercise",
      durationMin: 30,
      intensity: "Moderate",
      calories: "",
      note: "",
    });
    setIsModalOpen(true);
  }

  function closeModal() {
    setIsModalOpen(false);
    setFormError("");
  }

  function onBackdropClick(e) {
    if (e.target.classList.contains("modal-backdrop")) closeModal();
  }

  function handleChange(key, value) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  function validateForm() {
    if (!form.time || !/^\d{2}:\d{2}$/.test(form.time)) return "Please enter a valid time.";
    if (!form.type.trim()) return "Please enter an activity name.";
    const d = Number(form.durationMin);
    if (!Number.isFinite(d) || d <= 0 || d > 600) return "Duration must be between 1 and 600 minutes.";
    return "";
  }

  function handleSubmit(e) {
    e.preventDefault();
    const err = validateForm();
    if (err) return setFormError(err);

    const newItem = {
      id: Date.now(),
      date: form.date,
      time: form.time,
      type: (form.type),
      category: form.category,
      durationMin: Number(form.durationMin),
      intensity: form.intensity || "",
      calories: form.calories ? Number(form.calories) : null,
      note: (form.note || "").trim(),
    };

    setItems((prev) => [newItem, ...prev].sort((a, b) => {
      if (a.date !== b.date) return a.date < b.date ? 1 : -1;
      return a.time < b.time ? 1 : -1;
    }));
    closeModal();
  }

  function handleDelete(id) {
    setItems((prev) => prev.filter((x) => x.id !== id));
  }

  
  return (
    <div className="activities-page">
      <Navbar />

      <main className="activities-main">
        {/* Hero Section */}
        <section className="activities-hero">
          <div className="hero-content">
            <h1 className="hero-title">Activities</h1>
            <p className="hero-subtitle">Track your daily wellness journey</p>
          </div>
          <button className="add-activity-btn" onClick={openModal}>
            <PlusIcon size={20} />
            Log Activity
          </button>
        </section>

        {/* Daily Summary */}
        <DailySummary activities={items} range={range} />

        {/* Time Range Filter */}
        <div className="filter-section">
          <div className="time-range-tabs">
            {RANGES.map((r) => (
              <button
                key={r.key}
                className={`range-tab ${range === r.key ? "is-active" : ""}`}
                onClick={() => setRange(r.key)}
              >
                {r.label}
              </button>
            ))}
          </div>
        </div>

        {/* Category Pills */}
        <div className="category-filter">
          <button
            className={`category-pill ${!selectedCategory ? 'is-active' : ''}`}
            onClick={() => setSelectedCategory(null)}
          >
            All
          </button>
          {ACTIVITY_CATEGORIES.map((cat) => {
            const IconComponent = cat.Icon;
            return (
              <button
                key={cat.id}
                className={`category-pill ${selectedCategory === cat.id ? 'is-active' : ''}`}
                style={{ '--pill-color': cat.color }}
                onClick={() => setSelectedCategory(selectedCategory === cat.id ? null : cat.id)}
              >
                <span className="category-pill__icon">
                  <IconComponent size={16} color={selectedCategory === cat.id ? '#fff' : cat.color} />
                </span>
                {cat.name}
              </button>
            );
          })}
        </div>

        {/* Activities List */}
        <section className="activities-section">
          {groupedActivities.length === 0 ? (
            <div className="empty-state">
              <div className="empty-state__icon">
                <ActivityIcon size={48} color="#9ca3af" />
              </div>
              <h3 className="empty-state__title">No activities yet</h3>
              <p className="empty-state__text">Start tracking your wellness journey by logging your first activity.</p>
              <button className="empty-state__btn" onClick={openModal}>
                Log Your First Activity
              </button>
            </div>
          ) : (
            groupedActivities.map(([date, activities]) => (
              <div key={date} className="activity-group">
                <h2 className="activity-group__date">
                  {date === new Date().toISOString().split('T')[0] 
                    ? 'Today' 
                    : date === new Date(Date.now() - 86400000).toISOString().split('T')[0]
                    ? 'Yesterday'
                    : formatDate(new Date(date))}
                </h2>
                <div className="activity-group__list">
                  {activities.map((activity) => (
                    <ActivityCard
                      key={activity.id}
                      activity={activity}
                      onDelete={handleDelete}
                      getCategoryInfo={getCategoryInfo}
                    />
                  ))}
                </div>
              </div>
            ))
          )}
        </section>
      </main>

      {/* Modal */}
      {isModalOpen && (
        <div className="modal-backdrop" onMouseDown={onBackdropClick}>
          <div className="modal">
            <div className="modal-header">
              <h2 className="modal-title">Log Activity</h2>
              <button className="modal-close" onClick={closeModal}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                  <path d="M18 6L6 18M6 6l12 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                </svg>
              </button>
            </div>

            <form className="modal-body" onSubmit={handleSubmit}>
              {/* Category Selection */}
              <div className="category-select">
                <label className="field-label">Category</label>
                <div className="category-grid">
                  {ACTIVITY_CATEGORIES.map((cat) => {
                    const IconComponent = cat.Icon;
                    return (
                      <button
                        key={cat.id}
                        type="button"
                        className={`category-option ${form.category === cat.id ? 'is-selected' : ''}`}
                        style={{ '--cat-color': cat.color }}
                        onClick={() => handleChange('category', cat.id)}
                      >
                        <span className="category-option__icon">
                          <IconComponent size={24} color={form.category === cat.id ? cat.color : '#6b7280'} />
                        </span>
                        <span className="category-option__name">{cat.name}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Activity Name */}
              <div className="field">
                <label className="field-label">Activity Name</label>
                <input
                  className="input"
                  type="text"
                  placeholder="e.g., Morning Run, Yoga Session"
                  value={form.type}
                  onChange={(e) => handleChange("type", e.target.value)}
                  autoFocus
                />
              </div>

              {/* Date & Time */}
              <div className="form-row">
                <div className="field">
                  <label className="field-label">Date</label>
                  <input
                    className="input"
                    type="date"
                    value={form.date}
                    onChange={(e) => handleChange("date", e.target.value)}
                  />
                </div>
                <div className="field">
                  <label className="field-label">Time</label>
                  <input
                    className="input"
                    type="time"
                    value={form.time}
                    onChange={(e) => handleChange("time", e.target.value)}
                  />
                </div>
              </div>

              {/* Duration & Calories */}
              <div className="form-row">
                <div className="field">
                  <label className="field-label">Duration (minutes)</label>
                  <input
                    className="input"
                    type="number"
                    min="1"
                    max="600"
                    value={form.durationMin}
                    onChange={(e) => handleChange("durationMin", e.target.value)}
                  />
                </div>
                <div className="field">
                  <label className="field-label">Calories (optional)</label>
                  <input
                    className="input"
                    type="number"
                    min="0"
                    placeholder="0"
                    value={form.calories}
                    onChange={(e) => handleChange("calories", e.target.value)}
                  />
                </div>
              </div>

              {/* Intensity */}
              <div className="field">
                <label className="field-label">Intensity</label>
                <div className="intensity-select">
                  {INTENSITY_OPTIONS.map((opt) => (
                    <button
                      key={opt}
                      type="button"
                      className={`intensity-option ${form.intensity === opt ? 'is-selected' : ''}`}
                      onClick={() => handleChange('intensity', opt)}
                    >
                      {opt}
                    </button>
                  ))}
                </div>
              </div>

              {/* Notes */}
              <div className="field">
                <label className="field-label">Notes (optional)</label>
                <textarea
                  className="input textarea"
                  rows="3"
                  placeholder="How did you feel? Any achievements?"
                  value={form.note}
                  onChange={(e) => handleChange("note", e.target.value)}
                />
              </div>

              {formError && <div className="form-error">{formError}</div>}

              <div className="modal-footer">
                <button className="btn btn--secondary" type="button" onClick={closeModal}>
                  Cancel
                </button>
                <button className="btn btn--primary" type="submit">
                  Save Activity
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
      <Footer />
    </div>
  );
}

export default Activities;