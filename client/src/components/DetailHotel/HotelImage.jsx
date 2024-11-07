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

  //tạo URL mới từ Cloudinary để resize ảnh
  const resizeImage = (url, width, height) => {
    return url.replace('/upload/', `/upload/w_${width},h_${height},c_fill/`);
  };
  
  // Dùng Cloudinary
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
            <Image preview={false}
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
              <Image preview={false}
                src={resizeImage(image, room.width, room.height)} // Resize ảnh phòng
                alt={`Ảnh Phòng ${index + 1}`}
                className="object-cover w-full h-full"
              />
            </div>
          ))}
        </div>
        
        {hasRoomImages && (
          <Button 
          type="primary" 
          onClick={showModal} 
          className="absolute bottom-2 right-2 z-10 text-white bg-blue-500 rounded-md transition-opacity duration-300 hover:opacity-80">
          Xem thêm
        </Button>
        
        )}
      </div>

      <Modal
  title="Tất cả ảnh"
  visible={isModalVisible}
  onCancel={handleCancel}
  footer={null}
  width={1000} // Kích thước modal lớn hơn
>
  <div className="grid grid-cols-3 gap-4"> 
    {hasHotelImages && images.hotelImages.map((image, index) => (
      <div key={`hotel-${index}`} className="w-full h-full overflow-hidden bg-gray-100 flex items-center justify-center">
        <Image 
          preview={{ src: resizeImage(image, 600, 400) }} 
          src={resizeImage(image, 300, 200)} // Resize 
          alt={`Ảnh Khách Sạn ${index + 1}`}
          className="object-cover w-full h-full cursor-pointer" 
        />
      </div>
    ))}
    {hasRoomImages && images.roomImages.map((image, index) => (
      <div key={`room-${index}`} className="w-full h-full overflow-hidden bg-gray-100 flex items-center justify-center">
        <Image 
          preview={{ src: resizeImage(image, 600, 400) }} 
          src={resizeImage(image, 300, 200)} // Resize 
          alt={`Ảnh Phòng ${index + 1}`}
          className="object-cover w-full h-full cursor-pointer" 
        />
      </div>
    ))}
  </div>
</Modal>

    </div>
  );
};
export default HotelImage;
