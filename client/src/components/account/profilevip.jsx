import React, { useEffect, useState } from 'react';
import AvatarCropper from './AvatarCropper'; // Đường dẫn chính xác tùy theo cấu trúc thư mục của bạn
import { useNavigate } from 'react-router-dom';
import { UploadOutlined } from '@ant-design/icons';
import { Drawer, Button, Form, Input, message, Upload, Modal, Spin } from 'antd';
import axios from 'axios'; // Import axios

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

    useEffect(() => {
        const fetchProfile = async () => {
            const token = localStorage.getItem('token');
            if (!token) {
                navigate('/login');
                return;
            }

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


    const handleUploadChange = (info) => {
        if (info.file.status === 'done') {
            const reader = new FileReader();
            reader.onload = (e) => {
                setAvatarSrc(e.target.result);
                setShowCropper(true); // Hiển thị modal cắt ảnh
            };
            reader.readAsDataURL(info.file.originFileObj);
        }
    };

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

    const uploadBlob = async (blob) => {
        const formData = new FormData();
        formData.append('avatar', blob, 'avatar.png'); // 'avatar' là tên field, 'avatar.png' là tên file
    
        try {
            const response = await fetch('/api/profile/upload-avatar', { // Thay thế bằng URL của bạn
                method: 'POST',
                body: formData,
            });
    
            if (!response.ok) {
                throw new Error('Failed to upload image');
            }
    
            const data = await response.json(); // Giả sử server trả về JSON
            return data; // Trả về dữ liệu từ server nếu cần
        } catch (error) {
            console.error('Upload failed:', error);
            throw error; // Ném lỗi để xử lý ở nơi gọi hàm
        }
    };
    
    const handleUpload = async ({ file }) => {
        setLoading(true); // Bắt đầu quá trình tải lên
        const formData = new FormData();
        formData.append('avatar', file); // Thêm file vào formData
    
        try {
            const response = await axios.post('/api/profile/upload-avatar', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data', // Đặt header cho request
                },
            });
    
            // Kiểm tra phản hồi từ server
            if (response.data && response.data.imageUrl) {
                setAvatarUrl(response.data.imageUrl); // Lưu URL vào state
                message.success('Tải lên ảnh thành công!'); // Thông báo thành công
                window.location.reload(); // Tải lại toàn bộ trang
            }
        } catch (error) {
            message.error('Tải lên ảnh thất bại!'); // Thông báo lỗi nếu có
        } finally {
            setLoading(false); // Kết thúc quá trình tải lên
        }
    };
    

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
                <Upload 
                showUploadList={false}
                customRequest={handleUpload}
                accept="image/*"
            >
                <UploadOutlined style={{ fontSize: '24px', color: 'white', opacity: 0.8 }} />
            </Upload>                
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
                        <table className="min-w-full bg-white shadow-md rounded-lg overflow-hidden">
                            <thead>
                                <tr className="bg-gray-200 text-gray-700 uppercase text-sm leading-normal">
                                    <th className="py-3 px-6 text-left">Mã Đặt Phòng</th>
                                    <th className="py-3 px-6 text-left">Tên Khách Sạn</th>
                                    <th className="py-3 px-6 text-left">Loại Phòng</th>
                                    <th className="py-3 px-6 text-left">Ngày Check In</th>
                                    <th className="py-3 px-6 text-left">Ngày Check Out</th>
                                    <th className="py-3 px-6 text-left">Tình Trạng Thanh Toán</th>
                                </tr>
                            </thead>
                            <tbody className="text-gray-600 text-sm font-light">
                                {bookingHistory.map((booking) => (
                                    <tr key={booking.id} className="border-b border-gray-200 hover:bg-gray-100">
                                        <td className="py-3 px-6 text-left">{booking.orderId}</td>
                                        <td className="py-3 px-6 text-left">{booking.room.hotel.name}</td>
                                        <td className="py-3 px-6 text-left">{booking.room.type}</td>
                                        <td className="py-3 px-6 text-left">{booking.checkInDate}</td>
                                        <td className="py-3 px-6 text-left">{booking.checkOutDate}</td>
                                        <td className="py-3 px-6 text-left">{booking.paymentStatus}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </section>

            {showCropper && (
                <Modal
                    visible={showCropper}
                    footer={null}
                    onCancel={() => setShowCropper(false)}
                    title="Cắt ảnh đại diện"
                >
                    <AvatarCropper 
                        src={avatarSrc} 
                        onCropComplete={(blob) => {
                            setLoading(true);
                            // Giả sử bạn có một hàm uploadBlob để upload ảnh
                            uploadBlob(blob).then(() => {
                                setLoading(false);
                                setShowCropper(false);
                            });
                        }} 
                    />
                </Modal>
            )}

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
