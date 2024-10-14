import React from "react";

const HotelImage = () => {
  return (
    <div className="hotel-image">
      <div className="main-image">
        <img src="Hp1.png" alt="Main Hotel View" />
      </div>
      <div className="gallery-images">
        <img src="Hp1.png" alt="Room 1" />
        <img src="Hp1.png" alt="Room 2" />
        <img src="Hp1.png" alt="Room 3" />
        <div className="image-with-button">
          <img src="Hp1.png" alt="Room 4" />
          <div className="view-more">
            <button>Xem toàn bộ</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HotelImage;
