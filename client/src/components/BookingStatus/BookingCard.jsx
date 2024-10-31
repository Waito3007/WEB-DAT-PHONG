import React from 'react';
import { Card } from 'flowbite-react';

const BookingCard = ({ booking }) => {
  const originalHotelImage = booking.room.hotel.imagehotel[0]; // Lấy ảnh đầu tiên hotel
  const hotelImage = originalHotelImage
    ? originalHotelImage.replace(
        '/upload/',
        '/upload/c_crop,g_center,r_max,w_200,h_200/' // Tạo ảnh cắt hình vuông, bo góc tròn
      )
    : null;
  
  const roomPrice = booking.room.price; // Lấy giá của phòng
  
  return (   
    <Card className="shadow-md flex mt-2 mx-5 p-5">
      {/* Hiển thị ảnh khách sạn */}
      {hotelImage && (
        <img src={hotelImage} alt="Hotel" className="rounded-lg w-32 h-32 object-cover mr-4" />
      )}
      
      <div className="flex flex-col flex-1"> {/* Chiếm phần còn lại của card */}
        <div className="flex justify-between mb-2">
          <p className="text-white font-bold text-2xl">Khách sạn: {booking.room.hotel.name}</p>
          <p className="text-white font-bold text-sm">Loại Phòng: {booking.room.type}</p>
        </div>
        
        <div className="flex justify-between">
          <p className="text-white text-sm">Ngày đặt: {new Date(booking.bookingDate).toLocaleDateString()}</p>
          <p className="text-white text-sm">Trạng thái thanh toán: {booking.paymentStatus}</p>
        </div>
        <p className="text-white text-sm">Trả phòng: {new Date(booking.checkOutDate).toLocaleDateString()}</p>
        <div className="flex justify-between">
          <p className="text-white text-sm">Nhận phòng: {new Date(booking.checkInDate).toLocaleDateString()}</p>
          <p className="price text-2xl">{roomPrice.toLocaleString('vi-VN')} VND</p>
        </div>
        
      </div>
    </Card>
  );
};

export default BookingCard;
