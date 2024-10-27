import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import ClipLoader from "react-spinners/ClipLoader"; // Thêm thư viện spinner

const HomeNavbar = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const [loading, setLoading] = useState(false); // Trạng thái loading

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
    setLoading(true); // Bắt đầu loading
    navigate("/login");
    setLoading(false); // Kết thúc loading (không thực sự hiệu quả trong trường hợp này)
  };

  const handleSignUp = () => {
    setLoading(true);
    navigate("/register");
    setLoading(false);
  };

  const handleHome = () => {
    setLoading(true);
    navigate("/");
    setLoading(false);
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
        setLoading(true);
        navigate("/login");
        setLoading(false);
      } else {
        console.error("Lỗi khi đăng xuất:", response.status);
      }
    } catch (error) {
      console.error("Lỗi khi đăng xuất:", error);
    }
  };

  const handleManageHotel = () => {
    setLoading(true);
    navigate("/overview");
    setLoading(false);
  };

  return (
    <div className="navbar flex justify-between items-center p-4 bg-gray-800 relative">
      <div className="navbar-title">
        <button className="text-white text-2xl m-0" onClick={handleHome}>staynight</button>
      </div>
      <div className="navbar-buttons relative">
        {loading && (
          <div className="absolute inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50 z-50">
            <ClipLoader color="#ffffff" loading={loading} size={50} />
          </div>
        )}
        {user ? (
          <div className="user-avatar cursor-pointer" onClick={toggleMenu}>
            <img 
              src={user.avatar || "https://img.freepik.com/premium-vector/default-avatar-profile-icon-social-media-user-image-gray-avatar-icon-blank-profile-silhouette-vector-illustration_561158-3485.jpg"} 
              alt="Avatar" 
              className="w-10 h-10 rounded-full" 
            />
            {menuOpen && (
              <div className="absolute right-0 mt-2 w-48 bg-white shadow-lg rounded-md z-50">
                <ul className="py-2">
                  <li className="px-4 py-2 text-black hover:bg-gray-100 cursor-pointer">Hồ sơ cá nhân của bạn</li>
                  <li className="px-4 py-2 text-black hover:bg-gray-100 cursor-pointer">Khách sạn yêu thích</li>
                  <li className="px-4 py-2 text-black hover:bg-gray-100 cursor-pointer">Đặt phòng của bạn</li>
                  {user.role === "Admin" || user.role === "HotelManager" ? (
                    <li className="px-4 py-2 text-black hover:bg-gray-100 cursor-pointer" onClick={handleManageHotel}>Quản lý khách sạn</li>
                  ) : null}
                  <li className="px-4 py-2 text-black hover:bg-gray-100 cursor-pointer" onClick={handleLogout}>Đăng xuất</li>
                </ul>
              </div>
            )}
          </div>
        ) : (
          <>
            <div className="inline-flex rounded-md shadow-sm" role="group">
              <button type="button" className="inline-flex items-center px-4 py-2 text-sm font-medium text-gray-900 bg-white border border-gray-200 rounded-s-lg hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:ring-2 focus:ring-blue-700 focus:text-blue-700 dark:bg-gray-800 dark:border-gray-700 dark:text-white dark:hover:text-white dark:hover:bg-gray-700 dark:focus:ring-blue-500 dark:focus:text-white" onClick={handleLogin}>
                <svg className="w-3 h-3 me-2" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M10 0a10 10 0 1 0 10 10A10.011 10.011 0 0 0 10 0Zm0 5a3 3 0 1 1 0 6 3 3 0 0 1 0-6Zm0 13a8.949 8.949 0 0 1-4.951-1.488A3.987 3.987 0 0 1 9 13h2a3.987 3.987 0 0 1 3.951 3.512A8.949 8.949 0 0 1 10 18Z"/>
                </svg>
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
