import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import 'antd/dist/antd'; // Ensure proper styling is imported

const API_URL = process.env.REACT_APP_API_URL;

function SearchHotel({ setFilteredHotels, setHotels, hotels }) {
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const locationFilter = queryParams.get("location");

  const [provinces, setProvinces] = useState([]);
  const [searchTerm, setSearchTerm] = useState(locationFilter || ""); // Initialize with URL param if present
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Fetch data on mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch provinces
        const provinceResponse = await fetch(`${API_URL}/api/tinhthanh/top-provinces`, {
          credentials: 'include'
        });
        const provinceData = await provinceResponse.json();
        if (provinceData.error === 0) {
          setProvinces(provinceData.data);
        } else {
          setError("Lỗi khi lấy danh sách tỉnh thành");
        }

        // Fetch hotels
        const hotelResponse = await fetch(`${API_URL}/api/searchhotel/Search`, {
          credentials: 'include'
        });
        const hotelData = await hotelResponse.json();
        setHotels(hotelData);
        setFilteredHotels(hotelData);
      } catch (err) {
        setError("Lỗi khi gọi API");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [setFilteredHotels, setHotels]);

  // Automatically filter results if locationFilter is present
  useEffect(() => {
    if (locationFilter) {
      filterHotels(locationFilter.toLowerCase());
    }
  }, [locationFilter, hotels]);

  // Filter hotels based on search term, excluding "Thành phố" and "Tỉnh"
  const filterHotels = (term) => {
    const excludeWords = ["thành phố", "tỉnh"];
    const cleanedSearchTerm = excludeWords.reduce((name, word) => {
      return name.replace(new RegExp(word, 'i'), '');
    }, term).trim();

    const filtered = hotels.filter((hotel) =>
      hotel.location.toLowerCase().includes(cleanedSearchTerm) ||
      hotel.name.toLowerCase().includes(cleanedSearchTerm)
    );

    setFilteredHotels(filtered);
  };

  const handleSearchChange = (event) => {
    const searchTerm = event.target.value.toLowerCase();
    setSearchTerm(searchTerm);
    filterHotels(searchTerm);
  };

  if (loading) return <p>Đang tải dữ liệu...</p>;
  if (error) return <p>{error}</p>;

  return (
    <section className="search-hotel justify-start">
      <div className="search-container-hotel">
        <div className="input-group-hotel">
          <div className="relative w-full">
            <input
              id="destination"
              value={searchTerm}
              onChange={handleSearchChange}
              placeholder="Nhập tên tỉnh thành hoặc tên khách sạn"
              className="pl-10 py-2 px-4 w-full text-black border border-black rounded-lg focus:border-gray-300"
            />
            <svg
              className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-500"
              aria-hidden="true"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 20 20"
            >
              <path
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z"
              />
            </svg>
          </div>
        </div>
      </div>
    </section>
  );
}

export default SearchHotel;
