import React, { useEffect, useState } from 'react';
import axios from 'axios';
import RoomInfo from '../components/Checkout/RoomInfo';
import Summary from '../components/Checkout/Summary';
import Payment from '../components/Checkout/Payment';
import { useParams } from "react-router-dom";
import "../assets/css/style.css";

const CheckoutPage = () => {
  const { roomId } = useParams(); // Lấy roomId từ URL nếu có
  const [roomDetails, setRoomDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchRoomDetails = async () => {
      try {
        const response = await axios.get(`/api/checkout/${roomId}`);
        setRoomDetails(response.data); // Lưu dữ liệu phòng vào state
        setLoading(false);
      } catch (error) {
        setError('Có lỗi xảy ra khi lấy thông tin phòng.');
        setLoading(false);
      }
    };

    fetchRoomDetails();
  }, [roomId]);

  if (loading) return <div>Đang tải thông tin phòng...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div className="checkout-page container mx-auto p-6 text-black">
      <h1 className="text-2xl font-bold mb-4">Thanh Toán</h1>
      <div className="flex flex-col md:flex-row mt-16">
        {/* Thông tin phòng */}
        <div className="room-info w-full md:w-2/3 pr-6">
          <RoomInfo roomDetails={roomDetails} />
        </div>

        {/* Thông tin thanh toán và tóm tắt */}
        <div className="payment-info w-full md:w-1/3">
          <Summary roomDetails={roomDetails} />
          <Payment roomDetails={roomDetails} /> {/* Thêm component Payment */}
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;
