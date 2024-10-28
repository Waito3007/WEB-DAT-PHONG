import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Payment = ({ roomDetails }) => {
  const [checkInDate, setCheckInDate] = useState('');
  const [checkOutDate, setCheckOutDate] = useState('');
  const [userId, setUserId] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserId = async () => {
      try {
        const response = await axios.get('/api/profile/me'); // API lấy thông tin người dùng
        setUserId(response.data.userId);
      } catch (error) {
        // Nếu không có token hoặc hết hạn, chuyển hướng về /login
        navigate('/login');
      }
    };

    fetchUserId();
  }, [navigate]);

  const handlePayment = async () => {
    if (!userId) return; // Kiểm tra userId trước khi thanh toán

    try {
      const response = await axios.post('/api/checkout/payment', {
        amount: roomDetails.price,
      });

      window.location.href = response.data.payUrl;
    } catch (error) {
      console.error('Lỗi khi thanh toán:', error);
      alert('Có lỗi xảy ra khi thanh toán. Vui lòng thử lại!');
    }
  };

  const handleConfirmPayment = async () => {
    const paymentStatus = 'Completed';

    try {
      const response = await axios.post('/api/checkout/confirm', {
        userId,
        roomId: roomDetails._id,
        checkInDate,
        checkOutDate,
        paymentStatus,
      });

      console.log(response.data);
    } catch (error) {
      console.error('Lỗi khi lưu booking:', error);
    }
  };

  useEffect(() => {
    if (window.location.search) {
      handleConfirmPayment();
    }
  }, [userId]);

  return (
    <div className="payment bg-white p-4 mt-4 rounded-lg shadow-md">
      <button
        onClick={handlePayment}
        className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 transition"
      >
        Thanh Toán
      </button>
    </div>
  );
};

export default Payment;
