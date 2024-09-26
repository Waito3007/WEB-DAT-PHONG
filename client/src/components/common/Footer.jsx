// Footer.jsx
import React from "react";

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-content">
        <h3>Clara Hotel</h3>
        <div className="social-icons">
          <a
            href="https://www.facebook.com"
            target="_blank"
            rel="noopener noreferrer"
          >
            <i className="fab fa-facebook"></i>
          </a>
          <a
            href="https://www.twitter.com"
            target="_blank"
            rel="noopener noreferrer"
          >
            <i className="fab fa-twitter"></i>
          </a>
          <a
            href="https://www.instagram.com"
            target="_blank"
            rel="noopener noreferrer"
          >
            <i className="fab fa-instagram"></i>
          </a>
          <a
            href="https://www.youtube.com"
            target="_blank"
            rel="noopener noreferrer"
          >
            <i className="fab fa-youtube"></i>
          </a>
        </div>
        <div className="footer-links">
          <div>
            <h4>Our Destinations</h4>
            <p>
              Canada
              <br />
              Alaska
              <br />
              France
              <br />
              Iceland
            </p>
          </div>
          <div>
            <h4>Our Activities</h4>
            <p>
              Northern Lights
              <br />
              Cruising & Sailing
              <br />
              Multi-activities
              <br />
              Kayaking
            </p>
          </div>
          <div>
            <h4>Travel Blogs</h4>
            <p>
              Bali Travel Guide
              <br />
              Sri Lanka Travel Guide
              <br />
              Peru Travel Guide
              <br />
              Bali Travel Guide
            </p>
          </div>
          <div>
            <h4>About Us</h4>
            <p>
              Our Story
              <br />
              Work with us
            </p>
          </div>
          <div>
            <h4>Contact Us</h4>
            <p>
              Our Story
              <br />
              Work with us
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
