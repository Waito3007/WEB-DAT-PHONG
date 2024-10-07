import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { message, Spin, List, Typography } from 'antd';
import { useParams, useNavigate } from 'react-router-dom'; // Nhập useNavigate

const { Title } = Typography;

const HotelRooms = () => {
  const { hotelId } = useParams();
  const navigate = useNavigate(); // Khai báo useNavigate
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchRooms();
  }, [hotelId]);

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

  // Hàm điều hướng khi nhấp vào phòng
  const handleRoomClick = (roomId) => {
    navigate(`/room/${roomId}`); // Điều hướng đến trang chi tiết phòng
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
            <List.Item key={room._id} className="border-b py-4 cursor-pointer" onClick={() => handleRoomClick(room._id)}>
              <div className="flex justify-between items-center p-4 rounded-lg transition-transform duration-200 hover:shadow-lg hover:bg-gray-50">
                <div>
                  <Title level={4} className="text-blue-500">{room.type}</Title>
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
                </div>
              </div>
            </List.Item>
          )}
        />
      </div>
    </div>
  );
};

export default HotelRooms;
