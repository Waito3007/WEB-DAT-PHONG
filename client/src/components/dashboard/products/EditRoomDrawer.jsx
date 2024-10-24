import React, { useEffect, useState } from 'react';
import { Drawer, Button, Form, Input, Checkbox, Upload, message, Spin } from 'antd';
import axios from 'axios';

const EditRoomDrawer = ({ visible, onClose, roomId, fetchRooms }) => {
  const [form] = Form.useForm();
  const [fileList, setFileList] = useState([]);
  const [isUpdating, setIsUpdating] = useState(false);
  const [removedImages, setRemovedImages] = useState([]);
  const [roomData, setRoomData] = useState(null);

  // Hàm lấy thông tin phòng để hiển thị
  const fetchRoomData = async () => {
    try {
      const response = await axios.get(`/api/room/${roomId}`);
      setRoomData(response.data);
      form.setFieldsValue({
        type: response.data.type,
        price: response.data.price,
        availability: response.data.availability,
      });
      setFileList(response.data.imageroom.map(url => ({ uid: url, name: url, url }))); // Giả sử imageroom là array URL
    } catch (error) {
      console.error('Error fetching room data:', error);
    }
  };

  useEffect(() => {
    if (roomId && visible) {
      fetchRoomData();
    }
  }, [roomId, visible]);

  // Hàm xử lý lưu thông tin phòng
  const handleSave = async (values) => {
    setIsUpdating(true);
    try {
      const updatedRoom = { ...values, imageroom: fileList.map(file => file.url) }; // Chỉ lưu URL hình ảnh
      await axios.put(`/api/room/${roomId}`, updatedRoom);
      message.success('Cập nhật phòng thành công');
      fetchRooms(); // Tải lại danh sách phòng
      onClose(); // Đóng drawer
    } catch (error) {
      console.error('Error updating room:', error);
      message.error('Cập nhật phòng không thành công');
    } finally {
      setIsUpdating(false);
    }
  };

  //chỉnh sửa và xóa ảnh
  const handleImageChange = ({ fileList: newFileList }) => {
    setFileList(newFileList.map(file => file.originFileObj || file));
  };

  const handleRemoveImage = async (file, roomId) => {
    setFileList((prev) => prev.filter((item) => item.uid !== file.uid));
    setRemovedImages((prev) => [...prev, file.url]);

    try {
      await axios.put(`/api/room/${roomId}/remove-image`, { imageUrl: file.url }, { withCredentials: true });
      message.success('Hình ảnh đã được xóa thành công');
    } catch (error) {
      message.error('Đã xảy ra lỗi khi xóa hình ảnh');
    }
  };

  const uploadButton = (
    <div>
      <Button>Chọn hình ảnh</Button>
    </div>
  );

  return (
    <Drawer
      title="Chỉnh sửa thông tin phòng"
      visible={visible}
      onClose={onClose}
      footer={null}
      width={520}
    >
      {roomData ? (
        <Form form={form} onFinish={handleSave}>
          <Form.Item
            label="Loại phòng"
            name="type"
            rules={[{ required: true, message: 'Vui lòng nhập loại phòng' }]}
          >
            <Input className="border-gray-300 rounded-lg" />
          </Form.Item>
          <Form.Item
            label="Giá"
            name="price"
            rules={[{ required: true, message: 'Vui lòng nhập giá phòng' }]}
          >
            <Input type="number" className="border-gray-300 rounded-lg" />
          </Form.Item>
          <Form.Item
            label="Tình trạng"
            name="availability"
            valuePropName="checked"
          >
            <Checkbox className="text-blue-600">Còn phòng</Checkbox>
          </Form.Item>
          <Form.Item label="Hình ảnh phòng">
            <Upload
              listType="picture"
              fileList={fileList}
              beforeUpload={() => false} // Ngăn không cho tự động upload
              onChange={handleImageChange}
              onRemove={handleRemoveImage}
            >
              {uploadButton}
            </Upload>
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit" loading={isUpdating} className="bg-blue-500 hover:bg-blue-600">
              {isUpdating ? 'Đang lưu...' : 'Lưu'}
            </Button>
          </Form.Item>
        </Form>
      ) : (
        <Spin tip="Đang tải thông tin phòng..." />
      )}
    </Drawer>
  );
};

export default EditRoomDrawer;
