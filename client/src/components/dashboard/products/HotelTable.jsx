import { useEffect, useState } from 'react';
import axios from 'axios';
import { motion } from 'framer-motion';
import { Edit, Search, Trash2 } from 'lucide-react';
import { Modal, Input, Button, message } from 'antd'; // Import Modal và Input từ Ant Design

const HotelTable = () => {
	const [searchTerm, setSearchTerm] = useState('');
	const [hotels, setHotels] = useState([]);
	const [currentPage, setCurrentPage] = useState(1);
	const [hotelsPerPage] = useState(5);
	const [isEditModalVisible, setIsEditModalVisible] = useState(false);
	const [isDeleteModalVisible, setIsDeleteModalVisible] = useState(false);
	const [currentHotel, setCurrentHotel] = useState(null);
	const [newName, setNewName] = useState('');
	const [newLocation, setNewLocation] = useState('');
	const [newDescription, setNewDescription] = useState('');
	const [password, setPassword] = useState(''); // Trường mật khẩu cho xác nhận xóa

	// Gọi API để lấy danh sách khách sạn
	useEffect(() => {
		const fetchHotels = async () => {
			try {
				const response = await axios.get('/api/hotel');
				setHotels(response.data);
			} catch (error) {
				console.error('Lỗi khi lấy danh sách khách sạn:', error);
			}
		};

		fetchHotels();
	}, []);

	const handleDelete = async (hotelId) => {
		try {
			await axios.delete(`/api/hotel/${hotelId}`, {
				data: { password }, // Gửi mật khẩu trong request
			});
			setHotels(hotels.filter(hotel => hotel._id !== hotelId));
			message.success("Xóa khách sạn thành công");
		} catch (error) {
			console.error('Lỗi khi xóa khách sạn:', error);
			message.error("Không thể xóa khách sạn. Vui lòng kiểm tra mật khẩu.");
		}
	};

	const showEditModal = (hotel) => {
		setCurrentHotel(hotel);
		setNewName(hotel.name);
		setNewLocation(hotel.location);
		setNewDescription(hotel.description);
		setIsEditModalVisible(true);
	};

	const handleEditOk = async () => {
		const updatedHotel = {
			name: newName,
			location: newLocation,
			description: newDescription,
		};

		try {
			const response = await axios.put(`/api/hotel/${currentHotel._id}`, updatedHotel);
			setHotels(hotels.map(h => h._id === currentHotel._id ? response.data.hotel : h));
			message.success("Cập nhật khách sạn thành công");
		} catch (error) {
			console.error('Lỗi khi cập nhật khách sạn:', error);
			message.error("Cập nhật khách sạn thất bại");
		} finally {
			setIsEditModalVisible(false);
		}
	};

	const showDeleteModal = (hotel) => {
		setCurrentHotel(hotel);
		setIsDeleteModalVisible(true);
		setPassword(''); // Reset password khi mở modal xóa
	};

	const handleDeleteOk = () => {
		handleDelete(currentHotel._id);
		setIsDeleteModalVisible(false);
	};

	// Xử lý tìm kiếm
	const handleSearch = (e) => {
		const term = e.target.value.toLowerCase();
		setSearchTerm(term);
		setCurrentPage(1); // reset lại trang khi tìm kiếm
	};

	// Lọc kết quả theo tìm kiếm
	const filteredHotels = hotels.filter(
		(hotel) => hotel.name.toLowerCase().includes(searchTerm) || hotel.location.toLowerCase().includes(searchTerm)
	);

	// Tính toán các khách sạn hiển thị trên trang hiện tại
	const indexOfLastHotel = currentPage * hotelsPerPage;
	const indexOfFirstHotel = indexOfLastHotel - hotelsPerPage;
	const currentHotels = filteredHotels.slice(indexOfFirstHotel, indexOfLastHotel);

	// Thay đổi trang
	const paginate = (pageNumber) => setCurrentPage(pageNumber);

	// Tạo danh sách các số trang
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
			<div className='flex justify-between items-center mb-6'>
				<h2 className='text-xl font-semibold text-gray-100'>Danh sách Khách Sạn</h2>
				<div className='relative'>
					<input
						type='text'
						placeholder='Tìm kiếm khách sạn...'
						className='bg-gray-700 text-white placeholder-gray-400 rounded-lg pl-10 pr-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500'
						onChange={handleSearch}
						value={searchTerm}
					/>
					<Search className='absolute left-3 top-2.5 text-gray-400' size={18} />
				</div>
			</div>

			<div className='overflow-x-auto'>
				<table className='min-w-full divide-y divide-gray-700'>
					<thead>
						<tr>
							<th className='px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider'>
								Tên
							</th>
							<th className='px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider'>
								Vị trí
							</th>
							<th className='px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider'>
								Quản lý
							</th>
							<th className='px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider'>
								Hành động
							</th>
						</tr>
					</thead>
					<tbody className='divide-y divide-gray-700'>
  {currentHotels.map((hotel) => (
    <motion.tr
      key={hotel._id}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      <td className='px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-100'>
        {hotel.name}
      </td>
      <td className='px-6 py-4 whitespace-nowrap text-sm text-gray-300'>
        {hotel.location}
      </td>
      <td className='px-6 py-4 whitespace-nowrap text-sm text-gray-300'>
        {hotel.manager ? hotel.manager.name : 'Chưa có quản lý'}
      </td>
      <td className='px-6 py-4 whitespace-nowrap text-sm text-gray-300'>
        <button className='text-indigo-400 hover:text-indigo-300 mr-2' onClick={() => showEditModal(hotel)}>
          <Edit size={18} />
        </button>
        <button className='text-red-400 hover:text-red-300' onClick={() => showDeleteModal(hotel)}>
          <Trash2 size={18} />
        </button>
      </td>
    </motion.tr>
  ))}
</tbody>

				</table>
			</div>

			{/* Phân trang */}
			<div className='flex justify-center mt-4'>
				{pageNumbers.map(number => (
					<button
						key={number}
						onClick={() => paginate(number)}
						className={`mx-1 px-3 py-1 rounded-md ${number === currentPage ? 'bg-blue-600 text-white' : 'bg-gray-600 text-gray-300'}`}
					>
						{number}
					</button>
				))}
			</div>

			{/* Modal Chỉnh sửa */}
			<Modal
				title="Chỉnh sửa Khách Sạn"
				visible={isEditModalVisible}
				onOk={handleEditOk}
				onCancel={() => setIsEditModalVisible(false)}
			>
				<Input 
					placeholder="Tên khách sạn" 
					value={newName} 
					onChange={(e) => setNewName(e.target.value)} 
				/>
				<Input 
					placeholder="Vị trí" 
					value={newLocation} 
					onChange={(e) => setNewLocation(e.target.value)} 
				/>
				<Input.TextArea 
					placeholder="Mô tả" 
					value={newDescription} 
					onChange={(e) => setNewDescription(e.target.value)} 
				/>
			</Modal>

			{/* Modal Xóa */}
			<Modal
				title="Xác nhận xóa khách sạn"
				visible={isDeleteModalVisible}
				onOk={handleDeleteOk}
				onCancel={() => setIsDeleteModalVisible(false)}
			>
				<p>Nhập mật khẩu để xác nhận xóa khách sạn {currentHotel?.name}</p>
				<Input.Password 
					placeholder="Mật khẩu" 
					value={password} 
					onChange={(e) => setPassword(e.target.value)} 
				/>
			</Modal>
		</motion.div>
	);
};

export default HotelTable;