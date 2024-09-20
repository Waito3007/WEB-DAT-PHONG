// src/App.js
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import HomePage from './pages/HomePage';
import AboutPage from './pages/AboutPage';
import ContactPage from './pages/ContactPage';
import NotFoundPage from './pages/NotFoundPage';
import Navbar from './components/Navbar'; 
import Login from './components/Login'; // Nhập component Login
import Register from './components/Register';

const App = () => {
  return (
    <Router>
      <Navbar /> {/* Đặt Navbar ở đây nếu cần hiển thị trên tất cả các trang */}
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/contact" element={<ContactPage />} />
        <Route path="/login" element={<Login />} /> 
        <Route path="/register" element={<Register />} />
        <Route path="*" element={<NotFoundPage />} /> {/* Route cho trang 404 */}
      </Routes>
    </Router>
  );
};

export default App;
