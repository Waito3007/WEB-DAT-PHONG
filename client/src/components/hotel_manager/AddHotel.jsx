import React, { useState } from 'react';
import axios from 'axios';
import { Form, Input, Button, Typography, message, Upload, Modal } from 'antd';
import { UploadOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { Star } from 'lucide-react';
import 'animate.css';
import MapPicker from '../Map/MapPicker'; // Import MapPicker component

const { TextArea } = Input;
const { Title } = Typography;

const AddHotel = () => {
  const [hotelData, setHotelData] = useState({
    name: '',
    location: '',
    description: '',
    stars: 0,
  });
  const [fileList, setFileList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isMapVisible, setIsMapVisible] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setHotelData({ ...hotelData, [name]: value });
  };

  const handleUpload = ({ fileList }) => {
    setFileList(fileList);
  };

  const handleSubmit = async (values) => {
    // (Giữ nguyên code handleSubmit ở đây)
  };

  const handleLocationSelect = (coordinate) => {
    setIsMapVisible(false);
  };

  return (
    <>
      <Button type="primary" onClick={() => setIsModalVisible(true)}>Thêm Khách Sạn</Button>

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
                readOnly // Để không cho người dùng chỉnh sửa trực tiếp
              />
              <Button onClick={() => setIsMapVisible(true)}>Chọn địa điểm</Button>
            </Form.Item>

            {/* (Giữ nguyên các Form.Item khác) */}

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

      <Modal
        visible={isMapVisible}
        onCancel={() => setIsMapVisible(false)}
        footer={null}
        className="modal-fullscreen" // Thêm lớp CSS cho modal toàn màn hình
        bodyStyle={{ padding: 0 }} // Loại bỏ padding trong body
      >
        <MapPicker onSelectLocation={handleLocationSelect} />
      </Modal>
    </>
  );
};

export default AddHotel;
