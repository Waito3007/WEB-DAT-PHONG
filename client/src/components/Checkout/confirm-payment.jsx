import React, { useEffect } from 'react';
import axios from 'axios';

const Success = ({ orderId }) => {
  useEffect(() => {
    const confirmPayment = async () => {
      try {
        const response = await axios.post('http://localhost:5000/api/checkout/confirm', { orderId });
        console.log(response.data.message);
      } catch (error) {
        console.error('Lỗi khi xác nhận thanh toán:', error);
      }
    };

    confirmPayment();
  }, [orderId]);

  return (
    <div className='text-black'>
      <h1>Thanh toán thành công!</h1>
      <p>Đơn hàng của bạn đã được xác nhận.</p>
    </div>
  );
};

export default Success;
