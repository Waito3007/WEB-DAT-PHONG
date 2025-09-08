import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { User, Heart, Calendar, Hotel, LogOut, Menu, X, ChevronDown } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import FavoriteRoomsDrawer from "../FavoritesPage/FavoritesPage";
import BookingCard from "../BookingStatus/BookingCard";
import './HomeNavbar.css';

const API_URL = process.env.REACT_APP_API_URL;

const HomeNavbar = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [drawerbookingOpen, setDrawerbookingOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  // Functions to open and close the drawer
  const handleOpenDrawer = () => {
    setDrawerOpen(true);
  };
  const handleCloseDrawer = () => {
    setDrawerOpen(false);
  };

  const handleOpenBookingDrawer = () => {
    setDrawerbookingOpen(true);
  };
  const handleCloseBookingDrawer = () => {
    setDrawerbookingOpen(false);
  };

  // Scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const fetchUser = async () => {
    try {
      const response = await fetch(`${API_URL}/api/profile/me`, {
        method: 'GET',
        credentials: 'include'
      });

      if (response.ok) {
        const userData = await response.json();
        setUser(userData);
      } else {
        console.error("Error fetching user data:", response.status);
      }
    } catch (error) {
      console.error("Network error:", error);
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

  const handleLogout = async () => {
    try {
      const response = await fetch(`${API_URL}/api/profile/logout`, {
        method: 'POST',
        credentials: 'include',
      });

      if (response.ok) {
        setUser(null);
        navigate("/login");
      } else {
        console.error("Logout error:", response.status);
      }
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  const handleManageHotel = () => {
    const token = localStorage.getItem('token');
    if (token) {
      navigate("/overview");
    } else {
      navigate("/login");
    }
  };

  return (
    <motion.nav 
      className={`navbar-gradient fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled ? 'backdrop-blur-lg bg-black/80' : 'bg-gradient-to-r from-gray-900/95 to-black/95'
      }`}
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
    >
      <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-8">
        <div className="flex justify-between items-center h-16 sm:h-20">
          {/* Logo */}
          <motion.div 
            className="logo-container cursor-pointer"
            onClick={handleHome}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <img
              src="https://res.cloudinary.com/dackig67m/image/upload/v1730387091/logovip_qp8hz1.png"
              alt="Stay Night Logo"
              className="h-10 sm:h-12 w-auto"
            />
          </motion.div>

          {/* Desktop Navigation */}
          <div className="desktop-nav">
            {['Trang chủ', 'Đặt Phòng', 'Liên hệ'].map((item, index) => {
              const actions = [handleHome, () => navigate("/searchpage"), () => window.open("https://www.facebook.com/waito.sv", '_blank')];
              return (
                <motion.button
                  key={item}
                  onClick={actions[index]}
                  className="nav-link nav-button text-white font-medium"
                  whileHover={{ y: -2 }}
                  whileTap={{ y: 0 }}
                >
                  {item}
                  <span className="nav-underline"></span>
                </motion.button>
              );
            })}
          </div>

          {/* Desktop User Controls */}
          <div className="desktop-user-controls">
            {user ? (
              <>
                {/* Action Buttons */}
                <motion.button
                  onClick={handleOpenBookingDrawer}
                  className="p-3 rounded-full bg-white/10 backdrop-blur-sm text-white hover:bg-white/20 transition-all duration-300"
                  whileHover={{ scale: 1.1, backgroundColor: "rgba(59, 130, 246, 0.3)" }}
                  whileTap={{ scale: 0.95 }}
                  title="Đặt phòng của tôi"
                >
                  <Calendar className="w-5 h-5" />
                </motion.button>

                <motion.button
                  onClick={handleOpenDrawer}
                  className="p-3 rounded-full bg-white/10 backdrop-blur-sm text-white hover:bg-white/20 transition-all duration-300"
                  whileHover={{ scale: 1.1, backgroundColor: "rgba(239, 68, 68, 0.3)" }}
                  whileTap={{ scale: 0.95 }}
                  title="Khách sạn yêu thích"
                >
                  <Heart className="w-5 h-5" />
                </motion.button>

                {/* User Dropdown */}
                <div className="relative">
                  <motion.button
                    onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                    className="flex items-center space-x-3 p-2 rounded-full bg-white/10 backdrop-blur-sm hover:bg-white/20 transition-all duration-300"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <img
                      src={user.avatar || "https://img.freepik.com/premium-vector/default-avatar-profile-icon-social-media-user-image-gray-avatar-icon-blank-profile-silhouette-vector-illustration_561158-3485.jpg"}
                      alt="User Avatar"
                      className="w-10 h-10 rounded-full border-2 border-white/30"
                    />
                    <motion.div
                      animate={{ rotate: userDropdownOpen ? 180 : 0 }}
                      transition={{ duration: 0.2 }}
                    >
                      <ChevronDown className="w-4 h-4 text-white" />
                    </motion.div>
                  </motion.button>

                  {/* Dropdown Menu */}
                  <AnimatePresence>
                    {userDropdownOpen && (
                      <motion.div
                        initial={{ opacity: 0, y: -10, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: -10, scale: 0.95 }}
                        transition={{ duration: 0.2 }}
                        className="user-dropdown"
                      >
                        <div className="p-4 border-b border-gray-200">
                          <div className="flex items-center space-x-3">
                            <img
                              src={user.avatar || "https://img.freepik.com/premium-vector/default-avatar-profile-icon-social-media-user-image-gray-avatar-icon-blank-profile-silhouette-vector-illustration_561158-3485.jpg"}
                              alt="User Avatar"
                              className="w-12 h-12 rounded-full"
                            />
                            <div>
                              <div className="font-semibold text-gray-800">{user.fullName || user.username}</div>
                              <div className="text-sm text-gray-500">{user.email}</div>
                            </div>
                          </div>
                        </div>
                        
                        <div className="py-2">
                          <button
                            onClick={() => { handleProfile(); setUserDropdownOpen(false); }}
                            className="w-full px-4 py-3 text-left flex items-center space-x-3 hover:bg-gray-100 transition-colors"
                          >
                            <User className="w-4 h-4 text-gray-600" />
                            <span className="text-gray-700">Hồ sơ cá nhân</span>
                          </button>
                          
                          {(user.role === "Admin" || user.role === "HotelManager") && (
                            <button
                              onClick={() => { handleManageHotel(); setUserDropdownOpen(false); }}
                              className="w-full px-4 py-3 text-left flex items-center space-x-3 hover:bg-gray-100 transition-colors"
                            >
                              <Hotel className="w-4 h-4 text-gray-600" />
                              <span className="text-gray-700">Quản lý khách sạn</span>
                            </button>
                          )}
                          
                          <div className="border-t border-gray-200 my-2"></div>
                          
                          <button
                            onClick={() => { handleLogout(); setUserDropdownOpen(false); }}
                            className="w-full px-4 py-3 text-left flex items-center space-x-3 hover:bg-red-50 text-red-600 transition-colors"
                          >
                            <LogOut className="w-4 h-4" />
                            <span>Đăng xuất</span>
                          </button>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </>
            ) : (
              <div className="flex space-x-3">
                <motion.button
                  onClick={handleLogin}
                  className="px-6 py-2.5 rounded-full border border-white/30 text-white font-medium hover:bg-white hover:text-gray-900 transition-all duration-300"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  Đăng nhập
                </motion.button>
                <motion.button
                  onClick={handleSignUp}
                  className="px-6 py-2.5 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 text-white font-medium hover:from-blue-600 hover:to-purple-700 transition-all duration-300 shadow-lg"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  Đăng ký
                </motion.button>
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <motion.button
            onClick={() => setMobileMenuOpen(true)}
            className="mobile-menu-button p-2 rounded-lg text-white hover:bg-white/10 transition-colors"
            whileTap={{ scale: 0.95 }}
          >
            <Menu className="w-6 h-6" />
          </motion.button>
        </div>
      </div>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="mobile-menu-overlay"
              onClick={() => setMobileMenuOpen(false)}
            />
            
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="mobile-menu-container"
            >
              <div className="p-4 sm:p-6 h-full overflow-y-auto">
                {/* Mobile Header */}
                <div className="flex items-center justify-between mb-6 sm:mb-8">
                  <div className="flex items-center space-x-3">
                    <img
                      src="https://res.cloudinary.com/dackig67m/image/upload/v1730387091/logovip_qp8hz1.png"
                      alt="Stay Night Logo"
                      className="h-6 sm:h-8"
                    />
                    <span className="text-lg sm:text-xl font-bold text-gray-800">Stay Night</span>
                  </div>
                  <motion.button
                    onClick={() => setMobileMenuOpen(false)}
                    className="p-2 rounded-full hover:bg-gray-100 transition-colors"
                    whileTap={{ scale: 0.95 }}
                  >
                    <X className="w-5 h-5 sm:w-6 sm:h-6 text-gray-600" />
                  </motion.button>
                </div>

                {/* Navigation Links */}
                <div className="space-y-2 sm:space-y-4 mb-6 sm:mb-8">
                  {[
                    { label: 'Trang chủ', action: handleHome },
                    { label: 'Đặt Phòng', action: () => navigate("/searchpage") },
                    { label: 'Liên hệ', action: () => window.open("https://www.facebook.com/waito.sv", '_blank') }
                  ].map((item, index) => (
                    <motion.button
                      key={item.label}
                      onClick={() => { item.action(); setMobileMenuOpen(false); }}
                      className="w-full text-left py-2.5 sm:py-3 px-3 sm:px-4 rounded-lg text-gray-700 font-medium hover:bg-gray-100 transition-colors text-sm sm:text-base"
                      initial={{ opacity: 0, x: 50 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      {item.label}
                    </motion.button>
                  ))}
                </div>

                {/* User Section */}
                <div className="border-t border-gray-200 pt-4 sm:pt-6">
                  {user ? (
                    <div className="space-y-3 sm:space-y-4">
                      {/* User Info */}
                      <div className="flex items-center space-x-3 p-3 sm:p-4 bg-gray-50 rounded-xl">
                        <img
                          src={user.avatar || "https://img.freepik.com/premium-vector/default-avatar-profile-icon-social-media-user-image-gray-avatar-icon-blank-profile-silhouette-vector-illustration_561158-3485.jpg"}
                          alt="User Avatar"
                          className="w-10 h-10 sm:w-12 sm:h-12 rounded-full"
                        />
                        <div className="flex-1 min-w-0">
                          <div className="font-semibold text-gray-800 text-sm sm:text-base truncate">{user.fullName || user.username}</div>
                          <div className="text-xs sm:text-sm text-gray-500 truncate">{user.email}</div>
                        </div>
                      </div>

                      {/* User Actions */}
                      <div className="space-y-1 sm:space-y-2">
                        {[
                          { icon: Calendar, label: 'Đặt phòng của tôi', action: handleOpenBookingDrawer },
                          { icon: Heart, label: 'Khách sạn yêu thích', action: handleOpenDrawer },
                          { icon: User, label: 'Hồ sơ cá nhân', action: handleProfile },
                          ...(user.role === "Admin" || user.role === "HotelManager" ? [
                            { icon: Hotel, label: 'Quản lý khách sạn', action: handleManageHotel }
                          ] : []),
                          { icon: LogOut, label: 'Đăng xuất', action: handleLogout, danger: true }
                        ].map((item, index) => (
                          <motion.button
                            key={item.label}
                            onClick={() => { item.action(); setMobileMenuOpen(false); }}
                            className={`w-full flex items-center space-x-3 py-2.5 sm:py-3 px-3 sm:px-4 rounded-lg transition-colors text-sm sm:text-base ${
                              item.danger 
                                ? 'text-red-600 hover:bg-red-50' 
                                : 'text-gray-700 hover:bg-gray-100'
                            }`}
                            initial={{ opacity: 0, x: 50 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: (index + 3) * 0.1 }}
                            whileTap={{ scale: 0.95 }}
                          >
                            <item.icon className="w-4 h-4 sm:w-5 sm:h-5 flex-shrink-0" />
                            <span className="font-medium">{item.label}</span>
                          </motion.button>
                        ))}
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-2 sm:space-y-3">
                      <motion.button
                        onClick={() => { handleLogin(); setMobileMenuOpen(false); }}
                        className="w-full py-2.5 sm:py-3 px-3 sm:px-4 rounded-lg border border-gray-300 text-gray-700 font-medium hover:bg-gray-50 transition-colors text-sm sm:text-base"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        Đăng nhập
                      </motion.button>
                      <motion.button
                        onClick={() => { handleSignUp(); setMobileMenuOpen(false); }}
                        className="w-full py-2.5 sm:py-3 px-3 sm:px-4 rounded-lg bg-gradient-to-r from-blue-500 to-purple-600 text-white font-medium hover:from-blue-600 hover:to-purple-700 transition-all duration-300 text-sm sm:text-base"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.4 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        Đăng ký
                      </motion.button>
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Drawers */}
      <FavoriteRoomsDrawer open={drawerOpen} onClose={handleCloseDrawer} />
      <BookingCard open={drawerbookingOpen} onClose={handleCloseBookingDrawer} />
    </motion.nav>
  );
};

export default HomeNavbar;
