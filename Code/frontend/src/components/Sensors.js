import React, { useState, useRef } from 'react';
import Navbar from '../components/Navbar';
import Footer from './Footer';
import sensorImg from '../assets/sensor.png';
import "./sensors.css";
import { useNavigate } from 'react-router-dom';

function Sensors() {
  const [isConnected, setIsConnected] = useState(true);
  const navigate = useNavigate();

  const DISCONNECTED_PAGES = [
    {
      title: "Your sensor is disconnected!",
      body: (
        <>
          Connect your device easily! <br />
          You need to use mobile app for initial connection. <br />
          Scroll down for simple guide!
        </>
      ),
    },
    {
      title: "Follow the Steps!",
      body: (
        <>
          Open the mobile app and sign in. <br />
          Go to <strong>My Sensors</strong> and tap <strong>Add Device</strong>. <br />
          Turn on Bluetooth and keep the sensor close. <br />
          Wait until the app shows <strong>Connected</strong>.
        </>
      ),
    },
    {
      title: "Now, your sensor is connected!",
      body: (
        <>
          
        </>
      ),
      cta: {
        label: "Need Help?",
        onClick: () => navigate('/FAQ'),
      },
    },
  ];

  const containerRef = useRef(null);
  const scrollTimeout = useRef(null);

  const [active, setActive] = useState(0);
  const pages = DISCONNECTED_PAGES;

  const onScroll = () => {
    if (!containerRef.current) {
      return;
    }

    if (scrollTimeout.current) {
      clearTimeout(scrollTimeout.current);
    }

    scrollTimeout.current = setTimeout(() => {
      const height = containerRef.current.clientHeight;
      const scrollTop = containerRef.current.scrollTop;

      const index = Math.floor((scrollTop + height / 2) / height);

      setActive(index);

      containerRef.current.scrollTo({
        top: index * height,
        behavior: "smooth",
      });
    }, 80);
  };

  const scrollToIndex = (index) => {
    if (!containerRef.current) {
      return;
    } 
    containerRef.current.scrollTo({
      top: index * containerRef.current.clientHeight,
      behavior: "smooth",
    });
  };

  let time = 30;
  let battery = 98;

  return (
    <>
      <Navbar />

      <div className="page-container">
        <h1 className="title">My Sensors</h1>

        {/* CONNECTED */}
        {isConnected && (
          <div className="connected-horizontal sensor-card">
            <div className="left-info">
              <p className="sensor-connected">Your sensor is connected!</p>
              <div className="tb-block">
                <p className="time">
                  For: {time} Minutes <br />
                  Battery: {battery}%
                </p>
              </div>
            </div>

            <div className="center-device">
              <div className="glow-circle"></div>
              <img src={sensorImg} alt="sensor" className="device-img" />
            </div>

            <div className="right-action">
              <div
                className="real-time-button"
                onClick={() => navigate('/Graphs')}
              >
                See your real-time data!
              </div>
            </div>
          </div>
        )}

        {/* DISCONNECTED */}
        {!isConnected && (
          <div className="disconnected-shell sensor-card">
            <div
              className="graphs-scroll"
              ref={containerRef}
              onScroll={onScroll}
            >
              {pages.map((page, idx) => (
                <section className="page-wrapper" key={idx}>
                  <div className="disconnected-main">
                    <p className="sensor-disconnected">{page.title}</p>
                    <p className="scroll-down">{page.body}</p>
                    {page.cta && (
                      <button
                        type="button"
                        className="faq"
                        onClick={page.cta.onClick}
                      >
                        {page.cta.label}
                      </button>
                    )}
                  </div>
                </section>
              ))}
            </div>

            {/* DOTS */}
            <div className="graphs-dots">
              {pages.map((_, i) => (
                <button
                  key={i}
                  className={`graphs-dot ${active === i ? "active" : ""}`}
                  onClick={() => scrollToIndex(i)}
                />
              ))}
            </div>
          </div>
        )}
      </div>

      {/* TEST */}
      <button
        className="test-button"
        onClick={() => setIsConnected(!isConnected)}
      >
        Test Connection
      </button>
      <Footer />
    </>
  );
}

export default Sensors;
