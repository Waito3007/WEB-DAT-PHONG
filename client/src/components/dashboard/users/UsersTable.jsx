import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Modal, notification } from 'antd';
import { Search, Edit, Trash2, X, Save, Mail, User, Users } from "lucide-react";

const API_URL = process.env.REACT_APP_API_URL;

const UsersTable = () => {
	const [searchTerm, setSearchTerm] = useState("");
	const [users, setUsers] = useState([]);
	const [filteredUsers, setFilteredUsers] = useState([]);
	const [currentPage, setCurrentPage] = useState(1);
	const [usersPerPage] = useState(5);
	const [selectedUser, setSelectedUser] = useState(null);
	const [editForm, setEditForm] = useState({ name: '', email: '', role: '' });
	const [isUpdating, setIsUpdating] = useState(false);

	const fetchUsers = async () => {
		try {
					const response = await fetch(`${API_URL}/api/usertable`, { credentials: 'include' });
			if (!response.ok) throw new Error('Lỗi khi lấy dữ liệu');
			const data = await response.json();
			setUsers(data);
			setFilteredUsers(data);
		} catch (error) {
			console.error('Lỗi:', error);
		}
	};
	useEffect(() => {
		fetchUsers();
	}, []);
	const handleSearch = (e) => {
		const term = e.target.value.toLowerCase();
		setSearchTerm(term);
		const filtered = users.filter(
			(user) => user.name.toLowerCase().includes(term) || user.email.toLowerCase().includes(term)
		);
		setFilteredUsers(filtered);
		setCurrentPage(1);
	};

	const indexOfLastUser = currentPage * usersPerPage;
	const indexOfFirstUser = indexOfLastUser - usersPerPage;
	const currentUsers = filteredUsers.slice(indexOfFirstUser, indexOfLastUser);

	const paginate = (pageNumber) => setCurrentPage(pageNumber);

	const handleDelete = (userId) => {
		// Sử dụng Modal xác nhận xóa
		Modal.confirm({
		  title: 'Bạn có chắc chắn muốn xóa người dùng này?',
		  content: 'Hành động này không thể hoàn tác.',
		  okText: 'Xóa',
		  okType: 'danger',
		  cancelText: 'Hủy',
		  onOk: async () => {
			try {
			  // Thực hiện yêu cầu xóa
						const response = await fetch(`${API_URL}/api/usertable/${userId}`, {
							method: 'DELETE',
							credentials: 'include',
						});
	  
			  if (!response.ok) throw new Error('Lỗi khi xóa người dùng');
			  
			  // Fetch lại danh sách người dùng
			  fetchUsers();
	  
			  // Hiển thị thông báo thành công
			  notification.success({
				message: 'Thành công',
				description: 'Người dùng đã được xóa thành công.',
				placement: 'topRight',
			  });
			} catch (error) {
			  // Hiển thị thông báo lỗi
			  notification.error({
				message: 'Lỗi',
				description: 'Đã xảy ra lỗi khi xóa người dùng. Vui lòng thử lại!',
				placement: 'topRight',
			  });
			  console.error('Lỗi:', error);
			}
		  },
		  onCancel: () => {
			// Xử lý khi người dùng hủy bỏ
			console.log('Hủy bỏ xóa');
		  }
		});
	  };

	const handleEdit = (user) => {
		setSelectedUser(user);
		setEditForm({ name: user.name, email: user.email, role: user.role });
	};

	const handleUpdate = async () => {
		if (!selectedUser) return;
		setIsUpdating(true);
		try {
			console.log('Updating user', selectedUser._id, 'with', editForm);
			const response = await fetch(`${API_URL}/api/usertable/${selectedUser._id}`, {
				method: 'PUT',
				headers: {
					'Content-Type': 'application/json',
				},
				credentials: 'include',
				body: JSON.stringify(editForm),
			});
			if (!response.ok) {
				const errText = await response.text().catch(() => null);
				console.error('Update failed:', response.status, errText);
				throw new Error('Lỗi khi cập nhật người dùng');
			}
			// await refresh
			await fetchUsers();
			setSelectedUser(null);
			notification.success({
				message: 'Cập nhật thành công',
				description: 'Thông tin người dùng đã được cập nhật.',
				placement: 'topRight',
			});
		} catch (error) {
			console.error('Lỗi:', error);
			notification.error({
				message: 'Lỗi cập nhật',
				description: error.message || 'Không thể cập nhật người dùng',
				placement: 'topRight',
			});
		} finally {
			setIsUpdating(false);
		}
	};

	const pageNumbers = [];
	for (let i = 1; i <= Math.ceil(filteredUsers.length / usersPerPage); i++) {
		pageNumbers.push(i);
	}

	return (
		<motion.div
			className='bg-gray-800 bg-opacity-50 backdrop-blur-md shadow-lg rounded-xl p-6 border border-gray-700'
			initial={{ opacity: 0, y: 20 }}
			animate={{ opacity: 1, y: 0 }}
			transition={{ delay: 0.2 }}
		>
			<div className='flex justify-between items-center mb-6'>
				<h2 className='text-xl font-semibold text-gray-100'>Người dùng</h2>
				<div className='relative'>
				<input 
					type="search"
					placeholder="Tìm người dùng"
					className="text-white bg-gray-700 placeholder-gray-400 rounded-lg pl-10 pr-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
					value={searchTerm}
					onChange={handleSearch}
				/>
					<Search className='absolute left-3 top-2.5 text-gray-400' size={18} />
				</div>
			</div>

			<div className='overflow-x-auto'>
  <table className='min-w-full divide-y divide-gray-700'>
    <thead>
      <tr>
        <th className='px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider'>Tên</th>
        <th className='px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider'>Email</th>
        <th className='px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider'>Vai trò</th>
        <th className='px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider'>Trạng thái</th>
        <th className='px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider'>Hành Động</th>
      </tr>
    </thead>

    <tbody className='divide-y divide-gray-700'>
      {currentUsers.map((user) => (
        <motion.tr
          key={user._id}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
        >
          <td className='px-6 py-4 whitespace-nowrap'>
            <div className='flex items-center'>
              <div className='flex-shrink-0 h-10 w-10'>
                <img
                  src={user.avatar || 'https://res.cloudinary.com/dackig67m/image/upload/v1730489645/5db7d294a77fbe0fbfca4eb233afc01b_vt0x30.jpg'}  // Link ảnh từ đối tượng người dùng
                  alt={user.name}  // Thêm alt cho ảnh
                  className='h-10 w-10 rounded-full'  // Đảm bảo ảnh có hình tròn
                />
              </div>
              <div className='ml-4'>
                <div className='text-sm font-medium text-gray-100'>{user.name}</div>
              </div>
            </div>
          </td>
          <td className='px-6 py-4 whitespace-nowrap'>
            <div className='text-sm text-gray-300'>{user.email}</div>
          </td>
          <td className='px-6 py-4 whitespace-nowrap'>
            <span className='px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-800 text-blue-100'>
              {user.role}
            </span>
          </td>
          <td className='px-6 py-4 whitespace-nowrap'>
            <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${user.isVerified ? "bg-green-800 text-green-100" : "bg-red-800 text-red-100"}`}>
              {user.isVerified ? "Active" : "Inactive"}
            </span>
          </td>
          <td className='px-6 py-4 whitespace-nowrap text-sm text-white'>
            <button className='text-indigo-400 hover:text-indigo-300 mr-2' onClick={() => handleEdit(user)}><Edit size={18} /></button>
            <button className='text-red-400 hover:text-red-300' onClick={() => handleDelete(user._id)}><Trash2 size={18} /></button>
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

			{/* Form chỉnh sửa */}
{selectedUser && (
  <div className='fixed inset-0 flex items-center justify-center bg-black bg-opacity-50'>
    <div className='p-6 bg-gray-800 rounded-lg shadow-xl w-1/3 transform scale-110 transition-all duration-500'>
      <h2 className='text-2xl font-Roboto text-gray-100 flex items-center'>
        <Edit className='mr-3 text-indigo-300' size={24} /> Chỉnh sửa người dùng
      </h2>
      {/* Tên */}
      <div className='flex items-center mt-4'>
        <User className='text-gray-200' size={20} />
        <input 
          value={editForm.name} 
          onChange={(e) => setEditForm({ ...editForm, name: e.target.value })} 
          className='bg-gray-800 text-white p-3 rounded-lg ml-3 w-full placeholder-gray-300 focus:ring-2 focus:ring-indigo-400 transition duration-200 ease-in-out shadow-md hover:shadow-lg'
          placeholder='Tên' 
        />
      </div>

      {/* Email */}
      <div className='flex items-center mt-4'>
        <Mail className='text-gray-200' size={20} />
        <input 
          type='email' 
          value={editForm.email} 
          onChange={(e) => setEditForm({ ...editForm, email: e.target.value })} 
          className='bg-gray-800 text-white p-3 rounded-lg ml-3 w-full placeholder-gray-300 focus:ring-2 focus:ring-indigo-400 transition duration-200 ease-in-out shadow-md hover:shadow-lg'
          placeholder='Email' 
        />
      </div>

      {/* Vai trò */}
      <div className='flex items-center mt-4'>
        <Users className='text-gray-200' size={20} />
        <select 
          value={editForm.role} 
          onChange={(e) => setEditForm({ ...editForm, role: e.target.value })} 
          className='bg-gray-800 text-white p-3 rounded-lg ml-3 w-full placeholder-gray-300 focus:ring-2 focus:ring-indigo-400 transition duration-200 ease-in-out shadow-md hover:shadow-lg'
        >
          <option value='Customer'>Customer</option>
          <option value='HotelManager'>Hotel Manager</option>
          <option value='Admin'>Admin</option>
        </select>
      </div>

      {/* Các nút Cập nhật và Hủy */}
      <div className='flex justify-end mt-6 space-x-4'>
				<button 
					onClick={handleUpdate}
					disabled={isUpdating}
					className={`flex items-center p-3 rounded-lg transition duration-300 transform hover:scale-105 shadow-md ${isUpdating ? 'bg-gray-500 text-white cursor-not-allowed' : 'bg-indigo-600 text-white hover:bg-indigo-500'}`}
				>
					<Save className='mr-2' size={20} /> {isUpdating ? 'Đang cập nhật...' : 'Cập nhật'}
				</button>
        <button 
          onClick={() => setSelectedUser(null)} 
          className='flex items-center bg-gray-600 text-white p-3 rounded-lg hover:bg-gray-500 transition duration-300 transform hover:scale-105 shadow-md hover:shadow-lg'
        >
          <X className='mr-2' size={20} /> Hủy
        </button>
      </div>
    </div>
  </div>
)}
		</motion.div>
	);
};

export default UsersTable;
