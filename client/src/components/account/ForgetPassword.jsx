import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Input, Spin, notification } from 'antd'; // Import Spin component from Ant Design
import { motion } from 'framer-motion';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [success, setSuccess] = useState(null);
  const [error, setError] = useState(null);
  const [isCooldown, setIsCooldown] = useState(false); // Track cooldown state
  const [countdown, setCountdown] = useState(30); // Track the countdown timer
  const [isLoading, setIsLoading] = useState(false); // Track loading state
  const navigate = useNavigate();

  // Start countdown when the user submits the email
  useEffect(() => {
    let timer;
    if (isCooldown) {
      timer = setInterval(() => {
        setCountdown((prevCountdown) => {
          if (prevCountdown <= 1) {
            clearInterval(timer);
            setIsCooldown(false);
            setCountdown(30);
          }
          return prevCountdown - 1;
        });
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [isCooldown]);

  const handleForgotPassword = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    // If cooldown is active, prevent submission
    if (isCooldown) {
      setError('Vui lòng đợi ' + countdown + ' giây trước khi thử lại.');
      return;
    }

    setIsLoading(true); // Start loading

    try {
      const response = await fetch('/api/profile/forgot-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();
      if (response.ok) {
        notification.success({
          message: "Thành Công.",
          description: "Đã gửi liên kết đặt lại mật khẩu vào email của bạn.",
        });
        setIsCooldown(true); // Start cooldown after successful request
      } else {
        setError(data.msg || 'Có lỗi xảy ra');
      }
    } catch (err) {
      console.error('Lỗi mạng hoặc server:', err);
      notification.error({
        message: "Thất Bại.",
        description: "Vui lòng thử lại sau.",
      });
        } finally {
      setIsLoading(false); // Stop loading
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
      <div className="w-full max-w-5xl flex flex-col md:flex-row items-start gap-6 p-12 bg-white shadow-md rounded-lg">
        {/* Form Section */}
        <div className="flex flex-col w-full md:w-1/2 gap-6">
          <h2 className="text-black text-4xl font-normal text-left">Bạn quên mật khẩu?</h2>
          <p className="text-left text-gray-700 text-base">
            Đừng lo lắng, điều này xảy ra với tất cả chúng ta. Nhập email của bạn dưới đây để khôi phục mật khẩu của bạn.
          </p>

          {error && <div className="text-red-500 mb-4 text-left">{error}</div>}
          {success && <div className="text-green-500 mb-4 text-left">{success}</div>}

          <form onSubmit={handleForgotPassword} className="flex flex-col gap-6 w-full">
            <div className="flex flex-col w-full">
              <label className="text-[#1c1b1f] text-sm font-medium">Email</label>
              <Input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full h-14 input-field border border-gray-300 rounded-md px-4 focus:outline-none"
                required
              />
            </div>

            <div className="flex items-center justify-center w-full">
              <button 
                type="submit" 
                className="w-full h-12 bg-black text-white py-2 rounded-md text-lg hover:bg-gray-800 transition duration-300 ease-in-out"
                disabled={isCooldown || isLoading} // Disable button if cooldown or loading is active
              >
                {isLoading ? (
                  <Spin size="small" className="mr-2" /> // Show spinner when loading
                ) : (
                  isCooldown ? `Vui lòng đợi ${countdown} giây` : 'Gửi'
                )}
              </button>
            </div>
          </form>

          <div className="flex justify-center items-center w-full gap-4 mt-4">
            <div className="flex-grow h-[0.5px] bg-gray-300 opacity-50"></div>
            <p className="text-sm text-gray-700">Or login with</p>
            <div className="flex-grow h-[0.5px] bg-gray-300 opacity-50"></div>
          </div>

          <div className="grid grid-cols-3 w-full gap-4 mt-4">
            <div className="w-[145px] h-[56px] px-4 py-2 rounded border border-[#8dd3bb] flex justify-center items-center justify-self-start">
              <img src="../fb.png" alt="Facebook Icon" className="w-6 h-6" />
            </div>

            <div className="w-[145px] h-[56px] px-4 py-2 rounded border border-[#8dd3bb] flex justify-center items-center justify-self-center">
              <img src="../gg.png" alt="Google Icon" className="w-6 h-6" />
            </div>

            <div className="w-[145px] h-[56px] px-4 py-2 rounded border border-[#8dd3bb] flex justify-center items-center justify-self-end">
              <img src="../apple.png" alt="Apple Icon" className="w-6 h-6" />
            </div>
          </div>

          <div className="flex justify-center w-full mt-4">
            <p className="text-sm text-black">
              Quay lại trang 
              <a href="/login" className="text-red-500 ml-1">Đăng nhập</a>
            </p>
          </div>
        </div>

        {/* Image Section */}
        <div className="hidden md:flex md:w-1/2 justify-center items-center">
          <img 
            className="w-[325px] h-[492px] rounded-[15px]" 
            src="../bg.png" 
            alt="Placeholder"
          />
        </div>
      </div>
    </motion.div>
  );
};

export default ForgotPassword;
