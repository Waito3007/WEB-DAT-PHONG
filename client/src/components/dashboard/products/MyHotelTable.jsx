import { useEffect, useState, useCallback } from 'react';
import axios from 'axios';
import { motion } from 'framer-motion';
import { Edit, Search, Trash2, PlusCircle, Eye } from 'lucide-react';
import { Modal, Input, Button, message, Upload, Form, Drawer,Rate, Table } from 'antd';
import { UploadOutlined } from '@ant-design/icons';
import AddRoom from './AddRoom'; // Thay đổi đường dẫn cho phù hợp với cấu trúc thư mục của bạn
import { useParams } from 'react-router-dom';


const MyHotelTable = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [roomSearchTerm, setRoomSearchTerm] = useState(''); // Tìm kiếm phòng
  const [loading, setLoading] = useState(false); 
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
  const [isRoomDrawerVisible, setIsRoomDrawerVisible] = useState(false);
  const [roomList, setRoomList] = useState([]);
  const [addHotelForm] = Form.useForm(); // Form instance for Add Hotel

  const roomsPerPage = 10; // Số phòng mỗi trang
  const { hotelId } = useParams();


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

  const showRoomDrawer = async (hotelId) => {
    try {
      const response = await axios.get(`/api/room/${hotelId}/rooms`, { withCredentials: true });
      setRoomList(response.data); // Gán dữ liệu trả về nếu có
    } catch (error) {
      setRoomList([]); // Nếu có lỗi, gán danh sách trống
    } finally {
      setIsRoomDrawerVisible(true); // Luôn mở Drawer bất kể có lỗi hay không
    }
  };
  

  //them anh moi khi them khach san
  const handleUpload = ({ fileList }) => {
    setFileList(fileList);
  };

  const closeRoomDrawer = () => {
    setIsRoomDrawerVisible(false);
    setRoomList([]);
  };

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


