import React from "react";
import "./homecss/hero.css";
import { Link } from 'react-router-dom';

const Hero = () => {
  return (
    <section className="hero" id="home">
      <div className="hero-background">
        <div className="hero-overlay"></div>
      </div>
      <div className="container">
        <div className="hero-content">
          <div className="hero-text">
            <h1 className="hero-title">
              Let
              <span className="highlight"> URBANDEPOT</span>
              <br />
              get you parked
            </h1>
            <p className="hero-description">
              Discover the easiest way to find and reserve parking in real-time—quick, convenient, and stress-free.
            </p>
            <div className="hero-actions">
            <Link to="/login" className="btn-primary1 large">
  <span>Book Parking Now</span>
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
    <path
      d="M5 12h14M12 5l7 7-7 7"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
</Link>

              <button className="btn-primary2 large">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                  <polygon points="5,3 19,12 5,21" fill="currentColor" />
                </svg>
                Watch Demo
              </button>
            </div>
            <div className="hero-stats">
              <div className="stat">
                <span className="stat-number">50K+</span>
                <span className="stat-label">Happy Customers</span>
              </div>
              <div className="stat">
                <span className="stat-number">1000+</span>
                <span className="stat-label">Parking Spots</span>
              </div>
              <div className="stat">
                <span className="stat-number">24/7</span>
                <span className="stat-label">Support</span>
              </div>
            </div>
          </div>
          <div className="hero-visual">
            <div className="phone-mockup">
              <div className="phone-screen">
                <div className="app-interface">
                  <div className="app-header">
                    <div className="app-title">urbandepot</div>
                    <div className="location-pin"></div>
                  </div>
                  <div className="map-area">
                    <div className="parking-spots">
                      <div className="spot available"></div>
                      <div className="spot occupied"></div>
                      <div className="spot available"></div>
                      <div className="spot reserved"></div>
                    </div>
                  </div>
                  <div className="booking-card">
                    <div className="booking-info1">
                      <span>Downtown Plaza</span>
                      <span className="price">₹50/hr</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
