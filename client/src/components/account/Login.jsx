import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Input } from 'antd';

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
        localStorage.setItem('token', data.token);
        localStorage.setItem('user', JSON.stringify(data.user));
        alert('Đăng nhập thành công');
        navigate('/');
      } else {
        setError(data.msg || 'Có lỗi xảy ra');
      }
    } catch (err) {
      console.error('Lỗi mạng hoặc server:', err);
      setError('Có lỗi xảy ra, vui lòng thử lại sau.');
    }
  };

  return (
    <div className="flex flex-col md:flex-row justify-center items-start px-4 py-8 md:px-16 md:py-16 bg-white">
      <div className="w-[488px] h-[816px] relative mb-8 md:mb-0">
        <img
          className="w-[100%] h-auto rounded-lg"
          src="https://res.cloudinary.com/dackig67m/image/upload/v1728844619/image_2024-10-14_013655362_w9eudg.png"
          alt="Login" />
      </div>
      <div className="w-full md:w-1/2 flex flex-col justify-start items-start gap-6 ml-11">
        <h2 className="text-black text-4xl font-normal text-center md:text-left">Đăng Nhập <br /> Tài Khoản Của Bạn</h2>
        {error && <div className="text-red-500 mb-4 text-center">{error}</div>}
        <form onSubmit={handleLogin} className="flex flex-col gap-6">
          <div className="flex flex-col">
            <label className="text-[#1c1b1f] text-sm">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 input-field h-12" // Chiều rộng 100% cho ô nhập
              style={{ color: 'black', width: '100%' }} // Thay đổi màu chữ thành đen và chiều rộng 100%
              required
            />
          </div>

          <div className="flex flex-col">
            <label className="text-[#1c1b1f] text-sm">Mật khẩu</label>
            <Input.Password
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full input-field h-12" // Chiều rộng 100% cho ô nhập
              style={{ width: '100%' }} // Đảm bảo chiều rộng là 100%
              required
            />
            <a href="/forgotpassword" className="text-red-500 text-sm text-right mt-1">Quên mật khẩu?</a>
          </div>

          <div className="flex items-center justify-center">
            <button type="submit" className="w-full bg-black text-white py-2 rounded-md text-lg h-12"> 
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
    </div>
  );
};

export default Login;
