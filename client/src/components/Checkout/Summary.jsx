import React, { useState, useEffect } from 'react';

const Summary = ({ roomDetails, totalDays, setTotalPrice }) => {
  const roomPrice = roomDetails ? roomDetails.price : 0;

  useEffect(() => {
    if (roomDetails) {
      setTotalPrice(roomPrice * totalDays);  // Cập nhật totalPrice khi roomDetails hoặc totalDays thay đổi
    }
  }, [roomDetails, totalDays, setTotalPrice]);

  if (!roomDetails) return null; // Chỉ trả về null nếu chưa có roomDetails

  return (
    <div className="summary bg-white p-4 mt-4 rounded-lg shadow-md">
      <h2 className="text-xl font-semibold mb-4">Tóm Tắt Thanh Toán</h2>
      <div className="mb-4">Loại phòng: {roomDetails.type}</div>
      <div className="flex justify-between mb-2">
        <span>Tổng tiền:</span>
        <span className='price'>{(roomPrice * totalDays).toLocaleString('vi-VN')} VNĐ</span>
      </div>
      <div className="text-sm mt-4">Lưu ý: giá phòng đã bao gồm thuế</div>
    </div>
  );
};

export default Summary;
