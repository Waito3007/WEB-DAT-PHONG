import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { message, Spin, Typography, Form, Modal, Input, Button, Checkbox, Popconfirm, Upload, Card } from 'antd';
import { PlusOutlined, UploadOutlined } from '@ant-design/icons';
import { useParams, useNavigate } from 'react-router-dom';

const { Title, Text } = Typography;

const RoomDetail = () => {
  const { roomId } = useParams();
  const navigate = useNavigate();
  const [room, setRoom] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isUpdating, setIsUpdating] = useState(false); 
  const [isDeleting, setIsDeleting] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [form] = Form.useForm();
  const [fileList, setFileList] = useState([]); 
  const [removedImages, setRemovedImages] = useState([]);

  const fetchRoomDetail = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`/api/room/${roomId}`, { withCredentials: true });
      setRoom(response.data);
    } catch (error) {
      message.error('Đã xảy ra lỗi khi lấy chi tiết phòng');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRoomDetail();
  }, [roomId]);

  const showModal = () => {
    setIsModalVisible(true);
    form.setFieldsValue({
      type: room.type,
      price: room.price,
      availability: room.availability,
    });
    setFileList(room.imageroom.map((url, index) => ({
      uid: index,
      name: `Image-${index}`,
      status: 'done',
      url,
    })));
    setRemovedImages([]);
  };

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
      setIsModalVisible(false);
      fetchRoomDetail();
    } catch (error) {
      message.error('Đã xảy ra lỗi khi cập nhật phòng');
    } finally {
      setIsUpdating(false);
    }
  };

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      await axios.delete(`/api/room/${roomId}`, { withCredentials: true });
      message.success('Phòng đã được xóa thành công');
      navigate(`/myhotel`);
    } catch (error) {
      message.error('Đã xảy ra lỗi khi xóa phòng');
    } finally {
      setIsDeleting(false);
    }
  };

  
  
  const handleImageChange = ({ fileList: newFileList }) => {
    setFileList(newFileList.map(file => file.originFileObj || file));
  };

  const handleRemoveImage = async (file) => {
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
    <Button icon={<UploadOutlined />} className="bg-blue-500 text-white hover:bg-blue-600">
      Chọn ảnh
    </Button>
  );

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen bg-gray-100">
        <Spin size="large" tip="Đang tải chi tiết phòng..." />
      </div>
    );
  }

  if (!room) {
    return <p>Không tìm thấy phòng.</p>;
  }

  return (
    <div className="max-w-4xl mx-auto p-5 bg-white shadow-lg rounded-lg">
      <Card className="mb-4 shadow-lg rounded-lg">
        <Title level={2} className="text-center text-blue-600">{room.type}</Title>
        <Text className="block text-lg font-semibold">Giá: {room.price} VND</Text>
        <Text className={`block text-lg ${room.availability ? 'text-green-500' : 'text-red-500'}`}>
          {room.availability ? 'Còn phòng' : 'Hết phòng'}
        </Text>
      </Card>

      {room.imageroom && room.imageroom.length > 0 && (
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-4">
          {room.imageroom.map((image, index) => (
            <div key={index} className="relative">
              <img
                src={image}
                alt={`Phòng ${room.type}`}
                className="w-full h-48 object-cover rounded-lg shadow-md transition-transform transform hover:scale-105"
              />
            </div>
          ))}
        </div>
      )}
    
      <div className="flex space-x-4">
        <Button type="primary" onClick={showModal} loading={isUpdating} className="bg-green-500 hover:bg-green-600">
          {isUpdating ? 'Đang lưu...' : 'Chỉnh sửa'}
        </Button>

        <Popconfirm
          title="Bạn có chắc chắn muốn xóa phòng này không?"
          onConfirm={handleDelete}
          okText="Có"
          cancelText="Không"
        >
          <Button type="danger" loading={isDeleting} className="bg-red-500 hover:bg-red-600">
            {isDeleting ? 'Đang xóa...' : 'Xóa phòng'}
          </Button>
        </Popconfirm>
      </div>

      <Modal
        title="Chỉnh sửa thông tin phòng"
        visible={isModalVisible}
        onCancel={() => setIsModalVisible(false)}
        footer={null}
      >
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
              beforeUpload={() => false}
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
      </Modal>
    </div>
  );
};

export default RoomDetail;
