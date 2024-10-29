import React from "react";

const HotelItem = ({ hotel }) => {
  return (
    <div className="hotel-card border rounded-lg shadow-md overflow-hidden">
      <img src={hotel.imagehotel[0]} alt={hotel.name} className="w-full h-48 object-cover" />
      <div className="hotel-details p-4">
        <h3 className="text-lg font-bold text-black name">{hotel.name}</h3>
        <p className="text-black location">{hotel.location}</p>

        <div className="rating-reviews-container flex justify-between items-center mt-2">
          <p className="rating text-black">{hotel.Rate}</p>
          <p className="reviews text-black">{hotel.reviews}</p>
        </div>

        <span className="lowest-price font-bold text-xl text-orange-600">
          {hotel.lowestRoomPrice !== null 
            ? `${hotel.lowestRoomPrice.toLocaleString('vi-VN')} VND` 
            : 'Đang cập nhật'}
        </span>

        <div className="button-container mt-4">
          <button className="book-button bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 transition">
            Đặt phòng
          </button>
        </div>
      </div>
    </div>
  );
};

export default HotelItem;
