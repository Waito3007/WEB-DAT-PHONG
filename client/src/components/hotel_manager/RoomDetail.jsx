import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { message, Spin, Typography, Form, Modal, Input, Button, Checkbox, Popconfirm, Upload } from 'antd';
import { PlusOutlined, UploadOutlined } from '@ant-design/icons';
import { useParams, useNavigate } from 'react-router-dom';

const { Title } = Typography;

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
  const [removedImages, setRemovedImages] = useState([]); // Thêm trạng thái để theo dõi hình ảnh bị xóa

  const fetchRoomDetail = async () => {
    setLoading(true); // Bắt đầu loading
    try {
      const response = await axios.get(`/api/room/${roomId}`, { withCredentials: true });
      setRoom(response.data);
    } catch (error) {
      message.error('Đã xảy ra lỗi khi lấy chi tiết phòng');
    } finally {
      setLoading(false); // Kết thúc loading
    }
  };

  useEffect(() => {
    fetchRoomDetail(); // Gọi hàm khi component mount
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
    try {
      const formData = new FormData();
      formData.append('type', values.type);
      formData.append('price', values.price);
      formData.append('availability', values.availability);
      
      fileList.forEach((file) => {
        formData.append('imageroom', file);
      });
      
      // Gửi danh sách hình ảnh đã xóa
      formData.append('removedImages', JSON.stringify(removedImages));

      await axios.put(`/api/room/${roomId}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        withCredentials: true,
      });
  
      message.success('Cập nhật phòng thành công!');
      setIsModalVisible(false);
      
      fetchRoomDetail(); // Gọi lại để cập nhật dữ liệu phòng

    } catch (error) {
      message.error('Đã xảy ra lỗi khi cập nhật phòng');
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
    // Xóa hình ảnh khỏi fileList
    setFileList((prev) => prev.filter((item) => item.uid !== file.uid));

    // Thêm hình ảnh vào danh sách removedImages
    setRemovedImages((prev) => [...prev, file.url]);

    // Gửi yêu cầu đến server để xóa hình ảnh khỏi cơ sở dữ liệu
    try {
        await axios.put(`/api/room/${roomId}/remove-image`, { imageUrl: file.url }, { withCredentials: true });
        message.success('Hình ảnh đã được xóa thành công');
    } catch (error) {
        message.error('Đã xảy ra lỗi khi xóa hình ảnh');
    }
};




  const uploadButton = (
    <Button icon={<UploadOutlined />}>Chọn ảnh</Button>
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
      <Title level={2} className="text-center text-blue-600 mb-4">{room.type}</Title>
      <p className="text-gray-600">Giá: {room.price} VND</p>
      <p className={room.availability ? 'text-green-500' : 'text-red-500'}>
        {room.availability ? 'Còn phòng' : 'Hết phòng'}
      </p>

      {room.imageroom && room.imageroom.length > 0 && (
        <div className="flex flex-wrap gap-4 mt-2">
          {room.imageroom.map((image, index) => (
            <img
              key={index}
              src={image}
              alt={`Phòng ${room.type}`}
              className="w-48 h-48 object-cover rounded-lg shadow-sm"
            />
          ))}
        </div>
      )}
    
      <Button type="primary" onClick={showModal} className="mt-4" loading={isUpdating}>
        {isUpdating ? 'Đang lưu...' : 'Chỉnh sửa'}
      </Button>

      <Popconfirm
        title="Bạn có chắc chắn muốn xóa phòng này không?"
        onConfirm={handleDelete}
        okText="Có"
        cancelText="Không"
      >
        <Button type="danger" className="mt-4 ml-4" loading={isDeleting}>
          {isDeleting ? 'Đang xóa...' : 'Xóa phòng'}
        </Button>
      </Popconfirm>

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
        beforeUpload={() => false} // Ngăn chặn upload tự động
        onChange={handleImageChange}
        onRemove={(file) => handleRemoveImage(file)} // Gọi hàm xử lý xóa hình ảnh
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
</Modal>

    </div>
  );
};

export default RoomDetail;
