import React, { useState } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import { Form, Input, Button, message, InputNumber, Switch, Upload, Spin, Typography } from 'antd';
import { UploadOutlined } from '@ant-design/icons';

const { Title } = Typography;

const AddRoom = () => {
  const { hotelId } = useParams();
  const [type, setType] = useState('');
  const [price, setPrice] = useState(0);
  const [availability, setAvailability] = useState(true);
  const [remainingRooms, setRemainingRooms] = useState(0); // Trường mới cho số phòng còn lại
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleAddRoom = async () => {
    setLoading(true);
    const formData = new FormData();
    formData.append('type', type);
    formData.append('price', price);
    formData.append('availability', availability);
    formData.append('remainingRooms', remainingRooms); // Thêm số phòng còn lại vào formData

    images.forEach((file) => {
      formData.append('imageroom', file);
    });

    try {
      await axios.post(`/api/room/${hotelId}/add-room`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        withCredentials: true,
      });

      message.success('Phòng đã được thêm thành công');
      navigate(`/myhotel`);
    } catch (error) {
      console.error('Lỗi khi thêm phòng:', error.response?.data);
      message.error('Đã xảy ra lỗi khi thêm phòng');
    } finally {
      setLoading(false);
    }
  };

  const handleFileChange = ({ fileList }) => {
    setImages(fileList.map(file => file.originFileObj));
  };

  return (
    <div className="max-w-lg mx-auto p-6 bg-white shadow-md rounded-md">
      <Title level={3} className="text-center mb-4">Thêm Phòng</Title>
      <Form layout="vertical" onFinish={handleAddRoom}>
        <Form.Item 
          label={<span className="font-semibold text-gray-700">Loại Phòng</span>} 
          required
        >
          <Input
            value={type}
            onChange={(e) => setType(e.target.value)}
            placeholder="Nhập loại phòng (Deluxe, Standard...)"
            className="rounded-lg"
            required
          />
        </Form.Item>
        
        <Form.Item 
          label={<span className="font-semibold text-gray-700">Giá Phòng</span>} 
          required
        >
          <InputNumber
            min={0}
            value={price}
            onChange={(value) => setPrice(value)}
            className="w-full rounded-lg"
            placeholder="Nhập giá phòng"
            required
          />
        </Form.Item>

        <Form.Item 
          label={<span className="font-semibold text-gray-700">Tình Trạng</span>}
        >
          <Switch
            checked={availability}
            onChange={(checked) => setAvailability(checked)}
            checkedChildren="Có sẵn"
            unCheckedChildren="Hết phòng"
            className="ml-2"
          />
        </Form.Item>

        <Form.Item 
          label={<span className="font-semibold text-gray-700">Số Phòng Còn Lại</span>} // Thêm trường này
          required
        >
          <InputNumber
            min={0}
            value={remainingRooms}
            onChange={(value) => setRemainingRooms(value)}
            className="w-full rounded-lg"
            placeholder="Nhập số phòng còn lại"
            required
          />
        </Form.Item>

        <Form.Item 
          label={<span className="font-semibold text-gray-700">Ảnh Phòng</span>}
        >
          <Upload
            listType="picture"
            beforeUpload={() => false}
            onChange={handleFileChange}
          >
            <Button icon={<UploadOutlined />}>Chọn ảnh</Button>
          </Upload>
        </Form.Item>

        <Button 
          type="primary" 
          htmlType="submit" 
          loading={loading}
          className="w-full mt-3 rounded-lg"
        >
          {loading ? <Spin /> : 'Thêm Phòng'}
        </Button>
      </Form>
    </div>
  );
};

export default AddRoom;
