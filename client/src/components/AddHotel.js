import React, { useState } from 'react';
import axios from 'axios';

const AddHotel = () => {
  const [name, setName] = useState('');
  const [location, setLocation] = useState('');
  const [description, setDescription] = useState('');
  const [manager, setManager] = useState('');
  const [rooms, setRooms] = useState([]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post('/api/hotels/add', {
        name,
        location,
        description,
        manager,
        rooms
      });
      console.log('Khách sạn đã được thêm:', response.data);
    } catch (error) {
      console.error('Lỗi khi thêm khách sạn:', error);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="text"
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="Tên khách sạn"
        required
      />
      <input
        type="text"
        value={location}
        onChange={(e) => setLocation(e.target.value)}
        placeholder="Vị trí"
        required
      />
      <textarea
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        placeholder="Mô tả"
      />
      <input
        type="text"
        value={manager}
        onChange={(e) => setManager(e.target.value)}
        placeholder="Quản lý"
        required
      />
      <button type="submit">Thêm khách sạn</button>
    </form>
  );
};

export default AddHotel;
