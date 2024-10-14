import React from "react";
import { FaMapMarkerAlt, FaStar } from "react-icons/fa";

const OrderRoom = () => {
  return (
    <div className="order-room-container">
      <div className="hotel-info">
        <div className="hotel-header">
          <h1 className="hotel-name">Stay night Hà Nội</h1>
          <div className="hotel-rating">
            <span className="rating-stars">
              <FaStar color="gold" />
              <FaStar color="gold" />
              <FaStar color="gold" />
              <FaStar color="gold" />
              <FaStar color="gold" />
            </span>
            <span className="hotel-category">Khách sạn 5 sao</span>
          </div>
        </div>
        <div className="hotel-location">
          <FaMapMarkerAlt /> <span>Hà Nội</span>
        </div>
        <div className="hotel-location">
          <button className="Hotel-button">4.2</button>
          <span>271 đánh giá</span>
        </div>
      </div>
      <div className="hotel-booking">
        <span className="hotel-price">2.202.000 VND</span>
        <button className="book-now-btn">Đặt ngay</button>
      </div>
    </div>
  );
};

export default OrderRoom;
