import React from "react";
import "./homecss/cta.css";

const CTA = () => {
  return (
    <section className="cta">
      <div className="container">
        <div className="cta-content">
          <h2>Ready to Transform Your Parking Experience?</h2>
          <p>Join thousands of smart drivers who never worry about parking again</p>
          <div className="cta-actions">
            <button className="btn-primary large">Start Booking Now</button>
            <div className="app-downloads">
              <span>Download our app:</span>
              <div className="download-buttons">
                <button className="download-btn">
                  <span role="img" aria-label="App Store">📱</span>
                  App Store
                </button>
                <button className="download-btn">
                  <span role="img" aria-label="Google Play">🤖</span>
                  Google Play
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CTA;
