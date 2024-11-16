import React, { useState, useEffect } from "react";
import { DatePicker, Input, Tooltip } from "antd";
import axios from "axios";

const { RangePicker } = DatePicker;

const RoomInfo = ({
  roomDetails,
  user,
  setCheckInDate,
  setCheckOutDate,
  setEmail,
  setPhone,
  setTotalDays,
}) => {
  const [localEmail, setLocalEmail] = useState("");
  const [localPhone, setLocalPhone] = useState("");
  const [localDateRange, setLocalDateRange] = useState([null, null]);
  const [bookedDates, setBookedDates] = useState([]); // Danh sách các ngày đã đặt

  useEffect(() => {
    // Kiểm tra roomDetails tồn tại trước khi gọi API
    if (roomDetails) {
      const fetchBookedDates = async () => {
        try {
          const response = await axios.get(
            `/api/booking/booking/room-availability/${roomDetails._id}`
          );
          // Chuẩn hóa dữ liệu trả về (nếu cần)
          const formattedDates =
            response.data.bookedDates?.map((date) => date.split("T")[0]) || [];
          setBookedDates(formattedDates);
        } catch (error) {
          console.error("Lỗi khi lấy danh sách ngày đã đặt:", error);
        }
      };

      fetchBookedDates();
    }
  }, [roomDetails]);

  const calculateDays = (dates) => {
    if (dates && dates[0] && dates[1]) {
      const checkIn = dates[0].toDate();
      const checkOut = dates[1].toDate();
      const diffTime = Math.abs(checkOut - checkIn);
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      setTotalDays(diffDays);
      setCheckInDate(checkIn.toISOString().split("T")[0]);
      setCheckOutDate(checkOut.toISOString().split("T")[0]);
    }
  };

  const disabledDate = (current) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const formattedDate = current?.format("YYYY-MM-DD");
    return current && (current < today || bookedDates.includes(formattedDate));
  };

  const dateRender = (current) => {
    const formattedDate = current.format("YYYY-MM-DD");
    const isBooked = bookedDates.includes(formattedDate);

    return (
      <Tooltip title={isBooked ? "Đã đặt" : "Còn trống"}>
        <div
          className={`ant-picker-cell-inner ${
            isBooked ? "bg-red-300 text-white" : ""
          }`}
        >
          {current.date()}
        </div>
      </Tooltip>
    );
  };

  if (!roomDetails) {
    return <p>Đang tải thông tin phòng...</p>;
  }

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
              calculateDays(dates);
            }}
            disabledDate={disabledDate}
            dateRender={dateRender}
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
