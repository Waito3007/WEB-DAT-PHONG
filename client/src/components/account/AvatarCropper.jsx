import React, { useState, useRef } from 'react';
import ReactCrop from 'react-image-crop';
import 'react-image-crop/dist/ReactCrop.css';

function AvatarCropper({ src, onCropComplete }) {
  const [crop, setCrop] = useState({ width: 25, height: 25, aspect: 1 });
  const [completedCrop, setCompletedCrop] = useState(null);
  const imageRef = useRef(null);

  const handleImageLoaded = (image) => {
    imageRef.current = image;
  };

  const handleCompleteCrop = (crop) => {
    setCompletedCrop(crop);
    if (imageRef.current && crop.width === 25 && crop.height === 25) {
      const canvas = document.createElement('canvas');
      const scaleX = imageRef.current.naturalWidth / imageRef.current.width;
      const scaleY = imageRef.current.naturalHeight / imageRef.current.height;
      canvas.width = crop.width;
      canvas.height = crop.height;
      const ctx = canvas.getContext('2d');

      ctx.drawImage(
        imageRef.current,
        crop.x * scaleX,
        crop.y * scaleY,
        crop.width * scaleX,
        crop.height * scaleY,
        0,
        0,
        crop.width,
        crop.height
      );

      // Convert canvas to blob and call onCropComplete
      canvas.toBlob((blob) => {
        onCropComplete(blob); // Gửi blob chứa ảnh cắt về hàm gọi
      });
    }
  };

  return (
    <ReactCrop
      src={src}
      crop={crop}
      onImageLoaded={handleImageLoaded}
      onComplete={handleCompleteCrop}
      onChange={(newCrop) => setCrop({ ...newCrop, width: 25, height: 25 })}
    />
  );
}

export default AvatarCropper;
