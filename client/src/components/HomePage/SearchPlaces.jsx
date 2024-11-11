import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

function SearchPlaces() {
  const [provinces, setProvinces] = useState([]); // Tất cả các tỉnh thành
  const [filteredProvinces, setFilteredProvinces] = useState([]); // Tỉnh thành được lọc theo tìm kiếm
  const [inputValue, setInputValue] = useState(""); // Giá trị người dùng nhập
  const [selectedProvince, setSelectedProvince] = useState("");
  const [showSuggestions, setShowSuggestions] = useState(false); // Biến điều khiển hiển thị danh sách gợi ý
  const navigate = useNavigate();

  // Hàm fetch dữ liệu tỉnh thành hàng đầu
  const fetchTopProvinces = async () => {
    try {
      const response = await fetch("/api/tinhthanh/top-provinces");
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
    fetchTopProvinces();
  }, []);

  useEffect(() => {
    // Lọc các tỉnh thành và địa điểm dựa trên inputValue
    if (inputValue) {
      const filtered = provinces.flatMap(province => {
        const provinceMatches = province.name.toLowerCase().includes(inputValue.toLowerCase());

        // Lọc các khách sạn trong tỉnh thành
        const locationMatches = province.locations.filter(location => 
          location.name.toLowerCase().includes(inputValue.toLowerCase()) || 
          location.location.toLowerCase().includes(inputValue.toLowerCase())
        );

        // Nếu tỉnh thành khớp, tạo một mảng gợi ý từ từng khách sạn
        const suggestions = locationMatches.map(location => ({
          provinceName: province.name,
          locationName: location.name,
          locationAddress: location.location,
        }));

        // Kiểm tra xem có tỉnh thành hoặc địa điểm khớp với inputValue hay không
        if (provinceMatches || locationMatches.length > 0) {
          // Thêm gợi ý của tỉnh thành nếu tên tỉnh thành khớp
          if (provinceMatches) {
            suggestions.push({
              provinceName: province.name,
              locationName: province.name, // Thêm tên tỉnh/thành vào gợi ý
              locationAddress: "", // Địa chỉ có thể để trống cho tỉnh/thành
            });
          }
        }

        return suggestions;
      }).filter(suggestion => suggestion.locationName); // Chỉ giữ lại các gợi ý có tên khách sạn

      setFilteredProvinces(filtered.slice(0, 4)); // Giới hạn tối đa 4 gợi ý
    } else {
      setFilteredProvinces([]); // Nếu không có gì nhập thì xóa danh sách
    }
  }, [inputValue, provinces]); // Gọi hàm lọc khi inputValue hoặc provinces thay đổi

  const handleSuggestionClick = (suggestion) => {
    setSelectedProvince(suggestion.locationName);
    setInputValue(`${suggestion.locationName}, ${suggestion.provinceName}`); // Cập nhật input với thông tin location và province
    setFilteredProvinces([]); // Xóa danh sách gợi ý sau khi chọn
    setShowSuggestions(false); // Ẩn danh sách gợi ý
  };

  // Hàm để xóa nội dung ô nhập
  const clearInput = () => {
    setInputValue(""); // Đặt lại giá trị ô nhập thành rỗng
    setFilteredProvinces([]); // Xóa danh sách gợi ý
    setSelectedProvince(""); // Đặt lại tỉnh đã chọn
  };

  const handleSearch = () => {
    if (inputValue.trim()) {
      navigate(`/searchpage?query=${encodeURIComponent(inputValue.trim())}`);
    } else {
      alert("Vui lòng nhập điểm đến hợp lệ."); // Hiển thị cảnh báo nếu input trống
    }
  };

  return (
    <section className="search-places relative">
      <div className="search-container">
        <h2 className="search-title">Bạn muốn đặt phòng ở đâu?</h2> 
        <div className="input-group">
          {/* Nhập tỉnh/thành */}
          <div className="input-item">
            <label htmlFor="province-input">Điểm đến</label>
            <div className="border rounded cursor-pointer relative text-black">
              <input
                type="text"
                id="province-input"
                value={inputValue}
                onChange={(e) => {
                  setInputValue(e.target.value);
                  setShowSuggestions(true); // Hiện gợi ý khi có ký tự nhập
                }}
                placeholder="Bạn muốn đặt phòng ở đâu"
                className="w-full border-none outline-none placeholder-black"
                onFocus={() => setShowSuggestions(true)} // Hiện gợi ý khi ô input được chọn
                onBlur={() => setTimeout(() => setShowSuggestions(false), 200)} // Ẩn gợi ý khi ô input bị bỏ chọn
              />
              {/* Biểu tượng x để xóa nội dung ô nhập */}
              {inputValue && (
                <button 
                  type="button" 
                  className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-600"
                  onClick={clearInput}
                >
                  x
                </button>
              )}
              {/* Danh sách tỉnh thành tìm kiếm */}
              {showSuggestions && filteredProvinces.length > 0 && (
                <ul className="suggestions-list border rounded mt-2 absolute z-10 bg-white border-black w-full">
                  {filteredProvinces.map((suggestion, index) => (
                    <li 
                      key={index} 
                      className="suggestion-item px-4 py-2 text-black cursor-pointer"
                      onClick={() => handleSuggestionClick(suggestion)} // Thêm sự kiện click vào gợi ý
                    >
                      <strong>{suggestion.provinceName}</strong> <br /> {suggestion.locationName} - {suggestion.locationAddress}
                    </li>
                  ))}
                </ul>
              )}
              {/* Hiển thị tỉnh thành hàng đầu nếu không có tìm kiếm */}
              {inputValue === "" && filteredProvinces.length === 0 && showSuggestions && (
                <ul className="suggestions-list border rounded mt-2 absolute z-10 bg-white border-black w-full">
                  {provinces.slice(0, 4).map(province => (
                    <li
                      key={province.id}
                      onClick={() => {
                        setSelectedProvince(province.name);
                        setInputValue(province.name);
                        setFilteredProvinces([]); // Xóa danh sách gợi ý sau khi chọn
                        setShowSuggestions(false); // Ẩn danh sách gợi ý
                      }}
                      className="suggestion-item px-4 py-2 cursor-pointer hover:bg-gray-200"
                    >
                      {province.name}
                    </li>
                  ))}
                </ul>
              )}
            </div>
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
          <button className="show-places-btn" onClick={handleSearch}>Tìm</button>
        </div>
      </div>
    </section>
  );
}

export default SearchPlaces;
