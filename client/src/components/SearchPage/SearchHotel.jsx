import React, { useEffect, useState, memo, useCallback, useMemo } from "react";
import { useLocation } from "react-router-dom";

const API_URL = process.env.REACT_APP_API_URL;

const SearchHotel = memo(({ setFilteredHotels, setHotels, hotels }) => {
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const locationFilter = queryParams.get("location");

  const [provinces, setProvinces] = useState([]);
  const [searchTerm, setSearchTerm] = useState(locationFilter || "");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);

  // Debounced search function để tránh search quá nhiều
  const debouncedSearch = useMemo(() => {
    let timeoutId;
    return (term) => {
      setIsSearching(true);
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => {
        if (!term.trim()) {
          setFilteredHotels(hotels);
          setIsSearching(false);
          return;
        }

        const excludeWords = ["thành phố", "tỉnh"];
        const cleanedSearchTerm = excludeWords.reduce((name, word) => {
          return name.replace(new RegExp(word, 'i'), '');
        }, term.toLowerCase()).trim();

        const filtered = hotels.filter((hotel) => {
          const hotelName = hotel.name?.toLowerCase() || '';
          const hotelLocation = hotel.location?.toLowerCase() || '';
          
          return hotelLocation.includes(cleanedSearchTerm) || 
                 hotelName.includes(cleanedSearchTerm);
        });

        setFilteredHotels(filtered);
        setIsSearching(false);
      }, 300); // Delay 300ms
    };
  }, [hotels, setFilteredHotels]);

  // Fetch data với error handling và timeout
  useEffect(() => {
    const fetchData = async () => {
      try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 10000); // 10s timeout

        // Fetch provinces và hotels song song
        const [provinceResponse, hotelResponse] = await Promise.all([
          fetch(`${API_URL}/api/tinhthanh/top-provinces`, {
            credentials: 'include',
            signal: controller.signal
          }),
          fetch(`${API_URL}/api/searchhotel/Search`, {
            credentials: 'include',
            signal: controller.signal
          })
        ]);

        clearTimeout(timeoutId);

        if (!provinceResponse.ok || !hotelResponse.ok) {
          throw new Error('API response not ok');
        }

        const [provinceData, hotelData] = await Promise.all([
          provinceResponse.json(),
          hotelResponse.json()
        ]);

        if (provinceData.error === 0) {
          setProvinces(provinceData.data);
        } else {
          setError("Lỗi khi lấy danh sách tỉnh thành");
        }

        setHotels(hotelData);
        setFilteredHotels(hotelData);
      } catch (err) {
        if (err.name === 'AbortError') {
          setError("Kết nối quá chậm, vui lòng thử lại");
        } else {
          setError("Lỗi khi gọi API");
          console.error('API Error:', err);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [setFilteredHotels, setHotels]);

  // Filter hotels function for direct use
  const filterHotels = useCallback((term) => {
    if (!term.trim()) {
      setFilteredHotels(hotels);
      return;
    }

    const excludeWords = ["thành phố", "tỉnh"];
    const cleanedSearchTerm = excludeWords.reduce((name, word) => {
      return name.replace(new RegExp(word, 'i'), '');
    }, term.toLowerCase()).trim();

    const filtered = hotels.filter((hotel) => {
      const hotelName = hotel.name?.toLowerCase() || '';
      const hotelLocation = hotel.location?.toLowerCase() || '';
      
      return hotelLocation.includes(cleanedSearchTerm) || 
             hotelName.includes(cleanedSearchTerm);
    });

    setFilteredHotels(filtered);
  }, [hotels, setFilteredHotels]);

  // Auto filter on location change
  useEffect(() => {
    if (locationFilter && hotels.length > 0) {
      filterHotels(locationFilter.toLowerCase());
    }
  }, [locationFilter, hotels, filterHotels]);

  const handleSearchChange = useCallback((event) => {
    const newSearchTerm = event.target.value;
    setSearchTerm(newSearchTerm);
    setShowSuggestions(newSearchTerm.length > 0);
    debouncedSearch(newSearchTerm.toLowerCase());
  }, [debouncedSearch]);

  const handleSuggestionClick = useCallback((province) => {
    setSearchTerm(province.name);
    setShowSuggestions(false);
    filterHotels(province.name.toLowerCase());
  }, [filterHotels]);

  const clearSearch = useCallback(() => {
    setSearchTerm("");
    setShowSuggestions(false);
    setFilteredHotels(hotels);
  }, [hotels, setFilteredHotels]);

  // Filtered suggestions based on search term
  const filteredSuggestions = useMemo(() => {
    if (!searchTerm || !provinces.length) return [];
    return provinces.filter(province => 
      province.name.toLowerCase().includes(searchTerm.toLowerCase())
    ).slice(0, 5);
  }, [searchTerm, provinces]);

  if (loading) {
    return (
      <div className="w-full bg-white shadow-sm border-b border-gray-100 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col sm:flex-row gap-4 items-center">
            <div className="w-full sm:flex-1">
              <div className="animate-pulse bg-gradient-to-r from-gray-200 to-gray-300 h-14 rounded-xl"></div>
            </div>
            <div className="flex items-center space-x-2 text-gray-600">
              <div className="animate-spin w-5 h-5 border-2 border-blue-500 border-t-transparent rounded-full"></div>
              <span className="text-sm font-medium">Đang tải dữ liệu...</span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="w-full bg-white shadow-sm border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="text-center py-8">
            <div className="mx-auto w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mb-4">
              <svg className="w-8 h-8 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Có lỗi xảy ra</h3>
            <p className="text-red-500 mb-4">{error}</p>
            <button 
              onClick={() => window.location.reload()} 
              className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-6 rounded-lg transition-colors duration-200"
            >
              Thử lại
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full bg-white shadow-sm border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex flex-col space-y-4">
          {/* Search Header */}
          <div className="text-center sm:text-left">
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">
              Tìm kiếm khách sạn
            </h2>
            <p className="text-gray-600">
              Khám phá {hotels?.length || 0} khách sạn tuyệt vời tại Việt Nam
            </p>
          </div>

          {/* Search Bar */}
          <div className="relative max-w-2xl mx-auto sm:mx-0 w-full">
            <div className="flex gap-3">
              {/* Input Container */}
              <div className="relative flex-1">
                <input
                  id="destination"
                  type="text"
                  value={searchTerm}
                  onChange={handleSearchChange}
                  placeholder="Nhập tên tỉnh thành hoặc tên khách sạn..."
                  className="block w-full px-4 py-4 text-gray-900 bg-white border border-gray-300 rounded-xl shadow-sm placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 text-base"
                  autoComplete="off"
                />
                
                {/* Clear button inside input */}
                {searchTerm && !isSearching && (
                  <button
                    onClick={clearSearch}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600 transition-colors"
                    title="Xóa tìm kiếm"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                )}
              </div>
              
              {/* Search Button */}
              <button
                onClick={() => debouncedSearch(searchTerm.toLowerCase())}
                disabled={isSearching || !searchTerm.trim()}
                className="flex-shrink-0 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed text-white px-6 py-4 rounded-xl transition-all duration-200 font-medium shadow-sm hover:shadow-md flex items-center space-x-2"
              >
                {isSearching ? (
                  <>
                    <div className="animate-spin w-5 h-5 border-2 border-white border-t-transparent rounded-full"></div>
                    <span className="hidden sm:inline">Đang tìm...</span>
                  </>
                ) : (
                  <>
                    <svg
                      className="w-5 h-5"
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
                    <span className="hidden sm:inline">Tìm kiếm</span>
                  </>
                )}
              </button>
            </div>

            {/* Suggestions Dropdown */}
            {showSuggestions && filteredSuggestions.length > 0 && (
              <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-gray-200 rounded-xl shadow-lg z-50 max-h-64 overflow-y-auto">
                <div className="p-2">
                  <div className="text-xs font-medium text-gray-500 px-3 py-2 border-b border-gray-100">
                    Gợi ý tỉnh thành
                  </div>
                  {filteredSuggestions.map((province, index) => (
                    <button
                      key={index}
                      onClick={() => handleSuggestionClick(province)}
                      className="w-full text-left px-3 py-3 hover:bg-gray-50 transition-colors duration-150 rounded-lg flex items-center space-x-3"
                    >
                      <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                      <span className="text-gray-900">{province.name}</span>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Search Stats */}
          {searchTerm && (
            <div className="text-sm text-gray-600 text-center sm:text-left">
              {isSearching ? (
                <span className="flex items-center justify-center sm:justify-start space-x-2">
                  <div className="animate-spin w-4 h-4 border-2 border-blue-500 border-t-transparent rounded-full"></div>
                  <span>Đang tìm kiếm...</span>
                </span>
              ) : (
                <span>
                  Tìm thấy kết quả cho "<strong>{searchTerm}</strong>"
                </span>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
});

SearchHotel.displayName = 'SearchHotel';

export default SearchHotel;
