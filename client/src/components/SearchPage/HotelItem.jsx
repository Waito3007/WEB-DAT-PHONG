import React, { memo } from "react";
import { Rate } from "antd";
import { useNavigate } from "react-router-dom";

const HotelItem = memo(({ hotel }) => {
  const navigate = useNavigate();

  const handleBookNowClick = () => {
    navigate(`/detailhotel/${hotel._id}`);
  };

  const handleImageError = (e) => {
    e.target.style.display = 'none';
    e.target.nextSibling.style.display = 'flex';
  };

  return (
    <div className="group bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
      <div className="flex flex-col lg:flex-row">
        {/* Hotel Image Section */}
        <div className="relative w-full lg:w-80 h-48 lg:h-56 overflow-hidden">
          {hotel.imagehotel && hotel.imagehotel.length > 0 ? (
            <>
              <img
                src={hotel.imagehotel[0]}
                alt={hotel.name}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                onError={handleImageError}
                loading="lazy"
              />
              <div className="hidden absolute inset-0 bg-gray-100 items-center justify-center">
                <div className="text-center text-gray-500">
                  <svg className="w-12 h-12 mx-auto mb-2" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" clipRule="evenodd" />
                  </svg>
                  <p className="text-sm">Không có hình ảnh</p>
                </div>
              </div>
            </>
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center">
              <div className="text-center text-gray-500">
                <svg className="w-16 h-16 mx-auto mb-3" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" clipRule="evenodd" />
                </svg>
                <p className="text-sm font-medium">Không có hình ảnh</p>
              </div>
            </div>
          )}
          
          {/* Overlay gradient for better text readability */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
          
          {/* Rating badge */}
          {hotel.averageRating && hotel.averageRating > 0 && (
            <div className="absolute top-3 left-3 bg-white/90 backdrop-blur-sm rounded-lg px-2 py-1 flex items-center space-x-1">
              <svg className="w-4 h-4 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
              <span className="text-sm font-semibold text-gray-800">
                {hotel.averageRating.toFixed(1)}
              </span>
            </div>
          )}
        </div>

        {/* Hotel Details Section */}
        <div className="flex-1 p-6 flex flex-col justify-between">
          <div className="space-y-4">
            {/* Hotel Name and Location */}
            <div>
              <h3 className="text-lg lg:text-xl font-bold text-gray-900 mb-2 line-clamp-2 group-hover:text-blue-600 transition-colors">
                {hotel.name || "Khách sạn không rõ tên"}
              </h3>
              <div className="flex items-center text-gray-600">
                <svg className="w-4 h-4 mr-2 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                </svg>
                <p className="text-sm lg:text-base line-clamp-1">
                  {hotel.location || "Vị trí không rõ"}
                </p>
              </div>
            </div>

            {/* Rating and Reviews */}
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Rate 
                  disabled 
                  value={hotel.averageRating || 0} 
                  allowHalf 
                  className="text-sm"
                />
                <span className="text-sm text-gray-600">
                  ({hotel.reviewsCount || 0} đánh giá)
                </span>
              </div>
            </div>

            {/* Description if available */}
            {hotel.description && (
              <p className="text-sm text-gray-600 line-clamp-2">
                {hotel.description}
              </p>
            )}

            {/* Amenities or features */}
            {hotel.rooms && hotel.rooms.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {hotel.rooms.slice(0, 2).map((room, index) => (
                  <span
                    key={index}
                    className="inline-flex items-center px-2 py-1 text-xs font-medium bg-blue-50 text-blue-700 rounded-full"
                  >
                    {room.roomType}
                  </span>
                ))}
                {hotel.rooms.length > 2 && (
                  <span className="inline-flex items-center px-2 py-1 text-xs font-medium bg-gray-100 text-gray-600 rounded-full">
                    +{hotel.rooms.length - 2} loại phòng khác
                  </span>
                )}
              </div>
            )}
          </div>

          {/* Price and Action Section */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between pt-4 mt-4 border-t border-gray-100 gap-4">
            <div className="flex flex-col">
              <div className="flex items-baseline space-x-1">
                <span className="text-2xl lg:text-3xl font-bold text-gray-900">
                  {hotel.lowestRoomPrice
                    ? `${hotel.lowestRoomPrice.toLocaleString("vi-VN")}`
                    : "Đang cập nhật"}
                </span>
                {hotel.lowestRoomPrice && (
                  <span className="text-sm text-gray-600">VND</span>
                )}
              </div>
              <span className="text-xs text-gray-500">mỗi đêm</span>
              {hotel.highestRoomPrice && hotel.highestRoomPrice !== hotel.lowestRoomPrice && (
                <span className="text-xs text-gray-500">
                  đến {hotel.highestRoomPrice.toLocaleString("vi-VN")} VND
                </span>
              )}
            </div>

            <button
              className="w-full sm:w-auto bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-semibold py-3 px-6 rounded-lg transition-all duration-300 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 shadow-lg hover:shadow-xl"
              onClick={handleBookNowClick}
            >
              Xem chi tiết
            </button>
          </div>
        </div>
      </div>
    </div>
  );
});

HotelItem.displayName = 'HotelItem';

export default HotelItem;
