import React from "react";
import "./homecss/howitworks.css";

const HowItWorks = () => {
  const steps = [
    {
      step: "01",
      title: "Search Location",
      description: "Enter your destination and find available parking spots nearby.",
      icon: "📍",
    },
    {
      step: "02",
      title: "Choose & Book",
      description: "Select your preferred spot, duration, and complete the booking.",
      icon: "🎯",
    },
    {
      step: "03",
      title: "Navigate & Park",
      description: "Follow GPS directions to your reserved spot and park with confidence.",
      icon: "🚗",
    },
  ];

  return (
    <section className="how-it-works" id="how-it-works">
      <div className="container">
        <div className="section-header">
          <h2>How It Works</h2>
          <p>Get parked in three simple steps</p>
        </div>
        <div className="steps-container">
          {steps.map((step, index) => (
            <div key={index} className="step-card">
              <div className="step-number">{step.step}</div>
              <div className="step-icon" role="img" aria-label={step.title}>
                {step.icon}
              </div>
              <h3>{step.title}</h3>
              <p>{step.description}</p>
              {index < steps.length - 1 && <div className="step-connector"></div>}
            </div>
          ))}
        </div>
      </div>
      <div>
        
      </div>
    </section>
  );
};

export default HowItWorks;
