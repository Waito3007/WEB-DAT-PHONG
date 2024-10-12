import React from "react";
import { Card, Col, Row } from "antd";
import "antd/dist/antd";

const { Meta } = Card;

const PopularDestinations = () => {
  const destinations = [
    { name: "TP Hồ Chí Minh", image: "image.png" },
    { name: "TP Hà Nội", image: "image.png" },
    { name: "TP Cần Thơ", image: "image.png" },
    { name: "TP Bà Rịa", image: "image.png" },
  ];

  return (
    <section className="popular-destinations">
      <h3 className="section-title">Địa điểm đang thịnh hành</h3>
      <Row gutter={16} justify="center">
        {destinations.map((destination, index) => (
          <Col xs={24} sm={12} md={6} key={index}>
            <Card hoverable>
              <Row>
                <Col span={8}>
                  <div className="destination-image-wrapper">
                    <img
                      alt={destination.name}
                      src={destination.image}
                      className="destination-image"
                    />
                  </div>
                </Col>
                <Col span={16}>
                  <div className="destination-content">
                    <Meta
                      title={destination.name}
                      description="Khách sạn • Khu nghỉ dưỡng"
                    />
                  </div>
                </Col>
              </Row>
            </Card>
          </Col>
        ))}
      </Row>
    </section>
  );
};

export default PopularDestinations;
