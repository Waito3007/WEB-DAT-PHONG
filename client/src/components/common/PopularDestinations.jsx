// PopularDestinations.jsx
import React from "react";

const PopularDestinations = () => {
  const destinations = [
    { name: "Istanbul, Turkey", image: "image.png" },
    { name: "Sydney, Australia", image: "image.png" },
    { name: "Baku, Azerbaijan", image: "image.png" },
    { name: "Malé, Maldives", image: "image.png" },
    { name: "Paris, France", image: "image.png" },
    { name: "New York, US", image: "image.png" },
    { name: "London, UK", image: "image.png" },
    { name: "Tokyo, Japan", image: "image.png" },
    { name: "Dubai, UAE", image: "image.png" },
  ];

  return (
    <section className="popular-destinations">
      <h2>Plan your perfect trip</h2>
      <p>Search Flights & Places Hire to our most popular destinations</p>
      <div className="destinations-grid">
        {destinations.map((destination, index) => (
          <div key={index} className="destination-card">
            <img src={destination.image} alt={destination.name} />
            <p>{destination.name}</p>
            <span>Flights • Hotels • Resorts</span>
          </div>
        ))}
      </div>
      <button className="see-more-btn">See more places</button>
    </section>
  );
};

export default PopularDestinations;
