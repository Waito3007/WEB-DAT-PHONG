import React, { useEffect, useState } from "react";
import { FaMapMarkerAlt, FaStar } from "react-icons/fa";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";

const OrderRoom = () => {
  const { hotelId } = useParams();
  const navigate = useNavigate(); // Sử dụng useNavigate để điều hướng
  const [hotel, setHotel] = useState(null);
  const [averageRating, setAverageRating] = useState(0);
  const [totalRatings, setTotalRatings] = useState(0);
  const [lowestPrice, setLowestPrice] = useState(0);

  useEffect(() => {
    const fetchHotel = async () => {
      try {
        const response = await axios.get(`/api/detail/${hotelId}`);
        setHotel(response.data.hotel);
        setAverageRating(response.data.averageRating);
        setTotalRatings(response.data.totalRatings);
        setLowestPrice(response.data.lowestPrice);
      } catch (error) {
        console.error("Error fetching hotel data:", error);
      }
    };

    fetchHotel();
  }, [hotelId]);

  if (!hotel) {
    return <div>Loading...</div>;
  }

  const stars = hotel.stars || 1;

  // Xử lý khi ấn vào nút "Chọn phòng"
  const handleSelectRoom = () => {
    navigate(`/detailroom/${hotel._id}`); // Điều hướng sang trang detailroom khi người dùng ấn nút "Chọn phòng"
  };

  return (
    <div className="order-room-container p-4">
      <div className="hotel-info mb-4">
        <div className="hotel-header flex justify-between items-center">
          <h1 className="hotel-name text-2xl font-bold">{hotel.name}</h1>
          <div className="hotel-rating flex items-center">
            <span className="rating-stars flex">
              {[...Array(5)].map((_, index) => (
                <FaStar key={index} color={index < stars ? "gold" : "gray"} />
              ))}
            </span>
            <span className="hotel-category ml-2 text-sm">Khách sạn {stars} sao</span>
          </div>
        </div>
        <div className="hotel-location flex items-center">
          <FaMapMarkerAlt className="mr-2" /> <span>{hotel.location}</span>
        </div>
        <div className="hotel-location flex items-center mt-2">
          <button className="bg-yellow-400 text-white py-1 px-3 rounded-lg">{averageRating.toFixed(1)}</button>
          <span className="ml-2">{totalRatings} đánh giá</span>
        </div>
      </div>
      <div className="hotel-booking flex justify-between items-center">
        <span className="price text-xl font-bold">{lowestPrice.toLocaleString('vi-VN')} VND</span>
        <button
          className="book-now-btn text-white py-2 px-4"
          onClick={handleSelectRoom} 
          >Chọn phòng
        </button>
      </div>
    </div>
  );
};

export default OrderRoom;
