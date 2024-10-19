import React from "react";

const amenities = [
  { icon: "🏊", text: "Bể bơi ngoài trời" },
  { icon: "🏊", text: "Bể bơi trong nhà" },
  { icon: "💆", text: "Spa và chăm sóc sức khoẻ" },
  { icon: "🍽️", text: "Nhà hàng" },
  { icon: "🛎️", text: "Dịch vụ phòng" },
  { icon: "💪", text: "Trung tâm thể hình" },
  { icon: "🍹", text: "Quầy bar/phòng chờ" },
  { icon: "📶", text: "Wi-Fi miễn phí" },
  { icon: "☕", text: "Quầy cafe" },
  { icon: "+24", text: "tiện ích khác" },
];

const Amenities = () => {
  return (
    <div className="amenities">
      <h2>Tiện nghi</h2>
      <ul>
        {amenities.map((amenity, index) => (
          <li key={index}>
            <span className="icon">{amenity.icon}</span>
            <span className="text">{amenity.text}</span>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Amenities;
