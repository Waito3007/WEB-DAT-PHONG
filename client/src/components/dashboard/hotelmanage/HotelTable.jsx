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
  const [currentHotel, setCurrentHotel] = useState(null);
  const [fileList, setFileList] = useState([]);
  const [password, setPassword] = useState('');
  const [removedImages, setRemovedImages] = useState([]);
  const [form] = Form.useForm();
  const [isDeleteModalVisible, setIsDeleteModalVisible] = useState(false);
  const [setIsAdmin] = useState(false); // Kiểm tra người dùng có phải admin không

  // Lấy thông tin người dùng để kiểm tra quyền admin
  useEffect(() => {
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

  // Lấy danh sách khách sạn từ API
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

  // Hiển thị modal để chỉnh sửa khách sạn
  const showModal = (hotel) => {
    setCurrentHotel(hotel);
    setFileList(hotel.imagehotel.map(url => ({ uid: url, url }))); // Hiển thị hình ảnh hiện có
    form.setFieldsValue({
      name: hotel.name,
      location: hotel.location,
      description: hotel.description,
    });
    setIsModalVisible(true);
  };

  
  

  // Cập nhật khách sạn
  const handleSave = async (values) => {
    setIsUpdating(true);
    try {
      const formData = new FormData();
      formData.append('name', values.name);
      formData.append('location', values.location);
      formData.append('description', values.description);
      fileList.forEach((file) => {
        formData.append('imagehotel', file);
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
      fetchHotel(); // Cập nhật danh sách khách sạn
    } catch (error) {
      message.error('Đã xảy ra lỗi khi cập nhật khách sạn');
    } finally {
      setIsUpdating(false);
    }
  };

  const handleImageChange = ({ fileList: newFileList }) => {
    setFileList(newFileList.map(file => file.originFileObj || file));
  };

  // Hiển thị modal để xóa khách sạn
  const showDeleteModal = (hotel) => {
    setCurrentHotel(hotel);
    setIsDeleteModalVisible(true);
  };



  const handleDeleteConfirm = async () => {
    try {
      await axios.delete(`/api/hotel/${currentHotel._id}`, {
        withCredentials: true,
        data: { password }, // Gửi mật khẩu vào body
      });
      message.success('Xóa khách sạn thành công');
      setHotels(hotels.filter(hotel => hotel._id !== currentHotel._id));
    } catch (error) {
      console.error('Lỗi khi xóa khách sạn:', error.response?.data);
      message.error(error.response?.data.message || 'Không thể xóa khách sạn vì lí do xác thực');
    } finally {
      setIsDeleteModalVisible(false); // Ẩn modal
      setPassword(''); // Reset mật khẩu
    }
  };
  

  // Xóa hình ảnh trong khi chỉnh sửa
  const handleRemoveImage = async (file) => {
    if (file.uid) {
      setFileList(prev => prev.filter(item => item.uid !== file.uid));
      setRemovedImages(prev => [...prev, file.url]);

      try {
        await axios.put(`/api/hotel/${currentHotel._id}/remove-image`, { imageUrl: file.url }, { withCredentials: true });
      } catch (error) {
        message.error('Đã xảy ra lỗi khi xóa hình ảnh');
      }
    }
  };
  
  

  // Xử lý khi người dùng nhập tìm kiếm
  const handleSearch = (e) => {
    const term = e.target.value.toLowerCase();
    setSearchTerm(term);
    setCurrentPage(1);
  };

  // Tìm kiếm khách sạn
  const filteredHotels = hotels.filter(
    (hotel) => hotel.name.toLowerCase().includes(searchTerm) || hotel.location.toLowerCase().includes(searchTerm)
  );

  // Phân trang
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
              type='search'
              className='bg-gray-700 text-white placeholder-gray-400 rounded-lg pl-12 pr-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500'
              onChange={handleSearch}
              value={searchTerm}
              autoComplete='off' // Ngăn chặn tự động điền
              placeholder="Tìm kiếm khách sạn..."
            />
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-search absolute left-3 top-2.5 text-gray-400"><circle cx="11" cy="11" r="8"></circle><path d="m21 21-4.3-4.3"></path></svg>
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
              <tr key={hotel._id}>
                <td className='px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-100'>{hotel.name}</td>
                <td className='px-6 py-4 whitespace-nowrap text-sm text-gray-300'>{hotel.location}</td>
                <td className='px-6 py-4 whitespace-nowrap text-sm text-gray-300'>{hotel.manager.name}</td>
                <td className='px-6 py-4 whitespace-nowrap text-sm font-medium flex space-x-4'>
                  <button
                    className='text-blue-500 hover:text-blue-700'
                    onClick={() => showModal(hotel)}
                  >
                    <Edit size={18} />
                  </button>
                  <button
                    className='text-red-500 hover:text-red-700'
                    onClick={() => showDeleteModal(hotel)}
                  >
                    <Trash2 size={18} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className='flex justify-center mt-6'>
        <ul className='pagination'>
          {pageNumbers.map(number => (
            <li key={number} className='inline-block mx-1'>
              <button
                onClick={() => paginate(number)}
                className={`px-3 py-2 rounded-lg ${currentPage === number ? 'bg-blue-500 text-white' : 'bg-gray-700 text-gray-300'}`}
              >
                {number}
              </button>
            </li>
          ))}
        </ul>
      </div>

      {/* Modal chỉnh sửa khách sạn */}
      <Modal
        title='Chỉnh sửa khách sạn'
        visible={isModalVisible}
        onCancel={() => setIsModalVisible(false)}
        footer={null}
        className='modal-update'
      >
        <Form form={form} onFinish={handleSave}>
          <Form.Item name='name' label='Tên khách sạn' rules={[{ required: true, message: 'Vui lòng nhập tên khách sạn' }]}>
            <Input placeholder='Tên khách sạn' />
          </Form.Item>

          <Form.Item name='location' label='Vị trí' rules={[{ required: true, message: 'Vui lòng nhập vị trí' }]}>
            <Input placeholder='Vị trí' />
          </Form.Item>

          <Form.Item name='description' label='Mô tả'>
            <Input.TextArea placeholder='Mô tả khách sạn' />
          </Form.Item>

          <Form.Item label='Hình ảnh'>
            <Upload
              listType='picture-card'
              fileList={fileList}
              onChange={handleImageChange}
              onRemove={handleRemoveImage}
              beforeUpload={() => false} // Ngăn không cho upload ngay lập tức
            >
              {fileList.length < 5 && (
                <div>
                  <UploadOutlined />
                  <div style={{ marginTop: 8 }}>Tải lên</div>
                </div>
              )}
            </Upload>
          </Form.Item>

          <Form.Item>
            <Button type='primary' htmlType='submit' loading={isUpdating}>
              Lưu thay đổi
            </Button>
          </Form.Item>
        </Form>
      </Modal>

      {/* Modal xóa khách sạn */}
      <Modal
  title="Xóa Khách Sạn"
  visible={isDeleteModalVisible}
  onOk={handleDeleteConfirm}
  onCancel={() => setIsDeleteModalVisible(false)}
>
  <p>Bạn có chắc chắn muốn xóa khách sạn này không?</p>
  <Input
    type="password"
    placeholder="Nhập mật khẩu để xác nhận"
    value={password}
    onChange={(e) => setPassword(e.target.value)}
  />
</Modal>


    </motion.div>
  );
};

export default HotelTable;
