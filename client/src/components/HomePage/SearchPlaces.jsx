// SearchPlaces.jsx
import React from "react";
import { useNavigate } from "react-router-dom"; // Import useNavigate

function SearchPlaces() {
  const navigate = useNavigate(); // Khởi tạo useNavigate

  const handleSearch = () => {
    navigate("/searchpage"); // Chuyển hướng đến trang SearchPage
  };

  return (
    <section className="search-places">
      <div className="search-container">
        <h2 className="search-title">Bạn muốn đặt phòng ở đâu?</h2>
        <div className="input-group">
          <div className="input-item">
            <label htmlFor="destination">Điểm đến</label>
            <input type="text" id="destination" placeholder="Nhập điểm đến" />
          </div>
          <div className="input-item">
            <label htmlFor="room-select">Phòng</label>
            <select id="room-select">
              <option value="1-room-2-guests">1 phòng, 1 người</option>
              <option value="2-room-2-guests">1 phòng, 2 người</option>
              <option value="2-room-2-guests">2 phòng, 2 người</option>
              <option value="2-room-4-guests">2 phòng, 4 người</option>
            </select>
          </div>
        </div>
        <div className="button-group">
          <button className="show-places-btn" onClick={handleSearch}>
            Tìm
          </button>
        </div>
      </div>
    </section>
  );
}

export default SearchPlaces;
