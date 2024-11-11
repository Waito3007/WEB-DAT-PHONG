import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Input } from 'antd';
import { motion } from 'framer-motion';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [success, setSuccess] = useState(null);
  const [error, setError] = useState(null);
  const [timer, setTimer] = useState(0);
  const [retryInterval, setRetryInterval] = useState(30); // Initial wait time is 30 seconds
  const navigate = useNavigate();

  useEffect(() => {
    let countdown;
    if (timer > 0) {
      countdown = setInterval(() => setTimer((prev) => prev - 1), 1000);
    } else if (timer === 0 && countdown) {
      clearInterval(countdown);
    }
    return () => clearInterval(countdown);
  }, [timer]);

  const handleForgotPassword = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    try {
      const response = await fetch('/api/profile/forgot-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();
      if (response.ok) {
        setSuccess('Đã gửi liên kết đặt lại mật khẩu vào email của bạn.');
        setTimer(retryInterval); // Start the timer
        setRetryInterval((prev) => prev + 15); // Increase retry interval by 15 seconds
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
      className="absolute inset-0 flex flex-col justify-center items-center px-4 py-8 md:px-16 md:py-16 bg-gradient-to-r from-gray-100 to-white"
      initial={{ opacity: 0, y: -50 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 50 }}
      transition={{ duration: 0.5 }}
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
              disabled={timer > 0}
            >
              {timer > 0 ? `Gửi lại sau ${timer}s` : 'Tiếp tục'}
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
