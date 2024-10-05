// PopularDestinations.jsx
import React from "react";
import { Card, Button, Col, Row } from "antd";
import "antd/dist/antd";

const { Meta } = Card;

const PopularDestinations = () => {
  const destinations = [
    { name: "TP Hồ Chí Minh", image: "image.png" },
    { name: "TP Hà Nội", image: "image.png" },
    { name: "TP Cần Thơ", image: "image.png" },
  ];

  return (
    <section className="popular-destinations">
      <div className="header">
        <h2>Tìm kiếm địa điểm du lịch</h2>
        <Button type="primary" className="see-more-btn">
          Xem thêm
        </Button>
      </div>
      <Row gutter={16}>
        {destinations.map((destination, index) => (
          <Col span={8} key={index}>
            <Card
              hoverable
              cover={
                <img
                  alt={destination.name}
                  src={destination.image}
                  style={{ height: 150, objectFit: "cover" }}
                />
              }
            >
              <Meta
                title={destination.name}
                description="Khách sạn • Khu nghỉ dưỡng"
              />
            </Card>
          </Col>
        ))}
      </Row>
    </section>
  );
};

export default PopularDestinations;
