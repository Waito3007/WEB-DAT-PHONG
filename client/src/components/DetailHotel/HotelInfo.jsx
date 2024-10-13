import React from 'react';

const HotelInfo = ({ rating, reviewCount, description }) => {
  return (
    <div className="hotel-info">
      <h2   style={{ color: 'black',fontSize:'30px' }}>
         Giới thiệu</h2>
      <p>{description}</p>

    </div>
  );
};

export default HotelInfo;
