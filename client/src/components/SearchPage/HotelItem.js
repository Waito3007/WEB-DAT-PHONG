import React from "react";

const HotelItem = ({ name, location, rating, reviews, price, image }) => {
  return (
    <div className="hotel-card">
      <img src={image} alt={name} />
      <div className="hotel-details">
        <h3 className="text-lg font-bold text-black name">{name}</h3>
        <p className="text-black location">{location}</p>

        <div className="rating-reviews-container">
          <p className="rating text-black">{rating}</p>
          <p className="reviews text-black">{reviews}</p>
        </div>

        <p className="text-custom price">{price} VNĐ</p>

        <div className="button-container">
          <button className="book-button">Đặt phòng</button>
        </div>
      </div>
    </div>
  );
};

export default HotelItem;
