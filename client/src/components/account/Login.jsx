import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Input } from 'antd';
import { motion } from 'framer-motion'; // Nhập thư viện Framer Motion

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError(null);
  
    try {
      const response = await fetch('/api/users/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
  
      const data = await response.json();
      if (response.ok) {
        // Chỉ cần lưu thông tin người dùng, không lưu token
        localStorage.setItem('user', JSON.stringify(data.user));
        navigate(-1);
      } else {
        setError(data.msg || 'Có lỗi xảy ra');
      }
    } catch (err) {
      console.error('Lỗi mạng hoặc server:', err);
      setError('Có lỗi xảy ra, vui lòng thử lại sau.');
    }
  };

  return (
    <motion.div 
      className="absolute inset-0 flex flex-col md:flex-row justify-center items-start px-4 py-8 md:px-16 md:py-16"
      initial={{ opacity: 0, y: -50 }} // Hiệu ứng ban đầu
      animate={{ opacity: 1, y: 0 }} // Hiệu ứng khi xuất hiện
      exit={{ opacity: 0, y: 50 }} // Hiệu ứng khi rời khỏi
      transition={{ duration: 0.5 }} // Thời gian cho hiệu ứng
    >
      <div className="w-1/4 h-fit relative mb-8 md:mb-0 shadow-lg rounded-lg overflow-hidden">
        <img
          className="w-full h-auto rounded-lg"
          src="https://res.cloudinary.com/dackig67m/image/upload/v1728844619/image_2024-10-14_013655362_w9eudg.png"
          alt="Login"
        />
      </div>
      <div className="w-fit md:w-fit flex flex-col justify-start items-start gap-6 ml-11 p-6 shadow-md rounded-lg bg-white">
        <h2 className="text-black text-4xl font-normal text-center md:text-left">Đăng Nhập <br /> Tài Khoản Của Bạn</h2>
        {error && <div className="text-red-500 mb-4 text-center">{error}</div>}
        <form onSubmit={handleLogin} className="flex flex-col gap-6">
          <div className="flex flex-col">
            <label className="text-[#1c1b1f] text-sm">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full input-field px-4 py-2 border border-gray-300 rounded-md focus:outline-none"
              style={{ color: 'black' }} // Thay đổi màu chữ thành đen
              required
            />
          </div>

          <div className="flex flex-col">
            <label className="text-[#1c1b1f] text-sm">Mật khẩu</label>
            <Input.Password
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full input-field h-12 border border-gray-300 rounded-md focus:outline-none"
              required
            />
            <a href="/forgotpassword" className="text-red-500 text-sm text-right mt-1">Quên mật khẩu?</a>
          </div>

          <div className="flex items-center justify-center">
            <button 
              type="submit" 
              className="w-full bg-black text-white py-2 rounded-md text-lg h-12 hover:bg-gray-800 transition duration-300 ease-in-out"
            > 
              Đăng Nhập
            </button>
          </div>
        </form>
        <div className="flex justify-center">
          <p className="text-sm text-black">
            Bạn chưa có tài khoản? 
            <a href="/register" className="text-red-500 ml-1">Đăng ký</a>
          </p>
        </div>
      </div>
    </motion.div>
  );
};

export default Login;
