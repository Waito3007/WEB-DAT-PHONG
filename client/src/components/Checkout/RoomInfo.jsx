import React, { useState } from 'react';

const RoomInfo = ({ roomDetails, user }) => {
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [checkInDate, setCheckInDate] = useState("");
  const [checkOutDate, setCheckOutDate] = useState("");

  // Nếu không có chi tiết phòng, trả về null
  if (!roomDetails) return null;

  const renderUserInfoInput = () => {
    if (!user) {
      return (
        <div className="user-info-input mb-4">
          <label className="block mb-2">
            Email:
            <input 
              type="email" 
              value={email} 
              onChange={(e) => setEmail(e.target.value)} 
              className="w-full p-2 border border-gray-300 rounded-md" // Thay đổi màu viền thành đen
              placeholder="Nhập email"
            />
          </label>
          <label className="block mb-4">
            Số điện thoại:
            <input 
              type="tel" 
              value={phone} 
              onChange={(e) => setPhone(e.target.value)} 
              className="w-full p-2 border border-gray-300 rounded-md" // Thay đổi màu viền thành đen
              placeholder="Nhập số điện thoại"
            />
          </label>
        </div>
      );
    }
    return null; 
  };
  // Điều chỉnh kích thước ảnh tùy theo màn hình
  const imageStyle = {
    maxWidth: '100%',
    height: 'auto',
    maxHeight: '300px', 
  };
  return (
    <div className="room-info bg-white p-4 rounded-lg shadow-md">
      <h2 className="text-xl font-semibold mb-2">Loại phòng: {roomDetails.type}</h2> 
      {/* Hiển thị ảnh */}
      <img 
        src={roomDetails.imageroom[0]} 
        alt={roomDetails.type} 
        style={imageStyle} 
        className="mb-4 rounded-lg" 
      />
      {/* Mô tả phòng */}
      <p>{roomDetails.description}</p>
      {/* Chọn ngày nhận phòng và trả phòng */}
      <div className="date-picker mt-4 flex justify-between">
        <div className="mr-2 w-full">
          <label className="block mb-2">
            Ngày nhận phòng:
            <input 
              type="date" 
              value={checkInDate} 
              onChange={(e) => setCheckInDate(e.target.value)} 
              className="w-full p-2 border rounded-md"
            />
          </label>
        </div>
        <div className="ml-2 w-full">
          <label className="block mb-2">
            Ngày trả phòng:
            <input 
              type="date" 
              value={checkOutDate} 
              onChange={(e) => setCheckOutDate(e.target.value)} 
              className="w-full p-2 border rounded-md"
            />
          </label>
        </div>
      </div>
      {renderUserInfoInput()}
    </div>
  );
};

export default RoomInfo;
