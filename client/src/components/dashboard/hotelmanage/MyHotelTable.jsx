/* eslint-disable no-unused-vars */
import { useEffect, useState, useCallback } from 'react';
import axios from 'axios';
import { motion } from 'framer-motion';
import { Edit, Trash2, PlusCircle, Eye } from 'lucide-react';
import { Modal, Input, Button, Form,Rate, notification } from 'antd';
import RoomListDrawer from './RoomListDrawer'; // Import component
import EditHotelModal from './EditHotelModal';
import AddHotelModal from './AddHotelModal'; // Import AddHotelModal



const MyHotelTable = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [hotels, setHotels] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [hotelsPerPage] = useState(15);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [currentHotel, setCurrentHotel] = useState(null);
  const [fileList, setFileList] = useState([]);
  const [form] = Form.useForm();
  const [isAddModalVisible, setIsAddModalVisible] = useState(false);
  const [isDeleteModalVisible, setIsDeleteModalVisible] = useState(false);
  const [password, setPassword] = useState('');
  const [selectedHotelRooms, setSelectedHotelRooms] = useState([]);
  const [isModalRoomVisible, setIsModalRoomVisible] = useState(false);




//load dữ liệu
  const fetchHotels = useCallback(async () => {
    try {
      const response = await axios.get('/api/hotel/myhotels', { withCredentials: true });
      setHotels(response.data);
    } catch (error) {
      console.error('Lỗi khi lấy danh sách khách sạn:', error);
    }
  }, []);

  useEffect(() => {
    fetchHotels();
  }, [fetchHotels]);
  

//hiển thị modal
  const showModal = (hotel) => {
    setCurrentHotel(hotel);
    setFileList(hotel.imagehotel.map(url => ({ uid: url, url })));
    form.setFieldsValue({
      name: hotel.name,
      location: hotel.location,
      description: hotel.description,
      stars: hotel.stars,
    });
    setIsModalVisible(true);
  };

//cập nhật khách sạn
  const handleUpdateHotel = () => {
    fetchHotels();  // Refresh the hotel list after updating
  };

//thêm khách sạn
  const handleAddHotel = () => {
    fetchHotels(); // Refresh the hotel list after adding a hotel
  };

  
//xem modal xóa khách sạn
  const showDeleteModal = (hotel) => {
    setCurrentHotel(hotel);
    setIsDeleteModalVisible(true);
  };


  //sự kiện xóa khách sạn
  const handleDeleteConfirm = async () => {
    try {
      await axios.delete(`/api/hotel/${currentHotel._id}`, {
        withCredentials: true,
        data: { password },
      });
      notification.success({
        message: "Xóa Khách Sạn Thành Công.",
        description: "Khách sạn đã được xóa khỏi danh sách.",
      });
        setHotels(hotels.filter(hotel => hotel._id !== currentHotel._id));
      fetchHotels();
    } catch (error) {
      notification.error({
        message: "Xóa Khách Sạn Thất Bại.",
        description: "Vui lòng thử lại sau.",
      });    } finally {
      setIsDeleteModalVisible(false);
      setPassword('');
    }
  };

  //tìm kiếm
  const handleSearch = (e) => {
    const term = e.target.value.toLowerCase();
    setSearchTerm(term);
    setCurrentPage(1);
  };



  // Xem danh sách phòng
  const handleViewRooms = (hotelId) => {
    setSelectedHotelRooms(hotelId);
    setIsModalRoomVisible(true);
};

// Đóng danh sách phòng
  const handleCloseModal = () => {
    setIsModalRoomVisible(false);
    setSelectedHotelRooms([]);
  };

  
  const filteredHotels = hotels.filter(
    (hotel) => hotel.name.toLowerCase().includes(searchTerm) || hotel.location.toLowerCase().includes(searchTerm)
  );

  const indexOfLastHotel = currentPage * hotelsPerPage;
  const indexOfFirstHotel = indexOfLastHotel - hotelsPerPage;
  const currentHotels = filteredHotels.slice(indexOfFirstHotel, indexOfLastHotel);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  const pageNumbers = [];
  for (let i = 1; i <= Math.ceil(filteredHotels.length / hotelsPerPage); i++) {
    pageNumbers.push(i);
  }

  return (
    <motion.div
      className='bg-gray-800 bg-opacity-50 backdrop-blur-md shadow-lg rounded-xl p-6 border border-gray-700 mb-8'
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 }}
    >
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-6 space-y-4 sm:space-y-0">
  <h2 className="text-lg sm:text-xl font-semibold text-gray-100 text-center sm:text-left">
    Danh Sách Khách Sạn
  </h2>
  <div className="flex flex-col sm:flex-row sm:space-x-2 space-y-4 sm:space-y-0 items-center">
    <div className="relative w-full sm:w-auto">
      <input
        type="search"
        className="bg-gray-700 text-white placeholder-gray-400 rounded-lg pl-12 pr-4 py-2 w-full sm:w-auto focus:outline-none focus:ring-2 focus:ring-blue-500"
        onChange={handleSearch}
        value={searchTerm}
        autoComplete="off"
        placeholder="Tìm kiếm khách sạn..."
      />
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="18"
        height="18"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="lucide lucide-search absolute left-3 top-2.5 text-gray-400"
      >
        <circle cx="11" cy="11" r="8"></circle>
        <path d="m21 21-4.3-4.3"></path>
      </svg>
    </div>
    <button
      className="text-green-500 hover:text-green-700 flex items-center justify-center"
      onClick={() => setIsAddModalVisible(true)}
    >
      <PlusCircle size={24} />
    </button>
  </div>
