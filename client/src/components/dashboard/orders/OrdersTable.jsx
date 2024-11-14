import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Eye, Edit, Trash2, Search } from "lucide-react";
import axios from "axios";
import BookingDetailsModal from "./BookingDetailsModal";

import UpdateStatusModal from "./UpdateStatusModal";
import EditBookingModal from "./EditBookingModal";
import DeleteBookingModal from "./DeleteModal";
const OrderTable = () => {
  const [data, setData] = useState([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [isStatusModalVisible, setIsStatusModalVisible] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  // Phân trang
  const [currentPage, setCurrentPage] = useState(1);
  const [bookingsPerPage] = useState(4); // Số lượng booking mỗi trang
  const [filteredBookings, setFilteredBookings] = useState([]);
  const [isEditModalVisible, setIsEditModalVisible] = useState(false);
  const [isDeleteModalVisible, setIsDeleteModalVisible] = useState(false);
  useEffect(() => {
    axios
      .get("/api/booking/booking/manager")
      .then((response) => {
        setData(response.data);
        setFilteredBookings(response.data); // Lưu trữ toàn bộ dữ liệu
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
      });
  }, []);

  const loadBookings = () => {
    axios
      .get("/api/booking/booking/manager")
      .then((response) => {
        setFilteredBookings(response.data); // Cập nhật lại filteredBookings với dữ liệu mới
      })
      .catch((error) => {
        console.error("Error fetching updated data:", error);
      });
  };

  const showModal = (booking) => {
    setSelectedBooking(booking);
    setIsModalVisible(true);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
    setSelectedBooking(null);
    setIsStatusModalVisible(false);
  };

  const showModalEdit = (booking) => {
    setSelectedBooking(booking);
    setIsEditModalVisible(true);
  };

  const handleEditCancel = () => {
    setIsEditModalVisible(false);
    setSelectedBooking(null);
  };

  const showModalDelete = (booking) => {
    setSelectedBooking(booking);
    setIsDeleteModalVisible(true);
  };

  const handleDeleteCancel = () => {
    setIsDeleteModalVisible(false);
    setSelectedBooking(null);
  };
  const getPaymentStatusText = (status) => {
    switch (status) {
      case "Complete":
        return "Đã thanh toán";
      case "Pending":
        return "Chưa thanh toán";
      case "CheckIn":
        return "Đã nhận phòng";
      case "Done":
        return "Đã hoàn thành";
      default:
        return "";
    }
  };

  const indexOfLastBooking = currentPage * bookingsPerPage;
  const indexOfFirstBooking = indexOfLastBooking - bookingsPerPage;
  const currentBookings = filteredBookings.slice(
    indexOfFirstBooking,
    indexOfLastBooking
  );

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  const pageNumbers = [];
  for (
    let i = 1;
    i <= Math.ceil(filteredBookings.length / bookingsPerPage);
    i++
  ) {
    pageNumbers.push(i);
  }

  const handleUpdateStatus = (status) => {
    // Cập nhật trạng thái booking
    axios
      .put(`/api/booking/${selectedBooking._id}/update-status`, { status })
      .then(() => {
        // Cập nhật trạng thái trong bộ dữ liệu state
        const updatedBookings = filteredBookings.map((booking) =>
          booking._id === selectedBooking._id
            ? { ...booking, paymentStatus: status }
            : booking
        );
        setFilteredBookings(updatedBookings); // Cập nhật filteredBookings mà không cần gọi lại API
        setSelectedBooking({ ...selectedBooking, paymentStatus: status });
        setIsStatusModalVisible(false);
      })
      .catch((error) => {
        console.error("Error updating status:", error);
      });
  };
  //
  // Handle tìm kiếm người dùng
  const handleSearch = (e) => {
    const term = e.target.value.toLowerCase();
    setSearchTerm(term);
    const filtered = data.filter(
      (booking) =>
        booking.user.name.toLowerCase().includes(term) ||
        booking.user.email.toLowerCase().includes(term) ||
        booking.orderId.toLowerCase().includes(term) || // Tìm theo mã đặt phòng
        booking.room.hotel.name.toLowerCase().includes(term) || // Tìm theo tên khách sạn
        booking.room.type.toLowerCase().includes(term) || // Tìm theo loại phòng
        new Date(booking.bookingDate).toLocaleDateString().includes(term) || // Tìm theo ngày đặt
        getPaymentStatusText(booking.paymentStatus).toLowerCase().includes(term) // Tìm theo trạng thái thanh toán
    );
    setFilteredBookings(filtered);
  };

  //handle print
  const handlePrint = () => {
    // Lấy phần tử có lớp modal-content
    const printContents = document.querySelector(".modal-content").innerHTML;
    // Tạo cửa sổ mới để in
    const printWindow = window.open("", "", "height=600,width=800");
    printWindow.document.write("<html><head><title>In hóa đơn</title>");
    // Thêm CSS cho cửa sổ in
    printWindow.document.write(
      "<style>body {font-family: Arial, sans-serif; padding: 20px;} .modal-content {font-size: 16px;}</style>"
    );
    printWindow.document.write("</head><body>");
    printWindow.document.write(printContents); // Ghi nội dung modal vào cửa sổ in
    printWindow.document.write("</body></html>");
    printWindow.document.close(); // Đóng cửa sổ để trình duyệt có thể xử lý

    // Gọi lệnh in của trình duyệt
    printWindow.print();
  };
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="container mx-auto p-4"
    >
      <div className="bg-gray-800 bg-opacity-50 backdrop-blur-md shadow-lg rounded-xl p-6 border border-gray-700 mb-8">
        <div className="flex justify-between items-center mb-6">
          <div className="flex-grow">
            <h2 className="text-xl font-semibold text-gray-100">Đặt phòng</h2>
          </div>

          <div className="relative">
            <input
              type="search"
              placeholder="Tìm kiếm"
              className="text-white bg-gray-700 placeholder-gray-400 rounded-lg pl-10 pr-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-150"
              value={searchTerm}
              onChange={handleSearch}
            />
            <Search
              className="absolute left-3 top-2.5 text-gray-400 transition-transform duration-150"
              size={18}
            />
          </div>
        </div>
        <table className="min-w-full table-auto text-white">
          <thead>
            <tr className="text-left">
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                Khách sạn
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                Loại Phòng
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                Ngày đặt
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                Thời gian
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                Thông tin
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                Phone
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                Trạng thái
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                Hành động
              </th>
            </tr>
          </thead>
          <tbody>
            {currentBookings.map((booking) => (
              <tr
                key={booking._id}
                className="border-b border-gray-700 hover:bg-gray-800 transition duration-150"
              >
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-100">
                  <strong>{booking.room.hotel.name}</strong>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm  text-slate-400">
                  {booking.room.type}
                </td>
                <td className="px-2 py-2 whitespace-nowrap text-sm text-gray-300">
                  {new Date(booking.bookingDate).toLocaleString()}
                </td>
                <td className="px-4 py-2 text-slate-400">
                  <div className="text-xs font-semibold">
                    <p className="check-in text-gray-300">{`Nhận phòng: ${new Date(
                      booking.checkInDate
                    ).toLocaleDateString()}`}</p>
                    <p className="check-out text-gray-300">{`Trả phòng: ${new Date(
                      booking.checkOutDate
                    ).toLocaleDateString()}`}</p>
                  </div>
                </td>

                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-100">
                  <p>{booking.user.name || "No name"}</p>
                  {/* <p>{booking.user.email || "No email"}</p> */}
                </td>
                <td className="px-4 py-2">{booking.phoneBooking}</td>
                <td className="px-4 py-2">
                  <span
                    onClick={() => {
                      setSelectedBooking(booking);
                      setIsStatusModalVisible(true);
                    }}
                    className={`whitespace-nowrap text-sm cursor-pointer ${
                      booking.paymentStatus === "Complete"
                        ? "text-green-600"
                        : "text-red-600 "
                    }`}
                  >
                    {getPaymentStatusText(booking.paymentStatus)}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                  {/* Tooltip cho nút Xem chi tiết */}
                  <button
                    onClick={() => showModal(booking)}
                    className="text-blue-500 hover:text-blue-700 mr-2 relative group"
                  >
                    <Eye size={18} />
                    <span className="tooltip hidden group-hover:block absolute bg-gray-700 text-white text-xs rounded px-2 py-1 bottom-full mb-1">
                      Xem chi tiết
                    </span>
                  </button>

                  {/* Tooltip cho nút Sửa */}
                  <button
                    onClick={() => showModalEdit(booking)}
                    className="text-yellow-500 hover:text-yellow-700 mr-2 relative group"
                  >
                    <Edit size={18} />
                    <span className="tooltip hidden group-hover:block absolute bg-gray-700 text-white text-xs rounded px-2 py-1 bottom-full mb-1">
                      Sửa thông tin
                    </span>
                  </button>

                  {/* Tooltip cho nút Xóa */}
                  <button
                    onClick={() => showModalDelete(booking)}
                    className="text-red-500 hover:text-red-700 relative group"
                  >
                    <Trash2 size={18} />
                    <span className="tooltip hidden group-hover:block absolute bg-gray-700 text-white text-xs rounded px-2 py-1 bottom-full mb-1">
                      Xóa
                    </span>
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {/* Phân trang */}
        <div className="flex justify-center mt-4">
          <ul className="flex space-x-2">
            {pageNumbers.map((number) => (
              <li key={number}>
                <button
                  onClick={() => paginate(number)}
                  className={`px-4 py-2 rounded-lg ${
                    currentPage === number
                      ? "bg-blue-500 text-white"
                      : "bg-gray-700 text-gray-300"
                  }`}
                >
                  {number}
                </button>
              </li>
            ))}
          </ul>
        </div>
      </div>
      {/* Modal cho chi tiết booking */}
      {isModalVisible && (
        <BookingDetailsModal
          booking={selectedBooking}
          onClose={handleCancel}
          onPrint={handlePrint}
        />
      )}
      {/* Modal cho cập nhật trạng thái */}
      {isStatusModalVisible && selectedBooking && (
        <UpdateStatusModal
          isVisible={isStatusModalVisible}
          onClose={handleCancel}
          onUpdateStatus={handleUpdateStatus}
          getStatusText={getPaymentStatusText}
        />
      )}

      <EditBookingModal
        visible={isEditModalVisible}
        booking={selectedBooking}
        onClose={handleEditCancel}
        onUpdate={loadBookings}
      />

      {selectedBooking && (
        <DeleteBookingModal
          isVisible={isDeleteModalVisible}
          onCancel={handleDeleteCancel}
          booking={selectedBooking}
          onDelete={loadBookings} // Update bookings after deletion
        />
      )}
    </motion.div>
  );
};
export default OrderTable;
