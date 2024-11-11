import React, { useEffect, useState, useCallback } from 'react';
import { Drawer, Button, Form, Input, Checkbox, Upload, message, Select, Spin } from 'antd';
import axios from 'axios';

const { Option } = Select; // Khai báo biến Option để sử dụng trong Select

const EditRoomDrawer = ({ visible, onClose, roomId, fetchRooms }) => {
  const [form] = Form.useForm();
  const [fileList, setFileList] = useState([]);
  const [isUpdating, setIsUpdating] = useState(false);
  const [removedImages, setRemovedImages] = useState([]);
  const [roomData, setRoomData] = useState(null);

  // Hàm lấy thông tin phòng để hiển thị
  const fetchRoomData = useCallback(async () => {
    if (!roomId) {
      message.error('ID phòng không hợp lệ.');
      return;
    }
    
    try {
      const response = await axios.get(`/api/room/${roomId}`);
      setRoomData(response.data);
      form.setFieldsValue({
        type: response.data.type,
        price: response.data.price,
        availability: response.data.availability,
        remainingRooms: response.data.remainingRooms,
      });
      setFileList((response.data.imageroom || []).map((url, index) => ({
        uid: index.toString(),
        name: `Image-${index}`,
        status: 'done',
        url,
      })));
      setRemovedImages([]);
    } catch (error) {
      console.error('Error fetching room data:', error);
      message.error('Lỗi khi tải dữ liệu phòng.');
    }
  }, [roomId, form]); // Đảm bảo rằng hàm fetchRoomData chỉ thay đổi khi roomId hoặc form thay đổi.

  useEffect(() => {
    if (roomId && visible) {
      fetchRoomData();
    }
  }, [roomId, visible, fetchRoomData]); // Thêm fetchRoomData vào dependency array

  // Hàm xử lý lưu thông tin phòng
  const handleSave = async (values) => {
    setIsUpdating(true);
    try {
      const formData = new FormData();
      formData.append('type', values.type);
      formData.append('price', values.price);
      formData.append('availability', values.availability);
      formData.append('remainingRooms', values.remainingRooms);

      fileList.forEach((file) => {
        formData.append('imageroom', file);
      });

      formData.append('removedImages', JSON.stringify(removedImages));

      await axios.put(`/api/room/${roomId}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        withCredentials: true,
      });

      message.success('Cập nhật phòng thành công!');
      fetchRooms();
      onClose(); // Đóng drawer sau khi cập nhật thành công
    } catch (error) {
      message.error('Đã xảy ra lỗi khi cập nhật phòng');
    } finally {
      setIsUpdating(false);
    }
  };

  // Chỉnh sửa và xóa ảnh
  const handleImageChange = ({ fileList: newFileList }) => {
    setFileList(newFileList.map(file => file.originFileObj || file));
  };

  const handleRemoveImage = async (file) => {
    setFileList((prev) => prev.filter((item) => item.uid !== file.uid));
    setRemovedImages((prev) => [...prev, file.url]);

    try {
      await axios.put(`/api/room/${roomId}/remove-image`, { imageUrl: file.url }, { withCredentials: true });
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
          <Form.Item label="Loại Phòng" name="type" required>
            <Select placeholder="Chọn loại phòng" required>
              <Option value="1 phòng 1 người">1 phòng 1 người</Option>
              <Option value="1 phòng 2 người">1 phòng 2 người</Option>
              <Option value="2 phòng 2 người">2 phòng 2 người</Option>
              <Option value="2 phòng 4 người">2 phòng 4 người</Option>
            </Select>
          </Form.Item>
          <Form.Item
            label="Giá"
            name="price"
            rules={[
              { required: true, message: 'Vui lòng nhập giá phòng' },
              { validator: (_, value) => value >= 0 ? Promise.resolve() : Promise.reject('Tiền không được nhỏ hơn 0') },
            ]}
          >
            <Input type="number" min={0} />
          </Form.Item>
          <Form.Item
            label="Phòng còn trống"
            name="remainingRooms"
            rules={[
              { required: true, message: 'Vui lòng nhập số lượng phòng còn trống' },
              { validator: (_, value) => value >= 0 ? Promise.resolve() : Promise.reject('Số lượng phòng còn trống không được nhỏ hơn 0') },
            ]}
          >
            <Input type="number" min={0} />
          </Form.Item>
          <Form.Item
            label="Tình trạng"
            name="availability"
            valuePropName="checked"
          >
            <Checkbox>Còn phòng</Checkbox>
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
            <Button type="primary" htmlType="submit" loading={isUpdating}>
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
