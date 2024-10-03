import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { List, Typography, message, Spin, Button, Modal, Input } from 'antd';
import { Link } from 'react-router-dom';

const { Title } = Typography;

const MyHotels = () => {
  const [hotels, setHotels] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedHotelId, setSelectedHotelId] = useState(null);
  const [password, setPassword] = useState('');

  useEffect(() => {
    const fetchHotels = async () => {
      try {
        const response = await axios.get('/api/hotel/myhotels', { withCredentials: true });
        setHotels(response.data);
        setLoading(false);
      } catch (error) {
        console.error('Lỗi khi lấy danh sách khách sạn:', error.response?.data);
        message.error('Đã xảy ra lỗi khi lấy danh sách khách sạn');
        setLoading(false);
      }
    };

    fetchHotels();
  }, []);

  const handleEdit = (hotelId) => {
    window.location.href = `/hotels/edit/${hotelId}`;
  };

  const showDeleteModal = (hotelId) => {
    setSelectedHotelId(hotelId);
    setIsModalVisible(true);
  };

  const handleDeleteConfirm = async () => {
    try {
      await axios.delete(`/api/hotel/${selectedHotelId}`, {
        withCredentials: true,
        data: { password }, // Gửi mật khẩu kèm theo yêu cầu xóa
      });
      message.success('Xóa khách sạn thành công');
      setHotels(hotels.filter(hotel => hotel._id !== selectedHotelId));
    } catch (error) {
      console.error('Lỗi khi xóa khách sạn:', error.response?.data);
      message.error('Đã xảy ra lỗi khi xóa khách sạn');
    } finally {
      setIsModalVisible(false);
      setPassword(''); // Xóa mật khẩu sau khi thực hiện xóa
    }
  };

  const handleAddRoom = (hotelId) => {
    window.location.href = `/hotels/${hotelId}/add-room`;
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center">
        <Spin size="large" tip="Đang tải danh sách khách sạn..." />
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-5">
      <Title level={2}>Danh Sách Khách Sạn Của Bạn</Title>
      <List
        itemLayout="vertical"
        dataSource={hotels}
        renderItem={(hotel) => (
          <List.Item key={hotel._id} className="border-b py-4">
            <div className="flex justify-between items-center">
              <List.Item.Meta
                title={
                  <Link to={`/hotels/${hotel._id}`} className="text-xl font-semibold">
                    {hotel.name}
                  </Link>
                }
              />
              {/* Nút nằm bên phải */}
              <div className="flex space-x-2">
                <Button onClick={() => handleEdit(hotel._id)} type="primary" size="small">
                  Chỉnh sửa
                </Button>
                <Button onClick={() => showDeleteModal(hotel._id)} type="danger" size="small">
                  Xóa
                </Button>
                <Button onClick={() => handleAddRoom(hotel._id)} type="default" size="small">
                  +
                </Button>
              </div>
            </div>
          </List.Item>
        )}
      />

      {/* Modal xác nhận xóa */}
      <Modal
        title="Xác nhận xóa khách sạn"
        visible={isModalVisible}
        onOk={handleDeleteConfirm}
        onCancel={() => setIsModalVisible(false)}
      >
        <p>Nhập mật khẩu của bạn để xác nhận xóa khách sạn này:</p>
        <Input.Password
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Nhập mật khẩu"
        />
      </Modal>
    </div>
  );
};

export default MyHotels;
