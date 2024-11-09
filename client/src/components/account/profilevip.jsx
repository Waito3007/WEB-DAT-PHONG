import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { UploadOutlined } from '@ant-design/icons';
import { Drawer, Button, Form, Input, message, Modal, Spin, Pagination, Table } from 'antd';
import axios from 'axios'; // Import axios
import AvatarEdit from 'react-avatar-edit'; // Nhập thư viện
import './Profilevip.css'; // Đảm bảo tạo file CSS và nhập vào


const ProfileVip = () => {
    const [user, setUser] = useState(null);
    const [editVisible, setEditVisible] = useState(false);
    const [changePasswordVisible, setChangePasswordVisible] = useState(false);
    const [avatarSrc, setAvatarSrc] = useState(null);
    const [showCropper, setShowCropper] = useState(false);
    const [avatarUrl, setAvatarUrl] = useState(null); 
    const [loading, setLoading] = useState(false); // Trạng thái để theo dõi quá trình tải lên
    const [bookingHistory, setBookingHistory] = useState([]); // State cho lịch sử đặt phòng
    const navigate = useNavigate();
    //phân trang
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage] = useState(5); // Số dòng hiển thị trên mỗi trang
    

    //lấy dữ liệu
    useEffect(() => {
        const fetchProfile = async () => {
            const token = localStorage.getItem('token');

            try {
                const response = await fetch('/api/profile/me', {
                    headers: { 'Authorization': `Bearer ${token}` },
                });
                const data = await response.json();
                if (response.ok) {
                    setUser(data);
                    setAvatarUrl(data.avatar);
                    fetchBookingHistory(token); // Gọi hàm lấy lịch sử đặt phòng
                } else {
                    navigate('/login');
                }
            } catch (err) {
                console.error('Lỗi mạng hoặc server:', err);
                navigate('/login');
            }
        };

        const fetchBookingHistory = async (token) => {
            try {
                const response = await fetch('/api/booking', {
                    headers: { 'Authorization': `Bearer ${token}` },
                });
                const data = await response.json();
                if (response.ok) {
                    setBookingHistory(data); // Cập nhật lịch sử đặt phòng
                } else {
                    console.error('Không thể lấy lịch sử đặt phòng');
                }
            } catch (err) {
                console.error('Lỗi mạng hoặc server:', err);
            }
        };

        fetchProfile();
    }, [navigate]);



    // Hàm định dạng ngày
    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return `${String(date.getDate()).padStart(2, '0')}/${String(date.getMonth() + 1).padStart(2, '0')}/${date.getFullYear()}`;
    };

        // Tính toán chỉ mục dữ liệu cho mỗi trang
        const startIndex = (currentPage - 1) * itemsPerPage;
        const endIndex = startIndex + itemsPerPage;
        const currentBookings = bookingHistory.slice(startIndex, endIndex);
    
        // Xử lý sự kiện thay đổi trang
        const onPageChange = (page) => {
            setCurrentPage(page);
        };

    //chỉnh sửa thông tin cá nhân
    const handleEditSubmit = async (values) => {
        const token = localStorage.getItem('token');
        try {
            const response = await fetch('/api/profile/edit', {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
                body: JSON.stringify({ ...values, avatar: avatarUrl }), // Include avatar URL in submission
            });

            if (response.ok) {
                const updatedUser = await response.json();
                setUser(updatedUser);
                message.success('Cập nhật thông tin thành công!');
                setEditVisible(false);
            } else {
                message.error('Cập nhật thông tin thất bại!');
            }
        } catch (err) {
            console.error('Lỗi:', err);
            message.error('Đã xảy ra lỗi!');
        }
    };

    //thay đổi mật khẩu
    const handleChangePasswordSubmit = async (values) => {
        const token = localStorage.getItem('token');
        try {
            const response = await fetch('/api/profile/change-password', {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
                body: JSON.stringify(values),
            });

            if (response.ok) {
                message.success('Đổi mật khẩu thành công!');
                setChangePasswordVisible(false);
            } else {
                message.error('Đổi mật khẩu thất bại!');
            }
        } catch (err) {
            console.error('Lỗi:', err);
            message.error('Đã xảy ra lỗi!');
        }
    };

    

    //thay đổi ảnh đại diện
    const onCrop = (preview) => {
        setAvatarSrc(preview); // Lưu hình ảnh đã cắt vào state
    };
    const onClose = () => {
        setShowCropper(false);
    };
    const handleUpload = async () => {
        if (!avatarSrc) return; // Nếu không có ảnh đã cắt thì không làm gì cả

        setLoading(true);
        const formData = new FormData();
        const blob = await fetch(avatarSrc).then(res => res.blob());
        formData.append('avatar', blob, 'avatar.png'); // Thêm blob vào formData

        try {
            const response = await axios.post('/api/profile/upload-avatar', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });

            if (response.data && response.data.imageUrl) {
                setAvatarUrl(response.data.imageUrl);
                message.success('Tải lên ảnh thành công!');
                window.location.reload();
            }
        } catch (error) {
            message.error('Tải lên ảnh thất bại!');
        } finally {
            setLoading(false);
        }
    };
    
    const columns = [
        {
            title: 'Mã Đặt Phòng',
            dataIndex: 'orderId',
            key: 'orderId',
            filterMultiple: false, // Giới hạn chọn một bộ lọc
            onFilter: (value, record) => record.orderId.includes(value),
            filters: bookingHistory.map(booking => ({ text: booking.orderId, value: booking.orderId })),
        },
        {
            title: 'Tên Khách Sạn',
            dataIndex: ['room', 'hotel', 'name'],
            key: 'hotelName',
            filterMultiple: true,
            onFilter: (value, record) => record.room.hotel.name.includes(value),
            filters: Array.from(new Set(bookingHistory.map(booking => booking.room.hotel.name)))
                .map(name => ({ text: name, value: name })),
        },
        {
            title: 'Loại Phòng',
            dataIndex: ['room', 'type'],
            key: 'roomType',
            filters: Array.from(new Set(bookingHistory.map(booking => booking.room.type)))
                .map(type => ({ text: type, value: type })),
            onFilter: (value, record) => record.room.type.includes(value),
        },
        {
            title: 'Ngày Check In',
            dataIndex: 'checkInDate',
            key: 'checkInDate',
            render: (date) => formatDate(date),
        },
        {
            title: 'Ngày Check Out',
            dataIndex: 'checkOutDate',
            key: 'checkOutDate',
            render: (date) => formatDate(date),
        },
        {
            title: 'Tình Trạng Thanh Toán',
            dataIndex: 'paymentStatus',
            key: 'paymentStatus',
            filters: [
                { text: 'Đã thanh toán', value: 'Complete' },
                { text: 'Chưa thanh toán', value: 'Pending' },
            ],
            onFilter: (value, record) => record.paymentStatus === value,
        },
    ];

    return (
        <main className="profile-page">
            <section className="relative block h-96 overflow-hidden">
                <div
                    className="absolute top-0 w-full h-full bg-center bg-cover"
                    style={{
                        backgroundImage: "url('https://res.cloudinary.com/dackig67m/image/upload/v1730394983/ebeab5a5-cc06-4d0c-a700-4c6aa3114d05_oetdts.gif')",
                    }}
                >
                    <span id="blackOverlay" className="w-full h-full absolute opacity-50 bg-black"></span>
                </div>
            </section>

            <section className="relative py-16 bg-gray-100">
                <div className="container mx-auto px-4">
                    <div className="relative flex flex-col min-w-0 break-words bg-white w-full mb-5 shadow-xl rounded-lg -mt-60">
                        <div className="flex flex-wrap justify-between items-center px-6 py-4">
                            <div className="flex items-center">
                            <div className="relative p-1 bg-white rounded-full shadow-lg transition-all duration-300 hover:shadow-2xl">
                <img
                    alt="Avatar"
                    src={avatarUrl || (user && user.avatar) ? user.avatar : 'https://res.cloudinary.com/dackig67m/image/upload/v1730489645/5db7d294a77fbe0fbfca4eb233afc01b_vt0x30.jpg'}
                    className="rounded-full h-32 w-32 object-cover align-middle border-none max-w-full"
                />
                <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center rounded-full opacity-0 hover:opacity-100 transition-opacity duration-300 cursor-pointer">
                <UploadOutlined onClick={() => setShowCropper(true)} style={{ fontSize: '24px', color: 'white', opacity: 0.8 }} />
                </div>
            </div>
                                <div className="text-left ml-4">
                                    <h3 className="text-2xl font-semibold leading-normal mb-2 text-black">
                                        {user ? user.name : 'Tải thông tin...'}
                                    </h3>
                                    <p className="text-gray-600">{user ? user.email : 'Đang tải email...'}</p>
                                </div>
                            </div>

                            <div className="text-right">
                                <Button
                                    className="mr-2"
                                    type="primary"
                                    onClick={() => setEditVisible(true)}
                                >
                                    Chỉnh sửa hồ sơ
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

             {/* Drawer for editing profile */}
            <Drawer
                title="Chỉnh sửa hồ sơ"
                placement="right"
                onClose={() => setEditVisible(false)}
                visible={editVisible}
                bodyStyle={{ padding: '20px', backgroundColor: '#f8f9fa' }} // Nền nhẹ cho nội dung
                titleStyle={{ fontSize: '1.5rem', textAlign: 'center', color: '#007bff' }} // Màu cho tiêu đề
                closable={false} // Tắt nút đóng mặc định để chỉ sử dụng nút riêng
            >
                <Form
                    initialValues={{ name: user?.name, email: user?.email, age: user?.age }}
                    onFinish={handleEditSubmit}
                >
                    <Form.Item
                        label="Tên"
                        name="name"
                        rules={[{ required: true, message: 'Vui lòng nhập tên!' }]}
                    >
                        <Input 
                            placeholder="Nhập tên của bạn" 
                            style={{ borderRadius: '8px', border: '1px solid #ced4da', boxShadow: '0 2px 5px rgba(0, 0, 0, 0.1)' }} 
                        />
                    </Form.Item>
                    <Form.Item
                        label="Email"
                        name="email"
                        rules={[{ required: true, type: 'email', message: 'Vui lòng nhập email hợp lệ!' }]}
                    >
                        <Input 
                            placeholder="Nhập email của bạn" 
                            style={{ borderRadius: '8px', border: '1px solid #ced4da', boxShadow: '0 2px 5px rgba(0, 0, 0, 0.1)' }} 
                        />
                    </Form.Item>
                    <Form.Item label="Tuổi" name="age">
                        <Input 
                            type="number" 
                            placeholder="Nhập tuổi của bạn" 
                            style={{ borderRadius: '8px', border: '1px solid #ced4da', boxShadow: '0 2px 5px rgba(0, 0, 0, 0.1)' }} 
                        />
                    </Form.Item>
                    <Form.Item>
                        <Button
                            type="default"
                            onClick={() => setChangePasswordVisible(true)}
                            style={{ width: '100%', borderRadius: '8px', marginBottom: '10px', backgroundColor: '#007bff', color: '#fff', border: 'none', boxShadow: '0 2px 5px rgba(0, 0, 0, 0.1)' }} // Nút với màu sắc
                        >
                            Đổi mật khẩu
                        </Button>
                    </Form.Item>
                    <Form.Item>
                        <Button
                            type="primary"
                            htmlType="submit"
                            style={{ width: '100%', borderRadius: '8px', boxShadow: '0 2px 5px rgba(0, 0, 0, 0.1)' }} // Nút chính
                        >
                            Lưu
                        </Button>
                    </Form.Item>
                </Form>
            </Drawer>

            {/* Drawer for changing password */}
            <Drawer
                title="Đổi mật khẩu"
                placement="right"
                onClose={() => setChangePasswordVisible(false)}
                visible={changePasswordVisible}
                bodyStyle={{ padding: '20px', backgroundColor: '#f8f9fa' }}
                titleStyle={{ fontSize: '1.5rem', textAlign: 'center', color: '#007bff' }}
                closable={false}
            >
                <Form onFinish={handleChangePasswordSubmit}>
                    <Form.Item
                        label="Mật khẩu hiện tại"
                        name="currentPassword"
                        rules={[{ required: true, message: 'Vui lòng nhập mật khẩu hiện tại!' }]}
                    >
                        <Input.Password 
                            placeholder="Nhập mật khẩu hiện tại" 
                            style={{ borderRadius: '8px', border: '1px solid #ced4da', boxShadow: '0 2px 5px rgba(0, 0, 0, 0.1)' }} 
                        />
                    </Form.Item>
                    <Form.Item
                        label="Mật khẩu mới"
                        name="newPassword"
                        rules={[{ required: true, message: 'Vui lòng nhập mật khẩu mới!' }]}
                    >
                        <Input.Password 
                            placeholder="Nhập mật khẩu mới" 
                            style={{ borderRadius: '8px', border: '1px solid #ced4da', boxShadow: '0 2px 5px rgba(0, 0, 0, 0.1)' }} 
                        />
                    </Form.Item>
                    <Form.Item
                        label="Xác nhận mật khẩu mới"
                        name="confirmPassword"
                        rules={[{ required: true, message: 'Vui lòng xác nhận mật khẩu mới!' }]}
                    >
                        <Input.Password 
                            placeholder="Xác nhận mật khẩu mới" 
                            style={{ borderRadius: '8px', border: '1px solid #ced4da', boxShadow: '0 2px 5px rgba(0, 0, 0, 0.1)' }} 
                        />
                    </Form.Item>
                    <Form.Item>
                        <Button
                            type="primary"
                            htmlType="submit"
                            style={{ width: '100%', borderRadius: '8px', boxShadow: '0 2px 5px rgba(0, 0, 0, 0.1)' }}
                        >
                            Đổi mật khẩu
                        </Button>
                    </Form.Item>
                </Form>
            </Drawer>{/* Drawer for editing profile */}
            <Drawer
                title="Chỉnh sửa hồ sơ"
                placement="right"
                onClose={() => setEditVisible(false)}
                visible={editVisible}
                bodyStyle={{ padding: '20px', backgroundColor: '#f8f9fa' }} // Nền nhẹ cho nội dung
                titleStyle={{ fontSize: '1.5rem', textAlign: 'center', color: '#007bff' }} // Màu cho tiêu đề
                closable={false} // Tắt nút đóng mặc định để chỉ sử dụng nút riêng
            >
                <Form
                    initialValues={{ name: user?.name, email: user?.email, age: user?.age }}
                    onFinish={handleEditSubmit}
                >
                    <Form.Item
                        label="Tên"
                        name="name"
                        rules={[{ required: true, message: 'Vui lòng nhập tên!' }]}
                    >
                        <Input 
                            placeholder="Nhập tên của bạn" 
                            style={{ borderRadius: '8px', border: '1px solid #ced4da', boxShadow: '0 2px 5px rgba(0, 0, 0, 0.1)' }} 
                        />
                    </Form.Item>
                    <Form.Item
                        label="Email"
                        name="email"
                        rules={[{ required: true, type: 'email', message: 'Vui lòng nhập email hợp lệ!' }]}
                    >
                        <Input 
                            placeholder="Nhập email của bạn" 
                            style={{ borderRadius: '8px', border: '1px solid #ced4da', boxShadow: '0 2px 5px rgba(0, 0, 0, 0.1)' }} 
                        />
                    </Form.Item>
                    <Form.Item label="Tuổi" name="age">
                        <Input 
                            type="number" 
                            placeholder="Nhập tuổi của bạn" 
                            style={{ borderRadius: '8px', border: '1px solid #ced4da', boxShadow: '0 2px 5px rgba(0, 0, 0, 0.1)' }} 
                        />
                    </Form.Item>
                    <Form.Item>
                        <Button
                            type="default"
                            onClick={() => setChangePasswordVisible(true)}
                            style={{ width: '100%', borderRadius: '8px', marginBottom: '10px', backgroundColor: '#007bff', color: '#fff', border: 'none', boxShadow: '0 2px 5px rgba(0, 0, 0, 0.1)' }} // Nút với màu sắc
                        >
                            Đổi mật khẩu
                        </Button>
                    </Form.Item>
                    <Form.Item>
                        <Button
                            type="primary"
                            htmlType="submit"
                            style={{ width: '100%', borderRadius: '8px', boxShadow: '0 2px 5px rgba(0, 0, 0, 0.1)' }} // Nút chính
                        >
                            Lưu
                        </Button>
                    </Form.Item>
                </Form>
            </Drawer>

            {/* Drawer for changing password */}
            <Drawer
                title="Đổi mật khẩu"
                placement="right"
                onClose={() => setChangePasswordVisible(false)}
                visible={changePasswordVisible}
                bodyStyle={{ padding: '20px', backgroundColor: '#f8f9fa' }}
                titleStyle={{ fontSize: '1.5rem', textAlign: 'center', color: '#007bff' }}
                closable={false}
            >
                <Form onFinish={handleChangePasswordSubmit}>
                    <Form.Item
                        label="Mật khẩu hiện tại"
                        name="currentPassword"
                        rules={[{ required: true, message: 'Vui lòng nhập mật khẩu hiện tại!' }]}
                    >
                        <Input.Password 
                            placeholder="Nhập mật khẩu hiện tại" 
                            style={{ borderRadius: '8px', border: '1px solid #ced4da', boxShadow: '0 2px 5px rgba(0, 0, 0, 0.1)' }} 
                        />
                    </Form.Item>
                    <Form.Item
                        label="Mật khẩu mới"
                        name="newPassword"
                        rules={[{ required: true, message: 'Vui lòng nhập mật khẩu mới!' }]}
                    >
                        <Input.Password 
                            placeholder="Nhập mật khẩu mới" 
                            style={{ borderRadius: '8px', border: '1px solid #ced4da', boxShadow: '0 2px 5px rgba(0, 0, 0, 0.1)' }} 
                        />
                    </Form.Item>
                    <Form.Item
                        label="Xác nhận mật khẩu mới"
                        name="confirmPassword"
                        rules={[{ required: true, message: 'Vui lòng xác nhận mật khẩu mới!' }]}
                    >
                        <Input.Password 
                            placeholder="Xác nhận mật khẩu mới" 
                            style={{ borderRadius: '8px', border: '1px solid #ced4da', boxShadow: '0 2px 5px rgba(0, 0, 0, 0.1)' }} 
                        />
                    </Form.Item>
                    <Form.Item>
                        <Button
                            type="primary"
                            htmlType="submit"
                            style={{ width: '100%', borderRadius: '8px', boxShadow: '0 2px 5px rgba(0, 0, 0, 0.1)' }}
                        >
                            Đổi mật khẩu
                        </Button>
                    </Form.Item>
                </Form>
            </Drawer>

              {/* Booking History Section */}
              <section className="py-16">
            <div className="relative mx-auto px-4">
                <h2 className="text-2xl font-ROBOTO text-black mb-4">LỊCH SỬ ĐẶT PHÒNG</h2>
                <div className="overflow-x-auto">
                    <Table
                        columns={columns}
                        dataSource={bookingHistory}
                        pagination={{
                            current: currentPage,
                            pageSize: itemsPerPage,
                            total: bookingHistory.length,
                            onChange: onPageChange,
                        }}
                        rowKey="id" // Đảm bảo mỗi hàng có một key duy nhất
                    />
                </div>
            </div>
        </section>
             {/* Modal cho AvatarEdit */}
            <Modal
                width={1000}
                visible={showCropper}
                onCancel={onClose}
                onOk={handleUpload}
                title="Chỉnh sửa ảnh đại diện"
                footer={[
                    <Button key="cancel" onClick={onClose} className="cancel-button">
                        Hủy
                    </Button>,
                    <Button key="save" type="primary" onClick={handleUpload} className="save-button">
                        Lưu
                    </Button>,
                ]}
                className="avatar-modal"
            >
                <div className="avatar-edit-container">
                    <AvatarEdit
                        width={900}
                        height={400}
                        onCrop={onCrop}
                        onClose={onClose}
                    />
                </div>
            </Modal>

            {/* Modal for loading */}
            <Modal
    visible={loading}
    footer={null}
    closable={false}
    bodyStyle={{ textAlign: 'center' }}
    style={{ borderRadius: '10px', padding: '20px' }} // Thêm style nếu cần
>
    <Spin size="large" tip="Đang tải..." />
    <h3 style={{ marginTop: '20px' }}>Đang tải...</h3>
</Modal>
        </main>
    );
};



export default ProfileVip;
