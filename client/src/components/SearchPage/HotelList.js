import React, { useEffect, useState } from "react";
import Filter from "./Filter";
import HotelItem from "./HotelItem";

const HotelList = () => {
  const [hotels, setHotels] = useState([]);

  useEffect(() => {
    // Gọi API lấy danh sách khách sạn
    fetch("/api/hotel") // Địa chỉ API của bạn
      .then((response) => response.json())
      .then((data) => {
        setHotels(data); // Giả sử data là mảng khách sạn
      })
      .catch((error) => {
        console.error("Lỗi khi gọi API:", error);
      });
  }, []);

  return (
    <div className="container">
      <div className="flex">
        {/* Phần lọc */}
        <Filter />

        {/* Danh sách khách sạn */}
        <div className="hotel-list w-full">
          <h2 className="text-xl font-semibold text-black">Khách sạn</h2>
          <div className="grid grid-cols-1 gap-4">
            {hotels.map((hotel) => (
              <HotelItem // Truyền toàn bộ hotel vào đây
                key={hotel.id} // Sử dụng id để làm khóa
                hotel={hotel} // Truyền đối tượng hotel
              />
            ))}
          </div>
          <button className="show-more-button">Hiển thị thêm</button>
        </div>
      </div>
    </div>
  );
};

export default HotelList;
