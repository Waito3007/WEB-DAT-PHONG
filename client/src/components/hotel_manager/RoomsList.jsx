import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { message, Spin, List, Typography, Button, Modal } from 'antd';
import { useParams } from 'react-router-dom';
import EditRoom from './EditRoom'; // Import component EditRoom

const { Title } = Typography;

const HotelRooms = () => {
  const { hotelId } = useParams();
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isEditModalVisible, setIsEditModalVisible] = useState(false);
  const [isDeleteModalVisible, setIsDeleteModalVisible] = useState(false);
  const [selectedRoomId, setSelectedRoomId] = useState(null);

  useEffect(() => {
    const fetchRooms = async () => {
      try {
        const response = await axios.get(`/api/room/${hotelId}/rooms`, { withCredentials: true });
        setRooms(response.data);
        setLoading(false);
      } catch (error) {
        console.error('Lỗi khi lấy danh sách phòng:', error.response?.data);
        message.error('Đã xảy ra lỗi khi lấy danh sách phòng');
        setLoading(false);
      }
    };

    fetchRooms();
  }, [hotelId]);

  // Hàm xóa phòng
  const handleDeleteRoom = async () => {
    try {
      await axios.delete(`/api/room/${selectedRoomId}`, { withCredentials: true });
      message.success('Phòng đã được xóa thành công');
      setRooms(rooms.filter(room => room._id !== selectedRoomId)); // Cập nhật danh sách phòng sau khi xóa
      setIsDeleteModalVisible(false); // Đóng modal xóa
      setSelectedRoomId(null);
    } catch (error) {
      console.error('Lỗi khi xóa phòng:', error.response?.data);
      message.error('Đã xảy ra lỗi khi xóa phòng');
    }
  };

  // Hàm chỉnh sửa phòng
  const handleEditRoom = (roomId) => {
    setSelectedRoomId(roomId);
    setIsEditModalVisible(true);
  };

  const handleEditModalClose = () => {
    setIsEditModalVisible(false);
    setSelectedRoomId(null);
    // Reload rooms after edit
    const fetchRooms = async () => {
      try {
        const response = await axios.get(`/api/room/${hotelId}/rooms`, { withCredentials: true });
        setRooms(response.data);
      } catch (error) {
        console.error('Lỗi khi lấy danh sách phòng:', error.response?.data);
      }
    };
    fetchRooms();
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen bg-gray-100">
        <Spin size="large" tip="Đang tải danh sách phòng..." />
      </div>
    );
  }

  return (
    <div className="h-screen overflow-y-auto bg-gray-100">
      <div className="max-w-4xl mx-auto p-5 bg-white shadow-lg rounded-lg">
        <Title level={2} className="text-center text-blue-600 mb-8">Danh Sách Phòng</Title>

        <List
          itemLayout="vertical"
          dataSource={rooms}
          renderItem={(room) => (
            <List.Item key={room._id} className="border-b py-4">
              <div className="flex justify-between items-center">
                <div>
                  <Title level={4} className="text-blue-500">{room.type}</Title>
                  <p className="text-gray-600">Giá: {room.price} VND</p>
                  <p className={room.availability ? 'text-green-500' : 'text-red-500'}>
                    {room.availability ? 'Còn phòng' : 'Hết phòng'}
                  </p>

                  {/* Hiển thị ảnh phòng */}
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
                </div>

                {/* Nút chỉnh sửa và xóa */}
                <div className="flex gap-4">
                  <Button type="primary" onClick={() => handleEditRoom(room._id)}>
                    Chỉnh sửa
                  </Button>
                  <Button type="danger" onClick={() => {
                    setSelectedRoomId(room._id);
                    setIsDeleteModalVisible(true);
                  }}>
                    Xóa
                  </Button>
                </div>
              </div>
            </List.Item>
          )}
        />

        {/* Modal chỉnh sửa phòng */}
        <Modal
          title="Chỉnh Sửa Phòng"
          visible={isEditModalVisible}
          onCancel={handleEditModalClose}
          footer={null}
        >
          {selectedRoomId && <EditRoom roomId={selectedRoomId} onClose={handleEditModalClose} />}
        </Modal>

        {/* Modal xác nhận xóa phòng */}
        <Modal
          title="Xác nhận xóa"
          visible={isDeleteModalVisible}
          onOk={handleDeleteRoom}
          onCancel={() => setIsDeleteModalVisible(false)}
        >
          <p>Bạn có chắc chắn muốn xóa phòng này?</p>
        </Modal>
      </div>
    </div>
  );
};

export default HotelRooms;
