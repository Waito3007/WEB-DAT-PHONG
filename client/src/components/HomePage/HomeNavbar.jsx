import React from "react";
import { useNavigate } from "react-router-dom"; // Import useNavigate

const HomeNavbar = () => {
  const navigate = useNavigate(); // Khởi tạo navigate

  const handleLogin = () => {
    navigate("/login"); // Chuyển đến trang /login
  };

  const handleSignUp = () => {
    navigate("/register"); // Chuyển đến trang /register
  };

  return (
    <div
      className="navbar"
      style={{
        backgroundImage: `url(/image.png)`, // Đường dẫn đến ảnh trong thư mục public
        backgroundSize: "cover", // Đảm bảo ảnh phủ đầy
        backgroundPosition: "center", // Căn giữa ảnh
        backgroundRepeat: "no-repeat", // Không lặp lại ảnh
        display: "flex",
        justifyContent: "space-between",
        alignItems: "flex-start", // Căn phần tử lên trên
        padding: "20px 40px", // Tăng khoảng cách trên để kéo phần tử lên cao hơn
        color: "white",
        height: "60vh", // Chiều cao bằng chiều cao của viewport
        width: "100%", // Đảm bảo navbar trải rộng toàn bộ chiều ngang
        position: "relative", // Để có thể đặt navbar lên ảnh
        zIndex: 10, // Đảm bảo navbar nằm trên tất cả các phần tử khác
      }}
    >
      <div className="navbar-title" style={{ marginTop: "10px" }}>
        {" "}
        {/* Đẩy tiêu đề lên cao hơn */}
        <h1
          className="hotel-title"
          style={{ color: "white", fontSize: "30px", margin: 0 }}
        >staynight
        </h1>
      </div>
      <div className="navbar-buttons" style={{ marginTop: "10px" }}>
        {" "}
        {/* Đẩy nút lên cao hơn */}
        <button className="login-btn" onClick={handleLogin} style={buttonStyle}>
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
