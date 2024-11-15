// src/components/AddHotelModal.jsx

import React, { useState } from 'react';
import { Modal, Input, Button, notification, Form, Rate, Upload } from 'antd';
import { UploadOutlined } from '@ant-design/icons';
import axios from 'axios';

const AddHotelModal = ({ visible, onCancel, onAddHotel }) => {
  const [loading, setLoading] = useState(false);
  const [fileList, setFileList] = useState([]);
  const [addHotelForm] = Form.useForm();

  // Xử lý khi người dùng tải ảnh lên
  const handleUpload = ({ fileList }) => {
    setFileList(fileList);
  };

  const handleAddHotel = async (values) => {
    setLoading(true);
    const formData = new FormData();
    formData.append('name', values.name);
    formData.append('location', values.location);
    formData.append('description', values.description);
    formData.append('stars', values.stars);

    // Đính kèm các file ảnh
    fileList.forEach(file => {
      formData.append('imagehotel', file.originFileObj);
    });

    try {
      const response = await axios.post('/api/hotel/addhotel', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        withCredentials: true,
      });

      if (response.status === 201) {
        notification.success({
          message: "Thêm Khách Sạn Thành Công.",
          description: "Vui lòng thêm phòng cho khách sạn.",
        });        
        onAddHotel(); // Gọi callback để refresh danh sách khách sạn
        onCancel(); // Đóng modal
      }
    } catch (error) {
      notification.error({
        message: "Thêm Khách Sạn Thất Bại.",
        description: "Vui lòng thử lại sau.",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      title="Thêm Khách Sạn"
      visible={visible}
      onCancel={onCancel}
      footer={null}
    >
      <Form form={addHotelForm} layout="vertical" onFinish={handleAddHotel}>
        <Form.Item
          name="name"
          label="Tên khách sạn"
          rules={[{ required: true, message: 'Vui lòng nhập tên khách sạn!' }]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          name="location"
          label="Vị trí"
          rules={[{ required: true, message: 'Vui lòng nhập vị trí!' }]}
        >
          <Input />
        </Form.Item>
        <Form.Item name="description" label="Mô tả">
          <Input.TextArea rows={4} />
        </Form.Item>
        <Form.Item
          name="stars"
          label="Xếp Hạng"
          rules={[{ required: true, message: 'Vui lòng chọn xếp hạng!' }]}
        >
          <Rate allowHalf />
        </Form.Item>
        <Form.Item label="Hình ảnh">
          <Upload
            listType="picture"
            fileList={fileList}
            onChange={handleUpload}
            beforeUpload={() => false} // Ngừng tự động tải lên
            multiple
          >
            <Button icon={<UploadOutlined />}>Tải lên</Button>
          </Upload>
        </Form.Item>
        <Form.Item>
          <Button type="primary" htmlType="submit" loading={loading}>
            Thêm Khách Sạn
          </Button>
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default AddHotelModal;
