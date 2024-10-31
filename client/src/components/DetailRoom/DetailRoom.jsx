import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from "react-router-dom"; // Sử dụng useNavigate
import { Modal, message } from 'antd'; // Thư viện Ant Design modal và message

const DetailRoom = () => {
  const { hotelId } = useParams();
  const [roomDetails, setRoomDetails] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isModalVisible, setIsModalVisible] = useState(false); // Trạng thái modal
  const [currentImage, setCurrentImage] = useState(''); // Trạng thái ảnh hiện tại cho modal
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

  const showModal = (image) => {
    setCurrentImage(image); // Đặt ảnh hiện tại cho modal
    setIsModalVisible(true); // Hiển thị modal
  };

  const handleCancel = () => {
    setIsModalVisible(false); // Đóng modal
  };

  const handleBookRoom = (roomId, remainingRooms) => {
    // Kiểm tra số phòng còn lại
    if (remainingRooms <= 0) {
      // Hiển thị thông báo nếu không còn phòng
      message.warning('Phòng đã hết, vui lòng chọn loại phòng khác.');
      return; // Dừng hàm nếu không còn phòng
    }
    // Điều hướng sang trang thanh toán và truyền ID phòng
    navigate(`checkout/${roomId}`);
  };

  if (loading) return <div>Đang tải thông tin phòng...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div className="flex flex-col m-20 p-4 text-black">
      <h2 className='w-1/2 p-2'>Thông Tin Các Phòng</h2>
      {roomDetails.length > 0 ? (
        <div className="room-list flex-1 m-20">
          {roomDetails.map((room) => (
            <div key={room._id} className="room-item mb-4 flex justify-between items-center border p-4 rounded-lg shadow-lg">
              {/* Hiển thị ảnh phòng */}
              {room.imageroom.length > 0 ? (
                <img
                  src={room.imageroom[0]}
                  alt={room.type}
                  className="room-image w-32 h-32 object-cover rounded-lg mr-4 transition duration-300 ease-in-out transform hover:scale-105 hover:opacity-75 cursor-pointer"
                  onClick={() => showModal(room.imageroom[0])} // Gọi hàm để mở modal với ảnh hiện tại
                />
              ) : (
                <img
                  src="https://res.cloudinary.com/dackig67m/image/upload/v1728847415/hotels/file_btzwen.jpg"
                  alt="Ảnh phòng mặc định"
                  className="room-image w-32 h-32 object-cover rounded-lg mr-4 transition duration-300 ease-in-out transform hover:scale-105 hover:opacity-75 cursor-pointer"
                  onClick={() => showModal("https://res.cloudinary.com/dackig67m/image/upload/v1728847415/hotels/file_btzwen.jpg")}
                />
              )}

              <div className="flex-1 flex flex-col">
                <div className="text-lg font-bold">Loại phòng: {room.type}</div>
                <div>Tình trạng: <span className={`text-${room.remainingRooms > 0 ? 'green-500' : 'red-500'}`}>{room.remainingRooms > 0 ? 'Có sẵn' : 'Hết phòng'}</span></div>
                <div>Số phòng còn trống: {room.remainingRooms}</div>
              </div>

              <div className="text-right flex flex-col items-end">
                <div className="price text-xl font-semibold">{room.price.toLocaleString('vi-VN')} VNĐ</div>
                <button 
                  type="button" 
                  className="book-now-btn bg-blue-500 text-white px-4 py-2 rounded mt-2"
                  onClick={() => handleBookRoom(room._id, room.remainingRooms)} // Gọi hàm với ID phòng và số phòng còn lại
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
        width="40%" // Đặt chiều rộng modal là 40%
        bodyStyle={{ padding: 0 }} // Xóa padding của body modal
      >
        <img src={currentImage} alt="room" className="w-full h-auto object-cover" /> {/* Hiển thị ảnh đầy đủ */}
      </Modal>
    </div>
  );
};

export default DetailRoom;
