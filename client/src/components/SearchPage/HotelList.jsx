import React, { useState, useEffect } from "react";
import HotelItem from "./HotelItem";

const HotelList = ({ hotels = [] }) => {
  const [visibleHotels, setVisibleHotels] = useState(2); // Hiển thị khách sạn ban đầu

  // Hàm xử lý khi người dùng cuộn trang
  const handleScroll = () => {
    const bottom = Math.ceil(window.innerHeight + document.documentElement.scrollTop) === document.documentElement.offsetHeight;
    if (bottom && visibleHotels < hotels.length) {
      // Nếu người dùng cuộn đến đáy trang và còn khách sạn chưa được tải
      setVisibleHotels((prevVisibleHotels) => prevVisibleHotels + 3); // Tải thêm khách sạn
    }
  };

  // Thêm event listener khi component được mount
  useEffect(() => {
    window.addEventListener("scroll", handleScroll);

    // Cleanup event listener khi component unmount
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [visibleHotels, hotels.length]);

  // Lấy danh sách khách sạn cần hiển thị
  const currentHotels = hotels.slice(0, visibleHotels);

  return (
    <div className="container">
      <div className="flex">
        <div className="hotel-list w-full">
          <div className="grid grid-cols-1 gap-4">
            {Array.isArray(currentHotels) && currentHotels.length > 0 ? (
              currentHotels.map((hotel) => {
                const lowestRoomPrice =
                  hotel.rooms && hotel.rooms.length > 0
                    ? Math.min(...hotel.rooms.map((room) => room.price))
                    : null;

                return (
                  <HotelItem
                    key={hotel._id}
                    hotel={hotel}
                    lowestRoomPrice={lowestRoomPrice}
                  />
                );
              })
            ) : (
              <p>Không có khách sạn nào được tìm thấy.</p>
            )}
          </div>

          {/* Thông báo khi không còn khách sạn */}
          {visibleHotels >= hotels.length && (
            <div className="text-center py-4">Không còn khách sạn nào để tải thêm.</div>
          )}
        </div>
      </div>
    </div>
  );
};

export default HotelList;
