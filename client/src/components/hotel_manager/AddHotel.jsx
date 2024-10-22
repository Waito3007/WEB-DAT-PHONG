import React, { useState } from 'react';
import axios from 'axios';
import { Form, Input, Button, Typography, message, Upload, Modal } from 'antd';
import { UploadOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { Star } from 'lucide-react'; // Nhập icon Star từ lucide-react
import 'animate.css';

const { TextArea } = Input;
const { Title } = Typography;

const AddHotel = () => {
  const [hotelData, setHotelData] = useState({
    name: '',
    location: '',
    description: '',
    stars: 0, // Thêm stars vào state
  });
  const [fileList, setFileList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false); // Trạng thái hiển thị modal
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setHotelData({ ...hotelData, [name]: value });
  };

  const handleUpload = ({ fileList }) => {
    setFileList(fileList);
  };

  const handleStarChange = (value) => {
    setHotelData({ ...hotelData, stars: value });
  };

  const handleSubmit = async (values) => {
    setLoading(true);
    const formData = new FormData();
    formData.append('name', hotelData.name);
    formData.append('location', hotelData.location);
    formData.append('description', hotelData.description);
    formData.append('stars', hotelData.stars);

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

      if (response.status === 201) {
        message.success('Thêm khách sạn thành công!');
        navigate('/myhotel');
      }
    } catch (error) {
      const errorMsg = error.response?.data?.msg || 'Đã xảy ra lỗi khi thêm khách sạn';
      message.error(errorMsg);
    } finally {
      setLoading(false);
      setIsModalVisible(false); // Đóng modal sau khi thêm khách sạn thành công
    }
  };

  return (
    <>
      <Button type="primary" onClick={() => setIsModalVisible(true)}>Thêm Khách Sạn</Button> {/* Nút để mở modal */}

      <Modal
        title="Thêm Khách Sạn"
        visible={isModalVisible}
        onCancel={() => setIsModalVisible(false)}
        footer={null}
        className="modal-add"
      >
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

            <Form.Item label="Xếp hạng" required>
              <div className="flex space-x-1">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star
                    key={star}
                    className={`cursor-pointer ${hotelData.stars >= star ? 'text-yellow-500' : 'text-gray-300'}`}
                    onClick={() => handleStarChange(star)}
                    size={30} // Kích thước biểu tượng sao
                  />
                ))}
              </div>
            </Form.Item>

            <Form.Item label="Ảnh khách sạn">
              <Upload
                listType="picture"
                maxCount={5}
                onChange={handleUpload}
                beforeUpload={() => false}
              >
                <Button icon={<UploadOutlined />}>Chọn ảnh</Button>
              </Upload>
            </Form.Item>

            <Form.Item>
              <Button
                type="primary"
                htmlType="submit"
                block
                loading={loading}
                className="bg-pink-500 hover:bg-pink-600 transition-all duration-300"
              >
                {loading ? 'Đang xử lý...' : 'Thêm Khách Sạn'}
              </Button>
            </Form.Item>
          </Form>
        </div>
      </Modal>
    </>
  );
};

export default AddHotel;
