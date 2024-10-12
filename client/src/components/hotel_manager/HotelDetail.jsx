import React, { useEffect, useCallback, useState } from 'react';
import axios from 'axios';
import { Typography, message, Spin, Button, Modal, Input, Upload, Form } from 'antd';
import { useParams } from 'react-router-dom';
import {  UploadOutlined } from '@ant-design/icons';

const { Title, Paragraph } = Typography;

const HotelDetail = () => {
  const { hotelId } = useParams(); // Lấy hotelId từ URL
  const [hotel, setHotel] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isUpdating, setIsUpdating] = useState(false); // Loading khi cập nhật
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [fileList, setFileList] = useState([]);
  const [removedImages, setRemovedImages] = useState([]);
  const [form] = Form.useForm(); // Form cho việc chỉnh sửa

  const fetchHotel = useCallback(async () => {
    setLoading(true);
    try {
      const response = await axios.get(`/api/hotel/${hotelId}`, { withCredentials: true });
      setHotel(response.data);
      setLoading(false);
    } catch (error) {
      console.error('Lỗi khi lấy thông tin khách sạn:', error.response?.data);
      message.error('Đã xảy ra lỗi khi lấy thông tin khách sạn');
      setLoading(false);
    }
  }, [hotelId]); // Thêm hotelId vào dependency array

  useEffect(() => {
    fetchHotel();
  }, [fetchHotel]); 

  // Hiển thị Modal khi nhấn nút Chỉnh sửa
  const showModal = () => {
    setIsModalVisible(true);
    form.setFieldsValue({
      name: hotel.name,
      location: hotel.location,
      description: hotel.description,
    });
    setFileList(hotel.imagehotel.map((url, index) => ({
      uid: index,
      name: `Image-${index}`,
      status: 'done',
      url,
    })));
    setRemovedImages([]);
  };

  const handleImageChange = ({ fileList: newFileList }) => {
    setFileList(newFileList.map(file => file.originFileObj || file));
  };

  const handleRemoveImage = async (file) => {
    setFileList((prev) => prev.filter((item) => item.uid !== file.uid));
    setRemovedImages((prev) => [...prev, file.url]);

    try {
      await axios.put(`/api/hotel/${hotelId}/remove-image`, { imageUrl: file.url }, { withCredentials: true });
      message.success('Hình ảnh đã được xóa thành công');
    } catch (error) {
      message.error('Đã xảy ra lỗi khi xóa hình ảnh');
    }
  };

  const uploadButton = (
    <Button icon={<UploadOutlined />} className="bg-blue-500 text-white hover:bg-blue-600">
      Chọn ảnh
    </Button>
  );

  const handleSave = async (values) => {
    setIsUpdating(true); // Bật chế độ loading khi bắt đầu lưu
    try {
      const formData = new FormData();
      formData.append('name', values.name);
      formData.append('location', values.location);
      formData.append('description', values.description);

      fileList.forEach((file) => {
        formData.append('imagehotel', file);
      });

      formData.append('removedImages', JSON.stringify(removedImages));

      await axios.put(`/api/hotel/${hotelId}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        withCredentials: true,
      });

      message.success('Cập nhật thông tin khách sạn thành công!');
      setIsModalVisible(false);
      fetchHotel();
    } catch (error) {
      message.error('Đã xảy ra lỗi khi cập nhật khách sạn');
    } finally {
      setIsUpdating(false); // Tắt chế độ loading sau khi lưu xong
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Spin size="large" tip="Đang tải thông tin khách sạn..." />
      </div>
    );
  }

  if (!hotel) {
    return (
      <div className="flex justify-center items-center h-screen">
        <p className="text-xl text-gray-700">Không tìm thấy thông tin khách sạn. Vui lòng thử lại sau.</p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-5 bg-white rounded-lg shadow-lg mt-10 animate__animated animate__fadeIn">
      <Title level={2} className="text-center text-gray-800 mb-6">
        {hotel.name}
      </Title>
      <div className="space-y-4">
        <Paragraph className="text-lg text-gray-600">
          <strong className="text-gray-800">Địa chỉ:</strong> {hotel.location}
        </Paragraph>
        <Paragraph className="text-lg text-gray-600">
          <strong className="text-gray-800">Mô tả:</strong> {hotel.description}
        </Paragraph>
        {hotel.imagehotel.length > 0 && (
          <div className="grid grid-cols-2 gap-4 mt-4">
            {hotel.imagehotel.map((image, index) => (
              <img
                key={index}
                src={image}
                alt={`Hình ảnh khách sạn ${hotel.name} ${index + 1}`}
                className="w-full h-40 object-cover rounded-lg shadow-md transform transition-transform hover:scale-105"
              />
            ))}
          </div>
        )}
      </div>

      {/* Nút chỉnh sửa */}
      <div className="mt-6 flex justify-center">
        <Button
          type="primary"
          size="large"
          onClick={showModal}
          className="bg-blue-600 hover:bg-blue-500 text-white font-semibold py-2 px-5 rounded-lg transition-transform transform hover:scale-105"
        >
          Chỉnh sửa
        </Button>
      </div>

      {/* Modal chỉnh sửa */}
      <Modal
        title="Chỉnh sửa thông tin khách sạn"
        visible={isModalVisible}
        onCancel={() => setIsModalVisible(false)}
        onOk={() => form.submit()}
        okText={isUpdating ? <Spin size="small" /> : 'Lưu'} // Thêm loading vào nút Lưu
        cancelText="Hủy"
        okButtonProps={{ disabled: isUpdating }} // Khóa nút khi đang xử lý
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={handleSave}
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
          <Form.Item label="Hình ảnh phòng">
            <Upload
              listType="picture"
              fileList={fileList}
              beforeUpload={() => false}
              onChange={handleImageChange}
              onRemove={handleRemoveImage}
            >
              {uploadButton}
            </Upload>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default HotelDetail;
