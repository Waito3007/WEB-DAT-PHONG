import React, { useState } from "react";
import { Table, Button } from "antd";
import { Eye, EyeOff } from "lucide-react";
import RatingComponent from "./RatingComponent"; // Import component RatingComponent

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
  const [currentBooking, setCurrentBooking] = useState(null); // Track booking for rating
  const [showRating, setShowRating] = useState(false); // To toggle visibility of RatingComponent

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
      title: "STT",
      key: "stt",
      render: (text, record, index) => (
        <span>{(currentPage - 1) * itemsPerPage + index + 1}</span>
      ),
    },
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
      render: (type) => type,
    },
    {
      title: "Ngày Nhận Phòng",
      dataIndex: "checkInDate",
      key: "checkInDate",
      render: (date) => formatDate(date),
    },
    {
      title: "Ngày Trả Phòng",
      dataIndex: "checkOutDate",
      key: "checkOutDate",
      render: (date) => formatDate(date),
    },
    {
      title: "Tình Trạng",
      dataIndex: "paymentStatus",
      key: "paymentStatus",
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
    {
      title: "Đánh Giá",
      key: "rating",
      render: (text, record) => {
        // Nếu trạng thái là "Hoàn thành" và chưa đánh giá, hiển thị nút "Đánh giá"
        const userRating = record.rating; // Giả sử record có rating của người dùng
        if (record.paymentStatus === "Done" && !userRating) {
          return (
            <Button
              type="primary"
              onClick={() => {
                // Lưu bookingId vào trạng thái
                setCurrentBooking(record);
                setShowRating(true);

                // Lấy hotelId từ booking và in ra
                const hotelId = record?.room?.hotel?.id; // Lấy hotelId từ booking
                console.log("Hotel ID:", hotelId);
              }}
            >
              Đánh giá
            </Button>
          );
        } else if (userRating) {
          return <span>Đánh giá: {userRating}</span>;
        }
        return null;
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

      {showRating && currentBooking && (
        <RatingComponent
          hotelId={currentBooking?.room?.hotel?.id} // Truyền hotelId vào RatingComponent
          onClose={() => setShowRating(false)}
        />
      )}
    </div>
  );
};

export default BookingHistory;
