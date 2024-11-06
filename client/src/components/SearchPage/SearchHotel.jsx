import React, { useEffect, useState } from "react"; 
import { FaSearch } from "react-icons/fa";
import 'antd/dist/antd';

function SearchHotel({ setFilteredHotels, setHotels, hotels }) {
  const [provinces, setProvinces] = useState([]);
  const [selectedProvince, setSelectedProvince] = useState("");
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

  const handleProvinceChange = (event) => {
    const provinceId = event.target.value;
    setSelectedProvince(provinceId);
  
    const provinceName = provinces.find((p) => p.id === provinceId)?.full_name;
  
    // Mảng chứa các từ cần loại trừ
    const excludeWords = ["thành phố", "tỉnh"];
  
    if (provinceName) {
      // Loại bỏ các từ không mong muốn
      const cleanedProvinceName = excludeWords.reduce((name, word) => {
        return name.replace(new RegExp(word, 'i'), ''); // Loại bỏ từ, không phân biệt chữ hoa chữ thường
      }, provinceName)
      .trim() // Xóa khoảng trắng ở đầu và cuối
      .toLowerCase(); // Chuyển về chữ thường
  
      // Lọc danh sách khách sạn dựa trên cleanedProvinceName
      const filtered = hotels.filter((hotel) =>
        hotel.location.toLowerCase().includes(cleanedProvinceName)
      );
  
      setFilteredHotels(filtered);
    } else {
      setFilteredHotels(hotels); 
    }
  };
  
  
  
  
  

  const handleSearch = () => {
    // Logic cho tìm kiếm
  };

  if (loading) return <p>Đang tải dữ liệu...</p>; 
  if (error) return <p>{error}</p>; 

  return (
    <section className="search-hotel">
      <div className="search-container-hotel">
        <div className="input-group-hotel">
          <div className="input-hotel">
            <label htmlFor="destination">Điểm đến</label>
            <select
              id="destination"
              value={selectedProvince}
              onChange={handleProvinceChange}
            >
              <option value="">Chọn Tỉnh Thành</option>
              {provinces.map((province) => (
                <option key={province.id} value={province.id}>
                  {province.full_name}
                </option>
              ))}
            </select>
          </div>
          <div className="input-hotel">
            <label htmlFor="check-in">Ngày nhận phòng</label>
            <input 
              type="date" 
              id="check-in" 
              value={checkInDate} 
              onChange={(e) => setCheckInDate(e.target.value)} 
            />
          </div>
          <div className="input-hotel">
            <label htmlFor="check-out">Ngày trả phòng</label>
            <input 
              type="date" 
              id="check-out" 
              value={checkOutDate} 
              onChange={(e) => setCheckOutDate(e.target.value)} 
            />
          </div>
          <div className="input-hotel">
            <button className="search-btn" onClick={handleSearch}>
              <FaSearch />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}

export default SearchHotel;
