import React from "react";
import { useNavigate } from "react-router-dom";

const HomeNavbar = () => {
  const navigate = useNavigate();

  const handleLogin = () => {
    navigate("/login");
  };

  const handleSignUp = () => {
    navigate("/register");
  };

  return (
    <>
      <div
        className="navbar"
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          padding: "20px 40px",
          backgroundColor: "rgba(0`, 0, 0, 0.7)", // Nền bán trong suốt
          color: "white",
          width: "100%",
          position: "fixed", // Cố định trên cùng
          top: 0,
          zIndex: 100,
        }}
      >
        <div className="navbar-title">
          <h1 style={{ color: "white", fontSize: "30px", margin: 0 }}>
            Stay Night
          </h1>
        </div>
        <div className="navbar-buttons">
          <button
            className="login-btn"
            onClick={handleLogin}
            style={buttonStyle}
          >
            Đăng nhập
          </button>
          <button
            className="signup-btn"
            onClick={handleSignUp}
            style={buttonStyle}
          >
            Đăng ký
          </button>
        </div>
      </div>
    </>
  );
};

// Định nghĩa kiểu dáng cho nút
const buttonStyle = {
  backgroundColor: "#f0f0f0",
  border: "2px solid black",
  padding: "10px 20px",
  fontSize: "16px",
  color: "black",
  cursor: "pointer",
  transition: "background-color 0.3s ease",
};

export default HomeNavbar;
