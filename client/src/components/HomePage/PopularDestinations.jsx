import React, { useEffect, useState } from "react";
import { Card, Col, Row } from "antd";
import { useNavigate } from "react-router-dom";
import Slider from "react-slick"; // Import react-slick for the slider
import "antd/dist/antd";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

const { Meta } = Card;

const PopularDestinations = () => {
  const [destinations, setDestinations] = useState([]);
  const navigate = useNavigate();
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const fetchDestinations = async () => {
      try {
        const response = await fetch("/api/tinhthanh/top-provinces");
        const data = await response.json();

        if (data.error === 0) {
          setDestinations(data.data);
        } else {
          console.error("Error fetching destinations:", data.error_text);
        }
      } catch (error) {
        console.error("Fetch error:", error);
      }
    };

    fetchDestinations();
  }, []);

  // Handle screen resize to detect mobile view
  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    handleResize(); // Initial check
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const handleCardClick = (destination) => {
    navigate(
      `/searchpage?location=${encodeURIComponent(destination.full_name)}`
    );
  };

  const sliderSettings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    arrows: false,
  };

  return (
    <section className="popular-destinations">
      <h3 className="section-title">Địa điểm nổi bật</h3>
      {isMobile ? (
        <Slider {...sliderSettings}>
          {destinations.map((destination) => (
            <div key={destination.id}>
              <Card hoverable onClick={() => handleCardClick(destination)}>
                <Row>
                  <Col span={8}>
                    <div className="destination-image-wrapper">
                      <img
                        alt={destination.full_name}
                        src={destination.image || "default-image.png"}
                        className="destination-image"
                      />
                    </div>
                  </Col>
                  <Col span={16}>
                    <div className="destination-content">
                      <Meta
                        title={
                          <div className="destination-title">
                            {destination.full_name}
                          </div>
                        }
                      />
                    </div>
                  </Col>
                </Row>
              </Card>
            </div>
          ))}
        </Slider>
      ) : (
        <Row gutter={16} justify="center">
          {destinations.map((destination) => (
            <Col xs={24} sm={12} md={6} key={destination.id}>
              <Card hoverable onClick={() => handleCardClick(destination)}>
                <Row>
                  <Col span={8}>
                    <div className="destination-image-wrapper">
                      <img
                        alt={destination.full_name}
                        src={destination.image || "default-image.png"}
                        className="destination-image"
                      />
                    </div>
                  </Col>
                  <Col span={16}>
                    <div className="destination-content">
                      <Meta
                        title={
                          <div className="destination-title">
                            {destination.full_name}
                          </div>
                        }
                      />
                    </div>
                  </Col>
                </Row>
              </Card>
            </Col>
          ))}
        </Row>
      )}
    </section>
  );
};

export default PopularDestinations;
