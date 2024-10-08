import React, { useEffect, useState } from "react";
import { Card, Button, Col, Row, Spin, message } from "antd";

const { Meta } = Card;

const TravelCards = () => {
  const [destinations, setDestinations] = useState([]);
  const [loading, setLoading] = useState(true); // Thêm trạng thái loading

  useEffect(() => {
    const fetchHotels = async () => {
      try {
        const response = await fetch('/api/hotel');
        if (!response.ok) throw new Error('Network response was not ok');
        
        const data = await response.json();
        setDestinations(data);
      } catch (error) {
        console.error('Error fetching hotels:', error);
        message.error('Đã xảy ra lỗi khi lấy danh sách khách sạn.');
      } finally {
        setLoading(false); // Tắt loading sau khi hoàn thành
      }
    };

    fetchHotels(); // Gọi hàm fetch khi component được render
  }, []);

  if (loading) return <Spin size="large" />; // Hiển thị loading nếu đang tải

  // Hàm để lấy ngẫu nhiên 4 khách sạn
  const getRandomDestinations = (destinations, count) => {
    const shuffled = destinations.sort(() => 0.5 - Math.random());
    return shuffled.slice(0, count);
  };

  const randomDestinations = getRandomDestinations(destinations, 4); // Lấy 4 khách sạn ngẫu nhiên

  return (
    <section className="travel-cards-wrapper bg-gray-100 py-8">
      <div className="container mx-auto px-4">
        <h2 className="travel-title text-3xl font-bold text-center mb-6">Đặt phòng</h2>
        <Row gutter={[16, 16]}>
          {randomDestinations.map((destination, index) => (
            <Col xs={24} sm={12} md={8} lg={6} key={index}>
              <Card
                hoverable
                className="shadow-lg transition-transform duration-300 transform hover:scale-105 h-full" // Đảm bảo chiều cao cố định
              >
                <img
                  alt={destination.name}
                  src={destination.imagehotel[0]} // Hiển thị ảnh đầu tiên trong danh sách
                  className="h-48 w-full object-cover rounded-t-lg" // Thêm kiểu Tailwind
                />
                <Meta
                  title={<span className="text-lg font-semibold mb-2 block">{destination.name}</span>}
                  description={<p className="text-gray-600 mb-2">{destination.description}</p>}
                />
                <div className="card-footer flex justify-between items-center mt-2 relative" style={{ padding: "16px" }}>
                  <span className="price font-bold text-xl text-green-600">
                    {destination.price ? `${destination.price} VNĐ` : '9999999'} 
                  </span>
                  <div className="absolute bottom-2 right-2">
                    <Button type="primary" className="book-btn rounded-lg">
                      Book a Hotel
                    </Button>
                  </div>
                </div>
              </Card>
            </Col>
          ))}
        </Row>
      </div>
    </section>
  );
};

export default TravelCards;
