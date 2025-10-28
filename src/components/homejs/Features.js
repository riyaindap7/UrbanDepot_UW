import React from "react";
import "./homecss/features.css";

const Features = () => {
  const features = [
    {
      icon: "💳",
      title: "Secure Payment",
      description:
        "Multiple payment options with bank-level security. Pay once, park worry-free.",
    },
    {
      icon: "📱",
      title: "Mobile First",
      description:
        "Seamless mobile experience. Book, navigate, and manage your parking from anywhere.",
    },
    {
      icon: "⏰",
      title: "Instant Booking",
      description:
        "Reserve your spot in under 30 seconds. No more circling around looking for parking.",
    },
    {
      icon: "💰",
      title: "Best Prices",
      description:
        "Compare prices across multiple providers and save up to 60% on parking fees.",
    },
  ];

  return (
    <section className="features" id="features">
      <div className="container">
        <div className="section-header">
          <h2>Why Choose urbandepot?</h2>
          <p>Experience the future of parking with our innovative features</p>
        </div>
        <div className="features-grid">
          {features.map((feature, index) => (
            <div
              key={index}
              className="feature-card"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div className="feature-icon" role="img" aria-label={feature.title}>
                <span>{feature.icon}</span>
              </div>
              <h3>{feature.title}</h3>
              <p>{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Features;
