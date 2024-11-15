// EditHotelModal.jsx
import { useState, useEffect } from 'react';
import { Modal, Form, Input, Upload, Button, Rate, notification } from 'antd';
import axios from 'axios';
import { UploadOutlined } from '@ant-design/icons';

const EditHotelModal = ({ hotel, isVisible, onClose, onUpdate }) => {
  const [form] = Form.useForm();
  const [fileList, setFileList] = useState([]);
  const [removedImages, setRemovedImages] = useState([]);
  const [loading, setLoading] = useState(false);  // State to manage loading status

  useEffect(() => {
    if (hotel) {
      form.setFieldsValue({
        name: hotel.name,
        location: hotel.location,
        description: hotel.description,
        stars: hotel.stars,
      });
      setFileList(hotel.imagehotel.map(url => ({ uid: url, url })));
    }
  }, [hotel, form]);

  const handleUpload = ({ fileList }) => {
    setFileList(fileList);
  };

  const handleRemoveImage = async (file) => {
    if (file.uid) {
      setFileList(prev => prev.filter(item => item.uid !== file.uid));
      setRemovedImages(prev => [...prev, file.url]);

      try {
        await axios.put(`/api/hotel/${hotel._id}/remove-image`, { imageUrl: file.url }, { withCredentials: true });
      } catch (error) {
        notification.error({
          message: "Xóa ảnh thất bại.",
        });
      }
    }
  };

  const handleSave = async (values) => {
    const formData = new FormData();
    formData.append('name', values.name);
    formData.append('location', values.location);
    formData.append('description', values.description);
    formData.append('stars', values.stars);
    
    fileList.forEach((file) => {
      formData.append('imagehotel', file.originFileObj || file);
    });
    
    formData.append('removedImages', JSON.stringify(removedImages));

    setLoading(true);  // Start loading before the request

    try {
        await axios.put(`/api/hotel/${hotel._id}`, formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
          withCredentials: true,
        });
  
        notification.success({
          message: "Chỉnh Sửa Khách Sạn Thành Công.",
          description: "Thông tin chỉnh sửa đã được lưu.",
        });
        onUpdate();  // Notify the parent component to refresh the list
        onClose();  // Close the modal
      } catch (error) {
        notification.error({
          message: "Chỉnh Sửa Khách Sạn Thất Bại.",
          description: "Vui lòng thử lại sau.",
        });
         } finally {
        setLoading(false);  // Stop loading after the request is completed
      }
    };

  return (
    <Modal
      visible={isVisible}
      title="Chỉnh sửa khách sạn"
      onCancel={onClose}
      footer={[
        <Button key="cancel" onClick={onClose}>
          Hủy
        </Button>,
         <Button key="submit" type="primary" onClick={() => form.submit()} loading={loading}>
         Lưu
       </Button>,
      ]}
    >
      <Form form={form} onFinish={handleSave}>
        <Form.Item label="Tên khách sạn" name="name" rules={[{ required: true, message: 'Vui lòng nhập tên khách sạn!' }]}>
          <Input />
        </Form.Item>
        <Form.Item label="Vị trí" name="location" rules={[{ required: true, message: 'Vui lòng nhập vị trí!' }]}>
          <Input />
        </Form.Item>
        <Form.Item label="Mô tả" name="description">
          <Input.TextArea rows={4} />
        </Form.Item>
        <Form.Item label="Xếp hạng" name="stars" rules={[{ required: true, message: 'Vui lòng chọn xếp hạng!' }]}>
          <Rate />
        </Form.Item>
        <Form.Item label="Ảnh" valuePropName="fileList">
          <Upload
            name="imagehotel"
            action="/upload"
            listType="picture-card"
            fileList={fileList}
            onChange={handleUpload}
            onRemove={handleRemoveImage}
            accept="image/*"
          >
            <div>
              <UploadOutlined />
              <div>Chọn ảnh</div>
            </div>
          </Upload>
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default EditHotelModal;
