import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from "../components/Navbar";
import Footer from './Footer';
import {
  SearchIcon,
  CloseIcon,
  ChevronDownIcon,
  HeartIcon,
  EmailIcon,
  MessageIcon,
  BookIcon,
  StarIcon,
  ChartIcon,
  LightbulbIcon,
} from './Icons';
import './FAQ.css';

// Custom Icons for FAQ categories
const RocketIcon = ({ size = 24, color = 'currentColor' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M4.5 16.5c-1.5 1.26-2 5-2 5s3.74-.5 5-2c.71-.84.7-2.13-.09-2.91a2.18 2.18 0 0 0-2.91-.09z"/>
    <path d="M12 15l-3-3a22 22 0 0 1 2-3.95A12.88 12.88 0 0 1 22 2c0 2.72-.78 7.5-6 11a22.35 22.35 0 0 1-4 2z"/>
    <path d="M9 12H4s.55-3.03 2-4c1.62-1.08 5 0 5 0"/>
    <path d="M12 15v5s3.03-.55 4-2c1.08-1.62 0-5 0-5"/>
  </svg>
);

const ShieldIcon = ({ size = 24, color = 'currentColor' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
  </svg>
);
const FAQ_DATA = [
  {
    category: 'Getting Started',
    Icon: RocketIcon,
    color: '#3b82f6',
    questions: [
      {
        q: 'What is HRV and why does it matter?',
        a: 'Heart Rate Variability (HRV) measures the variation in time between heartbeats. Higher HRV generally indicates better cardiovascular fitness, stress resilience, and recovery capacity. Our app tracks your HRV to provide personalized insights about your health and wellbeing.'
      },
      {
        q: 'How do I connect my wearable device?',
        a: 'Go to My Sensors → Connected Devices and select your device. We support x . Follow the on-screen instructions to complete the pairing process.'
      },
      {
        q: 'What data does the app track?',
        a: 'We track HRV, heart rate, sleep patterns, physical activity, and stress levels. All data is securely stored and used exclusively to generate personalized health insights and recommendations for you.'
      },
      {
        q: 'How accurate are the HRV measurements?',
        a: 'Our algorithms are validated against clinical-grade ECG devices. For best results, take measurements at the same time each day, preferably first thing in the morning while at rest.'
      },
    ]
  },
  {
    category: 'Understanding Your Data',
    Icon: ChartIcon,
    color: '#8b5cf6',
    questions: [
      {
        q: 'What is a "good" HRV score?',
        a: 'HRV varies significantly between individuals based on age, fitness level, and genetics. Rather than comparing to others, focus on your personal baseline and trends. Generally, higher HRV indicates better recovery, but context matters—an unusually high reading could also indicate stress.'
      },
      {
        q: 'Why does my HRV change so much day to day?',
        a: 'Daily HRV fluctuations are normal and influenced by sleep quality, stress, alcohol consumption, training intensity, hydration, and even weather. Our app identifies meaningful patterns from this noise to give you actionable insights.'
      },
      {
        q: 'What do the  insights mean?',
        a: 'We analyze your data patterns to generate natural language insights. Green indicators suggest positive trends, yellow indicates areas for attention, and personalized recommendations help you optimize your health behaviors.'
      },
      {
        q: 'How long until I see meaningful trends?',
        a: 'You\'ll start seeing basic insights within 1 day. For accurate baseline establishment and meaningful trend analysis, we recommend at least 7 days of consistent data. The longer you use the app, the more personalized your insights become.'
      },
    ]
  },
  {
    category: 'Features & Tips',
    Icon: LightbulbIcon,
    color: '#f59e0b',
    questions: [
      {
        q: 'What are Health Tips and how are they generated?',
        a: 'Health Tips are personalized recommendations based on your HRV data, activity patterns, and recovery status. We consider factors like recent sleep quality, training load, and stress indicators to suggest actionable steps for optimal wellbeing.'
      },
      {
        q: 'How do I log activities manually?',
        a: 'Navigate to the Activities page and tap "Log Activity." Select the activity type, duration, and intensity. Adding notes helps us provide more accurate insights. You can also edit or delete logged activities anytime.'
      },
      {
        q: 'Can I export my data?',
        a: 'Yes! Go to Settings → Data & Privacy → Export Data. You can export your complete health data in CSV or PDF format. We believe your health data belongs to you and should be fully accessible.'
      },
    
    ]
  },
  {
    category: 'Privacy & Security',
    Icon: ShieldIcon,
    color: '#10b981',
    questions: [
      {
        q: 'How is my health data protected?',
        a: 'We use bank-level AES-256 encryption for data storage and TLS 1.3 for data transmission. Your data is never sold to third parties. '
      },
      {
        q: 'Who can see my health data?',
        a: 'Only you have access to your health data. Our team cannot view individual user data unless you explicitly grant access for support purposes. You can revoke this access at any time.'
      },
      {
        q: 'Can I delete my account and data?',
        a: 'Yes, you can permanently delete your account and all associated data from Settings → Account → Delete Account. This action is irreversible and removes all your data from our servers within 30 days.'
      },
      {
        q: 'Do you share data with insurance companies?',
        a: 'Absolutely not. We never share, sell, or provide your health data to insurance companies, employers, or any third parties. Your health information remains strictly confidential.'
      },
    ]
  },
  {
    category: 'Support',
    Icon: StarIcon,
    color: '#ec4899',
    questions: [
     
      {
        q: 'How do I contact support?',
        a: 'You can reach our support team via the  chat or email at support@healthapp.com.'
      },
      
    ]
  },
];
function FAQItem({ question, answer, isOpen, onToggle }) {
  return (
    <div className={`faq-item ${isOpen ? 'is-open' : ''}`}>
      <button className="faq-item__question" onClick={onToggle}>
        <span>{question}</span>
        <ChevronDownIcon size={20} className="faq-item__icon" />
      </button>
      {isOpen && (
        <div className="faq-item__answer">
          <p>{answer}</p>
        </div>
      )}
    </div>
  );
}

function FAQCategory({ category, Icon, color, questions, openItems, onToggle }) {
  return (
    <div className="faq-category">
      <div className="faq-category__header">
        <div className="faq-category__icon" style={{ '--cat-color': color }}>
          <Icon size={24} color={color} />
        </div>
        <h2 className="faq-category__title">{category}</h2>
      </div>
      <div className="faq-category__list">
        {questions.map((item, idx) => (
          <FAQItem
            key={idx}
            question={item.q}
            answer={item.a}
            isOpen={openItems.includes(`${category}-${idx}`)}
            onToggle={() => onToggle(`${category}-${idx}`)}
          />
        ))}
      </div>
    </div>
  );
}

function FAQ() {
  const navigate = useNavigate();
  const [openItems, setOpenItems] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');

  const toggleItem = (id) => {
    setOpenItems(prev => 
      prev.includes(id) 
        ? prev.filter(item => item !== id)
        : [...prev, id]
    );
  };

  // Filter FAQ items based on search
  const filteredData = searchQuery.trim()
    ? FAQ_DATA.map(category => ({
        ...category,
        questions: category.questions.filter(
          q => q.q.toLowerCase().includes(searchQuery.toLowerCase()) ||
               q.a.toLowerCase().includes(searchQuery.toLowerCase())
        )
      })).filter(category => category.questions.length > 0)
    : FAQ_DATA;

  return (
    <div className="faq-page">
      {/* Header */}
      <Navbar />

      {/* Hero */}
      <section className="faq-hero">
        <div className="faq-hero__content">
          <h1 className="faq-hero__title">How can we help you?</h1>
          <p className="faq-hero__subtitle">
            Find answers to common questions 
          </p>
          
          <div className="faq-search">
            <SearchIcon size={20} className="faq-search__icon" />
            <input
              type="text"
              className="faq-search__input"
              placeholder="Search for answers..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            {searchQuery && (
              <button 
                className="faq-search__clear"
                onClick={() => setSearchQuery('')}
              >
                <CloseIcon size={16} />
              </button>
            )}
          </div>
        </div>
        
        <div className="faq-hero__decoration">
          <div className="decoration-circle decoration-circle--1"></div>
          <div className="decoration-circle decoration-circle--2"></div>
          <div className="decoration-circle decoration-circle--3"></div>
        </div>
      </section>

      {/* Main Content */}
      <main className="faq-main">
        {/* Quick Links */}
        <div className="faq-quick-links">
          {FAQ_DATA.map((cat, idx) => {
            const IconComponent = cat.Icon;
            return (
              <a 
                key={idx} 
                href={`#${cat.category.toLowerCase().replace(/\s+/g, '-')}`}
                className="quick-link"
                style={{ '--link-color': cat.color }}
              >
                <span className="quick-link__icon">
                  <IconComponent size={20} color={cat.color} />
                </span>
                <span className="quick-link__text">{cat.category}</span>
              </a>
            );
          })}
        </div>

        {/* FAQ List */}
        <div className="faq-content">
          {filteredData.length === 0 ? (
            <div className="faq-empty">
              <div className="faq-empty__icon">
                <SearchIcon size={48} color="#9ca3af" />
              </div>
              <h3 className="faq-empty__title">No results found</h3>
              <p className="faq-empty__text">
                We couldn't find any questions matching "{searchQuery}". Try different keywords or browse the categories below.
              </p>
              <button 
                className="faq-empty__btn"
                onClick={() => setSearchQuery('')}
              >
                Clear Search
              </button>
            </div>
          ) : (
            filteredData.map((category, idx) => (
              <div 
                key={idx} 
                id={category.category.toLowerCase().replace(/\s+/g, '-')}
              >
                <FAQCategory
                  category={category.category}
                  Icon={category.Icon}
                  color={category.color}
                  questions={category.questions}
                  openItems={openItems}
                  onToggle={toggleItem}
                />
              </div>
            ))
          )}
        </div>

        {/* Still Need Help */}
        <section className="faq-contact">
          <div className="faq-contact__content">
            <h2 className="faq-contact__title">Still have questions?</h2>
            <p className="faq-contact__text">
              Our support team is here to help. Reach out and we'll get back to you within 24 hours.
            </p>
            <div className="faq-contact__actions">
              <a href="mailto:support@healthapp.com" className="contact-card">
                <span className="contact-card__icon">
                  <EmailIcon size={28} color="#3b82f6" />
                </span>
                <span className="contact-card__label">Email Us</span>
                <span className="contact-card__value">support@healthapp.com</span>
              </a>
              <a href="#" className="contact-card">
                <span className="contact-card__icon">
                  <MessageIcon size={28} color="#10b981" />
                </span>
                <span className="contact-card__label">Live Chat</span>
                <span className="contact-card__value">Available 9am - 6pm EST</span>
              </a>
              
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}

export default FAQ;