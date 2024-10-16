import { useEffect, useState, useCallback } from 'react';
import axios from 'axios';
import { motion } from 'framer-motion';
import { Edit, Search, Trash2, PlusCircle } from 'lucide-react';
import { Modal, Input, Button, message, Upload, Form } from 'antd';
import { UploadOutlined } from '@ant-design/icons';

const MyHotelTable = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [hotels, setHotels] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [hotelsPerPage] = useState(5);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const [currentHotel, setCurrentHotel] = useState(null);
  const [fileList, setFileList] = useState([]);
  const [removedImages, setRemovedImages] = useState([]);
  const [form] = Form.useForm();
  const [isAddModalVisible, setIsAddModalVisible] = useState(false);
  const [isDeleteModalVisible, setIsDeleteModalVisible] = useState(false);
  const [password, setPassword] = useState('');

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

  const showModal = (hotel) => {
    setCurrentHotel(hotel);
    setFileList(hotel.imagehotel.map(url => ({ uid: url, url })));
    form.setFieldsValue({
      name: hotel.name,
      location: hotel.location,
      description: hotel.description,
    });
    setIsModalVisible(true);
  };

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
      fetchHotels();
    } catch (error) {
      message.error('Đã xảy ra lỗi khi cập nhật khách sạn');
    } finally {
      setIsUpdating(false);
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
  const handleAddHotel = async (values) => {
    try {
      const formData = new FormData();
      formData.append('name', values.name);
      formData.append('location', values.location);
      formData.append('description', values.description);
      fileList.forEach((file) => {
        formData.append('imagehotel', file);
      });

      await axios.post('/api/hotel/addhotel', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        withCredentials: true,
      });

      message.success('Khách sạn đã được thêm thành công');
      setIsAddModalVisible(false);
      fetchHotels();
    } catch (error) {
      message.error('Đã xảy ra lỗi khi thêm khách sạn');
    }
  };

  const handleImageChange = ({ fileList: newFileList }) => {
    setFileList(newFileList.map(file => file.originFileObj || file));
  };

  const showDeleteModal = (hotel) => {
    setCurrentHotel(hotel);
    setIsDeleteModalVisible(true);
  };

  const handleDeleteConfirm = async () => {
    try {
      await axios.delete(`/api/hotel/${currentHotel._id}`, {
        withCredentials: true,
        data: { password },
      });
      message.success('Xóa khách sạn thành công');
      setHotels(hotels.filter(hotel => hotel._id !== currentHotel._id));
    } catch (error) {
      message.error(error.response?.data.message || 'Không thể xóa khách sạn vì lí do xác thực');
    } finally {
      setIsDeleteModalVisible(false);
      setPassword('');
    }
  };

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
        <div className='flex space-x-2'>
        <div className='relative'>
  <input
    type='text'
    //placeholder='Tìm kiếm khách sạn...'
    className='bg-gray-700 text-white placeholder-gray-400 rounded-lg pl-12 pr-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500'
    onChange={handleSearch}
    value={searchTerm}
  />
  <Search className='absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400' size={18} />
</div>

          <button
            className='text-green-500 hover:text-green-700'
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
      {/* Modal thêm khách sạn */}
      <Modal
        title='Thêm Khách Sạn'
        visible={isAddModalVisible}
        onCancel={() => setIsAddModalVisible(false)}
        footer={null}
      >
        <Form
          layout='vertical'
          onFinish={handleAddHotel}
          form={form}
        >
          <Form.Item
            label='Tên Khách Sạn'
            name='name'
            rules={[{ required: true, message: 'Vui lòng nhập tên khách sạn' }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            label='Vị trí'
            name='location'
            rules={[{ required: true, message: 'Vui lòng nhập vị trí khách sạn' }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            label='Mô tả'
            name='description'
            rules={[{ required: true, message: 'Vui lòng nhập mô tả' }]}
          >
            <Input.TextArea />
          </Form.Item>
          <Form.Item label='Hình ảnh khách sạn'>
            <Upload
              multiple
              listType='picture'
              beforeUpload={() => false}
              onChange={handleImageChange}
              fileList={fileList}
            >
              <Button icon={<UploadOutlined />}>Chọn hình ảnh</Button>
            </Upload>
          </Form.Item>
          <Form.Item>
            <Button type='primary' htmlType='submit'>
              Thêm
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    </motion.div>
  );
};

export default MyHotelTable;
