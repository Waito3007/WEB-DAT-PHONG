import React, { useEffect, useState } from "react";

function SearchPlaces() {
  const [provinces, setProvinces] = useState([]);
  const [selectedProvince, setSelectedProvince] = useState("");

  // Hàm fetch dữ liệu từ API
  const fetchProvinces = async () => {
    try {
      const response = await fetch("https://esgoo.net/api-tinhthanh/1/0.htm");
      if (response.ok) {
        const result = await response.json();
        if (result.error === 0 && Array.isArray(result.data)) {
          setProvinces(result.data);
        } else {
          console.error("Dữ liệu từ API không hợp lệ:", result);
        }
      } else {
        console.error("Lỗi khi lấy dữ liệu tỉnh thành:", response.status);
      }
    } catch (error) {
      console.error("Lỗi khi kết nối tới API:", error);
    }
  };

  useEffect(() => {
    fetchProvinces();
  }, []);

  return (
    <section className="search-places">
      <div className="search-container">
        <h2 className="search-title">Bạn muốn đặt phòng ở đâu?</h2>
        
        <div className="input-group">
          {/* Select tỉnh/thành */}
          <div className="input-item">
            <label htmlFor="province-select">Điểm đến</label>
            <select
              id="province-select"
              value={selectedProvince}
              onChange={(e) => setSelectedProvince(e.target.value)}
              className="border rounded px-4 py-2"
            >
              <option value="">Chọn điểm đến</option>
              {provinces.map((province) => (
                <option key={province.id} value={province.name}>
                  {province.name}
                </option>
              ))}
            </select>
          </div>

          {/* Chọn số lượng phòng */}
          <div className="input-item">
            <label htmlFor="room-select">Phòng</label>
            <select id="room-select" className="border rounded px-4 py-2">
              <option value="1-room-2-guests">1 phòng, 1 người</option>
              <option value="2-room-2-guests">1 phòng, 2 người</option>
              <option value="2-room-2-guests">2 phòng, 2 người</option>
              <option value="2-room-2-guests">2 phòng, 4 người</option>
            </select>
          </div>
        </div>

        {/* Nút tìm kiếm */}
        <div className="button-group">
          <button className="show-places-btn">Tìm</button>
        </div>
      </div>
    </section>
  );
}

export default SearchPlaces;
