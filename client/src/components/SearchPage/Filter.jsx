import React, { useState } from "react";

const Filter = ({ onFilterChange }) => {
  const [selectedType, setSelectedType] = useState({
    New: false,
    Used: false,
    Branded: false
  });
  
  const [selectedPrice, setSelectedPrice] = useState("all");

  const handleTypeChange = (e) => {
    setSelectedType(prevState => ({
      ...prevState,
      [e.target.id]: e.target.checked
    }));
  };

  const handlePriceChange = (e) => {
    setSelectedPrice(e.target.value);
  };

  const handleApplyFilter = () => {
    onFilterChange({
      type: selectedType,
      price: selectedPrice
    });
  };

  return (
    <div className="filter">
      <h2 className="text-xl font-semibold text-black">Bộ lọc tìm kiếm</h2>
      <details open className="m-10 max-w-md w-screen overflow-hidden rounded-lg border border-gray-200 open:shadow-lg text-gray-700">
        <summary className="flex cursor-pointer select-none items-center justify-between bg-gray-100 px-5 py-3 lg:hidden">
          <span className="text-sm font-medium">Toggle Filters</span>
          <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </summary>

        <form action="" className="flex border-t border-gray-200 lg:border-t-0">
         

          <fieldset className="w-full">
            <legend className="block w-full bg-gray-50 px-5 py-3 text-xs font-medium">Giá</legend>
            <div className="space-y-2 px-5 py-6">
              <div className="flex items-center">
                <input type="radio" name="Price" value="200000" checked={selectedPrice === "200000"} onChange={handlePriceChange} className="h-5 w-5 rounded border-gray-300" />
                <label className="ml-3 text-sm font-medium">Trên 200.000 VND</label>
              </div>
              <div className="flex items-center">
                <input type="radio" name="Price" value="600000" checked={selectedPrice === "600000"} onChange={handlePriceChange} className="h-5 w-5 rounded border-gray-300" />
                <label className="ml-3 text-sm font-medium">Trên 600.000 VND</label>
              </div>
              <div className="flex items-center">
                <input type="radio" name="Price" value="1000000" checked={selectedPrice === "1000000"} onChange={handlePriceChange} className="h-5 w-5 rounded border-gray-300" />
                <label className="ml-3 text-sm font-medium">Trên 1.000.000 VND</label>
              </div>
              <div className="flex items-center">
                <input type="radio" name="Price" value="all" checked={selectedPrice === "all"} onChange={handlePriceChange} className="h-5 w-5 rounded border-gray-300" />
                <label className="ml-3 text-sm font-medium">Tìm tất cả</label>
              </div>
            </div>
          </fieldset>
        </form>

        <div className="">
          <div className="flex justify-between border-t border-gray-200 px-5 py-3">
            <button name="commit" type="button" className="rounded bg-blue-600 px-5 py-3 text-xs font-medium text-white active:scale-95" onClick={handleApplyFilter}>
              Lọc
            </button>
          </div>
        </div>
      </details>
    </div>
  );
};

export default Filter;
