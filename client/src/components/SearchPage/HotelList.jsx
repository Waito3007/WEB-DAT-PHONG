import React, { useState } from "react";
import { Rate } from "antd"; // Import Rate từ Ant Design
import HotelItem from "./HotelItem";

const HotelList = ({ hotels = [] }) => {
  const [currentPage, setCurrentPage] = useState(1); // Trang hiện tại
  const hotelsPerPage = 5; // Số lượng khách sạn mỗi trang

  // Tính chỉ số khách sạn bắt đầu và kết thúc cho trang hiện tại
  const indexOfLastHotel = currentPage * hotelsPerPage;
  const indexOfFirstHotel = indexOfLastHotel - hotelsPerPage;

  // Cắt danh sách khách sạn cho trang hiện tại
  const currentHotels = hotels.slice(indexOfFirstHotel, indexOfLastHotel);

  // Tính tổng số trang
  const totalPages = Math.ceil(hotels.length / hotelsPerPage);

  // Hàm thay đổi trang
  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  return (
    <div className="container">
      <div className="flex">
        <div className="hotel-list w-full">
          <div className="grid grid-cols-1 gap-4">
            {Array.isArray(currentHotels) && currentHotels.length > 0 ? (
              currentHotels.map((hotel) => {
                const lowestRoomPrice =
                  hotel.rooms && hotel.rooms.length > 0
                    ? Math.min(...hotel.rooms.map((room) => room.price))
                    : null;

                return (
                  <HotelItem
                    key={hotel._id}
                    hotel={hotel}
                    lowestRoomPrice={lowestRoomPrice}
                  />
                );
              })
            ) : (
              <p>Không có khách sạn nào được tìm thấy.</p>
            )}
          </div>

          {/* Flowbite Pagination */}
          <div className="flex justify-center mt-4">
            <nav aria-label="Page navigation example">
              <ul className="inline-flex items-center space-x-2">
                <li>
                  <button
                    className="px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-lg hover:bg-gray-100 hover:text-gray-700"
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                  >
                    Trước đó
                  </button>
                </li>

                {/* Hiển thị số trang */}
                {Array.from({ length: totalPages }, (_, index) => (
                  <li key={index}>
                    <button
                      className={`px-3 py-2 text-sm font-medium ${
                        currentPage === index + 1
                          ? "text-blue-600 bg-blue-100"
                          : "text-gray-500 bg-white"
                      } border border-gray-300 rounded-lg hover:bg-gray-100 hover:text-gray-700`}
                      onClick={() => handlePageChange(index + 1)}
                    >
                      {index + 1}
                    </button>
                  </li>
                ))}

                <li>
                  <button
                    className="px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-lg hover:bg-gray-100 hover:text-gray-700"
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage === totalPages}
                  >
                    Tiếp theo
                  </button>
                </li>
              </ul>
            </nav>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HotelList;
