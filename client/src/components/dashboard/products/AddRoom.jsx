import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { Form, Button, message, InputNumber, Switch, Upload, Select } from 'antd';
import { UploadOutlined } from '@ant-design/icons';

const { Option } = Select; // Khai báo biến Option để sử dụng trong Select

const AddRoom = ({ hotelId, onClose }) => {
  const [type, setType] = useState('');
  const [price, setPrice] = useState(0);
  const [availability, setAvailability] = useState(true);
  const [images, setImages] = useState([]); // Đổi thành images cho nhất quán
  const [remainingRooms, setRemainingRooms] = useState(0); // Số phòng còn trống
  const [loading, setLoading] = useState(false); // Trạng thái loading
  const navigate = useNavigate();

  const handleAddRoom = async () => {
    setLoading(true); // Bắt đầu loading
    const formData = new FormData();
    formData.append('type', type);
    formData.append('price', price);
    formData.append('availability', availability);
    formData.append('remainingRooms', remainingRooms); // Thêm số phòng còn trống

    // Thêm từng ảnh vào formData với tên trường 'imageroom'
    images.forEach((file) => {
      formData.append('imageroom', file);
    });

    try {
      const response = await axios.post(`/api/room/${hotelId}/add-room`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        withCredentials: true,
      });

      message.success(response.data.msg || 'Phòng đã được thêm thành công');
      onClose(); // Đóng modal sau khi thêm thành công
    } catch (error) {
      console.error('Lỗi khi thêm phòng:', error.response?.data);
      message.error(error.response?.data.msg || 'Đã xảy ra lỗi khi thêm phòng');
    } finally {
      setLoading(false); // Kết thúc loading
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
          <Select
            value={type}
            onChange={(value) => setType(value)}
            placeholder="Chọn loại phòng"
            required
          >
            <Option value="1 phòng 1 người">1 phòng 1 người</Option>
            <Option value="1 phòng 2 người">1 phòng 2 người</Option>
            <Option value="2 phòng 2 người">2 phòng 2 người</Option>
            <Option value="2 phòng 4 người">2 phòng 4 người</Option>
          </Select>
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
        <Form.Item label="Số Phòng Còn Trống" required>
          <InputNumber
            min={0}
            value={remainingRooms}
            onChange={(value) => setRemainingRooms(value)}
            className="w-full"
            placeholder="Nhập số phòng còn trống"
            required
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
        <Button type="primary" htmlType="submit" loading={loading}>
          {loading ? 'Đang thêm phòng...' : 'Thêm Phòng'}
        </Button>
      </Form>
    </div>
  );
};

export default AddRoom;
