import React from "react";
import { Card, Col, Row } from "antd";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

const { Meta } = Card;

const Endow = () => {
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
      name: "HUY Hotel",
      description: "170 đánh giá",
      price: "12.000.000 VNĐ",
      stars: 5,
      image: "image.png",
      rating: "8.5/10",
    },
    {
      name: "SANG Hotel",
      description: "170 đánh giá",
      price: "12.000.000 VNĐ",
      stars: 5,
      image: "image.png",
      rating: "8.5/10",
    },
    {
      name: "NHAN Hotel",
      description: "170 đánh giá",
      price: "12.000.000 VNĐ",
      stars: 5,
      image: "image.png",
      rating: "8.5/10",
    },
  ];

  const sliderSettings = {
    dots: true,
    infinite: false,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    responsive: [
      {
        breakpoint: 768,
        settings: {
          slidesToShow: 1,
        },
      },
    ],
  };

  return (
    <section className="endow-cards-wrapper">
      <div className="endow-cards">
        <h2 className="endow-title">Khách sạn đang được khuyến mãi</h2>
        <div className="card-list-wrapper">
          <div className="slider-container">
            <Slider {...sliderSettings}>
              {destinations.map((destination, index) => (
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
                  key={index}
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
                        <span
                          style={{ color: "gray" }}
                        >{` (${destination.description})`}</span>
                      </div>
                    }
                  />
                  <div className="card-footer">
                    <span className="price">{destination.price}</span>
                  </div>
                </Card>
              ))}
            </Slider>
          </div>
          <Row gutter={[16, 16]} className="grid-container">
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
                        <span
                          style={{ color: "gray" }}
                        >{` (${destination.description})`}</span>
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
      </div>
    </section>
  );
};

export default Endow;
