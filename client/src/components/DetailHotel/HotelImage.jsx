import React, { useEffect, useState } from 'react';
import { Card, Col, Row } from 'antd';
import axios from 'axios';

const HotelImage = ({ hotelId }) => {
  const [images, setImages] = useState([]);

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

  return (
    <div className="flex justify-center items-center mt-10">
      <div className="w-full max-w-4xl">
        <Row gutter={16}>
          <Col span={12}>
            <Card
              cover={
                <img
                  alt="Main Hotel View"
                  src={images[0] || 'default-image-url.png'} // Thay 'default-image-url.png' bằng URL ảnh mặc định nếu không có ảnh
                  className="w-full h-full object-cover"
                />
              }
              className="h-96"
            />
          </Col>
          <Col span={12}>
            <Row gutter={16}>
              {images.slice(1, 5).map((image, index) => (
                <Col span={12} key={index}>
                  <Card
                    cover={
                      <img
                        alt={`Room ${index + 1}`}
                        src={image || 'default-image-url.png'} // Thay 'default-image-url.png' bằng URL ảnh mặc định
                        className="w-full h-48 object-cover"
                      />
                    }
                  />
                </Col>
              ))}
            </Row>
          </Col>
        </Row>
      </div>
    </div>
  );
};

export default HotelImage;
