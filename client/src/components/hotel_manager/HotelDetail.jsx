import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Typography, message, Spin, Button, Modal, Input, Form } from 'antd';
import { useParams } from 'react-router-dom';

const { Title, Paragraph } = Typography;

const HotelDetail = () => {
  const { hotelId } = useParams(); // Lấy hotelId từ URL
  const [hotel, setHotel] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [form] = Form.useForm(); // Form cho việc chỉnh sửa

  useEffect(() => {
    const fetchHotel = async () => {
      try {
        const response = await axios.get(`/api/hotel/${hotelId}`, { withCredentials: true });
        setHotel(response.data);
        setLoading(false);
      } catch (error) {
        console.error('Lỗi khi lấy thông tin khách sạn:', error.response?.data);
        message.error('Đã xảy ra lỗi khi lấy thông tin khách sạn');
        setLoading(false);
      }
    };

    fetchHotel();
  }, [hotelId]);

  // Hiển thị Modal khi nhấn nút Chỉnh sửa
  const showModal = () => {
    setIsModalVisible(true);
    form.setFieldsValue({ // Đặt giá trị mặc định cho form
      name: hotel.name,
      location: hotel.location,
      description: hotel.description,
    });
  };

  // Xử lý khi nhấn nút Lưu trong modal
  const handleSave = async (values) => {
    try {
      const response = await axios.put(`/api/hotel/${hotelId}`, values, { withCredentials: true });
      message.success('Thông tin khách sạn đã được cập nhật');
      setHotel(response.data); // Cập nhật lại thông tin khách sạn
      setIsModalVisible(false); // Đóng modal
    } catch (error) {
      console.error('Lỗi khi cập nhật khách sạn:', error);
      message.error('Đã xảy ra lỗi khi cập nhật thông tin khách sạn');
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center">
        <Spin size="large" tip="Đang tải thông tin khách sạn..." />
      </div>
    );
  }

  if (!hotel) {
    return (
      <div className="flex justify-center items-center">
        <p>Không tìm thấy thông tin khách sạn. Vui lòng thử lại sau.</p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-5">
      <Title level={2}>{hotel.name}</Title>
      <Paragraph><strong>Địa chỉ:</strong> {hotel.location}</Paragraph>
      <Paragraph><strong>Mô tả:</strong> {hotel.description}</Paragraph>
      {hotel.imagehotel.length > 0 && (
        <div className="flex space-x-2">
          {hotel.imagehotel.map((image, index) => (
            <img
              key={index}
              src={image}
              alt={`Hình ảnh khách sạn ${hotel.name} ${index + 1}`}
              className="w-24 h-16 object-cover"
            />
          ))}
        </div>
      )}

      {/* Nút chỉnh sửa */}
      <Button type="primary" onClick={showModal}>
        Chỉnh sửa
      </Button>

      {/* Modal chỉnh sửa */}
      <Modal
        title="Chỉnh sửa thông tin khách sạn"
        visible={isModalVisible}
        onCancel={() => setIsModalVisible(false)}
        onOk={() => form.submit()} // Gửi form khi nhấn OK
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={handleSave} // Hàm xử lý khi nhấn Lưu
        >
          <Form.Item
            label="Tên khách sạn"
            name="name"
            rules={[{ required: true, message: 'Vui lòng nhập tên khách sạn' }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            label="Địa chỉ"
            name="location"
            rules={[{ required: true, message: 'Vui lòng nhập địa chỉ khách sạn' }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            label="Mô tả"
            name="description"
          >
            <Input.TextArea rows={4} />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default HotelDetail;
