import React, { useState, useEffect } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  useLocation,
  Navigate,
} from "react-router-dom";
import axios from "axios";
import HomePage from "./pages/HomePage";
import NotFoundPage from "./pages/NotFoundPage";
import Login from "./components/account/Login";
import Register from "./components/account/Register";
// Admin
import Sidebar from "./components/dashboard/common/Sidebar";
import OverviewPage from "./pages/OverviewPage";
import HotelManagerPage from "./pages/Admin/HotelManagerPage";
import UsersPage from "./pages/Admin/UsersPage";
import SalesPage from "./pages/Admin/SalesPage";
import OrdersPage from "./pages/Admin/OrdersPage";
import AnalyticsPage from "./pages/Admin/AnalyticsPage";
import SettingsPage from "./pages/Admin/SettingsPage";
import SearchPage from "./pages/SearchPage";
// Hotel Manager
import HotelAdd from "./components/hotel_manager/AddHotel";
import MyHotel from "./components/hotel_manager/MyHotel";
import HotelDetail from "./components/hotel_manager/HotelDetail"; 
import AddRoom from "./components/dashboard/products/AddRoom";
import HotelRooms from "./components/hotel_manager/HotelRooms"; 
import RoomDetail from "./components/hotel_manager/RoomDetail";
import SearchPlaces from "./components/HomePage/SearchPlaces";
import Success from "./components/Checkout/Success";
import ConfirmPayment from "./components/Checkout/confirm-payment";
import DetailHotelPage from "./pages/DetailHotelPage";
import DetailRoomPage from "./pages/DetailRoomPage"; 
import HotelImage from "./components/DetailHotel/HotelImage";
import CheckoutPage from "./pages/CheckoutPage";
import BookingStatusPage from "./pages/BookingStatusPage";

const AppContent = () => {
  const location = useLocation();
  const [role, setRole] = useState(""); // Lưu role người dùng
  const [isLoading, setIsLoading] = useState(true); // Kiểm soát trạng thái loading

  // Lấy thông tin người dùng từ API
  useEffect(() => {
    const fetchUserRole = async () => {
      try {
        const response = await axios.get("/api/profile/me", {
          withCredentials: true, // Gửi cookie để xác thực
        });
        const userRole = response.data.role;
        setRole(userRole);
      } catch (error) {
        console.error("Lỗi khi lấy thông tin người dùng:", error);
      } finally {
        setIsLoading(false); // Tắt loading khi hoàn thành
      }
    };

    fetchUserRole();
  }, []);

  const isAdminPage = [
    "/settings",
    "/analytics",
    "/orders",
    "/sales",
    "/users",
    "/hotelmanager",
    "/overview",
  ].includes(location.pathname);

  // Các trang mà HotelManager không được phép truy cập
  const restrictedPagesForHotelManager = [
    "/users",

  ].includes(location.pathname);

  if (isLoading) {
    return <div>Loading...</div>; // Hiển thị loading trong khi chờ dữ liệu
  }

  // Nếu không phải Admin hoặc HotelManager mà truy cập vào trang admin
  if (isAdminPage && role !== "Admin" && role !== "HotelManager") {
    return <Navigate to="/" />; // Điều hướng về trang chủ
  }

  // Nếu là HotelManager và cố gắng truy cập vào trang bị hạn chế
  if (restrictedPagesForHotelManager && role === "HotelManager") {
    return <Navigate to="/overview" />; // Điều hướng về trang trước đó
  }

  return (
    <div
    className={`${
        isAdminPage ? "flex h-screen bg-blue-900" : "bg-white"
      } text-gray-100 overflow-hidden`}
    >
      {isAdminPage && (
        <div className="fixed inset-0 z-0">
          <div className="absolute inset-0 bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 opacity-80" />
          <div className="absolute inset-0 backdrop-blur-sm" />
        </div>
      )}
      {isAdminPage && <Sidebar userRole={role} />}
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/overview" element={<OverviewPage />} />
        <Route path="/hotelmanager" element={<HotelManagerPage />} />
        <Route path="/sales" element={<SalesPage />} />
        <Route path="/orders" element={<OrdersPage />} />
        <Route path="/users" element={<UsersPage />} />
        <Route path="/analytics" element={<AnalyticsPage />} />
        <Route path="/settings" element={<SettingsPage />} />
        <Route path="/addhotel" element={<HotelAdd />} />
        <Route path="/hotels/:hotelId/add-room" element={<AddRoom />} />
        <Route path="/myhotel" element={<MyHotel />} />
        <Route path="/hotels/:hotelId/rooms" element={<HotelRooms />} />
        <Route path="/room/:roomId" element={<RoomDetail />} />
        <Route path="/hotels/:hotelId" element={<HotelDetail />} />
        <Route path="/searchplaces" element={<SearchPlaces />} />
        <Route path="/SearchPage" element={<SearchPage />} />
        <Route path="/t2/:hotelId" element={<HotelImage />} />
        <Route path="/detailhotel/:hotelId" element={<DetailHotelPage />} />
        <Route path="/detailroom/:hotelId" element={<DetailRoomPage />} />
        <Route path="/detailroom/:hotelId/checkout/:roomId" element={<CheckoutPage />} />
        <Route path="/success" element={<Success/>} />
        <Route path="/confirmpayment" element={<ConfirmPayment/>} />
        <Route path="/bookingstatus" element={<BookingStatusPage/>} />
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </div>
  );
};

const App = () => {
  return (
    <Router>
      <AppContent />
    </Router>
  );
};

export default App;
