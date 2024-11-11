import React, { useEffect } from 'react';
import axios from 'axios';
import { useLocation } from 'react-router-dom';
import { FaCheckCircle } from 'react-icons/fa';

const SuccessPage = () => {
  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const orderId = params.get('orderId');
  const paymentStatus = params.get('paymentStatus');

  useEffect(() => {
    const confirmBooking = async () => {
      try {
        const response = await axios.post('/api/checkout/confirmchange', {
          orderId: orderId,
          // thêm các thông tin cần thiết khác nếu có
        });
        console.log('Xác nhận booking thành công:', response.data);
      } catch (error) {
        console.error('Lỗi khi xác nhận booking:', error);
      }
    };

    if (orderId) {
      confirmBooking();
    }
  }, [orderId]);

  return (
    <div 
      className="relative flex items-center justify-center min-h-screen bg-cover bg-center bg-no-repeat"
      style={{ backgroundImage: 'url("https://res.cloudinary.com/dackig67m/image/upload/v1731093708/34d7a3bbe7ab056f213e66c7182dd57e_u8wj4s.gif")' }} // thay URL ảnh ở đây
    >
      {/* Overlay để làm mờ ảnh nền */}
      <div className="absolute inset-0 bg-black opacity-40"></div>
      
      <div className="relative bg-white bg-opacity-90 rounded-lg shadow-lg p-6 md:p-8 text-center max-w-md mx-4">
      <div className="flex flex-col items-center justify-center">
        <FaCheckCircle className="text-green-500 text-6xl mb-4" />
        <h1 className="text-2xl font-bold text-gray-800 mb-2">Thanh toán thành công!</h1>
        <p className="text-gray-600 mb-4">Cảm ơn bạn đã đặt phòng. Mã đơn hàng của bạn là:</p>
        <p className="text-lg font-semibold text-blue-600 mb-6">{orderId}</p>
        
        <button
          onClick={() => window.location.href = "/"}
          className="bg-blue-500 hover:bg-blue-600 text-white py-2 px-6 rounded-lg shadow-md transition-transform transform hover:scale-105"
        >
          Quay về trang chủ
        </button>
        </div>

      </div>
    </div>
  );
};

export default SuccessPage;
