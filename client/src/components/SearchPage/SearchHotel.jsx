import React, { useEffect, useState } from "react";
import { FaSearch } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

function SearchPlaces() {
  const [provinces, setProvinces] = useState([]);
  const [hotels, setHotels] = useState([]); // Danh sách khách sạn từ cơ sở dữ liệu
  const [filteredHotels, setFilteredHotels] = useState([]); // Danh sách khách sạn đã lọc theo tỉnh thành
  const [selectedProvince, setSelectedProvince] = useState("");

  useEffect(() => {
    // Gọi API lấy danh sách tỉnh thành
    fetch("https://esgoo.net/api-tinhthanh/1/0.htm")
      .then((response) => response.json())
      .then((data) => {
        if (data.error === 0) {
          setProvinces(data.data);
        } else {
          console.error("Lỗi khi lấy danh sách tỉnh thành:", data);
        }
      })
      .catch((error) => {
        console.error("Lỗi khi gọi API:", error);
      });

    // Giả sử chúng ta lấy danh sách khách sạn từ một API khác
    fetch("/api/hotels")
      .then((response) => response.json())
      .then((data) => setHotels(data))
      .catch((error) => console.error("Lỗi khi gọi API khách sạn:", error));
  }, []);

  // Hàm xử lý khi thay đổi tỉnh thành
  const handleProvinceChange = (event) => {
    const provinceId = event.target.value;
    setSelectedProvince(provinceId);

    // Tìm tên tỉnh thành từ `provinces`
    const provinceName = provinces.find((p) => p.id === provinceId)?.full_name;

    // Lọc các khách sạn có địa chỉ chứa tên tỉnh thành
    if (provinceName) {
      const filtered = hotels.filter((hotel) =>
        hotel.location.includes(provinceName)
      );
      setFilteredHotels(filtered);
    } else {
      setFilteredHotels(hotels); // Nếu không chọn tỉnh nào, hiển thị toàn bộ khách sạn
    }
  };

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
            <input type="date" id="check-in" />
          </div>
          <div className="input-hotel">
            <label htmlFor="check-out">Ngày trả phòng</label>
            <input type="date" id="check-out" />
          </div>
          <div className="input-hotel">
            <label htmlFor="room-select">Phòng</label>
            <select id="room-select">
              <option value="1-room-1-guest">1 phòng, 1 người</option>
              <option value="1-room-2-guests">1 phòng, 2 người</option>
              <option value="2-room-2-guests">2 phòng, 2 người</option>
              <option value="2-room-4-guests">2 phòng, 4 người</option>
            </select>
          </div>
          <div className="input-hotel">
            <button className="search-btn">
              <FaSearch />
            </button>
          </div>
        </div>

        {/* Hiển thị danh sách khách sạn đã lọc */}
        <div className="hotel-list">
          {filteredHotels.map((hotel) => (
            <div key={hotel.id} className="hotel-item">
              <h3>{hotel.name}</h3>
              <p>{hotel.location}</p>
              <p>{hotel.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default SearchPlaces;
