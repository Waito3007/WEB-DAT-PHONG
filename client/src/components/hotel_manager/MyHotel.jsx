import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { List, Typography, message, Spin, Button, Modal, Input } from 'antd';
import { Link, useNavigate } from 'react-router-dom';

const { Title } = Typography;

const MyHotels = () => {
  const [hotels, setHotels] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedHotelId, setSelectedHotelId] = useState(null);
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

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
    window.location.href = `/hotels/${hotelId}`;
  };

  const showDeleteModal = (hotelId) => {
    setSelectedHotelId(hotelId);
    setIsModalVisible(true);
  };

  const handleDeleteConfirm = async () => {
    try {
      await axios.delete(`/api/hotel/${selectedHotelId}`, {
        withCredentials: true,
        data: { password },
      });
      message.success('Xóa khách sạn thành công');
      setHotels(hotels.filter(hotel => hotel._id !== selectedHotelId));
    } catch (error) {
      console.error('Lỗi khi xóa khách sạn:', error.response?.data);
      message.error('Đã xảy ra lỗi khi xóa khách sạn');
    } finally {
      setIsModalVisible(false);
      setPassword('');
    }
  };

  const handleAddRoom = (hotelId) => {
    navigate(`/hotels/${hotelId}/add-room`);
  };

  const handleViewRooms = (hotelId) => {
    navigate(`/hotels/${hotelId}/rooms`);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Spin size="large" tip="Đang tải danh sách khách sạn..." />
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-5 bg-white rounded-lg shadow-md mt-10 animate__animated animate__fadeIn">
      <Title level={2} className="text-center text-gray-800 mb-6">
        Danh Sách Khách Sạn Của Bạn
      </Title>
      <List
        itemLayout="vertical"
        dataSource={hotels}
        renderItem={(hotel) => (
          <List.Item key={hotel._id} className="border-b py-4 flex flex-col sm:flex-row justify-between items-center">
            <List.Item.Meta
              title={
                <Link
                  to={`/hotels/${hotel._id}`}
                  className="text-xl font-semibold text-blue-600 hover:underline"
                >
                  {hotel.name}
                </Link>
              }
            />
            <div className="flex space-x-3 mt-3 sm:mt-0">
              <Button
                onClick={() => handleEdit(hotel._id)}
                className="bg-blue-500 hover:bg-blue-400 text-white font-semibold py-1 px-3 rounded transition ease-in-out duration-200 transform hover:scale-105"
              >
                Chỉnh sửa
              </Button>
              <Button
                onClick={() => showDeleteModal(hotel._id)}
                className="bg-red-500 hover:bg-red-400 text-white font-semibold py-1 px-3 rounded transition ease-in-out duration-200 transform hover:scale-105"
              >
                Xóa
              </Button>
              <Button
                onClick={() => handleAddRoom(hotel._id)}
                className="bg-green-500 hover:bg-green-400 text-white font-semibold py-1 px-3 rounded transition ease-in-out duration-200 transform hover:scale-105"
              >
                +
              </Button>
              <Button
                onClick={() => handleViewRooms(hotel._id)}
                className="bg-yellow-500 hover:bg-yellow-400 text-white font-semibold py-1 px-3 rounded transition ease-in-out duration-200 transform hover:scale-105"
              >
                Xem phòng
              </Button>
            </div>
          </List.Item>
        )}
      />

      <Modal
        title="Xác nhận xóa khách sạn"
        visible={isModalVisible}
        onOk={handleDeleteConfirm}
        onCancel={() => setIsModalVisible(false)}
        okText="Xóa"
        cancelText="Hủy"
      >
        <p className="text-gray-700">Nhập mật khẩu của bạn để xác nhận xóa khách sạn này:</p>
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
