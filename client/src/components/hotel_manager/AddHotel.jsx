// components/AddHotel.jsx
import React, { useState } from 'react';
import axios from 'axios';

const AddHotel = () => {
  const [hotelData, setHotelData] = useState({
    name: '',
    location: '',
    description: '',
    rooms: [], // Có thể để trống nếu chưa có phòng
    imagehotel: [] // Có thể để trống nếu chưa có ảnh
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setHotelData({ ...hotelData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      const response = await axios.post('/api/hotel/addhotel', hotelData, {
        withCredentials: true // Để gửi cookie kèm theo request
      });
      console.log(response.data);
      // Xử lý kết quả thành công (ví dụ: thông báo)
    } catch (error) {
      console.error('Lỗi khi thêm khách sạn:', error.response.data);
      // Xử lý lỗi
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input 
        type="text" 
        name="name" 
        placeholder="Tên khách sạn" 
        value={hotelData.name} 
        onChange={handleChange} 
        required 
      />
      <input 
        type="text" 
        name="location" 
        placeholder="Địa điểm" 
        value={hotelData.location} 
        onChange={handleChange} 
        required 
      />
      <textarea 
        name="description" 
        placeholder="Mô tả" 
        value={hotelData.description} 
        onChange={handleChange} 
      />
      <button type="submit">Thêm Khách Sạn</button>
    </form>
  );
};

export default AddHotel;
