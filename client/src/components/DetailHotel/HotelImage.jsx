import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { Modal, Button, Image } from 'antd';

const HotelImage = () => {
  const { hotelId } = useParams();
  const [images, setImages] = useState({ hotelImages: [], roomImages: [] });
  const [isModalVisible, setIsModalVisible] = useState(false);

  useEffect(() => {
    const fetchImages = async () => {
      try {
        const response = await axios.get(`/api/detail/${hotelId}/image`);
        setImages(response.data);
      } catch (error) {
        console.error('Error fetching hotel images:', error);
      }
    };

    fetchImages();
  }, [hotelId]);

  const hasHotelImages = Array.isArray(images.hotelImages) && images.hotelImages.length > 0;
  const hasRoomImages = Array.isArray(images.roomImages) && images.roomImages.length > 0;

  const showModal = () => {
    setIsModalVisible(true);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };

  // Hàm tạo URL mới từ Cloudinary để resize ảnh
  const resizeImage = (url, width, height) => {
    return url.replace('/upload/', `/upload/w_${width},h_${height},c_fill/`);
  };
  
  // Dùng Cloudinary để lấy kích thước phù hợp
  const getResponsiveSize = () => {
    const width = window.innerWidth; // Lấy chiều rộng của cửa sổ
    if (width >= 1024) { // Desktop
      return { hotel: { width: 700, height: 400 }, room: { width: 200, height: 200 } };
    } else if (width >= 640) { // Tablet
      return { hotel: { width: 500, height: 300 }, room: { width: 150, height: 150 } };
    } else { // Mobile
      return { hotel: { width: 300, height: 200 }, room: { width: 120, height: 120 } };
    }
  };
  
  const { hotel, room } = getResponsiveSize();

  return (
    <div className="flex flex-col md:flex-row justify-center md:h-auto p-4">
      {/* Cột bên trái: Ảnh khách sạn */}
      <div className="mr-0 md:mr-8 mb-4 md:mb-0 flex-shrink-0">
        {hasHotelImages && (
          <div className="w-full md:w-[700px] h-[400px] overflow-hidden bg-gray-100 flex items-center justify-center">
            <Image
              src={resizeImage(images.hotelImages[0], hotel.width, hotel.height)} // Resize ảnh khách sạn
              alt="Ảnh Khách Sạn"
              className="object-cover w-full h-full"
            />
          </div>
        )}
      </div>

      {/* Cột bên phải: Ảnh các phòng */}
      <div className="flex flex-col w-full md:w-auto relative">
        <div className="grid grid-cols-2 gap-2">
          {hasRoomImages && images.roomImages.slice(0, 4).map((image, index) => (
            <div key={index} className="w-full sm:w-[200px] h-[200px] overflow-hidden bg-gray-100 flex items-center justify-center">
              <Image
                src={resizeImage(image, room.width, room.height)} // Resize ảnh phòng
                alt={`Ảnh Phòng ${index + 1}`}
                className="object-cover w-full h-full"
              />
            </div>
          ))}
        </div>
        
        {/* Nút Xem thêm được đặt đè lên ảnh cuối */}
        {hasRoomImages && (
          <Button 
          type="link" 
          onClick={showModal} 
          className="absolute bottom-2 right-2 z-10 text-white bg-blue-500 rounded-md transition-opacity duration-300 hover:opacity-80">
          Xem thêm
        </Button>
        
        )}
      </div>

      {/* Modal hiển thị tất cả ảnh */}
      <Modal
        title="Tất cả ảnh"
        visible={isModalVisible}
        onCancel={handleCancel}
        footer={null}
        width={800} // Kích thước modal
      >
        <div className="flex flex-wrap gap-2">
          {hasHotelImages && images.hotelImages.map((image, index) => (
            <div key={`hotel-${index}`} className="w-[150px] h-[100px] overflow-hidden bg-gray-100 flex items-center justify-center">
              <Image
                src={resizeImage(image, 150, 100)} // Resize ảnh khách sạn trong modal
                alt={`Ảnh Khách Sạn ${index + 1}`}
                className="object-cover w-full h-full"
              />
            </div>
          ))}
          {hasRoomImages && images.roomImages.map((image, index) => (
            <div key={`room-${index}`} className="w-[150px] h-[100px] overflow-hidden bg-gray-100 flex items-center justify-center">
              <Image
                src={resizeImage(image, 150, 100)} // Resize ảnh phòng trong modal
                alt={`Ảnh Phòng ${index + 1}`}
                className="object-cover w-full h-full"
              />
            </div>
          ))}
        </div>
      </Modal>
    </div>
  );
};

export default HotelImage;
