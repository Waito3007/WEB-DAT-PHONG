// BookingDetailsModal.js
import React from "react";

const BookingDetailsModal = ({ booking, onClose, onPrint }) => {
  if (!booking) return null;

  return (
    <div
      className="fixed text-black inset-0 bg-gray-900 bg-opacity-50 flex justify-center items-center z-50"
      onClick={onClose}
    >
      <div
        className="bg-white p-8 rounded-xl shadow-lg max-w-3xl w-full"
        onClick={(e) => e.stopPropagation()}
      >
        <h3 className="text-2xl font-bold mb-6 text-center">
          Chi tiết hóa đơn
        </h3>
        <div className="modal-content space-y-4">
          {/* Mã đặt phòng */}
          <p>
            <strong className="text-gray-700">Mã đặt phòng:</strong>{" "}
            {booking.orderId}
          </p>

          {/* Thông tin khách hàng */}
          <p>
            <strong className="text-gray-700">Khách hàng:</strong>{" "}
            {booking.user.name}
          </p>
          <p>
            <strong className="text-gray-700">Email đặt phòng:</strong>{" "}
            {booking.emailBooking}
          </p>
          <p>
            <strong className="text-gray-700">Phone:</strong>{" "}
            {booking.phoneBooking}
          </p>

          {/* Thông tin khách sạn và phòng */}
          <p>
            <strong className="text-gray-700">Khách sạn:</strong>{" "}
            {booking.room.hotel.name}
          </p>
          <p>
            <strong className="text-gray-700">Loại phòng:</strong>{" "}
            {booking.room.type}
          </p>

          {/* Thông tin ngày đặt và ngày check-in/out */}
          <p>
            <strong className="text-gray-700">Ngày đặt:</strong>{" "}
            {new Date(booking.bookingDate).toLocaleString()}
          </p>
          <p>
            <strong className="text-gray-700">Check-in:</strong>{" "}
            {new Date(booking.checkInDate).toLocaleDateString()}
          </p>
          <p>
            <strong className="text-gray-700">Check-out:</strong>{" "}
            {new Date(booking.checkOutDate).toLocaleDateString()}
          </p>

          {/* Tổng tiền */}
          <p className="text-right text-lg font-Roboto text-orange-600">
            <strong>Tổng tiền:</strong> {booking.priceBooking} VND
          </p>
        </div>

        {/* Các nút điều khiển */}
        <div className="flex justify-end mt-6 gap-4">
          <button
            onClick={onClose}
            className="bg-red-600 text-white px-6 py-2 rounded-xl hover:bg-red-700 transition-colors"
          >
            Đóng
          </button>
          <button
            onClick={onPrint}
            className="bg-blue-600 text-white px-6 py-2 rounded-xl hover:bg-blue-700 transition-colors"
          >
            In hóa đơn
          </button>
        </div>
      </div>
    </div>
  );
};

export default BookingDetailsModal;
