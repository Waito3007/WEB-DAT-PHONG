import React from "react";
import { Rate } from "antd"; // Import Rate từ Ant Design
import HotelItem from "./HotelItem";

const HotelList = ({ hotels = [] }) => { // Khởi tạo hotels với giá trị mặc định là mảng rỗng
  return (
    <div className="container">
      <div className="flex">
        <div className="hotel-list w-full">
          <h2 className="text-xl font-semibold text-black">Khách sạn</h2>
          <div className="grid grid-cols-1 gap-4">
            {Array.isArray(hotels) && hotels.length > 0 ? ( // Kiểm tra xem hotels có phải là mảng và không rỗng
              hotels.map((hotel) => {
                // Tính giá phòng thấp nhất từ mảng phòng thuộc khách sạn
                const lowestRoomPrice = hotel.rooms && hotel.rooms.length > 0 
                  ? Math.min(...hotel.rooms.map(room => room.price)) 
                  : null;

                return (
                  <HotelItem 
                    key={hotel._id} 
                    hotel={hotel} 
                    lowestRoomPrice={lowestRoomPrice} // Truyền giá phòng thấp nhất vào HotelItem
                  />
                );
              })
            ) : (
              <p>Không có khách sạn nào được tìm thấy.</p> // Thông báo nếu không có khách sạn
            )}
          </div>
          <button className="show-more-button">Hiển thị thêm</button>
        </div>
      </div>
    </div>
  );
};

export default HotelList;