</div>


      <div className='overflow-x-auto'>
        <table className='min-w-full divide-y divide-gray-700'>
          <thead>
            <tr>
              <th className='px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider'>Tên</th>
              <th className='px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider'>Vị trí</th>
              <th className='px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider'>Quản lý</th>
              <th className='px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider'>Xếp Hạng</th>              
              <th className='px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider'>Hành động</th>

            </tr>
          </thead>

          <tbody className='divide-y divide-gray-700'>
            {currentHotels.map((hotel) => (
              <tr key={hotel._id}>
                <td className='px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-100'>{hotel.name}</td>
                <td className='px-2 py-2 whitespace-nowrap text-sm text-gray-300' style={{ maxWidth: '150px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                {hotel.location}
                </td>
                <td className='px-6 py-4 whitespace-nowrap text-sm text-gray-300'>{hotel.manager.name}</td>
                <td className='px-6 py-4 whitespace-nowrap text-sm text-gray-300'>
                <Rate value={hotel.stars} disabled style={{ fontSize: '18px' }} />
                </td>
               
                <td className='px-6 py-4 whitespace-nowrap text-sm text-gray-300'>
                <button onClick={() => handleViewRooms(hotel._id)} className='text-blue-500 hover:text-blue-700 mr-2'>
                <Eye size={18} />
                </button>

                  <button onClick={() => showModal(hotel)} className='text-yellow-500 hover:text-yellow-700 mr-2'>
                    <Edit size={18} />
                  </button>
                  <button onClick={() => showDeleteModal(hotel)} className='text-red-500 hover:text-red-700'>
                    <Trash2 size={18} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {pageNumbers.length > 1 && (
          <nav className='mt-4'>
            <ul className='flex justify-center'>
              {pageNumbers.map((number) => (
                <li key={number} className='mx-1'>
                  <button
                    className={`px-3 py-1 rounded-md ${
                      currentPage === number ? 'bg-blue-500 text-white' : 'bg-gray-700 text-gray-300'
                    }`}
                    onClick={() => paginate(number)}
                  >
                    {number}
                  </button>
                </li>
              ))}
            </ul>
          </nav>
        )}
      </div>
      
      {/* RoomListModal to show rooms of selected hotel */}
      <RoomListDrawer
        hotelId={selectedHotelRooms}
        visible={isModalRoomVisible}
        onClose={handleCloseModal}
      />

      {/* Modal for Edit Hotel */}
      <EditHotelModal
          hotel={currentHotel}
          isVisible={isModalVisible}
          onClose={() => setIsModalVisible(false)}
          onUpdate={handleUpdateHotel}
        />

      
     {/* Modal thêm khách sạn */}
     <AddHotelModal
        visible={isAddModalVisible}
        onCancel={() => setIsAddModalVisible(false)}
        onAddHotel={handleAddHotel} // Gọi lại hàm refresh sau khi thêm khách sạn
      />



      {/* Delete Confirmation Modal */}
      <Modal
        title="Xác nhận xóa"
        visible={isDeleteModalVisible}
        onCancel={() => setIsDeleteModalVisible(false)}
        footer={null}
      >
        <p>Bạn có chắc chắn muốn xóa khách sạn này không?</p>
        <Input.Password
          placeholder="Nhập mật khẩu để xác nhận"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <div className="flex justify-end mt-4">
          <Button type="primary" onClick={handleDeleteConfirm}>
            Xóa
          </Button>
          <Button onClick={() => setIsDeleteModalVisible(false)} className="ml-2">
            Hủy
          </Button>
        </div>
      </Modal>
    </motion.div>
  );
};

export default MyHotelTable;
