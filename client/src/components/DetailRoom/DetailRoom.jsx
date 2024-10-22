import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from "react-router-dom"; // Sử dụng useNavigate
import { Modal } from 'antd'; // Thư viện Ant Design modal

const DetailRoom = () => {
  const { hotelId } = useParams();
  const [roomDetails, setRoomDetails] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isModalVisible, setIsModalVisible] = useState(false); // Trạng thái modal
  const [currentImages, setCurrentImages] = useState([]); // Trạng thái ảnh hiện tại của modal
  const navigate = useNavigate(); // Khai báo useNavigate để điều hướng

  useEffect(() => {
    const fetchRoomDetails = async () => {
      try {
        const response = await axios.get(`/api/detail/${hotelId}/rooms`);
        setRoomDetails(response.data);
        setLoading(false);
      } catch (error) {
        setError('Có lỗi xảy ra khi lấy thông tin phòng.');
        setLoading(false);
      }
    };

    fetchRoomDetails();
  }, [hotelId]);

  const showModal = (images) => {
    setCurrentImages(images); // Đặt ảnh hiện tại cho modal
    setIsModalVisible(true); // Hiển thị modal
  };

  const handleCancel = () => {
    setIsModalVisible(false); // Đóng modal
  };

  const handleBookRoom = (roomId) => {
    // Điều hướng sang trang thanh toán và truyền ID phòng
    navigate(`checkout/${roomId}`);
  };

  if (loading) return <div>Đang tải thông tin phòng...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div className="flex flex-col m-20 p-4 text-black max-h-screen">
      <h2 className='w-1/2 p-2'>Thông Tin Các Phòng</h2>
      {roomDetails.length > 0 ? (
        <div className="room-list flex-1 m-20">
          {roomDetails.map((room) => (
            <div key={room._id} className="room-item mb-4 flex justify-between items-center">
              <div className="flex-1 flex items-center">
                <div className="room-images flex flex-col items-start relative group ">
                  {/* Hiển thị ảnh đầu tiên */}
                  {room.imageroom.length > 0 ? (
                    <img
                      src={room.imageroom[0]}
                      alt={room.type}
                      className="room-image w-32 h-32 object-cover m-2"
                    />
                  ) : (
                    <img
                      src="https://res.cloudinary.com/dackig67m/image/upload/v1728847415/hotels/file_btzwen.jpg"
                      alt="Ảnh phòng mặc định"
                      className="room-image w-32 h-32 object-cover m-2"
                    />
                  )}

                  {/* Hover để hiển thị 'Xem thêm' */}
                  {room.imageroom.length > 1 && (
                    <button
                      onClick={() => showModal(room.imageroom)}
                      className="absolute top-0 left-0 w-full h-full bg-black bg-opacity-50 text-white flex justify-center items-center opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      Xem thêm
                    </button>
                  )}
                </div>
                <div className="text-left mx-4 flex-1">
                  <div>{room.type}</div>
                  <div>Tình trạng: {room.availability ? 'Có sẵn' : 'Không có sẵn'}</div>
                  <div>Số phòng còn trống: {room.remainingRooms}</div>
                </div>
              </div>
              <div className="text-right flex flex-col items-end">
                <div className="price mb-2">{room.price.toLocaleString('vi-VN')} VNĐ</div>
                <button 
                  type="button" 
                  className="book-now-btn bg-blue-500 text-white px-4 py-2 rounded"
                  onClick={() => handleBookRoom(room._id)} // Điều hướng khi nhấn nút
                >
                  Chọn
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div>Không có phòng nào cho khách sạn này.</div>
      )}

      {/* Modal hiển thị tất cả ảnh */}
      <Modal
        title="Hình ảnh phòng"
        visible={isModalVisible}
        onCancel={handleCancel}
        footer={null}
        centered // Giúp modal nằm giữa trang
      >
        <div className="flex flex-wrap justify-center">
          {currentImages.map((image, index) => (
            <img key={index} src={image} alt="room" className="w-1/2 m-2 object-cover" />
          ))}
        </div>
      </Modal>
    </div>
  );
};

export default DetailRoom;
