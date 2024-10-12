import React from "react";
import Filter from "./Filter";
import HotelItem from "./HotelItem"; // Đổi tên import ở đây

const HotelList = () => {
  const hotels = [
    {
      name: "Aimee House Homestay",
      location: "Hà Nội",
      rating: "⭐⭐⭐⭐⭐",
      reviews: "9.0/10 (120 đánh giá)",
      price: "12.000.000",
      image: "Hp1.png",
    },
    {
      name: "Stay night Hồ Chí Minh",
      location: "Hồ Chí Minh",
      rating: "⭐⭐⭐⭐⭐",
      reviews: "8.7/10 (85 đánh giá)",
      price: "12.000.000",
      image: "Hp1.png",
    },
    {
      name: "Stay Night Cần Thơ",
      location: "Cần Thơ",
      rating: "⭐⭐⭐⭐⭐",
      reviews: "8.9/10 (90 đánh giá)",
      price: "12.000.000",
      image: "Hp1.png",
    },
    {
      name: "Stay night Sapa",
      location: "Sapa",
      rating: "⭐⭐⭐⭐⭐",
      reviews: "8.8/10 (110 đánh giá)",
      price: "12.000.000",
      image: "Hp1.png",
    },
  ];

  return (
    <div className="container">
      <div className="flex">
        {/* Phần lọc */}
        <Filter />

        {/* Danh sách khách sạn */}
        <div className="hotel-list w-full">
          <h2 className="text-xl font-semibold text-black">Khách sạn</h2>
          <div className="grid grid-cols-1 gap-4">
            {hotels.map((hotel, index) => (
              <HotelItem // Đổi tên component ở đây
                key={index}
                name={hotel.name}
                location={hotel.location}
                rating={hotel.rating}
                reviews={hotel.reviews}
                price={hotel.price}
                image={hotel.image}
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
