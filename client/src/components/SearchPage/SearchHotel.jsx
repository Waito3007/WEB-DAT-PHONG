import React, { useEffect, useState } from "react"; 
import { FaSearch } from "react-icons/fa";
import 'antd/dist/antd';

function SearchHotel({ setFilteredHotels, setHotels, hotels }) {
  const [provinces, setProvinces] = useState([]);
  const [searchTerm, setSearchTerm] = useState(""); // Thay selectedProvince bằng searchTerm
  const [checkInDate, setCheckInDate] = useState("");
  const [checkOutDate, setCheckOutDate] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const provinceResponse = await fetch("/api/tinhthanh/top-provinces");
        const provinceData = await provinceResponse.json();
        if (provinceData.error === 0) {
          setProvinces(provinceData.data);
        } else {
          setError("Lỗi khi lấy danh sách tỉnh thành");
        }

        const hotelResponse = await fetch("/api/searchhotel/Search");
        const hotelData = await hotelResponse.json();
        setHotels(hotelData); // Cập nhật danh sách khách sạn
        setFilteredHotels(hotelData); // Thiết lập danh sách khách sạn ban đầu
      } catch (err) {
        setError("Lỗi khi gọi API");
      } finally {
        setLoading(false); 
      }
    };

    fetchData();
  }, [setFilteredHotels, setHotels]);

  const handleSearchChange = (event) => {
    const searchTerm = event.target.value.toLowerCase();
    setSearchTerm(searchTerm);

    // Từ cần loại trừ
    const excludeWords = ["thành phố", "tỉnh"];

    const cleanedSearchTerm = excludeWords.reduce((name, word) => {
      return name.replace(new RegExp(word, 'i'), '');
    }, searchTerm).trim();

    // Lọc danh sách khách sạn dựa trên searchTerm đã làm sạch
    const filtered = hotels.filter((hotel) =>
      hotel.location.toLowerCase().includes(cleanedSearchTerm) ||
      hotel.name.toLowerCase().includes(cleanedSearchTerm) // Thêm điều kiện tìm theo tên khách sạn
    );

    setFilteredHotels(filtered);
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
        className="pl-10 py-2 px-4 w-full text-black border border-black rounded-lg focus:border-gray-300  "
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
