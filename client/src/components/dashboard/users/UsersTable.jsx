import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Search } from "lucide-react";

const UsersTable = () => {
	const [searchTerm, setSearchTerm] = useState("");
	const [users, setUsers] = useState([]);
	const [filteredUsers, setFilteredUsers] = useState([]);
	const [currentPage, setCurrentPage] = useState(1);
	const [usersPerPage] = useState(5);
	const [selectedUser, setSelectedUser] = useState(null);
	const [editForm, setEditForm] = useState({ name: '', email: '', role: '' });

	const fetchUsers = async () => {
		try {
			const response = await fetch('/api/usertable');
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

	const handleDelete = async (userId) => {
		const confirmDelete = window.confirm("Bạn có chắc chắn muốn xóa người dùng này?");
		if (confirmDelete) {
			try {
				const response = await fetch(`/api/usertable/${userId}`, {
					method: 'DELETE',
				});
				if (!response.ok) throw new Error('Lỗi khi xóa người dùng');
				fetchUsers();
			} catch (error) {
				console.error('Lỗi:', error);
			}
		}
	};

	const handleEdit = (user) => {
		setSelectedUser(user);
		setEditForm({ name: user.name, email: user.email, role: user.role });
	};

	const handleUpdate = async () => {
		try {
			const response = await fetch(`/api/usertable/${selectedUser._id}`, {
				method: 'PUT',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify(editForm),
			});
			if (!response.ok) throw new Error('Lỗi khi cập nhật người dùng');
			fetchUsers();
			setSelectedUser(null);
		} catch (error) {
			console.error('Lỗi:', error);
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
							<th className='px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider'>Thao tác</th>
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
											<div className='h-10 w-10 rounded-full bg-gradient-to-r from-purple-400 to-blue-500 flex items-center justify-center text-white font-semibold'>
												{user.name.charAt(0)}
											</div>
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
									<button className='text-indigo-400 hover:text-indigo-300 mr-2' onClick={() => handleEdit(user)}>Sửa</button>
									<button className='text-red-400 hover:text-red-300' onClick={() => handleDelete(user._id)}>Xóa</button>
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
					<div className='mt-4 p-4 bg-gray-700 rounded-lg w-1/3'>
						<h2 className='text-lg font-semibold text-gray-100'>Chỉnh sửa người dùng</h2>
						<input 
							value={editForm.name} 
							onChange={(e) => setEditForm({ ...editForm, name: e.target.value })} 
							className='bg-gray-600 text-white p-2 rounded mt-2 w-full' 
							placeholder='Tên' 
						/>
						<input 
							type='email' 
							value={editForm.email} 
							onChange={(e) => setEditForm({ ...editForm, email: e.target.value })} 
							className='bg-gray-600 text-white p-2 rounded mt-2 w-full' 
							placeholder='Email' 
						/>
						<select 
							value={editForm.role} 
							onChange={(e) => setEditForm({ ...editForm, role: e.target.value })} 
							className='bg-gray-600 text-white p-2 rounded mt-2 w-full'
						>
							<option value='Customer'>Customer</option>
							<option value='HotelManager'>Hotel Manager</option>
							<option value='Admin'>Admin</option>
						</select>
						<div className='flex justify-end mt-4'>
							<button onClick={handleUpdate} className='bg-blue-600 text-white p-2 rounded'>Cập nhật</button>
							<button onClick={() => setSelectedUser(null)} className='ml-2 bg-gray-500 text-white p-2 rounded'>Hủy</button>
						</div>
					</div>
				</div>
			)}
		</motion.div>
	);
};

export default UsersTable;
