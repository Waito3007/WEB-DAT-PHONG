import React from "react";

const ImageHome = () => {
  return (
    <div
      className="hero-image"
      style={{
        backgroundImage: `url(/Hp.png)`, // Đường dẫn tới ảnh trong thư mục public
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
        height: "60vh", // Chiều cao tấm ảnh
        width: "100%", // Chiều ngang toàn bộ
      }}
    />
  );
};

export default ImageHome;
