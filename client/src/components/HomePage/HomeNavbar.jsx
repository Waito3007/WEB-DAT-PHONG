import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { User, Heart, Calendar, Hotel, LogOut } from "lucide-react";

const HomeNavbar = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [menuOpen, setMenuOpen] = useState(false);

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
    navigate("/overview");
  };

  return (
    <div className="navbar flex justify-between items-center p-4 bg-gray-800 relative">
      <div className="navbar-title">
        <button className="text-white text-2xl m-0" onClick={handleHome}>staynight</button>
      </div>
      <div className="navbar-buttons relative">
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
                  <li className="flex items-center px-4 py-2 text-black hover:bg-gray-100 cursor-pointer">
                    <User className="w-4 h-4 mr-2" /> Hồ sơ cá nhân
                  </li>
                  <li className="flex items-center px-4 py-2 text-black hover:bg-gray-100 cursor-pointer">
                    <Heart className="w-4 h-4 mr-2" /> Khách sạn yêu thích
                  </li>
                  <li className="flex items-center px-4 py-2 text-black hover:bg-gray-100 cursor-pointer">
                    <Calendar className="w-4 h-4 mr-2" /> Đặt phòng của bạn
                  </li>
                  {user.role === "Admin" || user.role === "HotelManager" ? (
                    <li className="flex items-center px-4 py-2 text-black hover:bg-gray-100 cursor-pointer" onClick={handleManageHotel}>
                      <Hotel className="w-4 h-4 mr-2" /> Quản lý khách sạn
                    </li>
                  ) : null}
                  <li className="flex items-center px-4 py-2 text-black hover:bg-gray-100 cursor-pointer" onClick={handleLogout}>
                    <LogOut className="w-4 h-4 mr-2" /> Đăng xuất
                  </li>
                </ul>
              </div>
            )}
          </div>
        ) : (
          <>
            <div className="inline-flex rounded-md shadow-sm" role="group">
              <button type="button" className="inline-flex items-center px-4 py-2 text-sm font-medium text-gray-900 bg-white border border-gray-200 rounded-s-lg hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:ring-2 focus:ring-blue-700 focus:text-blue-700 dark:bg-gray-800 dark:border-gray-700 dark:text-white dark:hover:text-white dark:hover:bg-gray-700 dark:focus:ring-blue-500 dark:focus:text-white" onClick={handleLogin}>
                Đăng nhập
              </button>
              <button type="button" className="inline-flex items-center px-4 py-2 text-sm font-medium text-gray-900 bg-white border border-gray-200 rounded-e-lg hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:ring-2 focus:ring-blue-700 focus:text-blue-700 dark:bg-gray-800 dark:border-gray-700 dark:text-white dark:hover:text-white dark:hover:bg-gray-700 dark:focus:ring-blue-500 dark:focus:text-white" onClick={handleSignUp}>               
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
