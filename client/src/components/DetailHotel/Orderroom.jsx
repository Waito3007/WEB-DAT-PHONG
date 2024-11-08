import React, { useEffect, useState } from "react";
import { FaMapMarkerAlt, FaStar } from "react-icons/fa";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import { motion } from "framer-motion"; // Import motion từ framer-motion

const OrderRoom = () => {
  const { hotelId } = useParams();
  const navigate = useNavigate();
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

  const handleSelectRoom = () => {
    navigate(`/detailroom/${hotel._id}`);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="order-room-container p-4"
    >
      <div className="hotel-info mb-4">
        <div className="hotel-header flex justify-between items-center">
        <h1 className="hotel-name text-xl sm:text-2xl md:text-3xl font-bold">{hotel.name}</h1>
          <div className="hotel-rating flex items-center mt-2 sm:mt-0">
          <span className="rating-stars flex space-x-1 text-base sm:text-lg lg:text-xl">
            {[...Array(5)].map((_, index) => (
              <FaStar key={index} color={index < stars ? "gold" : "gray"} />
            ))}
          </span>
          <span className="hotel-category ml-2 text-xs sm:text-sm md:text-base">
            Khách sạn {stars} sao
          </span>
        </div>
        </div>
        <div className="hotel-location flex items-center text-sm sm:text-base mb-4">
        <FaMapMarkerAlt className="mr-2 text-lg sm:text-xl" />
        <span>{hotel.location}</span>
      </div>
        <div className="hotel-location flex items-center mt-2">
          <button className="bg-yellow-400 text-white py-1 px-3 rounded-lg">{averageRating.toFixed(1)}</button>
          <span className="ml-2">{totalRatings} đánh giá</span>
        </div>
      </div>
      <div className="hotel-booking flex justify-between items-center">
      <span className="price text-lg sm:text-xl font-bold">
        {lowestPrice.toLocaleString('vi-VN')} VND
      </span>
      <button
        className="book-now-btn bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded-lg w-full sm:w-auto text-sm sm:text-base"
        onClick={handleSelectRoom}
      >
        Chọn phòng
      </button>
      </div>
    </motion.div>
  );
};

export default OrderRoom;
