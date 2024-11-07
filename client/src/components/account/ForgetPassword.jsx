import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Input } from 'antd';
import { motion } from 'framer-motion';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [success, setSuccess] = useState(null);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleForgotPassword = async (e) => {
    e.preventDefault(); // Ngăn chặn reload trang khi gửi form
    setError(null);
    setSuccess(null);

    try {
      // Gửi yêu cầu POST đến server để gửi email đặt lại mật khẩu
      const response = await fetch('/api/profile/forgot-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }), // Chuyển email thành JSON
      });

      const data = await response.json(); // Nhận dữ liệu trả về từ server
      if (response.ok) {
        setSuccess('Đã gửi liên kết đặt lại mật khẩu vào email của bạn.');
      } else {
        setError(data.msg || 'Có lỗi xảy ra');
      }
    } catch (err) {
      console.error('Lỗi mạng hoặc server:', err);
      setError('Có lỗi xảy ra , vui lòng thử lại sau.');
    }
  };

  return (
    <motion.div 
      className="absolute inset-0 flex flex-col justify-center items-center px-4 py-8 md:px-16 md:py-16 bg-gradient-to-r from-gray-100 to-white"
      initial={{ opacity: 0, y: -50 }} // Hiệu ứng ban đầu
      animate={{ opacity: 1, y: 0 }} // Hiệu ứng khi xuất hiện
      exit={{ opacity: 0, y: 50 }} // Hiệu ứng khi rời khỏi
      transition={{ duration: 0.5 }} // Thời gian cho hiệu ứng
    >
      <div className="w-full max-w-md flex flex-col justify-start items-start gap-6 p-6 bg-white shadow-md rounded-lg">
        <h2 className="text-black text-4xl font-normal text-center">Quên Mật Khẩu</h2>
        {error && <div className="text-red-500 mb-4 text-center">{error}</div>}
        {success && <div className="text-green-500 mb-4 text-center">{success}</div>}
        <form onSubmit={handleForgotPassword} className="flex flex-col gap-6">
          <div className="flex flex-col">
            <label className="text-[#1c1b1f] text-sm">Email</label>
            <Input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full input-field border border-gray-300 rounded-md focus:outline-none"
              required
            />
          </div>

          <div className="flex items-center justify-center">
            <button 
              type="submit" 
              className="w-full bg-black text-white py-2 rounded-md text-lg h-12 hover:bg-gray-800 transition duration-300 ease-in-out"
            >
              Tiếp tục
            </button>
          </div>
        </form>
        <div className="flex justify-center">
          <p className="text-sm text-black">
            Quay lại trang 
            <a href="/login" className="text-red-500 ml-1">Đăng nhập</a>
          </p>
        </div>
      </div>
    </motion.div>
  );
};

export default ForgotPassword;
