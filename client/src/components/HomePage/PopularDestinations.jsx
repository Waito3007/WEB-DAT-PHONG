// PopularDestinations.jsx
import React from "react";
import { Card, Button, Col, Row } from "antd";
import 'antd/dist/antd';


const { Meta } = Card;

const PopularDestinations = () => {
  const destinations = [
    { name: "Istanbul, Turkey", image: "image.png" },
    { name: "Sydney, Australia", image: "image.png" },
    { name: "Baku, Azerbaijan", image: "image.png" },
  ];

  return (
    <section className="popular-destinations">
      <h2>Plan your perfect trip</h2>
      <p>Search Flights & Places Hire to our most popular destinations</p>
      <Row gutter={16}>
        {destinations.map((destination, index) => (
          <Col span={8} key={index}>
            <Card
              hoverable
              cover={<img alt={destination.name} src={destination.image} style={{ height: 150, objectFit: 'cover' }} />}
            >
              <Meta title={destination.name} description="Flights • Hotels • Resorts" />
            </Card>
          </Col>
        ))}
      </Row>
      <Button type="primary" className="see-more-btn">See more places</Button>
    </section>
  );
};

export default PopularDestinations;
