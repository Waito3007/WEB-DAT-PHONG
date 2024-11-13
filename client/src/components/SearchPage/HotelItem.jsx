import React from "react";
import { Rate } from "antd";
import { useNavigate } from "react-router-dom";

const HotelItem = ({ hotel }) => {
  const navigate = useNavigate();

  const handleBookNowClick = () => {
    navigate(`/detailhotel/${hotel._id}`); // Fix template string syntax
  };

  return (
    <div className="hotel-card border rounded-lg shadow-md overflow-hidden">
      {/* Hiển thị hình ảnh nếu có */}
      {hotel.imagehotel && hotel.imagehotel.length > 0 ? (
        <img
          src={hotel.imagehotel[0]}
          alt={hotel.name}
          className="w-full h-48 object-cover"
        />
      ) : (
        <div className="h-48 bg-gray-200 flex items-center justify-center">
          <p className="text-gray-500">Không có hình ảnh</p>
        </div>
      )}
      <div className="hotel-details p-4">
        <h3 className="text-lg font-bold text-black name">
          {hotel.name || "Khách sạn không rõ tên"}
        </h3>
        <p className="text-black location">
          {hotel.location || "Vị trí không rõ"}
        </p>

        <div className="rating-reviews-container flex justify-between items-center mt-2">
          <Rate disabled defaultValue={hotel.averageRating || 0} allowHalf />
          <span className="text-black font-bold ml-auto">
            {hotel.averageRating ? `${hotel.averageRating} Điểm` : "N/A"}
          </span>
        </div>

        <div className="lowest-price-container flex justify-end mt-2">
          <span className="lowest-price font-bold text-xl price">
            {hotel.lowestRoomPrice
              ? `${hotel.lowestRoomPrice.toLocaleString("vi-VN")} VND`
              : "Đang cập nhật"}
          </span>
        </div>

        <div className="button-container mt-4 flex justify-end">
          <button
            className="bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 transition"
            onClick={handleBookNowClick}
          >
            Đặt ngay
          </button>
        </div>
      </div>
    </div>
  );
};

export default HotelItem;
