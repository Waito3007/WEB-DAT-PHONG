import React, { useState } from 'react';
import axios from 'axios';
import { Form, Input, Button, Typography } from 'antd';

const { TextArea } = Input;
const { Title } = Typography;

const AddHotel = () => {
  const [hotelData, setHotelData] = useState({
    name: '',
    location: '',
    description: '',
    rooms: [],
    imagehotel: []
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setHotelData({ ...hotelData, [name]: value });
  };

  const handleSubmit = async () => {
    try {
      const response = await axios.post('/api/hotel/addhotel', hotelData, {
        withCredentials: true
      });
      console.log(response.data);
    } catch (error) {
      console.error('Lỗi khi thêm khách sạn:', error.response.data);
    }
  };

  return (
    <div style={{ maxWidth: '600px', margin: '0 auto', padding: '20px' }}>
      <Title level={2}>Thêm Khách Sạn</Title>
      <Form layout="vertical" onFinish={handleSubmit}>
        <Form.Item label="Tên khách sạn" required>
          <Input 
            name="name" 
            placeholder="Nhập tên khách sạn" 
            value={hotelData.name} 
            onChange={handleChange} 
          />
        </Form.Item>
        
        <Form.Item label="Địa điểm" required>
          <Input 
            name="location" 
            placeholder="Nhập địa điểm" 
            value={hotelData.location} 
            onChange={handleChange} 
          />
        </Form.Item>

        <Form.Item label="Mô tả">
          <TextArea 
            name="description" 
            placeholder="Nhập mô tả" 
            rows={4} 
            value={hotelData.description} 
            onChange={handleChange} 
          />
        </Form.Item>

        <Form.Item>
          <Button type="primary" htmlType="submit" block>
            Thêm Khách Sạn
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
};

export default AddHotel;
