import React from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import HomePage from './pages/HomePage';
import NotFoundPage from './pages/NotFoundPage';
import Login from './components/account/Login';
import Register from './components/account/Register';
// Admin
import Sidebar from "./components/dashboard/common/Sidebar";
import OverviewPage from "./pages/OverviewPage";
import HotelManagerPage from "./pages/HotelManagerPage";
import UsersPage from "./pages/UsersPage";
import SalesPage from "./pages/SalesPage";
import OrdersPage from "./pages/OrdersPage";
import AnalyticsPage from "./pages/AnalyticsPage";
import SettingsPage from "./pages/SettingsPage";
// Hotel Manager
import HotelAdd from './components/hotel_manager/AddHotel';
import MyHotel from './components/hotel_manager/MyHotel';
import HotelDetail from './components/hotel_manager/HotelDetail'; // Nhập HotelDetail

const AppContent = () => {
  const location = useLocation();

  const isAdminPage = [
    '/settings',
    '/analytics',
    '/orders',
    '/sales',
    '/users',
    '/hotelmanager',
    '/overview'
  ].includes(location.pathname);

  return (
    <div className={`flex h-screen ${isAdminPage ? 'bg-blue-900' : 'bg-gray-100'} text-gray-100 overflow-hidden`}>
      {isAdminPage && (
        <div className='fixed inset-0 z-0'>
          <div className='absolute inset-0 bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 opacity-80' />
          <div className='absolute inset-0 backdrop-blur-sm' />
        </div>
      )}
      {isAdminPage && <Sidebar />}
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<Login />} /> 
        <Route path="/register" element={<Register />} />
        <Route path="/overview" element={<OverviewPage />} />
        <Route path="/hotelmanager" element={<HotelManagerPage />} />
        <Route path="/users" element={<UsersPage />} />
        <Route path="/sales" element={<SalesPage />} />
        <Route path="/orders" element={<OrdersPage />} />
        <Route path="/analytics" element={<AnalyticsPage />} />
        <Route path="/settings" element={<SettingsPage />} />
        <Route path="/addhotel" element={<HotelAdd />} />
        <Route path="/myhotel" element={<MyHotel />} />
        <Route path="/hotels/:hotelId" element={<HotelDetail />} /> {/* Route cho HotelDetail */}
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
