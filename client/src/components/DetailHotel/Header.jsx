import React from 'react';
import './Header.css'; // Import CSS

const Header = () => {
  return (
    <div className="header">
      <div className="logo">
        <h1>staynight</h1>
      </div>

      <div className="user-actions">
        <button className="favorite-button">❤ Favourites</button>
        <div className="user">
          <img src="avta.png" alt="Nghĩa" />
          <span>Nghĩa</span>
        </div>
      </div>

      <hr className="custom-line" />
      <div className="hotel-header1">

      <div className="hotel-header">
        <h2>Stay night Hà Nội</h2>
        <div className="rating">
          <span>★★★★★</span>
        </div>
        <div className="rating1">
          <span > Khách sạn 5 sao</span>
        </div>
        <div className="booking-info">
  <span className="price">2.202.000 VND</span>
  <div className="user-actions">
    <button className="favorite-button">❤️</button>
    <button className="share-button">🔗</button>
    <button className="book-now">Đặt ngay</button>
  </div>
</div>

      </div>
      
      {/* Thông tin về vị trí và đánh giá */}
      <div className="hotel-info">
        <div className="location">
          <span>📍 Hà Nội</span>
        </div>
        <div class="rating-card">
          <div class="rating-score">4.2 ⭐</div>
          <div class="rating-description">Rất tốt</div>
          <div class="rating-count">371 Đánh giá</div>
        </div>
      </div>
</div>
     
    </div>
  );
};

export default Header;
