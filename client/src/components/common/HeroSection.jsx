// HeroSection.jsx
import React from "react";

const HeroSection = () => {
  return (
    <div className="hero-text">
      <div className="header-left">
        <h2 className="find-stays">Find Stays</h2>
      </div>
      <h1 className="hotel-title">Stay Night</h1>
      <div className="auth-buttons">
        <button className="login-btn">Login</button>
        <button className="signup-btn">Sign Up</button>
      </div>
    </div>
  );
};

export default HeroSection;
