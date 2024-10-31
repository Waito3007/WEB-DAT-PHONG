import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';

const Payment = ({ roomDetails, checkInDate, checkOutDate, email, phone }) => {
  const [userId, setUserId] = useState(null);
  const navigate = useNavigate();
  const { roomId } = useParams(); // Nhận roomId từ URL

  useEffect(() => {
    const fetchUserId = async () => {
      try {
        const response = await axios.get('/api/profile/me', {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`, // Thêm token vào header
          },
        });
        setUserId(response.data._id); // Lưu ID người dùng
      } catch (error) {
        console.error('Lỗi lấy thông tin người dùng:', error);
        navigate('/login'); // Chuyển hướng về /login nếu có lỗi
      }
    };
    fetchUserId();
  }, [navigate]);

  const handlePayment = async () => {
    // Kiểm tra các trường có được điền đầy đủ và hợp lệ không
    if (!checkInDate || !checkOutDate || !email || !phone) {
      alert("Vui lòng nhập đầy đủ các thông tin cần thiết.");
      return;
    }

    try {
      // Gửi yêu cầu thanh toán qua MoMo
      const response = await axios.post('/api/checkout/payment', {
        amount: roomDetails.price,
        checkInDate,
        checkOutDate,
        phoneBooking: phone,
        emailBooking: email,
        userId: userId || undefined, // Gửi userId nếu có, nếu không thì không gửi
        roomId, // Gửi roomId từ URL
      });

      // Chuyển hướng đến URL thanh toán MoMo
      window.location.href = response.data.payUrl; 
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
