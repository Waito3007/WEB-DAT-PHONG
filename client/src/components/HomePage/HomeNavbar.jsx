import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const HomeNavbar = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null); // Trạng thái lưu thông tin người dùng
  const [menuOpen, setMenuOpen] = useState(false); // Trạng thái mở menu

  // Hàm gọi API để lấy thông tin người dùng
  const fetchUser = async () => {
    try {
      const response = await fetch('/api/profile/me', {
        method: 'GET',
        credentials: 'include' // Đảm bảo cookie được gửi kèm theo yêu cầu
      });

      if (response.ok) {
        const userData = await response.json();
        setUser(userData); // Cập nhật thông tin người dùng
      } else {
        console.error("Lỗi lấy thông tin người dùng:", response.status);
      }
    } catch (error) {
      console.error("Lỗi mạng:", error);
    }
  };

  useEffect(() => {
    fetchUser(); // Gọi hàm lấy thông tin người dùng khi component được mount
  }, []);

  const handleLogin = () => {
    navigate("/login");
  };

  const handleSignUp = () => {
    navigate("/register");
  };
  const handleHome = () => {
    navigate("/");
  };

  const toggleMenu = () => {
    setMenuOpen(!menuOpen); // Đổi trạng thái mở menu
  };

  const handleLogout = async () => {
    try {
      // Gọi API để đăng xuất
      const response = await fetch('/api/profile/logout', {
        method: 'POST',
        credentials: 'include', // Gửi kèm cookie
      });
  
      if (response.ok) {
        // Xóa thông tin người dùng trong state
        setUser(null);
        setMenuOpen(false); // Đóng menu nếu đang mở
        // Điều hướng về trang đăng nhập
        navigate("/login");
      } else {
        console.error("Lỗi khi đăng xuất:", response.status);
      }
    } catch (error) {
      console.error("Lỗi khi đăng xuất:", error);
    }
  };
  
  return (
    <div className="navbar flex justify-between items-center p-4 bg-gray-800">
      <div className="navbar-title">
        <button className="text-white text-2xl m-0" onClick={handleHome}>staynight</button>
      </div>
      <div className="navbar-buttons relative">
        {user ? (
          <div className="user-avatar cursor-pointer" onClick={toggleMenu}>
            <img 
              src={user.avatar || "https://res-console.cloudinary.com/dackig67m/thumbnails/v1/image/upload/v1728362097/aG90ZWxzL2ZpbGVfbXk5c2l1/drilldown"} 
              alt="Avatar" 
              className="w-10 h-10 rounded-full" 
            />
            {/* Menu dropdown */}
            {menuOpen && (
              <div className="absolute right-0 mt-2 w-48 bg-white shadow-lg rounded-md z-50">
                <ul className="py-2">
                  <li className="px-4 py-2 text-black hover:bg-gray-100 cursor-pointer">Hồ sơ cá nhân của bạn</li>
                  <li className="px-4 py-2 text-black hover:bg-gray-100 cursor-pointer">Khách sạn yêu thích</li>
                  <li className="px-4 py-2 text-black hover:bg-gray-100 cursor-pointer">đặt phòng của bạn</li>
                  <li className="px-4 py-2 text-black hover:bg-gray-100 cursor-pointer" onClick={handleLogout}>Đăng xuất</li>
                </ul>
              </div>
            )}
          </div>
        ) : (
          <>
            <div class="inline-flex rounded-md shadow-sm" role="group">
              <button type="button" class="inline-flex items-center px-4 py-2 text-sm font-medium text-gray-900 bg-white border border-gray-200 rounded-s-lg hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:ring-2 focus:ring-blue-700 focus:text-blue-700 dark:bg-gray-800 dark:border-gray-700 dark:text-white dark:hover:text-white dark:hover:bg-gray-700 dark:focus:ring-blue-500 dark:focus:text-white" onClick={handleLogin}>
                <svg class="w-3 h-3 me-2" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M10 0a10 10 0 1 0 10 10A10.011 10.011 0 0 0 10 0Zm0 5a3 3 0 1 1 0 6 3 3 0 0 1 0-6Zm0 13a8.949 8.949 0 0 1-4.951-1.488A3.987 3.987 0 0 1 9 13h2a3.987 3.987 0 0 1 3.951 3.512A8.949 8.949 0 0 1 10 18Z"/>
                </svg>
                Đăng nhập
              </button>
              <button type="button" class="inline-flex items-center px-4 py-2 text-sm font-medium text-gray-900 bg-white border border-gray-200 rounded-e-lg hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:ring-2 focus:ring-blue-700 focus:text-blue-700 dark:bg-gray-800 dark:border-gray-700 dark:text-white dark:hover:text-white dark:hover:bg-gray-700 dark:focus:ring-blue-500 dark:focus:text-white" onClick={handleSignUp}>               
                Đăng ký
              </button>   
            </div>
          </>
        )}
      </div>
    </div>
    
  );
};

export default HomeNavbar;
