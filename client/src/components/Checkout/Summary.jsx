import React from 'react';

const Summary = ({ roomDetails }) => {
  if (!roomDetails) return null;

  const roomPrice = roomDetails.price; // Lấy giá phòng từ thông tin chi tiết phòng
  const tax = roomPrice * 0.1; // Thuế 10%
  const total = roomPrice + tax; // Tổng cộng

  return (
    <div className="summary bg-white p-4 mt-4 rounded-lg shadow-md">
      <h2 className="text-xl font-semibold mb-4">Tóm Tắt Thanh Toán</h2>
      <div className="flex justify-between mb-2">
        <span>Giá Phòng:</span>
        <span>{roomPrice.toLocaleString('vi-VN')} VNĐ</span>
      </div>
      <div className="flex justify-between mb-2">
        <span>Thuế (10%):</span>
        <span>{tax.toLocaleString('vi-VN')} VNĐ</span>
      </div>
      <div className="flex justify-between font-bold">
        <span>Tổng Cộng:</span>
        <span>{total.toLocaleString('vi-VN')} VNĐ</span>
      </div>
    </div>
  );
};

export default Summary;
