import React from "react";
const CoverImage = () => {
  return (
    <div className="relative w-full bg-gradient-to-r from-orange-500 to-teal-500">
      <img src="image.png" alt="Cover" className="h-72 w-full object-cover" />
      <button className="absolute top-56 right-4 bg-black text-white p-2 rounded">
        Tải lên bìa mới
      </button>
    </div>
  );
};
export default CoverImage;
