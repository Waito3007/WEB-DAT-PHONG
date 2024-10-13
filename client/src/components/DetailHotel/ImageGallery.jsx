import React from 'react';

const ImageGallery = ({ images }) => {
  return (
    <div className="image-gallery">
      <div className="main-image">
        <img src={images[0]} alt="Main Hotel" />
      </div>
      <div className="thumbnail-grid">
        {images.slice(1).map((image, index) => (
          <div className="thumbnail" key={index}>
            <img src={image} alt={`Thumbnail ${index}`} />
            <div className="view-more">Xem toàn bộ</div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ImageGallery;
