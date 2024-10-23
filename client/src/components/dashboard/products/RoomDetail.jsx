import React, { useState, useEffect } from 'react'; 
import { Button, Form, Input, Image, Modal, Spin, Typography } from 'antd';
import axios from 'axios';

const { Text } = Typography;

const RoomDetail = ({ roomId, visible, onClose }) => {
  const [room, setRoom] = useState(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [form] = Form.useForm();

  const fetchRoomDetails = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`/api/room/${roomId}`);
      setRoom(response.data);
      form.setFieldsValue(response.data); // Đặt giá trị cho form từ dữ liệu phòng
    } catch (error) {
      console.error('Error fetching room details:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (roomId && visible) {
      fetchRoomDetails();
    }
  }, [roomId, visible]);

  const handleEdit = async () => {
    try {
      await axios.put(`/api/room/${roomId}`, form.getFieldsValue());
      setEditing(false);
      fetchRoomDetails(); // Tải lại thông tin phòng sau khi chỉnh sửa
    } catch (error) {
      console.error('Error updating room:', error);
    }
  };

  const handleDelete = async () => {
    Modal.confirm({
      title: 'Bạn có chắc chắn muốn xóa phòng này?',
      onOk: async () => {
        try {
          await axios.delete(`/api/room/${roomId}`);
          onClose(); // Đóng modal khi xóa thành công
        } catch (error) {
          console.error('Error deleting room:', error);
        }
      },
    });
  };

  if (loading) return <Spin tip="Đang tải thông tin phòng..." />;

  if (!room) return <Text type="secondary">Không tìm thấy phòng.</Text>;

  return (
    <div>
      <h2>Thông tin phòng</h2>
      <Image
        width={200}
        height={200}
        src={room.imageroom.length > 0 ? room.imageroom[0] : ''}
        alt="Room"
        style={{ borderRadius: '8px', marginBottom: '16px' }}
      />
      <Form form={form} layout="vertical" style={{ marginBottom: '16px' }}>
        <Form.Item label="Loại phòng" name="type">
          <Input disabled={!editing} />
        </Form.Item>
        <Form.Item label="Giá" name="price">
          <Input type="number" disabled={!editing} />
        </Form.Item>
        <Form.Item label="Số phòng trống" name="remainingRooms">
          <Input type="number" disabled={!editing} />
        </Form.Item>
      </Form>
      <div>
        {editing ? (
          <>
            <Button type="primary" onClick={handleEdit}>Lưu</Button>
            <Button style={{ marginLeft: '8px' }} onClick={() => setEditing(false)}>Hủy</Button>
          </>
        ) : (
          <>
            <Button type="primary" onClick={() => setEditing(true)}>Chỉnh sửa</Button>
            <Button style={{ marginLeft: '8px' }} danger onClick={handleDelete}>Xóa</Button>
          </>
        )}
      </div>
    </div>
  );
};

export default RoomDetail;
