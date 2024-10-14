import React from "react";
import { FaSearch } from "react-icons/fa";

function SearchPlaces() {
  return (
    <section className="search-hotel">
      <div className="search-container-hotel">
        <div className="input-group-hotel">
          <div className="input-hotel">
            <label htmlFor="destination">Điểm đến</label>
            <input type="text" id="destination" placeholder="Nhập điểm đến" />
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
              <option value="1-room-2-guests">1 phòng, 1 người</option>
              <option value="2-room-2-guests">1 phòng, 2 người</option>
              <option value="2-room-2-guests">2 phòng, 2 người</option>
              <option value="2-room-2-guests">2 phòng, 4 người</option>
            </select>
          </div>
          <div className="input-hotel">
            {/* Nút tìm kiếm thay thế bằng icon */}
            <button className="search-btn">
              <FaSearch />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}

export default SearchPlaces;
