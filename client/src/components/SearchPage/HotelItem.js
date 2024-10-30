import React from "react";
import { Rate } from "antd"; // Import Rate từ Ant Design

const HotelItem = ({ hotel, lowestRoomPrice }) => {
  return (
    <div className="hotel-card border rounded-lg shadow-md overflow-hidden">
      {/* Hiển thị hình ảnh nếu có */}
      {hotel.imagehotel && hotel.imagehotel.length > 0 ? (
        <img src={hotel.imagehotel[0]} alt={hotel.name} className="w-full h-48 object-cover" />
      ) : (
        <div className="h-48 bg-gray-200 flex items-center justify-center">
          <p className="text-gray-500">Không có hình ảnh</p>
        </div>
      )}
      <div className="hotel-details p-4">
        <h3 className="text-lg font-bold text-black name">{hotel.name || 'Khách sạn không rõ tên'}</h3>
        <p className="text-black location">{hotel.location || 'Vị trí không rõ'}</p>

        <div className="rating-reviews-container flex justify-between items-center mt-2">
          <p className="rating text-black flex items-center">
            <Rate disabled defaultValue={hotel.stars || 0} />
          </p>
          <p className="reviews text-black">
            {hotel.reviews && hotel.reviews.length > 0 ? hotel.reviews.length : 'Chưa có đánh giá'} đánh giá
          </p>
        </div>

        <span className="lowest-price font-bold text-xl text-orange-600">
          {lowestRoomPrice !== null 
            ? `${lowestRoomPrice.toLocaleString('vi-VN')} VND` 
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
