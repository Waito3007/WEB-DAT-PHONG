import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Card, Col, Row } from 'antd';
import { useNavigate } from 'react-router-dom'; // Thêm import này

const { Meta } = Card;

const TopHotels = () => {
  const [hotels, setHotels] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate(); // Khởi tạo useNavigate

  useEffect(() => {
    const fetchTopHotels = async () => {
      try {
        const response = await axios.get('/api/homepage/top4hotel');
        setHotels(response.data);
        setLoading(false);
      } catch (err) {
        setError('Có lỗi xảy ra khi tải dữ liệu khách sạn');
        setLoading(false);
      }
    };

    fetchTopHotels();
  }, []);

  if (loading) {
    return <div>Đang tải...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <section className="travel-cards-wrapper">
      <div className="travel-cards">
        <h2 className="travel-title">Khách sạn hàng đầu</h2>
        <Row gutter={[16, 16]}>
          {hotels.map((hotel) => (
            <Col xs={24} sm={12} md={8} lg={6} key={hotel._id}>
              <Card
                hoverable
                style={{ height: 'auto' }}
                cover={
                  <img
                    alt={hotel.name}
                    src={hotel.imagehotel[0] || 'default-image.jpg'}
                    style={{
                      height: '200px',
                      width: '100%',
                      objectFit: 'cover',
                    }}
                  />
                }
                onClick={() => navigate(`/detailhotel/${hotel._id}`)} // Chuyển hướng đến trang chi tiết
              >
                <Meta
                  title={hotel.name}
                  description={
                    <div>
                      <span className="rating" style={{ color: '#1877F2' }}>
                        {hotel.averageRating ? `${hotel.averageRating.toFixed(1)}/10` : 'Chưa có đánh giá'}
                      </span>
                      <span style={{ color: 'gray' }}>
                        {` (${hotel.reviewsCount || 0} đánh giá)`}
                      </span>
                      <br />
                      <span className="lowest-price" style={{ fontWeight: 'bold', fontSize: '18px', color: '#ff3d00' }}>
                        {hotel.lowestPrice && hotel.highestPrice 
                          ? `${hotel.lowestPrice.toLocaleString('vi-VN')} - ${hotel.highestPrice.toLocaleString('vi-VN')} VND`
                          : 'Đang cập nhật'}
                      </span>
                    </div>
                  }
                />
              </Card>
            </Col>
          ))}
        </Row>
      </div>
    </section>
  );
};

export default TopHotels;