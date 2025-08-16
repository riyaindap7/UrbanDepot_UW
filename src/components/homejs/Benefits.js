import React from "react";
import "./homecss/benefits.css";

const Benefits = () => {
  return (
    <section className="benefits">
  <div className="container">
    <div className="benefits-content">
      
      {/* Text Section */}
      <div className="benefits-text">
        <h2>Save Time, Money & Stress</h2>
        <div className="benefit-list">
          <div className="benefit-item">
            <div className="benefit-icon">⚡</div>
            <h4>Save 15+ Minutes</h4>
            <p>No more driving around looking for parking spots</p>
          </div>
          <div className="benefit-item">
            <div className="benefit-icon">💵</div>
            <h4>Save Up to 60%</h4>
            <p>Compare prices and get the best deals available</p>
          </div>
          <div className="benefit-item">
            <div className="benefit-icon">🛡️</div>
            <h4>100% Guaranteed</h4>
            <p>Your spot is reserved and waiting for you</p>
          </div>
          <div className="benefit-item">
            <div className="benefit-icon">🌍</div>
            <h4>Eco-Friendly</h4>
            <p>Reduce emissions by eliminating unnecessary driving</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</section>


  );
};

export default Benefits;
