import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { UploadOutlined } from '@ant-design/icons';
import { Button, message, Modal } from 'antd';
import axios from 'axios'; // Import axios
import AvatarEdit from 'react-avatar-edit'; // Nhập thư viện
import BookingHistory from './BookingHistory'; // Import BookingHistory component
import EditProfileDrawer from './EditProfileDrawer'; // Import EditProfileDrawer
import ChangePasswordDrawer from './ChangePasswordDrawer'; // Import ChangePasswordDrawer
import LoadingModal from './LoadingModal'; // Import LoadingModal
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
     const [isOrderIdVisible, setIsOrderIdVisible] = useState(true); // Trạng thái hiển thị của cột Mã Đặt Phòng
    
    // Toggle function
    const toggleOrderIdVisibility = () => setIsOrderIdVisible(!isOrderIdVisible);

    //lấy dữ liệu người dùng
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
        
            //lấy dữ liệu lịch sử đặt phòng
        const fetchBookingHistory = async (token) => {
            try {
                const response = await fetch('/api/booking', {
                    headers: { 'Authorization': `Bearer ${token}` },
                });
                const data = await response.json();
        
                if (response.ok) {
                    // Sắp xếp `bookingHistory` theo `bookingDate` từ mới nhất đến cũ nhất
                    const sortedData = data.sort((a, b) => new Date(b.bookingDate) - new Date(a.bookingDate));
                    setBookingHistory(sortedData); // Cập nhật lịch sử đặt phòng với dữ liệu đã sắp xếp
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


            {/* Sử dụng EditProfileDrawer */}
            <EditProfileDrawer
                visible={editVisible}
                onClose={() => setEditVisible(false)}
                user={user}
                onEditSubmit={handleEditSubmit}
                onPasswordChange={() => setChangePasswordVisible(true)}
            />

             {/* Sử dụng ChangePasswordDrawer */}
             <ChangePasswordDrawer
                visible={changePasswordVisible}
                onClose={() => setChangePasswordVisible(false)}
                onPasswordSubmit={handleChangePasswordSubmit}
            />

              {/* BookingHistory component */}
            <BookingHistory
                bookingHistory={bookingHistory}
                currentPage={currentPage}
                itemsPerPage={itemsPerPage}
                onPageChange={onPageChange}
                formatDate={formatDate}
                isOrderIdVisible={isOrderIdVisible}
                toggleOrderIdVisibility={toggleOrderIdVisibility}
            />

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
            <LoadingModal loading={loading} />

        </main>
    );
};



export default ProfileVip;



