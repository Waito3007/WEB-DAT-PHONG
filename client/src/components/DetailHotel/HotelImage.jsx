import React, { useEffect, useState } from 'react';
import { Card, Col, Row } from 'antd';
import axios from 'axios';
import { useParams } from "react-router-dom";
const HotelImage = () => {
  const { hotelId } = useParams();
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
    <div className="flex justify-center items-center">
      <div className="w-full max-w-7xl ">
        <Row gutter={16}>
          <Col span={12}>
            <Card
              cover={
                <img
                  alt="Main Hotel View"
                  src={images[0] || 'https://res.cloudinary.com/dackig67m/image/upload/v1729091450/hotels/file_jl2c9p.jpg'} 
                  className="w-full h-full object-cover"
                />
              }
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
                        src={image || 'https://res.cloudinary.com/dackig67m/image/upload/v1729091450/hotels/file_jl2c9p.jpg'} 
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
