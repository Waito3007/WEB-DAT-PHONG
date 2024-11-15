import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Input, Button, notification } from 'antd';
import { motion } from 'framer-motion';

const ResetPassword = () => {
  const { token } = useParams();
  const navigate = useNavigate();
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  const handleResetPassword = async () => {
    setError(null);
    setSuccess(null);

    if (newPassword !== confirmPassword) {
      setError('Mật khẩu không khớp!');
      return;
    }

    try {
      const response = await fetch('/api/profile/reset', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token, newPassword }),
      });

      const data = await response.json();
      if (response.ok) {
        notification.success({
          message: "Thành Công.",
          description: "Mật khẩu đã được cập nhật thành công!",
        });
        setTimeout(() => navigate('/login'), 600);
      } else {
        notification.error({
          message: "Thất Bại.",
          description: "Cập nhật mật khẩu thất bại, vui lòng thử lại sau!",
        });
      }
    } catch (err) {
      console.error('Lỗi mạng hoặc server:', err);
      setError('Có lỗi xảy ra, vui lòng thử lại sau.');
    }
  };

  return (
    <motion.div
      className="absolute inset-0 flex flex-col md:flex-row justify-center items-center px-4 py-8 md:px-16 md:py-16 bg-gradient-to-r from-gray-100 to-white"
      initial={{ opacity: 0, y: -50 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 50 }}
      transition={{ duration: 0.5 }}
    >
      <div className="w-full max-w-4xl flex flex-col md:flex-row justify-start items-start gap-6 p-6 bg-white shadow-md rounded-lg">
        {/* Form Section */}
        <div className="w-full md:w-1/2 flex flex-col gap-6">
          <h2 className="text-black text-4xl font-normal text-left">Đặt lại mật khẩu</h2>
          {error && <div className="text-red-500 mb-4 text-left">{error}</div>}
          {success && <div className="text-green-500 mb-4 text-left">{success}</div>}
          <div className="flex flex-col gap-6">
            <div className="flex flex-col">
              <label className="text-[#1c1b1f] text-sm">Mật khẩu mới</label>
              <Input
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="w-full input-field border border-gray-300 rounded-md focus:outline-none"
                required
              />
            </div>
            <div className="flex flex-col">
              <label className="text-[#1c1b1f] text-sm">Xác nhận mật khẩu</label>
              <Input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full input-field border border-gray-300 rounded-md focus:outline-none"
                required
              />
            </div>
            <div className="flex items-center justify-center">
              <Button
                onClick={handleResetPassword}
                className="w-full bg-black text-white py-2 rounded-md text-lg h-12 hover:bg-gray-800 transition duration-300 ease-in-out"
              >
                Đặt lại mật khẩu
              </Button>
            </div>
          </div>
          <div className="flex justify-center">
            <p className="text-sm text-black">
              Quay lại trang
              <a href="/login" className="text-red-500 ml-1">Đăng nhập</a>
            </p>
          </div>
        </div>

        {/* Image Section */}
        <div className="w-full md:w-1/2 flex justify-center items-center">
          <img
            src="../bg.png"
            alt="Reset Password"
            className="rounded-lg shadow-md"
            style={{ width: '315px', height: '480px' }} // Điều chỉnh kích thước tại đây
          />  
        </div>
      </div>
    </motion.div>
  );
};

export default ResetPassword;
