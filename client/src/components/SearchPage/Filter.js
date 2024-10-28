import React from "react";

const Filter = () => {
  return (
    <div className="filter">
      <h2 className="text-xl font-semibold text-black">Lọc</h2>
      <div className="mt-4">
        <label className="block mb-2 text-black">Giá</label>
        <input type="range" min="300000" max="5000000" className="w-full" />
        <div className="flex justify-between text-black">
          <span> 300.000 VNĐ</span>
          <span> 4.000.000VNĐ +</span>
        </div>
      </div>
      <h2 className="mt-4 text-xl font-semibold text-black">Chọn lọc theo</h2>
      <div className="mt-2">
        <label className="flex items-center">
          <input type="checkbox" className="mr-2" />
          Nhà khách
        </label>
        <label className="flex items-center">
          <input type="checkbox" className="mr-2" />
          Nhà nghỉ mặt
        </label>
        <label className="flex items-center">
          <input type="checkbox" className="mr-2" />
          Nhà nghỉ trại
        </label>
        <label className="flex items-center">
          <input type="checkbox" className="mr-2" />
          Khu cắm trại
        </label>
      </div>
    </div>
  );
};

export default Filter;
