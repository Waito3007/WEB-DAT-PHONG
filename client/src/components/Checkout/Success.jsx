import React, { useEffect } from 'react';
import axios from 'axios';
import { useLocation } from 'react-router-dom';

const SuccessPage = () => {
  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const orderId = params.get('orderId');
  const paymentStatus = params.get('paymentStatus'); // nếu có

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
    <div className='text-black justify-items-center'>
      <h1>Thanh toán thành công!</h1>
      <p>Cảm ơn bạn đã đặt phòng. Mã đơn hàng của bạn là: {orderId}</p>
    </div>
  );
};

export default SuccessPage;
