import React from "react";
import { Card, Col, Row } from "antd"; // Xóa Button ở đây

const { Meta } = Card;

const PopularDestinations = () => {
  const destinations = [
    {
      name: "LTN Hotel",
      description: "170 đánh giá",
      price: "12.000.000 VNĐ",
      stars: 5,
      image: "image.png",
      rating: "8.5/10",
    },
    {
      name: "LTN Hotel",
      description: "170 đánh giá",
      price: "12.000.000 VNĐ",
      stars: 5,
      image: "image.png",
      rating: "8.5/10",
    },
    {
      name: "LTN Hotel",
      description: "170 đánh giá",
      price: "12.000.000 VNĐ",
      stars: 5,
      image: "image.png",
      rating: "8.5/10",
    },
    {
      name: "LTN Hotel",
      description: "170 đánh giá",
      price: "12.000.000 VNĐ",
      stars: 5,
      image: "image.png",
      rating: "8.5/10",
    },
  ];

  return (
    <section className="popular-destinations-wrapper">
      <div className="popular-destinations">
        <h2 className="travel-title">Khách sạn được yêu thích nhất</h2>
        <Row gutter={[16, 16]}>
          {destinations.map((destination, index) => (
            <Col xs={24} sm={12} md={8} lg={6} key={index}>
              <Card
                hoverable
                style={{ height: "auto" }}
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
                  description={
                    <div>
                      <span className="stars">
                        {Array.from({ length: destination.stars }, (_, i) => (
                          <span key={i} className="star">
                            ⭐
                          </span>
                        ))}
                      </span>
                      <br />
                      <span className="rating" style={{ color: "#1877F2" }}>
                        {destination.rating}
                      </span>
                      <span style={{ color: "gray" }}>
                        {` (${destination.description})`}
                      </span>
                    </div>
                  }
                />
                <div className="card-footer">
                  <span className="price">{destination.price}</span>
                </div>
              </Card>
            </Col>
          ))}
        </Row>
      </div>
    </section>
  );
};

export default PopularDestinations;
