// src/components/BookingStatus/BookingCard.js
import React from 'react';
import { Card } from 'flowbite-react';

const BookingCard = ({ booking }) => {
  return (
    <Card className="shadow-md">
      <h2 className="text-lg font-bold">{booking.room?.name}</h2>
      <p className="text-gray-700">Ngày đặt: {new Date(booking.bookingDate).toLocaleDateString()}</p>
      <p className="text-gray-700">Nhận phòng: {new Date(booking.checkInDate).toLocaleDateString()}</p>
      <p className="text-gray-700">Trả phòng: {new Date(booking.checkOutDate).toLocaleDateString()}</p>
      <p className="text-gray-700">Trạng thái thanh toán: {booking.paymentStatus}</p>
    </Card>
  );
};

export default BookingCard;
