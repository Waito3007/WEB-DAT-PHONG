import React, { useState, useEffect, useCallback } from 'react'; 
import { Modal, Drawer, Button, List, Image, Input, message, Spin, Typography, Pagination } from 'antd';
import { SearchOutlined, PlusOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons'; 
import axios from 'axios';
import AddRoom from './AddRoom'; // Nhập AddRoom
import EditRoomDrawer from './EditRoomDrawer';

const { Text } = Typography;

const RoomListDrawer = ({ hotelId, visible, onClose }) => {
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [isAddRoomModalVisible, setIsAddRoomModalVisible] = useState(false);
  const [isEditRoomDrawerVisible, setIsEditRoomDrawerVisible] = useState(false);
  const [selectedRoomId, setSelectedRoomId] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [roomsPerPage] = useState(3);

  const fetchRooms = useCallback(async () => {
    setLoading(true);
    try {
      const response = await axios.get(`/api/room/${hotelId}/rooms`);
      if (response.data.length === 0) {
        setRooms([]); 
      } else {
        setRooms(response.data); 
      }
    } catch (error) {
      console.error('Error fetching rooms:', error);
    } finally {
      setLoading(false);
    }
  }, [hotelId]);

  useEffect(() => {
    if (hotelId && visible) {
      fetchRooms();
    }
  }, [hotelId, visible, fetchRooms]);

  const filteredRooms = rooms.filter(room =>
    room.type.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const indexOfLastRoom = currentPage * roomsPerPage;
  const indexOfFirstRoom = indexOfLastRoom - roomsPerPage;
  const currentRooms = filteredRooms.slice(indexOfFirstRoom, indexOfLastRoom);


  //thêm phòng
  const handleAddRoom = () => {
    setIsAddRoomModalVisible(true);
  };

  const handleAddRoomModalClose = () => {
    setIsAddRoomModalVisible(false);
    fetchRooms(); 
  };

  //chỉnh sửa phòng
  const handleEditRoom = (roomId) => {
    setSelectedRoomId(roomId);
    setIsEditRoomDrawerVisible(true);
  };

   // Hàm xác nhận xóa phòng
   const confirmDeleteRoom = (roomId) => {
    Modal.confirm({
      title: 'Xác nhận xóa',
      content: 'Bạn có chắc chắn muốn xóa phòng này?',
      okText: 'Có',
      okType: 'danger',
      cancelText: 'Không',
      onOk: () => handleDeleteRoom(roomId), // Gọi hàm xóa phòng nếu người dùng xác nhận
    });
  };
   // Hàm xóa phòng
   const handleDeleteRoom = async (roomId) => {
    try {
      await axios.delete(`/api/room/${roomId}`, { withCredentials: true });
      message.success('Phòng đã được xóa thành công');
      fetchRooms(); 
    } catch (error) {
      message.error('Đã xảy ra lỗi khi xóa phòng');
    }
  };

  
  return (
    <Drawer
      title="Danh sách phòng"
      visible={visible}
      onClose={onClose}
      width={720}
    >
      {loading ? (
        <Spin tip="Đang tải danh sách phòng..." />
      ) : (
        <>
          <div style={{ display: 'flex', alignItems: 'center', marginBottom: '16px' }}>
            <Input
              placeholder="Tìm kiếm phòng..."
              prefix={<SearchOutlined />}
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              style={{ borderRadius: '8px', flex: 1, marginRight: '8px' }}
            />
            <Button 
              type="primary" 
              icon={<PlusOutlined />} 
              onClick={handleAddRoom} 
            />
          </div>
          {rooms.length === 0 ? (
            <Text type="secondary">Danh sách phòng trống.</Text>
          ) : (
            <>
              <List
                itemLayout="horizontal"
                dataSource={currentRooms}
                renderItem={room => (
                  <List.Item
                    actions={[
                  <Button 
                type="primary" 
                icon={<EditOutlined />} 
                onClick={() => handleEditRoom(room._id)} // Mở drawer chỉnh sửa phòng
              />,                      
              <Button 
                      type="primary" 
                      danger 
                      icon={<DeleteOutlined />} 
                      onClick={() => confirmDeleteRoom(room._id)} // Gọi hàm xác nhận xóa
                    />,                    ]}
                    style={{
                      border: '1px solid #e0e0e0',
                      borderRadius: '8px',
                      marginBottom: '12px',
                      padding: '10px',
                      background: '#f9f9f9',
                    }}
                  >
                    <List.Item.Meta
                      title={room.type}
                      description={`Giá: ${room.price} VND - Số phòng trống: ${room.remainingRooms}`}
                    />
                    {room.imageroom.length > 0 && (
                      <Image
                        width={100}
                        height={100} // Đặt chiều cao để tạo hình vuông
                        src={room.imageroom[0]}
                        alt="Room"
                        style={{ borderRadius: '8px', objectFit: 'cover' }}
                      />
                    )}
                  </List.Item>
                )}
              />
              <Pagination
                current={currentPage}
                pageSize={roomsPerPage}
                total={filteredRooms.length}
                onChange={page => setCurrentPage(page)}
                style={{ textAlign: 'center', marginTop: '16px' }}
              />
            </>
          )}
        </>
      )}
      <Drawer
        title="Thêm Phòng"
        visible={isAddRoomModalVisible}
        onClose={handleAddRoomModalClose}
        footer={null}
        width={520}
      >
        <AddRoom hotelId={hotelId} onClose={handleAddRoomModalClose} />

        
      </Drawer>
      {/* Drawer chỉnh sửa thông tin phòng */}
      <EditRoomDrawer 
      visible={isEditRoomDrawerVisible} 
      onClose={() => {
      setIsEditRoomDrawerVisible(false);
      setSelectedRoomId(null);  // Xóa roomId sau khi đóng drawer
      }}
      roomId={selectedRoomId}    // Truyền roomId vào EditRoomDrawer
      fetchRooms={fetchRooms} 
/>
    </Drawer>
  );
};

export default RoomListDrawer;
