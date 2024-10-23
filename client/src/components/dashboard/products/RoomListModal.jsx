import React, { useState, useEffect } from 'react'; 
import { Drawer, Button, List, Image, Input, Spin, Typography, Pagination } from 'antd';
import { SearchOutlined, PlusOutlined } from '@ant-design/icons'; 
import axios from 'axios';
import AddRoom from './AddRoom'; // Nhập AddRoom


const { Text } = Typography;

const RoomListModal = ({ hotelId, visible, onClose }) => {
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [isAddRoomModalVisible, setIsAddRoomModalVisible] = useState(false); // Trạng thái modal thêm phòng
  const [currentPage, setCurrentPage] = useState(1); // Trang hiện tại
  const [roomsPerPage] = useState(3); // Số phòng trên mỗi trang

  const fetchRooms = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`/api/room/${hotelId}/rooms`);
      if (response.data.length === 0) {
        setRooms([]); // Trả về danh sách trống
      } else {
        setRooms(response.data); // Lưu danh sách phòng
      }
    } catch (error) {
      console.error('Error fetching rooms:', error);
      // Không hiển thị thông báo lỗi nếu không có phòng
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (hotelId && visible) {
      fetchRooms();
    }
  }, [hotelId, visible]);

  const filteredRooms = rooms.filter(room =>
    room.type.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Tính toán số trang
  const indexOfLastRoom = currentPage * roomsPerPage;
  const indexOfFirstRoom = indexOfLastRoom - roomsPerPage;
  const currentRooms = filteredRooms.slice(indexOfFirstRoom, indexOfLastRoom);

  const handleAddRoom = () => {
    setIsAddRoomModalVisible(true); // Mở modal thêm phòng
  };

  const handleAddRoomModalClose = () => {
    setIsAddRoomModalVisible(false); // Đóng modal thêm phòng
    // Tải lại danh sách phòng sau khi thêm
    fetchRooms(); 
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
            <Text type="secondary">Danh sách phòng trống.</Text> // Hiển thị thông báo nếu không có phòng
          ) : (
            <>
              <List
                itemLayout="horizontal"
                dataSource={currentRooms}
                renderItem={room => (
                  <List.Item
                    actions={[
                      <Button type="primary" onClick={() => {/* handle view details */}}>
                        Xem chi tiết
                      </Button>,
                    ]}
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
    </Drawer>
  );
};

export default RoomListModal;
