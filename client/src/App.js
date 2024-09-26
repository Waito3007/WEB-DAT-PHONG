import React from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import HomePage from './pages/HomePage';
import ContactPage from './pages/ContactPage';
import NotFoundPage from './pages/NotFoundPage';
import Login from './components/account/Login';
import Register from './components/account/Register';
import Profile from './components/account/Profile';
// Admin
import Sidebar from "./components/dashboard/common/Sidebar";
import OverviewPage from "./pages/OverviewPage";
import ProductsPage from "./pages/ProductsPage";
import UsersPage from "./pages/UsersPage";
import SalesPage from "./pages/SalesPage";
import OrdersPage from "./pages/OrdersPage";
import AnalyticsPage from "./pages/AnalyticsPage";
import SettingsPage from "./pages/SettingsPage";
// Hotel Add
import HotelAdd from './components/hotel_manager/AddHotel';
const AppContent = () => {
  const location = useLocation();

  // Kiểm tra xem đường dẫn có phải là một trong những trang admin không
  const isAdminPage = [
    '/settings',
    '/analytics',
    '/orders',
    '/sales',
    '/users',
    '/products',
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
        <Route path="/contact" element={<ContactPage />} />
        <Route path="/login" element={<Login />} /> 
        <Route path="/register" element={<Register />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/overview" element={<OverviewPage />} />
        <Route path="/products" element={<ProductsPage />} />
        <Route path="/users" element={<UsersPage />} />
        <Route path="/sales" element={<SalesPage />} />
        <Route path="/orders" element={<OrdersPage />} />
        <Route path="/analytics" element={<AnalyticsPage />} />
        <Route path="/settings" element={<SettingsPage />} />
        <Route path="/addhotel" element={<HotelAdd />} />
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
