import React, { useEffect, useState } from "react";
import { Card, Col, Row } from "antd";
import "antd/dist/antd"; // Đảm bảo bạn đã thêm css

const { Meta } = Card;

const PopularDestinations = () => {
  const [destinations, setDestinations] = useState([]);

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

  return (
    <section className="popular-destinations">
      <h3 className="section-title">Địa điểm nổi bật</h3>
      <Row gutter={16} justify="center">
        {destinations.map((destination) => (
          <Col xs={24} sm={12} md={6} key={destination.id}>
            <Card hoverable>
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
                      title={<div className="destination-title">{destination.full_name}</div>} // Áp dụng lớp CSS cho tiêu đề
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
