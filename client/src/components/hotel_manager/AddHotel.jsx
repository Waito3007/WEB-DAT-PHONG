import React, { useState } from 'react';
import axios from 'axios';
import { Form, Input, Button, Typography, message, Upload } from 'antd';
import { UploadOutlined } from '@ant-design/icons';


const { TextArea } = Input;
const { Title } = Typography;

const AddHotel = ({ onHotelAdded }) => {
  const [hotelData, setHotelData] = useState({
    name: '',
    location: '',
    description: '',
  });
  const [fileList, setFileList] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setHotelData({ ...hotelData, [name]: value });
  };

  const handleUpload = ({ fileList }) => {
    setFileList(fileList);
  };

  const handleSubmit = async () => {
    setLoading(true);
    const formData = new FormData();
    formData.append('name', hotelData.name);
    formData.append('location', hotelData.location);
    formData.append('description', hotelData.description);

    fileList.forEach(file => {
      formData.append('imagehotel', file.originFileObj);
    });

    try {
      const response = await axios.post('/api/hotel/addhotel', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
        withCredentials: true,
      });
      console.log('Response from server:', response.data); // Thêm log này

      message.success('Thêm khách sạn thành công!');

      // Giả sử bạn nhận được đường dẫn ảnh từ API
      const newHotel = {
        name: hotelData.name,
        location: hotelData.location,
        description: hotelData.description,
        imageUrl: response.data.imageUrl, // Đảm bảo đường dẫn ảnh chính xác
      };
      onHotelAdded(newHotel); 

      // Đặt lại biểu mẫu
      setHotelData({
        name: '',
        location: '',
        description: '',
      });
      setFileList([]);
    } catch (error) {
      console.error('Lỗi khi thêm khách sạn:', error.response?.data);
      message.error('Đã xảy ra lỗi khi thêm khách sạn');
    } finally {
      setLoading(false);
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

        <Form.Item label="Ảnh khách sạn">
          <Upload
            listType="picture"
            maxCount={5}
            onChange={handleUpload}
            beforeUpload={() => false} // Ngăn chặn upload tự động
            fileList={fileList}
          >
            <Button icon={<UploadOutlined />}>Chọn ảnh</Button>
          </Upload>
        </Form.Item>

        <Form.Item>
          <Button type="primary" htmlType="submit" block loading={loading}>
            Thêm Khách Sạn
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
};

export default AddHotel;
