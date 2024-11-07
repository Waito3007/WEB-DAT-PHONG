import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Payment = ({ roomDetails, checkInDate, checkOutDate, email, phone, totalPrice }) => {
  const [userId, setUserId] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserId = async () => {
      try {
        const response = await axios.get('/api/profile/me', {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        });
        setUserId(response.data._id);
      } catch (error) {
        console.error('Lỗi lấy thông tin người dùng:', error);
        navigate('/login');
      }
    };

    fetchUserId();
  }, [navigate]);

  const handlePayment = async () => {
    if (!checkInDate || !checkOutDate || !email || !phone) {
      alert("Vui lòng nhập đầy đủ các thông tin cần thiết.");
      return;
    }

    try {
      const response = await axios.post('/api/checkout/payment', {
        amount: totalPrice, // Giá tiền tổng
        checkInDate,
        checkOutDate,
        phoneBooking: phone,
        emailBooking: email,
        userId: userId || undefined,
        roomId: roomDetails._id, // ID phòng
      });

      window.location.href = response.data.payUrl; // Redirect đến URL thanh toán
    } catch (error) {
      console.error('Lỗi khi thanh toán:', error);
      alert('Có lỗi xảy ra khi thanh toán. Vui lòng thử lại!');
    }
  };

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
