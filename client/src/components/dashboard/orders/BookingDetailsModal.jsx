// BookingDetailsModal.js
import React from 'react';

const BookingDetailsModal = ({ booking, onClose, onPrint }) => {
  if (!booking) return null;

  return (
    <div
      className="fixed text-black inset-0 bg-gray-900 bg-opacity-50 flex justify-center items-center z-50"
      onClick={onClose}
    >
      <div
        className="bg-white p-6 rounded-xl shadow-lg max-w-2xl w-full"
        onClick={(e) => e.stopPropagation()}
      >
        <h3 className="text-xl font-bold mb-4">Chi tiết</h3>
        <div className="modal-content">
          <p><strong>Mã đặt phòng:</strong> {booking.orderId}</p>
          <p><strong>Khách hàng:</strong> {booking.user.name}</p>     
          <p><strong>Khách sạn:</strong> {booking.room.hotel.name}</p>
          <p><strong>Email đặt phòng:</strong> {booking.emailBooking}</p>    
          <p><strong>Phone:</strong> {booking.phoneBooking}</p>                 
          <p><strong>Loại phòng:</strong> {booking.room.type}</p>
          <p><strong>Ngày đặt:</strong> {new Date(booking.bookingDate).toLocaleString()}</p>
          <p><strong>Check-in:</strong> {new Date(booking.checkInDate).toLocaleDateString()}</p>
          <p><strong>Check-out:</strong> {new Date(booking.checkOutDate).toLocaleDateString()}</p>
          <p className='text-orange-600'><strong>Tổng tiền:</strong> {booking.priceBooking} VND</p>
        </div>
        <div className="flex justify-end mt-6 gap-3">
          <button onClick={onClose} className="bg-red-600 text-white px-4 py-2 rounded-xl">Đóng</button>
          <button 
            onClick={onPrint} 
            className="bg-blue-600 text-white px-4 py-2 rounded-xl"
          >
            In hóa đơn
          </button>
        </div>
      </div>
    </div>
  );
};

export default BookingDetailsModal;
