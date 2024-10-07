import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { message, Input, Button, Upload, Typography } from 'antd';
import { UploadOutlined } from '@ant-design/icons';


const { Title } = Typography;

const EditRooms = ({ roomId, onClose }) => {
  const [room, setRoom] = useState(null);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    type: '',
    price: '',
    availability: true,
    imageroom: [],
  });

  useEffect(() => {
    const fetchRoom = async () => {
      try {
        const response = await axios.get(`/api/room/${roomId}`, { withCredentials: true });
        setRoom(response.data);
        setFormData({
          type: response.data.type,
          price: response.data.price,
          availability: response.data.availability,
          imageroom: response.data.imageroom || [],
        });
        setLoading(false);
      } catch (error) {
        console.error('Lỗi khi lấy thông tin phòng:', error.response?.data);
        message.error('Đã xảy ra lỗi khi lấy thông tin phòng');
        setLoading(false);
      }
    };

    fetchRoom();
  }, [roomId]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value,
    });
  };

  const handleUploadChange = (fileList) => {
    const newImages = fileList.map(file => file.originFileObj);
    setFormData({
      ...formData,
      imageroom: newImages,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const uploadPromises = formData.imageroom.map((file) => {
        const formData = new FormData();
        formData.append('file', file);
        return axios.post('/api/upload', formData, { withCredentials: true });
      });
  
      const uploadResponses = await Promise.all(uploadPromises);
      const imageUrls = uploadResponses.map(res => res.data.url); // Giả sử API trả về URL hình ảnh
  
      const updatedRoomData = {
        ...formData,
        imageroom: imageUrls,
      };
  
      console.log('Dữ liệu phòng sẽ được cập nhật:', updatedRoomData); // Thêm dòng này để kiểm tra
  
      await axios.put(`/api/room/${roomId}`, updatedRoomData, { withCredentials: true });
  
      message.success('Chỉnh sửa phòng thành công');
      onClose(); // Đóng modal sau khi chỉnh sửa thành công
    } catch (error) {
      console.error('Lỗi khi chỉnh sửa phòng:', error.response?.data);
      message.error('Đã xảy ra lỗi khi chỉnh sửa phòng');
    }
  };
  

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="max-w-4xl mx-auto p-5">
      <Title level={2}>Chỉnh Sửa Phòng</Title>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Loại phòng:</label>
          <Input
            name="type"
            value={formData.type}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label>Giá:</label>
          <Input
            type="number"
            name="price"
            value={formData.price}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label>
            <input
              type="checkbox"
              name="availability"
              checked={formData.availability}
              onChange={handleChange}
            />
            Còn phòng
          </label>
        </div>
        <div>
          <label>Hình ảnh:</label>
          <Upload
            multiple
            onChange={({ fileList }) => handleUploadChange(fileList)}
            beforeUpload={() => false} // Ngăn không cho tự động upload
          >
            <Button icon={<UploadOutlined />}>Chọn hình ảnh</Button>
          </Upload>
        </div>
        <Button type="primary" htmlType="submit">Lưu thay đổi</Button>
      </form>
    </div>
  );
};

export default EditRooms;
