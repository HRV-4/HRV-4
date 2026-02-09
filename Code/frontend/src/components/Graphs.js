import React, { useRef, useState } from 'react';
import Navbar from '../components/Navbar';
import Footer from './Footer';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, Label } from 'recharts';
import { BarChart, Bar, ResponsiveContainer, Cell } from "recharts";
import { PieChart, Pie } from "recharts";
import "./Graphs.css"
import { useNavigate } from 'react-router-dom';


function Graphs() {
  // Time ranges
  const RANGES = [
  { key: "12h", label: "12h" },
  { key: "24h", label: "24h" },
  { key: "1w", label: "1w" },
  { key: "1m", label: "1m" },
  { key: "1y", label: "1y" },];

  const [range, setRange] = useState("24h");

  // Navigate
  const navigate = useNavigate();
  
  // Scroll
  const containerRef = useRef(null);
  const scrollRaf = useRef(null);
  const snapTimeout = useRef(null);
  const isAutoScrolling = useRef(false);
  const [active, setActive] = useState(0);
  const pages = [0, 1, 2, 3, 4];


  const onScroll = () => {
    if (!containerRef.current) return;
    if (scrollRaf.current) {
      cancelAnimationFrame(scrollRaf.current);
    }

    scrollRaf.current = requestAnimationFrame(() => {
      const height = containerRef.current.clientHeight || 1;
      const scrollTop = containerRef.current.scrollTop;

      const index = Math.max(
        0,
        Math.min(pages.length - 1, Math.round(scrollTop / height))
      );

      setActive(index);
    });

    if (isAutoScrolling.current) return;

    if (snapTimeout.current) {
      clearTimeout(snapTimeout.current);
    }

    snapTimeout.current = setTimeout(() => {
      if (!containerRef.current) return;

      const height = containerRef.current.clientHeight || 1;
      const scrollTop = containerRef.current.scrollTop;
      const index = Math.max(
        0,
        Math.min(pages.length - 1, Math.round(scrollTop / height))
      );

      isAutoScrolling.current = true;
      containerRef.current.scrollTo({
        top: index * height,
        behavior: "smooth",
      });

      setTimeout(() => {
        isAutoScrolling.current = false;
      }, 250);
    }, 120);
  };

  const scrollToIndex = (index) => {
    if (!containerRef.current) return;
    isAutoScrolling.current = true;
    containerRef.current.scrollTo({
      top: index * containerRef.current.clientHeight,
      behavior: "smooth",
    });

    setTimeout(() => {
      isAutoScrolling.current = false;
    }, 250);
  };


  // Heart Rate data
  const pulseData = [
  { hour: '8h', pulse: 75, min: 60, max: 90 },
  { hour: '9h', pulse: 80, min: 65, max: 95 },
  { hour: '4h', pulse: 68, min: 55, max: 85 },
  ];

  // HRV Distribution Data and Function
  const data = [
  { value: 40, count: 2 },
  { value: 45, count: 6 },
  { value: 50, count: 12 },
  { value: 55, count: 20 },
  { value: 60, count: 28 },
  { value: 65, count: 20 },
  { value: 70, count: 10 },
  { value: 75, count: 4 },
  ];

  function HRVDistribution() {
  const highlightValue = 60;

    return (
      <ResponsiveContainer>
        <BarChart data={data}>
          <XAxis dataKey="value" />
          <YAxis hide />
          <Tooltip />
          <Bar dataKey="count" radius={[6, 6, 0, 0]}>
            {data.map((entry, index) => (
              <Cell
                key={index}
                fill={entry.value === highlightValue ? "#34C759" : "#CFCFCF"}
              />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    );
  }

  // Pie Chart Data
  const biologicalAgeData = {
  score: "30",
  name: "Biological Age",
  pieData: [
    { name: "Better than", value: 65 },
    { name: "Worse than", value: 35 },
    ],
  };

  const healthData = {
  score: "7.2/10",
  name: "General Health Score",
  pieData: [
    { name: "Better than", value: 37 },
    { name: "Worse than", value: 63 },
    ],
  };
  
  const stressData = {
  score: "6.3/10",
  name: "Stress",
  pieData: [
    { name: "Better than", value: 52 },
    { name: "Worse than", value: 48 },
    ],
  };

  const performanceData = {
  score: "8.5/10",
  name: "Performance",
  pieData: [
    { name: "Better than", value: 43 },
    { name: "Worse than", value: 57 },
    ],
  };

  const burnoutData = {
  score: "3.7/10",
  name: "Burnout Resistance",
  pieData: [
    { name: "Better than", value: 11 },
    { name: "Worse than", value: 89 },
    ],
  };

  // Pie Chart Function
  const COLORS = ["#34C759", "#CFCFCF"];

  function HRVPie({data}) {
    const percentage = data[0].value
    return (
      <ResponsiveContainer>
        <PieChart>
          <Pie
            data={data}
            dataKey="value"
            nameKey="name"
            innerRadius={40}
            outerRadius={60}
            paddingAngle={4}
          >
            {data.map((entry, index) => (
              <Cell key={index} fill={COLORS[index]} />
            ))}
            <Label
              value={`${percentage}%`}
              position="center"
              style={{
                fontSize: "28px",
                fontWeight: "700",
                fill: "#000",
              }}
            />
          </Pie>
          <Tooltip />
        </PieChart>
      </ResponsiveContainer>
    )
  }

  // Page with HRV Pie and Distribution Graphs
  function ScrollPage({data}) {
    return (<>
    <div className='scrollable-graphs-horizontal'>
        <div className='graphs-together'>
          <div className="chart-box pie">
            <p className='top-metric'> {data.name}: <strong>{data.score}</strong></p>
            <HRVPie data={data.pieData} />
            
          </div>
          <div className="chart-box bar">
            <HRVDistribution />
          </div>
        </div>
        <div className="tips-btn" onClick={() => navigate('/Insights')}>
          Get tips to increase <br/>
          your well being! 
        </div>
      </div>
      <p className='bottom-metric'>Better than <strong>{data.pieData[0].value}%</strong> of people of the same age and gender.</p>
      </>
    )
  }
  
  return (
    <>
      <Navbar />
      {/* HEADER */}
      <div className='graphs-container'>
      <div className='horizantal-top'>
        <p className='top-left'>Hope you are good today!</p>
        <div className="activities-header__right">
              <div className="time-range">
                <div className="time-range-label">Time Range</div>
                <div className="time-range-segmented" role="tablist">
                  {RANGES.map((r) => (
                    <button
                      key={r.key}
                      type="button"
                      className={`time-range-btn ${range === r.key ? "is-active" : ""}`}
                      onClick={() => setRange(r.key)}
                    >
                      {r.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>
      </div>
      {/* SCROLL PAGES */}
      <div className="graphs-scroll-wrapper">
        <div className="graphs-scroll" ref={containerRef} onScroll={onScroll}>
            
            {/* --- Page 1 --- */}
            <section className="graphs-page">
              <h1 className='graph-header'>Biological Age</h1>
              <ScrollPage data={biologicalAgeData}/>
            </section>

            {/* --- Page 2 --- */}
            <section className="graphs-page">
              <h1 className='graph-header'>General Health Score</h1>
              <ScrollPage data={healthData}/>
            </section>

            {/* --- Page 3 --- */}
            <section className="graphs-page">
              <h1>Stress Score</h1>
              <ScrollPage data={stressData}/>
            </section>

            {/* --- Page 4 --- */}
            <section className="graphs-page">
              <h1>Performance Potential</h1>
              <ScrollPage data={performanceData}/>
            </section>

            {/* --- Page 5 --- */}
            <section className="graphs-page">
              <h1>Burnout Resistance</h1>
              <ScrollPage data={burnoutData}/>
            </section>
          </div>

          {/* Dots */}
          <div className="graphs-dots">
            {pages.map((i) => (
              <button
                key={i}
                className={`graphs-dot ${active === i ? "active" : ""}`}
                onClick={() => scrollToIndex(i)}
              />
            ))}
          </div>
        </div>
        {/* HEART RATE PAGE */}
        <div className='pulse-card'>
          <div className='pulse-card-inner'>
            <div className="pulse-header">
              <h2 className="pulse-title">Pulse Rate</h2>
            </div>
            <LineChart
              width={1000}
              height={300}
              data={pulseData}
              margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="hour" />
              <YAxis
                label={{ value: 'BpM', angle: -90, position: 'insideLeft' }}
                domain={[30, 210]}
              />
              <Tooltip />
              <Legend />

              <Line
                type="monotone"
                dataKey="pulse"
                stroke="#34C759"
                name="Heart Rate"
                dot={false}
                strokeWidth={2}
              />

              <Line
                type="monotone"
                dataKey="min"
                stroke="yellowgreen"
                name="Min Heart Rate"
                dot={false}
                strokeWidth={1}
              />

              <Line
                type="monotone"
                dataKey="max"
                stroke="green"
                name="Max Heart Rate"
                dot={false}
                strokeWidth={1}
              />
            </LineChart>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}

export default Graphs;