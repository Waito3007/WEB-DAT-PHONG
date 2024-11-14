import React, { useState } from "react";
import { Table } from "antd";
import { Eye, EyeOff } from "lucide-react";

const BookingHistory = ({
  bookingHistory,
  currentPage,
  itemsPerPage,
  onPageChange,
  formatDate,
  isOrderIdVisible,
  toggleOrderIdVisibility,
}) => {
  const [filterCurrentBookings, setFilterCurrentBookings] = useState(false);

  // Hàm lọc các booking đang còn hiệu lực (chưa check out và chưa hoàn thành)
  const filteredBookings = filterCurrentBookings
    ? bookingHistory.filter(
        (booking) =>
          new Date(booking.checkOutDate) > new Date() &&
          booking.paymentStatus !== "Done"
      )
    : bookingHistory;

  // Cấu hình các cột của bảng
  const columns = [
    {
      title: (
        <div className="flex items-center justify-center space-x-2">
          <span className="font-semibold text-gray-700">Mã Đặt Phòng</span>
          <button
            onClick={toggleOrderIdVisibility}
            className="hover:opacity-75"
          >
            {isOrderIdVisible ? <EyeOff size={16} /> : <Eye size={16} />}
          </button>
        </div>
      ),
      dataIndex: "orderId",
      key: "orderId",
      filterMultiple: false,
      onFilter: (value, record) => record.orderId.includes(value),
      filters: bookingHistory.map((booking) => ({
        text: booking.orderId,
        value: booking.orderId,
      })),
      render: (text) => (isOrderIdVisible ? text : "*********"),
    },
    {
      title: (
        <div className="flex items-center justify-center space-x-2">
          <span className="font-semibold text-gray-700">Tên Khách Sạn</span>
        </div>
      ),
      dataIndex: ["room", "hotel", "name"],
      key: "hotelName",
      filterMultiple: true,
      onFilter: (value, record) => record.room.hotel.name.includes(value),
      filters: Array.from(
        new Set(bookingHistory.map((booking) => booking.room.hotel.name))
      )
        .sort()
        .map((name) => ({ text: name, value: name })),
      render: (name) => name,
    },
    {
      title: (
        <div className="flex items-center justify-center space-x-2">
          <span className="font-semibold text-gray-700">Loại Phòng</span>
        </div>
      ),
      dataIndex: ["room", "type"],
      key: "roomType",
      onFilter: (value, record) => record.room.type.includes(value),
      filters: Array.from(
        new Set(bookingHistory.map((booking) => booking.room.type))
      )
        .sort()
        .map((type) => ({ text: type, value: type })),
      render: (type) => type,
    },
    {
      title: (
        <div className="flex items-center justify-center space-x-2">
          <span className="font-semibold text-gray-700">Ngày Nhận Phòng</span>
        </div>
      ),
      dataIndex: "checkInDate",
      key: "checkInDate",
      render: (date) => formatDate(date),
      sorter: (a, b) => new Date(a.checkInDate) - new Date(b.checkInDate),
    },
    {
      title: (
        <div className="flex items-center justify-center space-x-2">
          <span className="font-semibold text-gray-700">Ngày Trả Phòng</span>
        </div>
      ),
      dataIndex: "checkOutDate",
      key: "checkOutDate",
      render: (date) => formatDate(date),
      sorter: (a, b) => new Date(a.checkOutDate) - new Date(b.checkOutDate),
    },
    {
      title: (
        <div className="flex items-center justify-center space-x-2">
          <span className="font-semibold text-gray-700">Tình Trạng</span>
        </div>
      ),
      dataIndex: "paymentStatus",
      key: "paymentStatus",
      onFilter: (value, record) => record.paymentStatus === value,
      filters: [
        { text: "Đã thanh toán", value: "Complete" },
        { text: "Chưa thanh toán", value: "Pending" },
        { text: "Nhận phòng", value: "CheckIn" },
        { text: "Hoàn thành", value: "Done" },
      ],
      render: (status) => {
        let color = "";
        let text = "";

        switch (status) {
          case "Complete":
            color = "#38a169"; // Xanh lá cây cho trạng thái Đã thanh toán
            text = "Đã thanh toán";
            break;
          case "Pending":
            color = "#e53e3e"; // Đỏ cho trạng thái Chưa thanh toán
            text = "Chưa thanh toán";
            break;
          case "CheckIn":
            color = "#3182ce"; // Xanh dương cho trạng thái Nhận phòng
            text = "Nhận phòng";
            break;
          case "Done":
            color = "#805ad5"; // Tím cho trạng thái Hoàn thành
            text = "Hoàn thành";
            break;
          default:
            color = "#718096"; // Màu xám cho trạng thái không xác định
            text = "Không xác định";
        }

        return (
          <span
            style={{
              color: color,
              fontWeight: "bold",
            }}
          >
            {text}
          </span>
        );
      },
    },
  ];

  return (
    <div className="relative mx-auto px-4">
      <h2 className="text-2xl font-ROBOTO text-black mb-2">
        <span>LỊCH SỬ ĐẶT PHÒNG</span>
      </h2>
      <div className="mb-4">
        <button
          onClick={() => setFilterCurrentBookings(!filterCurrentBookings)}
          className="px-4 py-2 text-white bg-gray-800 rounded-md hover:bg-brown-700 focus:outline-none focus:ring-2 focus:ring-brown-500 transition-all duration-200"
        >
          {filterCurrentBookings ? "Hiển thị tất cả" : "Phòng đang đặt"}
        </button>
      </div>
      <div className="overflow-x-auto">
        <Table
          columns={columns}
          dataSource={filteredBookings}
          pagination={{
            current: currentPage,
            pageSize: itemsPerPage,
            total: filteredBookings.length,
            onChange: onPageChange,
          }}
          rowKey="id"
          rowClassName="ant-table-row-hover"
          className="ant-table-bordered"
          scroll={{ x: "max-content" }} // Enable horizontal scroll on smaller screens
        />
      </div>
    </div>
  );
};

export default BookingHistory;
