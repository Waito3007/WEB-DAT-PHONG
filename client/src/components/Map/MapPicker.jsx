import React, { useEffect, useRef, useState } from 'react';
import axios from 'axios';

const MapPicker = ({ onSelectLocation }) => {
  const mapContainerRef = useRef(null);
  const [searchQuery, setSearchQuery] = useState('');
  const H = window.H; // Đảm bảo rằng biến H được xác định từ HERE Maps
  const mapRef = useRef(null); // Thêm biến để lưu trữ bản đồ

  useEffect(() => {
    const getCurrentLocation = async () => {
      try {
        const response = await axios.get('https://ipinfo.io/json');
        const [latitude, longitude] = response.data.loc.split(',');

        initMap(latitude, longitude);
      } catch (error) {
        console.error('Error fetching location:', error);
        // Vị trí mặc định nếu có lỗi
        initMap(52.5, 13.4);
      }
    };

    const initMap = (lat, lon) => {
      const platform = new H.service.Platform({
        apikey: 'H1_-qxcSX3OZlvwC-TBbarcbIMcp-ckSpYDml1-F9MM',
        language: 'vi'
      });

      const defaultLayers = platform.createDefaultLayers();

      // Chỉ khởi tạo bản đồ nếu chưa có bản đồ nào
      if (!mapRef.current) {
        mapRef.current = new H.Map(
          mapContainerRef.current,
          defaultLayers.vector.normal.map,
          {
            zoom: 10,
            center: { lat: lat, lng: lon },
          }
        );

        const behavior = new H.mapevents.Behavior(new H.mapevents.MapEvents(mapRef.current));
        const ui = H.ui.UI.createDefault(mapRef.current, defaultLayers);

        // Thêm marker cho vị trí hiện tại
        const marker = new H.map.Marker({ lat: lat, lng: lon });
        mapRef.current.addObject(marker);

        // Lưu vị trí đã chọn để gửi về component cha khi chọn
        mapRef.current.addEventListener('tap', (event) => {
          const coords = mapRef.current.screenToGeo(event.currentPointer.viewportX, event.currentPointer.viewportY);
          onSelectLocation({ lat: coords.lat, lng: coords.lng }); // Gọi hàm để gửi vị trí đã chọn
        });
      }
    };

    getCurrentLocation();

    // Cleanup function to remove the map when the component unmounts
    return () => {
      if (mapContainerRef.current) {
        mapContainerRef.current.innerHTML = ''; // Xóa nội dung của container map
        mapRef.current = null; // Đặt lại bản đồ
      }
    };
  }, [onSelectLocation]);

  const handleSearch = () => {
    // Xử lý tìm kiếm địa điểm (cần được triển khai)
    console.log('Tìm kiếm:', searchQuery);
    // Có thể gọi API tìm kiếm địa điểm từ HERE Maps API tại đây
  };

  return (
    <div className="flex flex-col items-center justify-center p-4">
      <h1 className="text-2xl font-bold mb-4">Chọn Vị Trí Trên Bản Đồ</h1>
      <input
        type="text"
        placeholder="Nhập tên địa điểm..."
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        className="border border-gray-300 rounded p-2 mb-4 w-full md:w-1/2"
      />
      <button
        onClick={handleSearch}
        className="bg-blue-500 text-white rounded p-2 hover:bg-blue-600 transition"
      >
        Tìm Kiếm
      </button>
      <div
        ref={mapContainerRef}
        className="w-full h-96 mt-4 border rounded"
      />
    </div>
  );
};

export default MapPicker;
