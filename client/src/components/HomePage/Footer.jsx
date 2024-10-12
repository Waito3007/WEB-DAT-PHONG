import React from "react";

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-content">
        <h3 className="footer-title">Stay night</h3>
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
              Cần Thơ
              <br />
              Sapa
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
            </p>
          </div>
          <div>
            <h4>Về chúng tôi</h4>
            <p>
              Du lịch bền vững
              <br />
              Truyền thông
            </p>
          </div>
          <div>
            <h4>Liên hệ với chúng tôi</h4>
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
