import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from "react-router-dom"; // Sử dụng useNavigate
import { Modal, notification } from 'antd'; // Thư viện Ant Design modal và message

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
      notification.info({
        message: "Đã hết phòng.",
        description: "Vui lòng chọn phòng khác.",
      });
      return; // Dừng hàm nếu không còn phòng
    }

    // Điều hướng sang trang thanh toán và truyền ID phòng
    navigate(`checkout/${roomId}`);
  };

  if (loading) return <div>Đang tải thông tin phòng...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div className="flex flex-col m-4 sm:m-8 lg:m-20 p-4 text-black">
      <h2 className='text-2xl font-semibold mb-4 text-center md:text-left'>Thông Tin Các Phòng</h2>
      {roomDetails.length > 0 ? (
        <div className="room-list flex flex-col space-y-4">
          {roomDetails.map((room) => (
            <div 
              key={room._id} 
              className="room-item flex flex-col sm:flex-row justify-between items-center border p-4 rounded-lg shadow-lg w-full md:w-3/4 mx-auto"
            >
              {/* Hiển thị ảnh phòng */}
              <div className="flex-shrink-0 mb-4 sm:mb-0 sm:mr-4 w-full sm:w-1/4 md:w-1/5 lg:w-1/6">
                <img
                  src={room.imageroom.length > 0 ? room.imageroom[0] : "https://res.cloudinary.com/dackig67m/image/upload/v1728847415/hotels/file_btzwen.jpg"}
                  alt={room.type}
                  className="w-full h-40 object-cover rounded-lg transition duration-300 ease-in-out transform hover:scale-105 hover:opacity-75 cursor-pointer"
                  onClick={() => showModal(room.imageroom.length > 0 ? room.imageroom[0] : "https://res.cloudinary.com/dackig67m/image/upload/v1728847415/hotels/file_btzwen.jpg")}
                />
              </div>

              {/* Thông tin phòng */}
              <div className="flex-1 flex flex-col mb-4 sm:mb-0">
                <div className="text-lg font-bold">Loại phòng: {room.type}</div>
                <div>Tình trạng: <span className={`text-${room.remainingRooms > 0 ? 'green-500' : 'red-500'}`}>{room.remainingRooms > 0 ? 'Có sẵn' : 'Hết phòng'}</span></div>
                <div>Số phòng còn trống: {room.remainingRooms}</div>
              </div>

              {/* Giá và nút chọn */}
              <div className="text-right flex flex-col items-end w-full sm:w-auto">
              <div className="price text-lg font-semibold">{room.price.toLocaleString('vi-VN')} VNĐ</div>
              <button 
              type="button" 
              className="bg-black text-white px-4 py-2 rounded mt-2 hover:bg-gray-800 transition"
              onClick={() => handleBookRoom(room._id, room.remainingRooms)}
              >
             Chọn
             </button>
            </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center">Không có phòng nào cho khách sạn này.</div>
      )}

      {/* Modal hiển thị ảnh phòng */}
      <Modal
        title="Hình ảnh phòng"
        visible={isModalVisible}
        onCancel={handleCancel}
        footer={null}
        centered
        width="80%"
        bodyStyle={{ padding: 0 }}
      >
        <img src={currentImage} alt="room" className="w-full h-auto object-cover" />
      </Modal>
    </div>
  );
};


export default DetailRoom;
