import React, { useEffect, useState } from 'react';
import { Card, Col, Row } from 'antd';
import axios from 'axios';
import { useParams } from "react-router-dom";
import { motion } from 'framer-motion'; // Import motion từ framer-motion

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
            <motion.div
              initial={{ opacity: 0, y: -20 }} // Hiệu ứng ban đầu
              animate={{ opacity: 1, y: 0 }} // Hiệu ứng khi xuất hiện
              transition={{ duration: 0.5 }} // Thời gian chuyển động
            >
              <Card
                cover={
                  <img
                    alt="Main Hotel View"
                    src={images[0] } 
                    className="w-full h-full object-cover"
                  />
                }
              />
            </motion.div>
          </Col>
          <Col span={12}>
            <Row gutter={16}>
              {images.slice(1, 5).map((image, index) => (
                <Col span={12} key={index}>
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9 }} // Hiệu ứng ban đầu
                    animate={{ opacity: 1, scale: 1 }} // Hiệu ứng khi xuất hiện
                    transition={{ duration: 0.3, delay: index * 0.1 }} // Thời gian và độ trễ cho từng hình ảnh
                  >
                    <Card
                      cover={
                        <img
                          alt={`Room ${index + 1}`}
                          src={image } 
                          className="w-full h-48 object-cover"
                        />
                      }
                    />
                  </motion.div>
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
