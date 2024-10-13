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

  const toggleMenu = () => {
    setMenuOpen(!menuOpen); // Đổi trạng thái mở menu
  };

  const handleLogout = async () => {
    try {
      // Gọi API để đăng xuất (nếu cần)
      await fetch('/api/profile', {
        method: 'POST',
        credentials: 'include' // Đảm bảo cookie được gửi kèm theo yêu cầu
      });
      
      // Xóa thông tin người dùng
      setUser(null);
      setMenuOpen(false); // Đóng menu nếu đang mở

      // Điều hướng về trang đăng nhập
      navigate("/login");
    } catch (error) {
      console.error("Lỗi khi đăng xuất:", error);
    }
  };

  return (
    <div className="navbar flex justify-between items-center p-4 bg-gray-800">
      <div className="navbar-title">
        <h1 className="text-white text-2xl m-0">staynight</h1>
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
            <button className="login-btn bg-gray-300 border-2 border-black py-2 px-4 text-black text-lg mr-2" onClick={handleLogin}>
              Đăng nhập
            </button>
            <button className="signup-btn bg-gray-300 border-2 border-black py-2 px-4 text-black text-lg" onClick={handleSignUp}>
              Đăng ký
            </button>
          </>
        )}
      </div>
    </div>
  );
};

export default HomeNavbar;
