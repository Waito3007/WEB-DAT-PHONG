import React, { useState, useEffect } from 'react';
import axios from 'axios';
import RoomInfo from '../components/Checkout/RoomInfo';
import Summary from '../components/Checkout/Summary';
import Payment from '../components/Checkout/Payment';
import { useParams } from "react-router-dom";
import "../assets/css/style.css";
import HeroSection from "../components/HomePage/HomeNavbar";

const CheckoutPage = () => {
  const { roomId } = useParams();
  const [roomDetails, setRoomDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [checkInDate, setCheckInDate] = useState('');
  const [checkOutDate, setCheckOutDate] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [totalDays, setTotalDays] = useState(0); // Quản lý tổng số ngày
  const [totalPrice, setTotalPrice] = useState(0); // Quản lý tổng tiền

  useEffect(() => {
    const fetchRoomDetails = async () => {
      try {
        const response = await axios.get(`/api/checkout/${roomId}`);
        setRoomDetails(response.data);
        setLoading(false);
      } catch (error) {
        setError('Có lỗi xảy ra khi lấy thông tin phòng.');
        setLoading(false);
      }
    };

    fetchRoomDetails();
  }, [roomId]);

  // Nếu đang tải hoặc có lỗi
  if (loading) return <div>Đang tải thông tin phòng...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div className="checkout-page">
      <HeroSection />
      <div className="container mx-auto p-6 text-black">
        <h1 className="text-2xl font-bold mt-6 mb-4">Thanh Toán</h1>
        <div className="flex flex-col md:flex-row mt-16">
          <div className="room-info w-full md:w-2/3 pr-6">
            <RoomInfo
              roomDetails={roomDetails}
              setCheckInDate={setCheckInDate}
              setCheckOutDate={setCheckOutDate}
              setEmail={setEmail}
              setPhone={setPhone}
              setTotalDays={setTotalDays} // Truyền setTotalDays vào đây
            />
          </div>
          <div className="payment-info w-full md:w-1/3">
            <Summary 
              roomDetails={roomDetails} 
              totalDays={totalDays} 
              setTotalPrice={setTotalPrice}  // Truyền callback setTotalPrice để cập nhật giá trị totalPrice
            />
            <Payment
              roomDetails={roomDetails}
              checkInDate={checkInDate}
              checkOutDate={checkOutDate}
              email={email}
              phone={phone}
              totalPrice={totalPrice}  // Truyền totalPrice vào Payment
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;
