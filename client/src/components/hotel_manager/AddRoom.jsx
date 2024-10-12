import React, { useState } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import { Form, Input, Button, message, InputNumber, Switch, Upload, Spin, Typography } from 'antd';
import { UploadOutlined } from '@ant-design/icons';

const { Title } = Typography;

const AddRoom = () => {
  const { hotelId } = useParams(); // Lấy hotelId từ URL
  const [type, setType] = useState('');
  const [price, setPrice] = useState(0);
  const [availability, setAvailability] = useState(true);
  const [images, setImages] = useState([]); // Đổi thành images cho nhất quán
  const [loading, setLoading] = useState(false); // Trạng thái loading
  const navigate = useNavigate();

  const handleAddRoom = async () => {
    setLoading(true); // Bắt đầu loading
    const formData = new FormData();
    formData.append('type', type);
    formData.append('price', price);
    formData.append('availability', availability);

    // Thêm từng ảnh vào formData với tên trường 'imageroom'
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
      navigate(`/myhotel`); // Chuyển hướng về trang My Hotel
    } catch (error) {
      console.error('Lỗi khi thêm phòng:', error.response?.data);
      message.error('Đã xảy ra lỗi khi thêm phòng');
    } finally {
      setLoading(false); // Kết thúc loading
    }
  };

  const handleFileChange = ({ fileList }) => {
    setImages(fileList.map(file => file.originFileObj)); // Lưu ảnh dưới dạng file gốc
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
          label={<span className="font-semibold text-gray-700">Ảnh Phòng</span>}
        >
          <Upload
            listType="picture"
            beforeUpload={() => false} // Ngăn chặn upload tự động
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
