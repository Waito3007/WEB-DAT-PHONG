// components/Checkout/Payment.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Payment = ({ roomDetails }) => {
  const [checkInDate, setCheckInDate] = useState('');
  const [checkOutDate, setCheckOutDate] = useState('');

  const handlePayment = async () => {
    try {
      const response = await axios.post('/api/checkout/payment', {
        amount: roomDetails.price, // Số tiền thanh toán
      });

      // Chuyển hướng đến MoMo
      window.location.href = response.data.payUrl; // Thay đổi url thành địa chỉ của MoMo
    } catch (error) {
      console.error('Lỗi khi thanh toán:', error);
      alert('Có lỗi xảy ra khi thanh toán. Vui lòng thử lại!');
    }
  };

  // Hàm để lưu thông tin đặt phòng sau khi thanh toán thành công
  const handleConfirmPayment = async () => {
    const paymentStatus = 'Completed'; // Hoặc lấy từ phản hồi từ MoMo nếu có
    const userId = 'ID_CỦA_NGƯỜI_DÙNG'; // Thay thế bằng ID người dùng thực tế

    try {
      const response = await axios.post('/api/checkout/confirm', {
        userId, // ID người dùng
        roomId: roomDetails._id, // ID phòng
        checkInDate,
        checkOutDate,
        paymentStatus,
      });

      console.log(response.data);
    } catch (error) {
      console.error('Lỗi khi lưu booking:', error);
    }
  };

  // Gọi hàm confirm payment khi component được mount
  useEffect(() => {
    if (window.location.search) {
      handleConfirmPayment();
    }
  }, []);

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
