import React from 'react';

const Summary = ({ roomDetails }) => {
  if (!roomDetails) return null;

  const roomPrice = roomDetails.price;
  return (
    <div className="summary bg-white p-4 mt-4 rounded-lg shadow-md">
      {/* <img src={roomDetails.imageroom[0]} alt={roomDetails.type} className="h-10" /> */}
      <h2 className="text-xl font-semibold mb-4">Tóm Tắt Thanh Toán</h2>
      <div className="mb-4">Loại phòng: {roomDetails.type}</div>  
      <div className="flex justify-between mb-2">
        <span>Tổng tiền:</span>
        <span className='price'>{roomPrice.toLocaleString('vi-VN')} VNĐ</span>
      </div>
      <div className="text-sm mt-4">Lưu ý: giá phòng đã bao gồm thuế</div>
    </div>
  );
};

export default Summary;
