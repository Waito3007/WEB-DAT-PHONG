import React from "react";
import { Card, Button, Col, Row } from "antd";

const { Meta } = Card;

const TravelCards = () => {
  const destinations = [
    {
      name: "Hồ Chí Minh",
      description: "Một cuộc hành trình tuyệt vời",
      price: "500000vnd",
      image: "phong1.png",
    },
    {
      name: "Hà Nội",
      description: "Một cuộc phiêu lưu",
      price: "500000vnd",
      image: "phong1.png",
    },
    {
      name: "Cần thơ",
      description: "Những con đường tuyệt vời",
      price: "500000vnd",
      image: "phong1.png",
    },
    {
      name: "spa",
      description: "Thiên nhiên miền núi",
      price: "500000vnd",
      image: "phong1.png",
    },
  ];

  return (
    <section className="travel-cards-wrapper">
      {" "}
      <div className="travel-cards">
        <h2 className="travel-title">Đặt phòng</h2>
        <Row gutter={[16, 16]}>
          {destinations.map((destination, index) => (
            <Col xs={24} sm={12} md={8} lg={6} key={index}>
              <Card
                hoverable
                style={{ height: "400px" }}
                cover={
                  <img
                    alt={destination.name}
                    src={destination.image}
                    style={{
                      height: "200px",
                      width: "100%",
                      objectFit: "cover",
                    }}
                  />
                }
              >
                <Meta
                  title={destination.name}
                  description={destination.description}
                />
                <div className="card-footer" style={{ marginTop: "10px" }}>
                  <span
                    className="price"
                    style={{ fontWeight: "bold", marginRight: "10px" }}
                  >
                    {destination.price}
                  </span>
                  <Button type="primary" className="book-btn">
                    Đặt phòng
                  </Button>
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
