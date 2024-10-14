import React, { useState } from 'react';
import axios from 'axios';
import { Form, Input, Button, Typography, message, Upload } from 'antd';
import { UploadOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom'; // Import useNavigate
import 'animate.css'; // Nếu cần dùng animate.css

const { TextArea } = Input;
const { Title } = Typography;

const AddHotel = () => {
  const [hotelData, setHotelData] = useState({
    name: '',
    location: '',
    description: '',
  });
  const [fileList, setFileList] = useState([]);
  const [loading, setLoading] = useState(false); // Thêm state loading
  const navigate = useNavigate(); // Sử dụng useNavigate để điều hướng trang

  const handleChange = (e) => {
    const { name, value } = e.target;
    setHotelData({ ...hotelData, [name]: value });
  };

  const handleUpload = ({ fileList }) => {
    setFileList(fileList);
  };

  const handleSubmit = async (values) => {
    setLoading(true); // Bật loading khi bắt đầu gửi form
    const formData = new FormData();
    formData.append('name', hotelData.name);
    formData.append('location', hotelData.location);
    formData.append('description', hotelData.description);
    
    fileList.forEach(file => {
      formData.append('imagehotel', file.originFileObj);
    });

    try {
      const response = await axios.post('/api/hotel/addhotel', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        withCredentials: true
      });

      // Kiểm tra phản hồi từ server
      if (response.status === 201) {
        message.success('Thêm khách sạn thành công!');
        navigate('/myhotel'); // Chuyển đến trang /myhotel sau khi thêm thành công
      }
    } catch (error) {
      // Xử lý lỗi và hiển thị thông báo
      const errorMsg = error.response?.data?.msg || 'Đã xảy ra lỗi khi thêm khách sạn';
      message.error(errorMsg);
    } finally {
      setLoading(false); // Tắt loading khi hoàn thành
    }
  };

  return (
    <div className="max-w-lg mx-auto p-8 bg-white shadow-lg rounded-lg mt-10 animate__animated animate__fadeIn">
      <Title level={2} className="text-center text-gray-800 mb-6">Thêm Khách Sạn</Title>
      <Form layout="vertical" onFinish={handleSubmit}>
        <Form.Item label="Tên khách sạn" required>
          <Input 
            name="name" 
            placeholder="Nhập tên khách sạn" 
            value={hotelData.name} 
            onChange={handleChange}
            className="border-gray-300 focus:border-pink-500 focus:ring-pink-500"
            required
          />
        </Form.Item>

        <Form.Item label="Địa điểm" required>
          <Input 
            name="location" 
            placeholder="Nhập địa điểm" 
            value={hotelData.location} 
            onChange={handleChange}
            className="border-gray-300 focus:border-pink-500 focus:ring-pink-500"
            required
          />
        </Form.Item>

        <Form.Item label="Mô tả">
          <TextArea 
            name="description" 
            placeholder="Nhập mô tả" 
            rows={4} 
            value={hotelData.description} 
            onChange={handleChange}
            className="border-gray-300 focus:border-pink-500 focus:ring-pink-500"
          />
        </Form.Item>

        <Form.Item label="Ảnh khách sạn">
          <Upload
            listType="picture"
            maxCount={5}
            onChange={handleUpload}
            beforeUpload={() => false} // Ngăn chặn tải lên ngay lập tức
          >
            <Button icon={<UploadOutlined />}>Chọn ảnh</Button>
          </Upload>
        </Form.Item>

        <Form.Item>
          <Button 
            type="primary" 
            htmlType="submit" 
            block
            loading={loading} // Thêm loading vào button
            className="bg-pink-500 hover:bg-pink-600 transition-all duration-300"
          >
            {loading ? 'Đang xử lý...' : 'Thêm Khách Sạn'}
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
};

export default AddHotel;
