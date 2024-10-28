import React, { useState } from 'react';

const RoomInfo = ({ roomDetails, user, setCheckInDate, setCheckOutDate, setEmail, setPhone }) => {
  const [localEmail, setLocalEmail] = useState("");
  const [localPhone, setLocalPhone] = useState("");
  const [localCheckInDate, setLocalCheckInDate] = useState("");
  const [localCheckOutDate, setLocalCheckOutDate] = useState("");

  // Nếu không có chi tiết phòng, trả về null
  if (!roomDetails) return null;

  const handleInputChange = () => {
    setEmail(localEmail);
    setPhone(localPhone);
    setCheckInDate(localCheckInDate);
    setCheckOutDate(localCheckOutDate);
  };

  return (
    <div className="room-info bg-white p-4 rounded-lg shadow-md">
      <h2 className="text-xl font-semibold mb-2">Loại phòng: {roomDetails.type}</h2> 
      <img src={roomDetails.imageroom[0]} alt={roomDetails.type} style={{ maxWidth: '100%', maxHeight: '300px' }} className="mb-4 rounded-lg" />
      <p>{roomDetails.description}</p>
      <div className="date-picker mt-4 flex justify-between">
        <div className="mr-2 w-full">
          <label className="block mb-2">
            Ngày nhận phòng:
            <input 
              type="date" 
              value={localCheckInDate} 
              onChange={(e) => setLocalCheckInDate(e.target.value)} 
              className="w-full p-2 border rounded-md"
              onBlur={handleInputChange}
            />
          </label>
        </div>
        <div className="ml-2 w-full">
          <label className="block mb-2">
            Ngày trả phòng:
            <input 
              type="date" 
              value={localCheckOutDate} 
              onChange={(e) => setLocalCheckOutDate(e.target.value)} 
              className="w-full p-2 border rounded-md"
              onBlur={handleInputChange}
            />
          </label>
        </div>
      </div>
      {!user && (
        <div className="user-info-input mb-4">
          <label className="block mb-2">
            Email:
            <input 
              type="email" 
              value={localEmail} 
              onChange={(e) => setLocalEmail(e.target.value)} 
              className="w-full p-2 border border-gray-300 rounded-md"
              placeholder="Nhập email"
              onBlur={handleInputChange}
            />
          </label>
          <label className="block mb-4">
            Số điện thoại:
            <input 
              type="tel" 
              value={localPhone} 
              onChange={(e) => setLocalPhone(e.target.value)} 
              className="w-full p-2 border border-gray-300 rounded-md"
              placeholder="Nhập số điện thoại"
              onBlur={handleInputChange}
            />
          </label>
        </div>
      )}
    </div>
  );
};

export default RoomInfo;
