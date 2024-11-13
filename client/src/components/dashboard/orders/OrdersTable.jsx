import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Eye, Edit, Search } from 'lucide-react';
import axios from 'axios';
import BookingDetailsModal from './BookingDetailsModal';
import UpdateStatusModal from './UpdateStatusModal';
const OrderTable = () => {
  const [data, setData] = useState([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [isStatusModalVisible, setIsStatusModalVisible] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  // Phân trang
  const [currentPage, setCurrentPage] = useState(1);
  const [bookingsPerPage] = useState(4); // Số lượng booking mỗi trang
  const [filteredBookings, setFilteredBookings] = useState([]);

  useEffect(() => {
    axios.get('/api/booking/booking/manager')
      .then((response) => {
        setData(response.data);
        setFilteredBookings(response.data); // Lưu trữ toàn bộ dữ liệu
      })
      .catch((error) => {
        console.error('Error fetching data:', error);
      });
  }, []);

  const showModal = (booking) => {
    setSelectedBooking(booking);
    setIsModalVisible(true);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
    setSelectedBooking(null);
    setIsStatusModalVisible(false);
  };

  const getPaymentStatusText = (status) => {
    switch (status) {
      case 'Complete':
        return 'Đã thanh toán';
      case 'Pending':
        return 'Chưa thanh toán';
      case 'CheckIn':
        return 'Đã nhận phòng';
      case 'Done':
        return 'Đã hoàn thành';
      default:
        return '';
    }
  };

  const indexOfLastBooking = currentPage * bookingsPerPage;
  const indexOfFirstBooking = indexOfLastBooking - bookingsPerPage;
  const currentBookings = filteredBookings.slice(indexOfFirstBooking, indexOfLastBooking);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  const pageNumbers = [];
  for (let i = 1; i <= Math.ceil(filteredBookings.length / bookingsPerPage); i++) {
    pageNumbers.push(i);
  }

  const handleUpdateStatus = (status) => {
    // Cập nhật trạng thái booking
    axios.put(`/api/booking/${selectedBooking._id}/update-status`, { status })
      .then(() => {
        // Cập nhật trạng thái trong bộ dữ liệu state
        const updatedBookings = filteredBookings.map((booking) => 
          booking._id === selectedBooking._id ? { ...booking, paymentStatus: status } : booking
        );
        setFilteredBookings(updatedBookings); // Cập nhật filteredBookings mà không cần gọi lại API
        setSelectedBooking({ ...selectedBooking, paymentStatus: status });
        setIsStatusModalVisible(false);
      })
      .catch((error) => {
        console.error('Error updating status:', error);
      });
  };

  // Handle tìm kiếm người dùng
  const handleSearch = (e) => {
    const term = e.target.value.toLowerCase();
    setSearchTerm(term);
    const filtered = data.filter((booking) =>
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
    const printContents = document.querySelector('.modal-content').innerHTML;
    // Tạo cửa sổ mới để in
    const printWindow = window.open('', '', 'height=600,width=800');
    printWindow.document.write('<html><head><title>In hóa đơn</title>');
    // Thêm CSS cho cửa sổ in
    printWindow.document.write('<style>body {font-family: Arial, sans-serif; padding: 20px;} .modal-content {font-size: 16px;}</style>');
    printWindow.document.write('</head><body>');
    printWindow.document.write(printContents);  // Ghi nội dung modal vào cửa sổ in
    printWindow.document.write('</body></html>');
    printWindow.document.close();  // Đóng cửa sổ để trình duyệt có thể xử lý
  
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
        <div className='flex justify-between items-center mb-6'>
          <div className='flex-grow'>
            <h2 className='text-xl font-semibold text-gray-100'>Đặt phòng</h2>
          </div>
          <div className='relative'>
            <input 
              type="search"
              placeholder="Tìm kiếm"
              className="text-white bg-gray-700 placeholder-gray-400 rounded-lg pl-10 pr-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={searchTerm}
              onChange={handleSearch}
            />
            <Search className='absolute left-3 top-2.5 text-gray-400' size={18} />
          </div>
        </div>
        <table className="min-w-full table-auto text-white">          
          <thead>
            <tr className="text-left">
              <th className="px-4 py-2">Khách sạn</th>
              <th className="px-4 py-2">Loại Phòng</th>
              <th className="px-4 py-2">Ngày đặt</th>
              <th className="px-4 py-2">Check-In / Check-Out</th>
              <th className="px-4 py-2">Thông tin</th>
              <th className="px-4 py-2">Phone</th>
              <th className="px-4 py-2">Trạng thái</th>
              <th className="px-4 py-2">Hành động</th>
            </tr>
          </thead>
          <tbody>
            {currentBookings.map((booking) => (
              <tr key={booking._id} className="border-b border-gray-700">
                <td className="px-4 py-2">
                  <strong>{booking.room.hotel.name}</strong>
                </td>
                <td className="px-4 py-2 text-slate-400">{booking.room.type}</td>
                <td className="px-4 py-2">
                  {new Date(booking.bookingDate).toLocaleString()}
                </td>
                <td className="px-4 py-2 text-slate-400">
                  <p>{new Date(booking.checkInDate).toLocaleDateString()}</p>
                  <p>{new Date(booking.checkOutDate).toLocaleDateString()}</p>
                </td>
                <td className="px-4 py-2">
                  <p>{booking.user.name || 'No name'}</p>
                  <p>{booking.user.email || 'No email'}</p>
                </td>
                <td className="px-4 py-2">{booking.phoneBooking}</td>
                <td className="px-4 py-2">
                  <span
                    onClick={() => {
                      setSelectedBooking(booking);
                      setIsStatusModalVisible(true);
                    }}
                    className={` text-sm cursor-pointer ${booking.paymentStatus === 'Complete' ? 'text-green-600' : 'text-red-600 '}`}
                  >
                    {getPaymentStatusText(booking.paymentStatus)}
                  </span>
                </td>
                <td className="">
                  <button
                    onClick={() => showModal(booking)}
                    className="text-blue-500 text-left hover:underline flex items-center gap-1"
                  >
                    <Eye size={18} />
                    Chi tiết
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
                  className={`px-4 py-2 rounded-lg ${currentPage === number ? 'bg-blue-500 text-white' : 'bg-gray-700 text-gray-300'}`}
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
    </motion.div>
  );
};
export default OrderTable;