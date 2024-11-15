import React, { useState } from "react";
import './Searchpage.css'; 

const Filter = ({ setFilteredHotels, hotels }) => {
  const [selectedPrice, setSelectedPrice] = useState("all");
  const [selectedRating, setSelectedRating] = useState("all");
  const [selectedStars, setSelectedStars] = useState("all");

  const handlePriceChange = (e) => {
    setSelectedPrice(e.target.value);
  };

  const handleRatingChange = (e) => {
    setSelectedRating(e.target.value);
  };

  const handleStarsChange = (e) => {
    setSelectedStars(e.target.value);
  };

  const handleResetFilter = () => {
    setSelectedPrice("all");
    setSelectedRating("all");
    setSelectedStars("all");
    setFilteredHotels(hotels); // Reset danh sách khách sạn về ban đầu
  };

  const handleApplyFilter = () => {
    let filtered = [...hotels];

    // Lọc theo giá (Thấp đến cao, Cao đến thấp)
    if (selectedPrice === "lowToHigh") {
      filtered = filtered.sort((a, b) => {
        const aPrice = a.rooms[0]?.price || 0;
        const bPrice = b.rooms[0]?.price || 0;
        return aPrice - bPrice;
      });
    } else if (selectedPrice === "highToLow") {
      filtered = filtered.sort((a, b) => {
        const aPrice = a.rooms[0]?.price || 0;
        const bPrice = b.rooms[0]?.price || 0;
        return bPrice - aPrice;
      });
    }

    // Lọc theo đánh giá
    if (selectedRating === "good") {
      filtered = filtered.filter(hotel => hotel.averageRating >= 8); // Assuming 8 is a "good" rating
    }

    // Lọc theo sao
    if (selectedStars !== "all") {
      filtered = filtered.filter(hotel => hotel.stars >= parseInt(selectedStars, 10));
    }

    setFilteredHotels(filtered); // Cập nhật danh sách khách sạn đã lọc
  };

  return (
    <div className="filter-container p-5 border border-gray-300 rounded-lg">
      <form>
        {/* Lọc theo giá */}
        <fieldset>
          <legend className="text-lg font-medium text-gray-900">Lọc theo giá</legend>
          <div className="mt-4">
            <div className="flex items-center">
              <input
                type="radio"
                name="Price"
                value="lowToHigh"
                checked={selectedPrice === "lowToHigh"}
                onChange={handlePriceChange}
                className="h-5 w-5 rounded border-gray-300"
              />
              <label className="ml-3 text-sm font-medium text-black">
                Giá từ thấp đến cao
              </label>
            </div>
            <div className="flex items-center mt-2">
              <input
                type="radio"
                name="Price"
                value="highToLow"
                checked={selectedPrice === "highToLow"}
                onChange={handlePriceChange}
                className="h-5 w-5 rounded border-gray-300"
              />
              <label className="ml-3 text-sm font-medium text-black">
                Giá từ cao đến thấp
              </label>
            </div>
          </div>
        </fieldset>

        {/* Lọc theo Đánh giá */}
        <fieldset className="mt-6">
          <legend className="text-lg font-medium text-gray-900">Lọc theo Đánh giá</legend>
          <div className="mt-4">
            <div className="flex items-center">
              <input
                type="radio"
                name="Rating"
                value="good"
                checked={selectedRating === "good"}
                onChange={handleRatingChange}
                className="h-5 w-5 rounded border-gray-300"
              />
              <label className="ml-3 text-sm font-medium text-black">
                Đánh giá tốt (8 trở lên)
              </label>
            </div>
          </div>
        </fieldset>
      </form>

      {/* Button Lọc và Reset */}
      <div className="flex justify-between border-t border-gray-200 px-5 py-3">
        <button
          type="button"
          className="rounded bg-blue-600 px-5 py-3 text-xs font-medium text-white active:scale-95 mx-2"
          onClick={handleApplyFilter}
        >
          Lọc
        </button>
        <button
          type="button"
          className="rounded bg-gray-300 px-5 py-3 text-xs font-medium text-black active:scale-95 mx-2" 
          onClick={handleResetFilter}
        >
          Reset
        </button>
      </div>
    </div>
  );
};

export default Filter;
