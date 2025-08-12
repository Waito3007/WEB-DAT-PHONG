import React, { useEffect, useState, memo, useMemo, useCallback } from 'react';
import axios from 'axios';
import { Card, Col, Row, Skeleton } from 'antd';
import { useNavigate } from 'react-router-dom';

const API_URL = process.env.REACT_APP_API_URL;

const { Meta } = Card;

const TopHotels = memo(() => {
  const [hotels, setHotels] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const fetchTopHotels = useCallback(async () => {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 8000); // 8s timeout
      
      const response = await axios.get(`${API_URL}/api/homepage/top4hotel`, {
        signal: controller.signal,
        timeout: 8000
      });
      
      clearTimeout(timeoutId);
      setHotels(response.data);
    } catch (err) {
      if (err.name === 'AbortError' || err.code === 'ECONNABORTED') {
        setError('Kết nối quá chậm, vui lòng thử lại');
      } else {
        setError('Có lỗi xảy ra khi tải dữ liệu khách sạn');
      }
      console.error('Error fetching hotels:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchTopHotels();
  }, [fetchTopHotels]);

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
});

export default TopHotels;