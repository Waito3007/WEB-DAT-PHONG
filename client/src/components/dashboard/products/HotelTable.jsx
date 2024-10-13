import { useEffect, useState, useCallback } from 'react';
import axios from 'axios';
import { motion } from 'framer-motion';
import { Edit, Search, Trash2 } from 'lucide-react';
import { Modal, Input, Button, message, Upload, Form } from 'antd';
import { UploadOutlined } from '@ant-design/icons';

const HotelTable = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [hotels, setHotels] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [hotelsPerPage] = useState(5);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const [isDeleteModalVisible, setIsDeleteModalVisible] = useState(false);
  const [currentHotel, setCurrentHotel] = useState(null);
  const [fileList, setFileList] = useState([]);
  const [password, setPassword] = useState('');
  const [removedImages, setRemovedImages] = useState([]);
  const [form] = Form.useForm();
  const [isAdmin, setIsAdmin] = useState(false); // Khởi tạo biến isAdmin

  useEffect(() => {
	// Gọi API để lấy thông tin người dùng
	const fetchUserInfo = async () => {
		try {
		  const response = await axios.get('/api/profile/me', {
			withCredentials: true, // Nếu cần gửi cookie để xác thực
		  });
		  if (response.data && response.data.role) {
			setIsAdmin(response.data.role === 'Admin');
		  }
		} catch (error) {
		  console.error('Lỗi khi lấy thông tin người dùng:', error);
		}
	  };	  
  
	fetchUserInfo();
  }, []);
  
  
  // Fetch hotels from API
  const fetchHotel = useCallback(async () => {
    try {
      const response = await axios.get('/api/hotel');
      setHotels(response.data);
    } catch (error) {
      console.error('Lỗi khi lấy danh sách khách sạn:', error);
    }
  }, []);

  useEffect(() => {
    fetchHotel();
  }, [fetchHotel]);

  // Show modal for editing
  const showModal = (hotel) => {
    setCurrentHotel(hotel);
    setFileList(hotel.imagehotel.map(url => ({ uid: url, url }))); // Update fileList with current images
    form.setFieldsValue({
      name: hotel.name,
      location: hotel.location,
      description: hotel.description,
    });
    setIsModalVisible(true);
  };

  // Update hotel
  const handleSave = async (values) => {
    setIsUpdating(true);
    try {
      const formData = new FormData();
      formData.append('name', values.name);
      formData.append('location', values.location);
      formData.append('description', values.description);
      fileList.forEach(file => {
        if (file.originFileObj) {
          formData.append('imagehotel', file.originFileObj); // Add new image files to FormData
        }
      });
      formData.append('removedImages', JSON.stringify(removedImages));
      await axios.put(`/api/hotel/${currentHotel._id}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        withCredentials: true,
      });
      message.success('Khách sạn đã được cập nhật thành công');
      setIsModalVisible(false);
      fetchHotel(); // Update hotel list
    } catch (error) {
      message.error('Đã xảy ra lỗi khi cập nhật khách sạn');
    } finally {
      setIsUpdating(false);
    }
  };

  const handleImageChange = ({ fileList: newFileList }) => {
    setFileList(newFileList.map(file => file.originFileObj || file));
  };

  // Show delete modal
  const showDeleteModal = (hotel) => {
    setCurrentHotel(hotel);
    setIsDeleteModalVisible(true);
  };

  // Prompt for password
  const promptPassword = () => {
    return new Promise((resolve) => {
      Modal.confirm({
        title: 'Nhập mật khẩu',
        content: (
          <Input.Password
            placeholder="Mật khẩu của bạn"
            onChange={(e) => setPassword(e.target.value)}
          />
        ),
        onOk() {
          resolve(password);
        },
        onCancel() {
          resolve(null);
        },
      });
    });
  };

  // Handle delete confirmation
const handleDeleteOk = async () => {
	try {
	  // Kiểm tra nếu người dùng là admin
	  if (isAdmin) {
		// Nếu là admin, gửi request xóa mà không cần mật khẩu
		await axios.delete(`/api/hotel/${currentHotel._id}`);
		message.success('Khách sạn đã được xóa thành công');
	  } else {
		const password = await promptPassword(); // Hàm này lấy mật khẩu từ người dùng
		if (password) {
		  await axios.delete(`/api/hotel/${currentHotel._id}`, { data: { password } });
		  message.success('Khách sạn đã được xóa thành công');
		} else {
		  message.warning('Bạn cần nhập mật khẩu để xóa khách sạn');
		}
	  }
  
	  setIsDeleteModalVisible(false);
	  fetchHotel(); // Update danh sách khách sạn sau khi xóa
	} catch (error) {
	  message.error('Đã xảy ra lỗi khi xóa khách sạn: ' + (error.response ? error.response.data.msg : ''));
	}
  };
  
  

  // Handle image removal
  const handleRemoveImage = async (file) => {
    if (file.uid) {
      setFileList(prev => prev.filter(item => item.uid !== file.uid));
      setRemovedImages(prev => [...prev, file.url]);

      try {
        await axios.put(`/api/hotel/${currentHotel._id}/remove-image`, { imageUrl: file.url }, { withCredentials: true });
        message.success('Hình ảnh đã được xóa thành công');
      } catch (error) {
        message.error('Đã xảy ra lỗi khi xóa hình ảnh');
      }
    }
  };

  // Handle search input
  const handleSearch = (e) => {
    const term = e.target.value.toLowerCase();
    setSearchTerm(term);
    setCurrentPage(1);
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
      <div className='flex justify-between items-center mb-6'>
        <h2 className='text-xl font-semibold text-gray-100'>Danh Sách Khách Sạn</h2>
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
              <th className='px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider'>Tên</th>
              <th className='px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider'>Vị trí</th>
              <th className='px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider'>Quản lý</th>
              <th className='px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider'>Hành động</th>
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
                <td className='px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-100'>{hotel.name}</td>
                <td className='px-6 py-4 whitespace-nowrap text-sm text-gray-300'>{hotel.location}</td>
                <td className='px-6 py-4 whitespace-nowrap text-sm text-gray-300'>{hotel.manager ? hotel.manager.name : 'Chưa có quản lý'}</td>
                <td className='px-6 py-4 whitespace-nowrap text-sm text-gray-300'>
                  <button className='text-indigo-400 hover:text-indigo-300 mr-2' onClick={() => showModal(hotel)}>
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

      {/* Pagination */}
      {pageNumbers.length > 1 && (
        <div className='flex justify-center mt-4'>
          {pageNumbers.map(number => (
            <button
              key={number}
              onClick={() => paginate(number)}
              className={`px-3 py-1 rounded-md ${currentPage === number ? 'bg-blue-600 text-white' : 'bg-gray-700 text-gray-300 hover:bg-blue-500 hover:text-white'}`}
            >
              {number}
            </button>
          ))}
        </div>
      )}

      {/* Update Hotel Modal */}
      <Modal
        title="Cập nhật khách sạn"
        visible={isModalVisible}
        onCancel={() => setIsModalVisible(false)}
        footer={null}
      >
        <Form form={form} onFinish={handleSave}>
          <Form.Item name="name" rules={[{ required: true, message: 'Tên không được để trống' }]}>
            <Input placeholder="Tên khách sạn" />
          </Form.Item>
          <Form.Item name="location" rules={[{ required: true, message: 'Vị trí không được để trống' }]}>
            <Input placeholder="Vị trí" />
          </Form.Item>
          <Form.Item name="description" rules={[{ required: true, message: 'Mô tả không được để trống' }]}>
            <Input.TextArea placeholder="Mô tả" />
          </Form.Item>
          <Form.Item>
            <Upload
              fileList={fileList}
              onChange={handleImageChange}
              onRemove={handleRemoveImage}
              listType="picture"
              multiple
              beforeUpload={() => false} // Prevent auto upload
            >
              <Button icon={<UploadOutlined />}>Tải lên hình ảnh</Button>
            </Upload>
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit" loading={isUpdating}>
              Cập nhật
            </Button>
          </Form.Item>
        </Form>
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal
        title="Xóa khách sạn"
        visible={isDeleteModalVisible}
        onCancel={() => setIsDeleteModalVisible(false)}
        footer={[
          <Button key="cancel" onClick={() => setIsDeleteModalVisible(false)}>
            Hủy
          </Button>,
          <Button key="delete" type="danger" onClick={handleDeleteOk}>
            Xóa
          </Button>,
        ]}
      >
        <p>Bạn có chắc chắn muốn xóa khách sạn này không?</p>
      </Modal>
    </motion.div>
  );
};

export default HotelTable;
