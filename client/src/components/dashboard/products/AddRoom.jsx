import React, { useState } from 'react';
import axios from 'axios';
import { Form, Button, message, InputNumber, Switch, Upload, Spin, Typography, Select, Modal } from 'antd'; 
import { UploadOutlined } from '@ant-design/icons';

const { Title } = Typography;
const { Option } = Select;

const AddRoom = ({ visible, onClose, hotelId }) => {
  const [loading, setLoading] = useState(false);
  const [form] = Form.useForm(); // Tạo instance của form

  const handleAddRoom = async (values) => {
    const { type, price, remainingRooms, availability, imageroom } = values;

    setLoading(true);
    const formData = new FormData();
    formData.append('type', type);
    formData.append('price', price);
    formData.append('availability', availability);
    formData.append('remainingRooms', remainingRooms);

    imageroom.forEach((file) => {
      formData.append('imageroom', file.originFileObj);
    });

    try {
      const response = await axios.post(`/api/room/${hotelId}/add-room`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        withCredentials: true,
      });

      message.success(response.data.msg || 'Phòng đã được thêm thành công');
      onClose(); // Đóng modal sau khi thêm phòng thành công
      form.resetFields(); // Đặt lại form
    } catch (error) {
      console.error('Lỗi khi thêm phòng:', error.response?.data);
      message.error(error.response?.data?.msg || 'Đã xảy ra lỗi khi thêm phòng');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      title="Thêm Phòng"
      visible={visible}
      onCancel={onClose}
      footer={null} 
    >
      <div className="max-w-lg mx-auto p-6 bg-white shadow-md rounded-md">
        <Title level={3} className="text-center mb-4">Thêm Phòng</Title>
        <Form 
          layout="vertical" 
          form={form} 
          onFinish={handleAddRoom} // Sử dụng giá trị form trực tiếp khi submit
          initialValues={{
            availability: true, // Giá trị mặc định cho switch
            remainingRooms: 0,  // Giá trị mặc định cho số lượng phòng còn lại
          }}
        >
          <Form.Item 
            label="Loại Phòng" 
            name="type" 
            rules={[{ required: true, message: 'Vui lòng chọn loại phòng!' }]}
          >
            <Select placeholder="Chọn loại phòng">
              <Option value="1 phòng 1 người">1 phòng 1 người</Option>
              <Option value="1 phòng 2 người">1 phòng 2 người</Option>
              <Option value="2 phòng 2 người">2 phòng 2 người</Option>
              <Option value="2 phòng 4 người">2 phòng 4 người</Option>
            </Select>
          </Form.Item>

          <Form.Item 
            label="Giá Phòng" 
            name="price" 
            rules={[{ required: true, message: 'Vui lòng nhập giá phòng!' }]}
          >
            <InputNumber
              min={0}
              className="w-full rounded-lg"
              placeholder="Nhập giá phòng"
            />
          </Form.Item>

          <Form.Item 
            label="Số phòng còn lại" 
            name="remainingRooms"
            rules={[{ required: true, message: 'Vui lòng nhập số phòng còn lại!' }]}
          >
            <InputNumber
              min={0}
              className="w-full rounded-lg"
              placeholder="Nhập số phòng còn lại"
            />
          </Form.Item>

          <Form.Item 
            label="Tình Trạng" 
            name="availability" 
            valuePropName="checked"
          >
            <Switch
              checkedChildren="Có sẵn"
              unCheckedChildren="Hết phòng"
              className="ml-2"
            />
          </Form.Item>

          <Form.Item 
            label="Ảnh Phòng" 
            name="imageroom"
            valuePropName="fileList"
            getValueFromEvent={(e) => Array.isArray(e) ? e : e && e.fileList}
          >
            <Upload
              listType="picture"
              beforeUpload={() => false} // Ngăn upload tự động
              multiple // Cho phép chọn nhiều ảnh
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
    </Modal>
  );
};

export default AddRoom;
