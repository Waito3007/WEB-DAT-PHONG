import React, { useEffect, useState } from "react";
import axios from "axios";
import { Card, Col, Row } from "antd";
import { useNavigate } from "react-router-dom";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

const { Meta } = Card;

const PopularDestinations = () => {
  const [hotels, setHotels] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchTopHotels = async () => {
      try {
        const response = await axios.get("/api/homepage/random-hotel");
        setHotels(response.data);
        setLoading(false);
      } catch (err) {
        setError("Có lỗi xảy ra khi tải dữ liệu khách sạn");
        setLoading(false);
      }
    };

    fetchTopHotels();
  }, []);

  if (loading) return <div>Đang tải...</div>;
  if (error) return <div>{error}</div>;

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
    <section className="travel-cards-wrapper">
      <div className="travel-cards text-black mt-5">
        <h2 className="travel-title text-2xl md:text-2xl lg:text-3xl font-medium">
          Có thể bạn thích
        </h2>
        <div className="hotel-list-wrapper">
          {/* Use slider only for smaller screens */}
          <div className="slider-container">
            <Slider {...sliderSettings}>
              {hotels.map((hotel) => (
                <Card
                  hoverable
                  style={{ height: "auto" }}
                  cover={
                    <img
                      alt={hotel.name}
                      src={hotel.imagehotel[0] || "default-image.jpg"}
                      style={{
                        height: "200px",
                        width: "100%",
                        objectFit: "cover",
                      }}
                    />
                  }
                  onClick={() => navigate(`/detailhotel/${hotel._id}`)}
                  key={hotel._id}
                >
                  <Meta
                    title={hotel.name}
                    description={
                      <div>
                        <span className="rating" style={{ color: "#1877F2" }}>
                          {hotel.averageRating
                            ? `${hotel.averageRating.toFixed(1)}/10`
                            : "Chưa có đánh giá"}
                        </span>
                        <span style={{ color: "gray" }}>
                          {` (${hotel.reviewsCount || 0} đánh giá)`}
                        </span>
                        <br />
                        <span
                          className="lowest-price"
                          style={{
                            fontWeight: "bold",
                            fontSize: "18px",
                            color: "#ff3d00",
                          }}
                        >
                          {hotel.lowestPrice && hotel.highestPrice
                            ? `${hotel.lowestPrice.toLocaleString(
                                "vi-VN"
                              )} - ${hotel.highestPrice.toLocaleString(
                                "vi-VN"
                              )} VND`
                            : "Đang cập nhật"}
                        </span>
                      </div>
                    }
                  />
                </Card>
              ))}
            </Slider>
          </div>
          {/* Grid layout for larger screens */}
          <Row gutter={[16, 16]} className="grid-container">
            {hotels.map((hotel) => (
              <Col xs={24} sm={12} md={8} lg={6} key={hotel._id}>
                <Card
                  hoverable
                  style={{ height: "auto" }}
                  cover={
                    <img
                      alt={hotel.name}
                      src={hotel.imagehotel[0] || "default-image.jpg"}
                      style={{
                        height: "200px",
                        width: "100%",
                        objectFit: "cover",
                      }}
                    />
                  }
                  onClick={() => navigate(`/detailhotel/${hotel._id}`)}
                >
                  <Meta
                    title={hotel.name}
                    description={
                      <div>
                        <span className="rating" style={{ color: "#1877F2" }}>
                          {hotel.averageRating
                            ? `${hotel.averageRating.toFixed(1)}/10`
                            : "Chưa có đánh giá"}
                        </span>
                        <span style={{ color: "gray" }}>
                          {` (${hotel.reviewsCount || 0} đánh giá)`}
                        </span>
                        <br />
                        <span
                          className="lowest-price"
                          style={{
                            fontWeight: "bold",
                            fontSize: "18px",
                            color: "#ff3d00",
                          }}
                        >
                          {hotel.lowestPrice && hotel.highestPrice
                            ? `${hotel.lowestPrice.toLocaleString(
                                "vi-VN"
                              )} - ${hotel.highestPrice.toLocaleString(
                                "vi-VN"
                              )} VND`
                            : "Đang cập nhật"}
                        </span>
                      </div>
                    }
                  />
                </Card>
              </Col>
            ))}
          </Row>
        </div>
      </div>
    </section>
  );
};

export default PopularDestinations;
