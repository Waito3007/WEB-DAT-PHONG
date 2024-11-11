import React, { useState, useEffect } from 'react';
import { DatePicker, Input } from 'antd';

const { RangePicker } = DatePicker;

const RoomInfo = ({ roomDetails, user, setCheckInDate, setCheckOutDate, setEmail, setPhone, setTotalDays }) => {
  const [localEmail, setLocalEmail] = useState("");
  const [localPhone, setLocalPhone] = useState("");
  const [localDateRange, setLocalDateRange] = useState([null, null]);

  if (!roomDetails) return null;

  // Hàm tính số ngày giữa ngày nhận và trả phòng
  const calculateDays = (dates) => {
    if (dates[0] && dates[1]) {
      const checkIn = dates[0].toDate(); // Ngày nhận phòng
      const checkOut = dates[1].toDate(); // Ngày trả phòng
      const diffTime = Math.abs(checkOut - checkIn); // Sự khác biệt thời gian
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)); // Tính số ngày
      setTotalDays(diffDays); // Gửi số ngày tới parent component
      setCheckInDate(checkIn.toISOString().split('T')[0]); // Cập nhật ngày nhận phòng
      setCheckOutDate(checkOut.toISOString().split('T')[0]); // Cập nhật ngày trả phòng
    }
  };

  // Hàm kiểm tra và vô hiệu hóa ngày trước ngày hiện tại (không dùng moment)
  const disabledDate = (current) => {
    // Lấy ngày hiện tại
    const today = new Date();
    today.setHours(0, 0, 0, 0); // Đặt thời gian về đầu ngày (00:00:00)

    // So sánh với ngày hiện tại, không cho phép chọn ngày trước hôm nay
    return current && current < today;
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
              calculateDays(dates); // Tính toán lại số ngày khi thay đổi
            }}
            disabledDate={disabledDate} // Áp dụng hàm disabledDate
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
              onBlur={() => setEmail(localEmail)} 
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
              onBlur={() => setPhone(localPhone)} 
            />
          </label>
        </div>
      )}
    </div>
  );
};

export default RoomInfo;
