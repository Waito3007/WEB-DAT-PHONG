import React, { useState } from 'react';
import { DatePicker, Input } from 'antd';

const { RangePicker } = DatePicker;

const RoomInfo = ({ roomDetails, user, setCheckInDate, setCheckOutDate, setEmail, setPhone }) => {
  const [localEmail, setLocalEmail] = useState("");
  const [localPhone, setLocalPhone] = useState("");
  const [localDateRange, setLocalDateRange] = useState([null, null]);

  if (!roomDetails) return null;

  const handleInputChange = () => {
    setEmail(localEmail);
    setPhone(localPhone);
    if (localDateRange[0] && localDateRange[1]) {
      setCheckInDate(localDateRange[0].format("YYYY-MM-DD"));
      setCheckOutDate(localDateRange[1].format("YYYY-MM-DD"));
    }
  };

  return (
    <div className="room-info bg-white p-4 rounded-lg shadow-md">      
           
      <p>{roomDetails.description}</p>
      <div className="date-picker mt-4">
        <label className="block mb-2">
          Ngày nhận phòng và trả phòng:
          <RangePicker 
            className="w-full text-lg border-2 border-gray-300 rounded-lg p-2"
            value={localDateRange}
            onChange={(dates) => {
              setLocalDateRange(dates);
              handleInputChange();
            }}
          />
        </label>
      </div>
      {!user && (
        <div className="user-info-input mb-4">
          <label className="block mb-2">
            Email:
            <Input 
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
            <Input 
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
