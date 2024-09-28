// HomeNavbar.jsx
import React from "react";
import { useNavigate } from "react-router-dom"; // Import useNavigate

const HeroSection = () => {
  const navigate = useNavigate(); // Khởi tạo navigate

  const handleLogin = () => {
    navigate("/login"); // Chuyển đến trang /login
  };

  const handleSignUp = () => {
    navigate("/register"); // Chuyển đến trang /register
  };

  return (
    <div className="hero-text">
      <div className="header-left">
        <h1 className="hotel-title">Stay Night</h1>      
      </div>
      <div className="auth-buttons">
        <button className="login-btn" onClick={handleLogin}>Login</button>
        <button className="signup-btn" onClick={handleSignUp}>Sign Up</button>
      </div>
    </div>
  );
};

export default HeroSection;