//cap nhat khách sạn
  const handleSave = async (values) => {
    setIsUpdating(true);
    try {
      const formData = new FormData();
      formData.append('name', values.name);
      formData.append('location', values.location);
      formData.append('description', values.description);
      formData.append('stars', values.star);
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


  //xóa ảnh
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


  //thêm khách sạn
  const handleAddHotel = async (values) => {
    setLoading(true);
    const formData = new FormData();
    formData.append('name', values.name);
    formData.append('location', values.location);
    formData.append('description', values.description);
    formData.append('stars', values.stars); // Bổ sung trường đánh giá sao
  
    // Đính kèm file ảnh
    fileList.forEach(file => {
      formData.append('imagehotel', file.originFileObj);
    });
  
    try {
      const response = await axios.post('/api/hotel/addhotel', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        withCredentials: true
      });
  
      if (response.status === 201) {
        message.success('Thêm khách sạn thành công!');
        fetchHotels();
        setIsAddModalVisible(false);
        addHotelForm.resetFields();
        setFileList([]);
      }
    } catch (error) {
      const errorMsg = error.response?.data?.msg || 'Đã xảy ra lỗi khi thêm khách sạn';
      message.error(errorMsg);
    } finally {
      setLoading(false);
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
      fetchHotels();
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

  const handleAddRoomClick = () => {
    setCurrentHotel(hotels); // Lưu lại ID của khách sạn để truyền vào AddRoom
    setIsModalVisible(true); // Mở modal khi nhấn nút
  };

  const handleModalClose = () => {
    setIsModalVisible(false); // Đóng modal
  };
  
  const handleViewRoom = (roomId) => {
    console.log('Xem chi tiết phòng:', roomId);
    // Xử lý logic xem chi tiết phòng
  };
  
  const handleEditRoom = (roomId) => {
    console.log('Sửa phòng:', roomId);
    // Xử lý logic sửa phòng
  };
  
  const handleDeleteRoom = (roomId) => {
    console.log('Xóa phòng:', roomId);
    // Xử lý logic xóa phòng
  };


  const handleSearchRoom = (e) => {
    const term = e.target.value.toLowerCase();
    setRoomSearchTerm(term); // Sử dụng roomSearchTerm thay vì searchTerm
    setCurrentPage(1);
  };

  // Gọi hàm filteredRooms để lọc và phân trang
  const filteredRooms = roomList.filter(
    (room) => room.type.toLowerCase().includes(roomSearchTerm) // Sử dụng roomSearchTerm để lọc
  );

const indexOfLastRoom = currentPage * roomsPerPage;
const indexOfFirstRoom = indexOfLastRoom - roomsPerPage;
const currentRooms = filteredRooms.slice(indexOfFirstRoom, indexOfLastRoom);

const paginateRooms = (pageNumber) => setCurrentPage(pageNumber);

const roomPageNumbers = [];
for (let i = 1; i <= Math.ceil(filteredRooms.length / roomsPerPage); i++) {
  roomPageNumbers.push(i);
}
  
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
              className='bg-gray-700 text-white placeholder-gray-400 rounded-lg pl-12 pr-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500'
              onChange={handleSearch}
              value={searchTerm}
              autoComplete='off' // Ngăn chặn tự động điền
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
              <th className='px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider'>Xếp Hạng</th>              
              <th className='px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider'>Hành động</th>

            </tr>
          </thead>

          <tbody className='divide-y divide-gray-700'>
            {currentHotels.map((hotel) => (
              <tr key={hotel._id}>
                <td className='px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-100'>{hotel.name}</td>
                <td className='px-6 py-4 whitespace-nowrap text-sm text-gray-300'>{hotel.location}</td>
                <td className='px-6 py-4 whitespace-nowrap text-sm text-gray-300'>{hotel.manager.name}</td>
                <td className='px-6 py-4 whitespace-nowrap text-sm text-gray-300'>{hotel.stars}</td>
                <td className='px-6 py-4 whitespace-nowrap text-sm text-gray-300'>
                  <button onClick={() => showRoomDrawer(hotel._id)} className='text-blue-500 hover:text-blue-700 mr-2'>
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

      {/* Modal for Edit Hotel */}
      <Modal
        title={isUpdating ? 'Cập nhật khách sạn' : 'Chỉnh sửa khách sạn'}
        visible={isModalVisible}
        onCancel={() => setIsModalVisible(false)}
        footer={null}
      >
        <Form form={form} layout="vertical" onFinish={handleSave}>
          <Form.Item name="name" label="Tên khách sạn" rules={[{ required: true, message: 'Vui lòng nhập tên khách sạn!' }]}>
            <Input />
          </Form.Item>
          <Form.Item name="location" label="Vị trí" rules={[{ required: true, message: 'Vui lòng nhập vị trí!' }]}>
            <Input />
          </Form.Item>
          <Form.Item name="description" label="Mô tả">
            <Input.TextArea rows={4} />
          </Form.Item>
          <Form.Item label="Hình ảnh">
            <Upload
              action={null}
              fileList={fileList}
              onChange={handleImageChange}
              onRemove={handleRemoveImage}
              beforeUpload={() => false} // Prevent automatic upload
              listType="picture"
            >
              <Button icon={<UploadOutlined />}>Chọn Hình Ảnh</Button>
            </Upload>
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit" loading={isUpdating}>
              {isUpdating ? 'Đang cập nhật...' : 'Cập nhật'}
            </Button>
          </Form.Item>
        </Form>
      </Modal>

      
      <Modal
  title="Thêm Khách Sạn"
  visible={isAddModalVisible}
  onCancel={() => setIsAddModalVisible(false)}
  footer={null}
>
  <Form form={addHotelForm} layout="vertical" onFinish={handleAddHotel}>
    <Form.Item
      name="name"
      label="Tên khách sạn"
      rules={[{ required: true, message: 'Vui lòng nhập tên khách sạn!' }]}
    >
      <Input />
    </Form.Item>
    <Form.Item
      name="location"
      label="Vị trí"
      rules={[{ required: true, message: 'Vui lòng nhập vị trí!' }]}
    >
      <Input />
    </Form.Item>
    <Form.Item name="description" label="Mô tả">
      <Input.TextArea rows={4} />
    </Form.Item>
    {/* Stars rating field */}
    <Form.Item
      name="stars"
      label="Xếp Hạng"
      rules={[{ required: true, message: 'Vui lòng chọn xếp hạng!' }]}
    >
      <Rate allowHalf />
    </Form.Item>
    <Form.Item label="Hình ảnh">
      <Upload
        action={null}
        fileList={fileList}
        onChange={handleUpload}
        onRemove={handleRemoveImage}
        beforeUpload={() => false} // Prevent automatic upload
        listType="picture"
      >
        <Button icon={<UploadOutlined />}>Chọn Hình Ảnh</Button>
      </Upload>
    </Form.Item>
    <Form.Item>
      <Button type="primary" htmlType="submit" loading={loading}>
        {loading ? 'Đang thêm...' : 'Thêm khách sạn'}
      </Button>
    </Form.Item>
  </Form>
</Modal>


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

      <Drawer
  title="Danh sách phòng"
  placement="right"
  hotelId={currentHotel}
  onClose={closeRoomDrawer}
  visible={isRoomDrawerVisible}
  width={720}
>
  <div style={{ marginBottom: '16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
    {/* Nút Thêm Phòng */}
    <Button 
      type="primary" 
      icon={<PlusCircle />} 
      onClick={handleAddRoomClick} // Gọi hàm thêm phòng
    >
      Thêm Phòng
    </Button>

    {/* Thanh tìm kiếm */}
    <Input
      placeholder="Tìm kiếm phòng..."
      onChange={handleSearchRoom}
      value={roomSearchTerm}
      autoComplete="off" // Ngăn chặn tự động điền
      style={{ width: 200 }}
    />
  </div>

    <>
      {/* Bảng danh sách phòng */}
      <Table
        dataSource={currentRooms}
        rowKey="_id" // Sử dụng trường _id làm khóa cho mỗi hàng
        pagination={false} // Tắt phân trang nếu không cần thiết
        columns={[
          {
            title: 'Loại Phòng',
            dataIndex: 'type',
            key: 'type',
          },
          {
            title: 'Giá',
            dataIndex: 'price',
            key: 'price',
            render: (text) => <span>{text} VND</span>,
          },
          {
            title: 'Số Lượng Còn Lại',
            dataIndex: 'remainingRooms',
            key: 'remainingRooms',
            render: (text) => <span>{text} Phòng</span>,
          },
          {
            title: 'Hành Động',
            key: 'action',
            render: (text, record) => (
              <div style={{ display: 'flex', gap: '10px' }}>
                <Eye color="green" cursor="pointer" title="Xem" onClick={() => handleViewRoom(record._id)} />
                <Edit color="orange" cursor="pointer" title="Sửa" onClick={() => handleEditRoom(record._id)} />
                <Trash2 color="red" cursor="pointer" title="Xóa" onClick={() => handleDeleteRoom(record._id)} />
              </div>
            ),
          },
        ]}
      />

      {/* Phân trang nếu có nhiều trang */}
      {roomPageNumbers.length > 1 && (
        <div style={{ marginTop: '16px', display: 'flex', justifyContent: 'center' }}>
          {roomPageNumbers.map(number => (
            <Button 
              key={number} 
              onClick={() => paginateRooms(number)}
              style={{ margin: '0 4px' }} // Khoảng cách giữa các nút
            >
              {number}
            </Button>
          ))}
        </div>
      )}
    </>


  {/* Hiển thị modal để thêm phòng */}
  <AddRoom 
    visible={isModalVisible} 
    onClose={handleModalClose}
    hotelId={hotelId} // Truyền hotelId vào AddRoom

  />
</Drawer>






    </motion.div>
  );
};

export default MyHotelTable;
