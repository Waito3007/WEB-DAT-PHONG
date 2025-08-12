import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { User, Heart, Calendar, Hotel, LogOut, Menu } from "lucide-react";
import { Layout, Button, Avatar, Dropdown, Space, Tooltip, Drawer } from "antd";
import FavoriteRoomsDrawer from "../FavoritesPage/FavoritesPage";
import BookingCard from "../BookingStatus/BookingCard";

const { Header } = Layout;
const API_URL = process.env.REACT_APP_API_URL;

const HomeNavbar = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [drawerbookingOpen, setDrawerbookingOpen] = useState(false);

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

  // User dropdown menu items
  const userMenuItems = [
    {
      key: 'profile',
      icon: <User className="w-4 h-4" />,
      label: 'Hồ sơ cá nhân',
      onClick: handleProfile,
    },
    ...(user?.role === "Admin" || user?.role === "HotelManager" ? [{
      key: 'manage',
      icon: <Hotel className="w-4 h-4" />,
      label: 'Quản lý khách sạn',
      onClick: handleManageHotel,
    }] : []),
    {
      type: 'divider',
    },
    {
      key: 'logout',
      icon: <LogOut className="w-4 h-4" />,
      label: 'Đăng xuất',
      onClick: handleLogout,
      danger: true,
    },
  ];

  // Mobile menu items
  const mobileMenuItems = [
    {
      label: 'Trang chủ',
      onClick: handleHome,
    },
    {
      label: 'Đặt Phòng',
      onClick: () => navigate("/searchpage"),
    },
    {
      label: 'Liên hệ',
      onClick: () => window.open("https://www.facebook.com/waito.sv", '_blank'),
    },
  ];

  return (
    <Header 
      className="fixed top-0 left-0 right-0 z-50 bg-black border-b border-gray-900 shadow-lg"
      style={{ 
        padding: '0 24px',
        height: '80px',
        lineHeight: '80px',
        backgroundColor: '#000',
      }}
    >
      <div className="flex justify-between items-center h-full max-w-7xl mx-auto" style={{ width: '100%' }}>
        {/* Logo */}
        <div 
          className="flex items-center cursor-pointer hover:opacity-80 transition-opacity"
          onClick={handleHome}
          style={{ flexShrink: 0 }}
        >
          <img
            src="https://res.cloudinary.com/dackig67m/image/upload/v1730387091/logovip_qp8hz1.png"
            alt="Stay Night Logo"
            className="h-10"
          />
        </div>

        {/* Desktop Navigation Links - Centered */}
        <div className="hidden md:flex items-center space-x-8" style={{ flex: 1, justifyContent: 'center' }}>
          <Button 
            type="text" 
            className="text-white font-medium transition-transform duration-200 hover:scale-110 hover:text-white hover:border-white hover:border"
            style={{ fontSize: '1.1rem', height: '56px', borderRadius: '12px', background: 'transparent', border: '2px solid transparent', WebkitTextStroke: '0px', transition: 'all 0.2s' }}
            onMouseEnter={e => {
              e.target.style.WebkitTextStroke = '1px white';
              e.target.style.textShadow = '0 0 2px white, 0 0 6px white';
            }}
            onMouseLeave={e => {
              e.target.style.WebkitTextStroke = '0px';
              e.target.style.textShadow = 'none';
            }}
            onClick={handleHome}
          >
            Trang chủ
          </Button>
          <Button 
            type="text" 
            className="text-white font-medium transition-transform duration-200 hover:scale-110 hover:text-white hover:border-white hover:border"
            style={{ fontSize: '1.1rem', height: '56px', borderRadius: '12px', background: 'transparent', border: '2px solid transparent', WebkitTextStroke: '0px', transition: 'all 0.2s' }}
            onMouseEnter={e => {
              e.target.style.WebkitTextStroke = '1px white';
              e.target.style.textShadow = '0 0 2px white, 0 0 6px white';
            }}
            onMouseLeave={e => {
              e.target.style.WebkitTextStroke = '0px';
              e.target.style.textShadow = 'none';
            }}
            onClick={() => navigate("/searchpage")}
          >
            Đặt Phòng
          </Button>
          <Button 
            type="text" 
            className="text-white font-medium transition-transform duration-200 hover:scale-110 hover:text-white hover:border-white hover:border"
            style={{ fontSize: '1.1rem', height: '56px', borderRadius: '12px', background: 'transparent', border: '2px solid transparent', WebkitTextStroke: '0px', transition: 'all 0.2s' }}
            onMouseEnter={e => {
              e.target.style.WebkitTextStroke = '1px white';
              e.target.style.textShadow = '0 0 2px white, 0 0 6px white';
            }}
            onMouseLeave={e => {
              e.target.style.WebkitTextStroke = '0px';
              e.target.style.textShadow = 'none';
            }}
            onClick={() => window.open("https://www.facebook.com/waito.sv", '_blank')}
          >
            Liên hệ
          </Button>
        </div>

        {/* Desktop User Controls - Right aligned */}
        <div className="hidden md:flex items-center space-x-4" style={{ flexShrink: 0 }}>
          {user ? (
            <Space size="middle">
              {/* Booking Button */}
              <Tooltip title="Đặt phòng của tôi" placement="bottom">
                <Button
                  type="text"
                  icon={<Calendar className="w-5 h-5" />}
                  className="text-white hover:text-blue-400 hover:bg-gray-700 border-none"
                  onClick={handleOpenBookingDrawer}
                />
              </Tooltip>

              {/* Favorites Button */}
              <Tooltip title="Khách sạn yêu thích" placement="bottom">
                <Button
                  type="text"
                  icon={<Heart className="w-5 h-5" />}
                  className="text-white hover:text-red-400 hover:bg-gray-700 border-none"
                  onClick={handleOpenDrawer}
                />
              </Tooltip>

              {/* User Avatar Dropdown */}
              <Dropdown
                menu={{ items: userMenuItems }}
                placement="bottomRight"
                trigger={['click']}
                overlayClassName="user-dropdown"
              >
                <Avatar
                  src={user.avatar || "https://img.freepik.com/premium-vector/default-avatar-profile-icon-social-media-user-image-gray-avatar-icon-blank-profile-silhouette-vector-illustration_561158-3485.jpg"}
                  className="cursor-pointer hover:opacity-80 transition-opacity border-2 border-gray-600 hover:border-blue-400"
                  size="large"
                />
              </Dropdown>
            </Space>
          ) : (
            <div className="flex gap-3">
              <Button
                type="default"
                className="font-medium text-base bg-white text-gray-900 border border-gray-300 rounded-xl px-6 py-2 h-12 shadow-sm transition-colors duration-200 hover:bg-gray-100 hover:text-black focus:outline-none"
                style={{ minWidth: '110px', borderRadius: '14px', height: '48px', fontSize: '1.05rem', boxSizing: 'border-box' }}
                onClick={handleLogin}
              >
                Đăng nhập
              </Button>
              <Button
                type="primary"
                className="font-medium text-base bg-blue-600 text-white border border-blue-600 rounded-xl px-6 py-2 h-12 shadow-sm transition-colors duration-200 hover:bg-blue-700 focus:outline-none"
                style={{ minWidth: '110px', borderRadius: '14px', height: '48px', fontSize: '1.05rem', boxSizing: 'border-box' }}
                onClick={handleSignUp}
              >
                Đăng ký
              </Button>
            </div>
          )}
        </div>

        {/* Mobile Menu Icon */}
        <div className="md:hidden">
          <Button
            type="text"
            icon={<Menu className="w-6 h-6 text-white" />}
            className="border-none"
            onClick={() => setMobileMenuOpen(true)}
          />
        </div>

        {/* Mobile Drawer */}
        <Drawer
          title={
            <div className="flex items-center space-x-3">
              <img
                src="https://res.cloudinary.com/dackig67m/image/upload/v1730387091/logovip_qp8hz1.png"
                alt="Stay Night Logo"
                className="h-8"
              />
              <span className="text-gray-800 font-semibold">Stay Night</span>
            </div>
          }
          placement="right"
          onClose={() => setMobileMenuOpen(false)}
          open={mobileMenuOpen}
          width={300}
          className="mobile-menu-drawer"
        >
          <div className="flex flex-col space-y-4">
            {/* Navigation Links */}
            {mobileMenuItems.map((item, index) => (
              <Button
                key={index}
                type="text"
                size="large"
                className="text-left justify-start h-12"
                onClick={() => {
                  item.onClick();
                  setMobileMenuOpen(false);
                }}
              >
                {item.label}
              </Button>
            ))}

            <div className="border-t border-gray-200 pt-4 mt-4">
              {user ? (
                <div className="space-y-4">
                  {/* User Info */}
                  <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                    <Avatar
                      src={user.avatar || "https://img.freepik.com/premium-vector/default-avatar-profile-icon-social-media-user-image-gray-avatar-icon-blank-profile-silhouette-vector-illustration_561158-3485.jpg"}
                      size="large"
                    />
                    <div>
                      <div className="font-semibold text-gray-800">{user.fullName || user.username}</div>
                      <div className="text-sm text-gray-500">{user.email}</div>
                    </div>
                  </div>

                  {/* User Actions */}
                  <div className="space-y-2">
                    <Button
                      type="text"
                      size="large"
                      icon={<Calendar className="w-4 h-4" />}
                      className="w-full text-left justify-start"
                      onClick={() => {
                        handleOpenBookingDrawer();
                        setMobileMenuOpen(false);
                      }}
                    >
                      Đặt phòng của tôi
                    </Button>
                    <Button
                      type="text"
                      size="large"
                      icon={<Heart className="w-4 h-4" />}
                      className="w-full text-left justify-start"
                      onClick={() => {
                        handleOpenDrawer();
                        setMobileMenuOpen(false);
                      }}
                    >
                      Khách sạn yêu thích
                    </Button>
                    <Button
                      type="text"
                      size="large"
                      icon={<User className="w-4 h-4" />}
                      className="w-full text-left justify-start"
                      onClick={() => {
                        handleProfile();
                        setMobileMenuOpen(false);
                      }}
                    >
                      Hồ sơ cá nhân
                    </Button>
                    {(user.role === "Admin" || user.role === "HotelManager") && (
                      <Button
                        type="text"
                        size="large"
                        icon={<Hotel className="w-4 h-4" />}
                        className="w-full text-left justify-start"
                        onClick={() => {
                          handleManageHotel();
                          setMobileMenuOpen(false);
                        }}
                      >
                        Quản lý khách sạn
                      </Button>
                    )}
                    <Button
                      type="text"
                      size="large"
                      icon={<LogOut className="w-4 h-4" />}
                      className="w-full text-left justify-start text-red-500 hover:text-red-600"
                      onClick={() => {
                        handleLogout();
                        setMobileMenuOpen(false);
                      }}
                    >
                      Đăng xuất
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="space-y-3">
                  <Button 
                    type="default"
                    size="large"
                    className="w-full"
                    onClick={() => {
                      handleLogin();
                      setMobileMenuOpen(false);
                    }}
                  >
                    Đăng nhập
                  </Button>
                  <Button 
                    type="primary"
                    size="large"
                    className="w-full"
                    onClick={() => {
                      handleSignUp();
                      setMobileMenuOpen(false);
                    }}
                  >
                    Đăng ký
                  </Button>
                </div>
              )}
            </div>
          </div>
        </Drawer>

        {/* Drawers */}
        <FavoriteRoomsDrawer open={drawerOpen} onClose={handleCloseDrawer} />
        <BookingCard open={drawerbookingOpen} onClose={handleCloseBookingDrawer} />
      </div>
    </Header>
  );
};

export default HomeNavbar;
