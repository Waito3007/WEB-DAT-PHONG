// App.js
import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import HomePage from './pages/HomePage';
import NotFoundPage from './pages/NotFoundPage';
import Login from './components/account/Login';
import Register from './components/account/Register';
import HotelPage from './components/HomePage/HotelPage';
import Sidebar from "./components/dashboard/common/Sidebar";
import OverviewPage from "./pages/OverviewPage";
import HotelManagerPage from "./pages/HotelManagerPage";
import UsersPage from "./pages/UsersPage";
import SalesPage from "./pages/SalesPage";
import OrdersPage from "./pages/OrdersPage";
import AnalyticsPage from "./pages/AnalyticsPage";
import SettingsPage from "./pages/SettingsPage";
import HotelAdd from './components/hotel_manager/AddHotel';
import MyHotel from './components/hotel_manager/MyHotel';
import HotelDetail from './components/hotel_manager/HotelDetail';

const AppContent = ({ hotels, addNewHotel }) => {
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
      {isAdminPage && <Sidebar />}
      <Routes>
        <Route path="/" element={<HomePage hotels={hotels} />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/overview" element={<OverviewPage />} />
        <Route path="/hotelmanager" element={<HotelManagerPage />} />
        <Route path="/hotelpage" element={<HotelPage hotels={hotels} />} />
        <Route path="/users" element={<UsersPage />} />
        <Route path="/sales" element={<SalesPage />} />
        <Route path="/orders" element={<OrdersPage />} />
        <Route path="/analytics" element={<AnalyticsPage />} />
        <Route path="/settings" element={<SettingsPage />} />
        <Route path="/addhotel" element={<HotelAdd onHotelAdded={addNewHotel} />} />
        <Route path="/myhotel" element={<MyHotel hotels={hotels} />} />
        <Route path="/hotels/:hotelId" element={<HotelDetail />} />
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </div>
  );
};

const App = () => {
  const [hotels, setHotels] = useState([]);

  const addNewHotel = (newHotel) => {
    setHotels((prevHotels) => [...prevHotels, newHotel]);
  };
  return (
    <Router>
      <AppContent hotels={hotels} addNewHotel={addNewHotel} />
    </Router>
  );
};

export default App;
