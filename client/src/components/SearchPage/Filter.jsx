import React, { useState } from "react";

const Filter = ({ onFilterChange }) => {
  const [selectedType, setSelectedType] = useState({
    New: false,
    Used: false,
    Branded: false,
  });

  const [selectedPrice, setSelectedPrice] = useState("all");
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleTypeChange = (e) => {
    setSelectedType((prevState) => ({
      ...prevState,
      [e.target.id]: e.target.checked,
    }));
  };

  const handlePriceChange = (e) => {
    setSelectedPrice(e.target.value);
  };

  const handleApplyFilter = () => {
    onFilterChange({
      type: selectedType,
      price: selectedPrice,
    });
  };

  const toggleModal = () => {
    setIsModalOpen(!isModalOpen);
  };

  return (
    <div className="filter">
      {/* Hiển thị bộ lọc trên desktop */}
      <h2 className="text-xl font-semibold text-black hidden lg:block">
        Bộ lọc tìm kiếm
      </h2>

      {/* Nút menu Taskbar 3 sọc cho mobile */}
      <button className="lg:hidden p-2" onClick={toggleModal}>
        <svg
          className="h-6 w-6 text-black"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M4 6h16M4 12h16M4 18h16"
          />
        </svg>
      </button>

      {/* Modal khi nhấn vào nút taskbar */}
      {isModalOpen && (
        <div
          className="fixed inset-0 z-50 bg-gray-500 bg-opacity-50"
          onClick={toggleModal}
        >
          <div
            className="relative max-w-md mx-auto mt-20 bg-white p-6 rounded-lg"
            onClick={(e) => e.stopPropagation()}
          >
            <h2 className="text-xl font-semibold text-black">
              Bộ lọc tìm kiếm
            </h2>
            <form
              action=""
              className="flex border-t border-gray-200 lg:border-t-0"
            >
              <fieldset className="w-full">
                <legend className="block w-full bg-gray-50 px-5 py-3 text-xs font-medium text-black">
                  giá
                </legend>
                <div className="space-y-2 px-5 py-6">
                  <div className="flex items-center">
                    <input
                      type="radio"
                      name="Price"
                      value="200000"
                      checked={selectedPrice === "200000"}
                      onChange={handlePriceChange}
                      className="h-5 w-5 rounded border-gray-300"
                    />
                    <label className="ml-3 text-sm font-medium text-black">
                      Trên 200.000 VND
                    </label>
                  </div>
                  <div className="flex items-center">
                    <input
                      type="radio"
                      name="Price"
                      value="600000"
                      checked={selectedPrice === "600000"}
                      onChange={handlePriceChange}
                      className="h-5 w-5 rounded border-gray-300"
                    />
                    <label className="ml-3 text-sm font-medium text-black">
                      Trên 600.000 VND
                    </label>
                  </div>
                  <div className="flex items-center">
                    <input
                      type="radio"
                      name="Price"
                      value="1000000"
                      checked={selectedPrice === "1000000"}
                      onChange={handlePriceChange}
                      className="h-5 w-5 rounded border-gray-300"
                    />
                    <label className="ml-3 text-sm font-medium text-black">
                      Trên 1.000.000 VND
                    </label>
                  </div>
                  <div className="flex items-center">
                    <input
                      type="radio"
                      name="Price"
                      value="all"
                      checked={selectedPrice === "all"}
                      onChange={handlePriceChange}
                      className="h-5 w-5 rounded border-gray-300"
                    />
                    <label className="ml-3 text-sm font-medium text-black">
                      Tìm tất cả
                    </label>
                  </div>
                </div>
              </fieldset>
            </form>

            <div className="flex justify-between border-t border-gray-200 px-5 py-3">
              <button
                name="commit"
                type="button"
                className="rounded bg-blue-600 px-5 py-3 text-xs font-medium text-white active:scale-95"
                onClick={handleApplyFilter}
              >
                Lọc
              </button>
            </div>

            <button
              className="absolute top-2 right-2 text-gray-500"
              onClick={toggleModal}
            >
              <svg
                className="h-6 w-6"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>
        </div>
      )}

      {/* Hiển thị bộ lọc trên desktop */}
      <div className="hidden lg:block">
        <form action="" className="flex border-t border-gray-200 lg:border-t-0">
          <fieldset className="w-full">
            <legend className="block w-full bg-gray-50 px-5 py-3 text-xs font-medium text-black">
              Giá
            </legend>
            <div className="space-y-2 px-5 py-6">
              <div className="flex items-center">
                <input
                  type="radio"
                  name="Price"
                  value="200000"
                  checked={selectedPrice === "200000"}
                  onChange={handlePriceChange}
                  className="h-5 w-5 rounded border-gray-300"
                />
                <label className="ml-3 text-sm font-medium text-black">
                  Trên 200.000 VND
                </label>
              </div>
              <div className="flex items-center">
                <input
                  type="radio"
                  name="Price"
                  value="600000"
                  checked={selectedPrice === "600000"}
                  onChange={handlePriceChange}
                  className="h-5 w-5 rounded border-gray-300"
                />
                <label className="ml-3 text-sm font-medium text-black">
                  Trên 600.000 VND
                </label>
              </div>
              <div className="flex items-center">
                <input
                  type="radio"
                  name="Price"
                  value="1000000"
                  checked={selectedPrice === "1000000"}
                  onChange={handlePriceChange}
                  className="h-5 w-5 rounded border-gray-300"
                />
                <label className="ml-3 text-sm font-medium text-black">
                  Trên 1.000.000 VND
                </label>
              </div>
              <div className="flex items-center">
                <input
                  type="radio"
                  name="Price"
                  value="all"
                  checked={selectedPrice === "all"}
                  onChange={handlePriceChange}
                  className="h-5 w-5 rounded border-gray-300"
                />
                <label className="ml-3 text-sm font-medium text-black">
                  Tìm tất cả
                </label>
              </div>
            </div>
          </fieldset>
        </form>

        <div className="flex justify-between border-t border-gray-200 px-5 py-3">
          <button
            name="commit"
            type="button"
            className="rounded bg-blue-600 px-5 py-3 text-xs font-medium text-white active:scale-95"
            onClick={handleApplyFilter}
          >
            Lọc
          </button>
        </div>
      </div>
    </div>
  );
};

export default Filter;
