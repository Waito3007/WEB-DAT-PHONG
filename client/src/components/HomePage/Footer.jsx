// Footer.jsx
import React from "react";

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-content">
        {/* Đặt Stay Night trong cùng một thẻ h3 để chúng nằm ngang */}
        <h3 className="footer-title">Stay Night</h3>
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
            <h4>Điểm đến</h4>
            <p>
              Hà Nội
              <br />
              HCM
              <br />
              Cần thơ
              <br />
              Spa
            </p>
          </div>
          <div>
            <h4>Hoạt động</h4>
            <p>
              Dinh Độc Lập
              <br />
              Ẩm thực đường phố
              <br />
              Chợ nổi Cái Răng
              <br />
              Nhà thờ Đức Bà
            </p>
          </div>
          <div>
            <h4>Blog du lịch</h4>
            <p>
              Hướng dẫn du lịch Huy
              <br />
              Hướng dẫn du lịch Seng
              <br />
              Hướng dẫn du lịch Nghĩa
              <br />
              Hướng dẫn du lịch Nhân
            </p>
          </div>
          <div>
            <h4>Về chung tôi</h4>
            <p>
              Du lịch bền vững
              <br />
              Truyền thông
            </p>
          </div>
          <div>
            <h4>Liên hệ với chung tôi</h4>
            <p>
              Du lịch bền vững
              <br />
              Truyền thông
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
