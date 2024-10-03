import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Typography, message, Spin } from 'antd';
import { useParams } from 'react-router-dom';

const { Title, Paragraph } = Typography;

const HotelDetail = () => {
  const { hotelId } = useParams(); // Lấy hotelId từ URL
  const [hotel, setHotel] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchHotel = async () => {
      try {
        const response = await axios.get(`/api/hotel/${hotelId}`, { withCredentials: true });
        setHotel(response.data);
        setLoading(false);
      } catch (error) {
        console.error('Lỗi khi lấy thông tin khách sạn:', error.response?.data);
        message.error('Đã xảy ra lỗi khi lấy thông tin khách sạn');
        setLoading(false);
      }
    };

    fetchHotel();
  }, [hotelId]);

  if (loading) {
    return (
      <div className="flex justify-center items-center">
        <Spin size="large" tip="Đang tải thông tin khách sạn..." />
      </div>
    );
  }

  if (!hotel) {
    return (
      <div className="flex justify-center items-center">
        <p>Không tìm thấy thông tin khách sạn. Vui lòng thử lại sau.</p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-5">
      <Title level={2}>{hotel.name}</Title>
      <Paragraph><strong>Địa chỉ:</strong> {hotel.location}</Paragraph>
      <Paragraph><strong>Mô tả:</strong> {hotel.description}</Paragraph>
      {hotel.imagehotel.length > 0 && (
        <div className="flex space-x-2">
          {hotel.imagehotel.map((image, index) => (
            <img
              key={index}
              src={image}
              alt={`Hình ảnh khách sạn ${hotel.name} ${index + 1}`}
              className="w-24 h-16 object-cover"
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default HotelDetail;
