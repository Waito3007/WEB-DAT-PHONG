import React, { useState } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import { Form, Input, Button, message, InputNumber, Switch, Upload } from 'antd';
import { UploadOutlined } from '@ant-design/icons';

const AddRoom = () => {
  const { hotelId } = useParams(); // Lấy hotelId từ URL
  const [type, setType] = useState('');
  const [price, setPrice] = useState(0);
  const [availability, setAvailability] = useState(true);
  const [images, setImages] = useState([]); // Đổi thành images cho nhất quán
  const navigate = useNavigate();

  const handleAddRoom = async () => {
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
    navigate(`/hotel/${hotelId}`);
  } catch (error) {
    console.error('Lỗi khi thêm phòng:', error.response?.data);
    message.error('Đã xảy ra lỗi khi thêm phòng');
  }
};

  

  const handleFileChange = ({ fileList }) => {
    setImages(fileList.map(file => file.originFileObj)); // Lưu ảnh dưới dạng file gốc
  };

  return (
    <div className="max-w-md mx-auto p-5">
      <h2 className="text-xl font-semibold mb-5">Thêm Phòng</h2>
      <Form layout="vertical" onFinish={handleAddRoom}>
        <Form.Item label="Loại Phòng" required>
          <Input
            value={type}
            onChange={(e) => setType(e.target.value)}
            placeholder="Nhập loại phòng (Deluxe, Standard...)"
            required
          />
        </Form.Item>
        <Form.Item label="Giá Phòng" required>
          <InputNumber
            min={0}
            value={price}
            onChange={(value) => setPrice(value)}
            className="w-full"
            placeholder="Nhập giá phòng"
            required
          />
        </Form.Item>
        <Form.Item label="Tình Trạng">
          <Switch
            checked={availability}
            onChange={(checked) => setAvailability(checked)}
            checkedChildren="Có sẵn"
            unCheckedChildren="Hết phòng"
          />
        </Form.Item>
        <Form.Item label="Ảnh Phòng">
          <Upload
            listType="picture"
            beforeUpload={() => false} // Ngăn chặn upload tự động
            onChange={handleFileChange}
          >
            <Button icon={<UploadOutlined />}>Chọn ảnh</Button>
          </Upload>
        </Form.Item>
        <Button type="primary" htmlType="submit">
          Thêm Phòng
        </Button>
      </Form>
    </div>
  );
};

export default AddRoom;
