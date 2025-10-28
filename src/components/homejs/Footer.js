import React from "react";
import "./homecss/footer.css";

const Footer = () => {
  return (
    <footer className="footer1">
      <div className="container">
        <div className="footer-content">
          <div className="footer-section">
            <div className="footer-logo">
              <h3>urbandepot</h3>
              <p>
                Smart parking solutions for modern cities. Find, book, and park with confidence.
              </p>
            </div>
            <div className="social-links">
              <a href="#" aria-label="Facebook">📘</a>
              <a href="#" aria-label="Twitter">🐦</a>
              <a href="#" aria-label="Instagram">📷</a>
              <a href="#" aria-label="LinkedIn">💼</a>
            </div>
          </div>

          <div className="footer-section">
            <h4>Product</h4>
            <ul>
              <li><a href="#">Features</a></li>
              <li><a href="#">Pricing</a></li>
              <li><a href="#">Mobile App</a></li>
              <li><a href="#">API</a></li>
            </ul>
          </div>

          <div className="footer-section">
            <h4>Company</h4>
            <ul>
              <li><a href="#">About Us</a></li>
              <li><a href="#">Careers</a></li>
              <li><a href="#">Press</a></li>
              <li><a href="#">Blog</a></li>
            </ul>
          </div>

          <div className="footer-section">
            <h4>Support</h4>
            <ul>
              <li><a href="#">Help Center</a></li>
              <li><a href="#">Contact Us</a></li>
              <li><a href="#">Privacy Policy</a></li>
              <li><a href="#">Terms of Service</a></li>
            </ul>
          </div>

          <div className="footer-section">
            <h4>Contact</h4>
            <ul>
              <p>📧 hello@urbandepot.com</p>
              <p>📞 +1 (555) 123-4567</p>
              <p>📍 123 Tech Street, San Francisco, CA</p>
            </ul>
          </div>
        </div>

        <div className="footer-bottom">
          <div className="footer-bottom-content">
            <p>&copy; 2024 urbandepot. All rights reserved.</p>
            <div className="footer-links">
              <a href="#">Privacy</a>
              <a href="#">Terms</a>
              <a href="#">Cookies</a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
