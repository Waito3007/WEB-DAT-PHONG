import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { message, Input, Button, Upload, Typography, Form } from 'antd';
import { UploadOutlined } from '@ant-design/icons';
import { useParams } from 'react-router-dom';

const { Title } = Typography;

const EditRoom = () => {
  const { roomId } = useParams(); // Lấy roomId từ URL
  const [loading, setLoading] = useState(true);
  const [form] = Form.useForm(); // Form cho việc chỉnh sửa
  const [imageList, setImageList] = useState([]);

  useEffect(() => {
    const fetchRoom = async () => {
      try {
        const response = await axios.get(`/api/room/${hotelId}/rooms/${roomId}`, { withCredentials: true });
        const { type, price, availability, imageroom } = response.data;
        form.setFieldsValue({ type, price, availability });
        setImageList(imageroom);
        setLoading(false);
      } catch (error) {
        console.error('Lỗi khi lấy thông tin phòng:', error);
        message.error('Đã xảy ra lỗi khi lấy thông tin phòng');
        setLoading(false);
      }
    };

    fetchRoom();
  }, [roomId, form]);

  const handleUploadChange = (fileList) => {
    const newImages = fileList.map(file => file.originFileObj);
    setImageList(newImages);
  };

  const handleSave = async (values) => {
    try {
      // Upload images to server
      const uploadPromises = imageList.map((file) => {
        const formData = new FormData();
        formData.append('file', file);
        return axios.post('/api/upload', formData, { withCredentials: true });
      });

      const uploadResponses = await Promise.all(uploadPromises);
      const imageUrls = uploadResponses.map(res => res.data.url);

      const updatedRoomData = {
        ...values,
        imageroom: imageUrls,
      };

      await axios.put(`/api/room/${roomId}`, updatedRoomData, { withCredentials: true });
      message.success('Chỉnh sửa phòng thành công');
    } catch (error) {
      console.error('Lỗi khi chỉnh sửa phòng:', error);
      message.error('Đã xảy ra lỗi khi chỉnh sửa phòng');
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="max-w-4xl mx-auto p-5">
      <Title level={2}>Chỉnh Sửa Phòng</Title>
      <Form
        form={form}
        layout="vertical"
        onFinish={handleSave}
      >
        <Form.Item
          label="Loại phòng"
          name="type"
          rules={[{ required: true, message: 'Vui lòng nhập loại phòng' }]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          label="Giá"
          name="price"
          rules={[{ required: true, message: 'Vui lòng nhập giá phòng' }]}
        >
          <Input type="number" />
        </Form.Item>

        <Form.Item
          label="Còn phòng"
          name="availability"
          valuePropName="checked"
        >
          <Input type="checkbox" />
        </Form.Item>

        <Form.Item label="Hình ảnh">
          <Upload
            multiple
            onChange={({ fileList }) => handleUploadChange(fileList)}
            beforeUpload={() => false} // Ngăn không cho tự động upload
          >
            <Button icon={<UploadOutlined />}>Chọn hình ảnh</Button>
          </Upload>
        </Form.Item>

        <Button type="primary" htmlType="submit">Lưu thay đổi</Button>
      </Form>
    </div>
  );
};

export default EditRoom;
