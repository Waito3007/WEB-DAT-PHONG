import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { User, Heart, Calendar, Hotel, LogOut, Menu } from "lucide-react";

const HomeNavbar = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const fetchUser = async () => {
    try {
      const response = await fetch('/api/profile/me', {
        method: 'GET',
        credentials: 'include'
      });

      if (response.ok) {
        const userData = await response.json();
        setUser(userData);
      } else {
        console.error("Lỗi lấy thông tin người dùng:", response.status);
      }
    } catch (error) {
      console.error("Lỗi mạng:", error);
    }
  };

  useEffect(() => {
    fetchUser();
  }, []);

  const handleLogin = () => {
    navigate("/login");
  };

  const handleProfile = () => {
    navigate("/myprofile");
  };

  const handleSignUp = () => {
    navigate("/register");
  };

  const handleHome = () => {
    navigate("/");
  };

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  const handleLogout = async () => {
    try {
      const response = await fetch('/api/profile/logout', {
        method: 'POST',
        credentials: 'include',
      });

      if (response.ok) {
        setUser(null);
        setMenuOpen(false);
        navigate("/login");
      } else {
        console.error("Lỗi khi đăng xuất:", response.status);
      }
    } catch (error) {
      console.error("Lỗi khi đăng xuất:", error);
    }
  };

  const handleManageHotel = () => {
    const token = localStorage.getItem('token');
    if (token) {
      // Nếu token tồn tại, chuyển hướng đến trang "/overview"
      console.log("Token hiện tại:", token);
      navigate("/overview");
    } else {
      // Nếu không có token, điều hướng về trang đăng nhập hoặc hiển thị thông báo lỗi
      console.error("Không tìm thấy token, vui lòng đăng nhập.");
      navigate("./login"); // Hoặc hiển thị thông báo lỗi tùy theo yêu cầu
    }
  };

  const toggleResponsiveMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <div className="navbar flex justify-between items-center p-4 bg-gray-800 relative">
      {/* Logo */}
      <div className="navbar-title">
        <img
          src="https://res.cloudinary.com/dackig67m/image/upload/v1730387091/logovip_qp8hz1.png"
          alt="Stay Night Logo"
          className="h-10"
          onClick={handleHome}
          style={{ cursor: 'pointer' }}
        />
      </div>

      {/* Middle Navigation Links */}
      <div className="navbar-links hidden md:flex space-x-6">
      <span className="cursor-pointer" onClick={handleHome}>Trang chủ</span>
      <span className="cursor-pointer" onClick={() => navigate("/searchpage")}>Đặt Phòng</span>
      <span className="cursor-pointer" onClick={() => navigate("/")}>Liên hệ</span>
      </div>

      {/* Mobile Menu Icon */}
      <div className="md:hidden flex items-center">
        <Menu className="w-8 h-8 text-white cursor-pointer" onClick={toggleResponsiveMenu} />
      </div>

      {/* User Controls */}
      <div className="navbar-buttons hidden md:flex relative">
        {user ? (
          <div className="user-avatar cursor-pointer" onClick={toggleMenu}>
            <img 
              src={user.avatar || "https://img.freepik.com/premium-vector/default-avatar-profile-icon-social-media-user-image-gray-avatar-icon-blank-profile-silhouette-vector-illustration_561158-3485.jpg"} 
              alt="Avatar" 
              className="w-10 h-10 rounded-full" 
            />
            {menuOpen && (
              <div className="absolute right-0 mt-2 w-60 bg-white shadow-lg rounded-md z-50">
                <ul className="py-2">
                  <li className="flex items-center px-4 py-2 text-black hover:bg-gray-100 cursor-pointer" onClick={handleProfile}>
                    <User className="w-4 h-4 mr-2" /> Hồ sơ cá nhân
                  </li>
                  <li className="flex items-center px-4 py-2 text-black hover:bg-gray-100 cursor-pointer">
                    <Heart className="w-4 h-4 mr-2" /> Khách sạn yêu thích
                  </li>
                  <li className="flex items-center px-4 py-2 text-black hover:bg-gray-100 cursor-pointer">
                    <Calendar className="w-4 h-4 mr-2" /> Đặt phòng của bạn
                  </li>
                  {user.role === "Admin" || user.role === "HotelManager" ? (
                    <a href="/overview" className="flex items-center px-4 py-2 text-black hover:bg-gray-100 cursor-pointer"onClick={handleProfile}>
                      <Hotel className="w-4 h-4 mr-2" /> Quản lý khách sạn
                    </a>
                  ) : null}
                  <li className="flex items-center px-4 py-2 text-black hover:bg-gray-100 cursor-pointer" onClick={handleLogout}>
                    <LogOut className="w-4 h-4 mr-2" /> Đăng xuất
                  </li>
                </ul>
              </div>
            )}
          </div>
        ) : (
          <div className="inline-flex rounded-md shadow-sm" role="group">
            <button type="button" className="inline-flex items-center px-4 py-2 text-sm font-medium text-gray-900 bg-white border border-gray-200 rounded-s-lg hover:text-blue-700 focus:z-10 focus:ring-2 focus:ring-blue-700 focus:text-blue-700 dark:bg-gray-800 dark:border-gray-700 dark:text-white dark:hover:text-white dark:hover:bg-gray-700 dark:focus:ring-blue-500 dark:focus:text-white" onClick={handleLogin}>
              Đăng nhập
            </button>
            <button type="button" className="inline-flex items-center px-4 py-2 text-sm font-medium text-gray-900 bg-white border border-gray-200 rounded-e-lg hover:text-blue-700 focus:z-10 focus:ring-2 focus:ring-blue-700 focus:text-blue-700 dark:bg-gray-800 dark:border-gray-700 dark:text-white dark:hover:text-white dark:hover:bg-gray-700 dark:focus:ring-blue-500 dark:focus:text-white" onClick={handleSignUp}>
              Đăng ký
            </button>   
          </div>
        )}
      </div>

      {/* Responsive Dropdown Menu */}
      {isMenuOpen && (
        <div className="absolute top-16 left-0 right-0 bg-gray-800 text-white md:hidden z-50 p-4">
          <div className="flex flex-col space-y-4">
            <span className="cursor-pointer" onClick={handleHome}>Trang chủ</span>
            <span className="cursor-pointer" onClick={() => navigate("/searchpage")}>Đặt Phòng</span>
            <span className="cursor-pointer" onClick={() => navigate("/")}>Liên hệ</span>
            {user ? (
              <>
                <span className="cursor-pointer" onClick={handleProfile}>Hồ sơ cá nhân</span>
                <span className="cursor-pointer" onClick={() => navigate("/favorite")}>Khách sạn yêu thích</span>
                <span className="cursor-pointer" onClick={() => navigate("/bookings")}>Đặt phòng của bạn</span>
                {user.role === "Admin" || user.role === "HotelManager" ? (
                  <span className="cursor-pointer" onClick={handleManageHotel}>Quản lý khách sạn</span>
                ) : null}
                <span className="cursor-pointer" onClick={handleLogout}>Đăng xuất</span>
              </>
            ) : (
              <>
                <span className="cursor-pointer" onClick={handleLogin}>Đăng nhập</span>
                <span className="cursor-pointer" onClick={handleSignUp}>Đăng ký</span>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default HomeNavbar;
