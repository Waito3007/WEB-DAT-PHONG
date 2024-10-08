import React, { useState } from 'react';
import AddHotel from '../hotel_manager/AddHotel'; // Nhập AddHotel

const HotelPage = () => {
  const [hotels, setHotels] = useState([]);

  // Hàm để thêm khách sạn
  const handleHotelAdded  = (newHotel) => {
    console.log('Hotel added:', newHotel);
    setHotels((prevHotels) => [...prevHotels, newHotel]);
  };
  
  // Hàm để lấy 4 khách sạn hàng đầu ngẫu nhiên
  const getTop4Hotels = () => {
    const shuffled = hotels.sort(() => 0.5 - Math.random());
    return shuffled.slice(0, 4);
  };

  return (
    <div>
      <AddHotel onHotelAdded={handleHotelAdded} /> {/* Thêm khách sạn mới */}
      <div style={{ marginTop: '20px' }}>
        <h2>Danh sách 4 khách sạn hàng đầu</h2>
        <div style={topHotelsStyle}>
          {getTop4Hotels().map((hotel, index) => (
            <div key={index} style={hotelCardStyle}>
              <img src={hotel.imageUrl} alt={hotel.name} style={imageStyle} />
              <h3>{hotel.name}</h3>
              <p>{hotel.description}</p>
              <button style={buttonStyle}>Book a Hotel</button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

// Kiểu dáng cho danh sách khách sạn
const topHotelsStyle = {
  display: 'flex',
  justifyContent: 'space-between',
  flexWrap: 'wrap',
};

// Kiểu dáng cho thẻ khách sạn
const hotelCardStyle = {
  backgroundColor: "white",
  borderRadius: "10px",
  padding: "20px",
  boxShadow: "0 2px 10px rgba(0, 0, 0, 0.1)",
  margin: "10px",
  width: "200px",
};

const imageStyle = {
  width: "100%",
  borderRadius: "10px",
};

// Định nghĩa kiểu dáng cho nút
const buttonStyle = {
  backgroundColor: "#f0f0f0",
  border: "2px solid black",
  padding: "10px 20px",
  fontSize: "16px",
  color: "black",
  cursor: "pointer",
  transition: "background-color 0.3s ease",
};

export default HotelPage;
