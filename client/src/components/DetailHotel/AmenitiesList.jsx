import React from 'react';

const AmenitiesList = ({ amenities }) => {
  return (
    <div className="amenities-list">
      <h3 style={{fontSize:'30px'}}>Tiện nghi</h3>
      <ul  style={{
    display: 'grid',
    gridTemplateColumns: 'repeat(2, 1fr)',
    gap: '10px' 
  }}>
        {amenities.map((amenity, index) => (
          <li key={index}>{amenity}</li>
        ))}
      </ul>
    </div>
  );
};

export default AmenitiesList;
