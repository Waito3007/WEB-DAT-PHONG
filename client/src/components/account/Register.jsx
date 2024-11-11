import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Input, Checkbox } from 'antd';
import { UserOutlined, MailOutlined, LockOutlined } from '@ant-design/icons';
import { motion } from 'framer-motion';
import '../../assets/css/Register.css';

const Register = () => {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState(null);
  const [agreeTerms, setAgreeTerms] = useState(false);
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    setError(null);

    if (password !== confirmPassword) {
      setError('Mật khẩu và mật khẩu nhập lại không khớp');
      return;
    }

    if (!agreeTerms) {
      setError('Bạn cần đồng ý với các điều khoản và chính sách quyền riêng tư');
      return;
    }

    const registrationDate = new Date().toISOString();
    const name = `${firstName} ${lastName}`;

    try {
      const response = await fetch('/api/users/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password, registrationDate }),
      });

      const data = await response.json();
      if (response.ok) {
        localStorage.setItem('token', data.token);
        localStorage.setItem('user', JSON.stringify(data.user));
        navigate('/login');
      } else {
        setError(data.msg || 'Có lỗi xảy ra');
      }
    } catch (err) {
      console.error('Lỗi mạng hoặc server:', err);
      setError('Có lỗi xảy ra, vui lòng thử lại sau.');
    }
  };

  return (
    <div className="absolute inset-0 flex flex-col md:flex-row justify-center items-start px-4 py-8 md:px-16 md:py-16 bg-gradient-to-r from-gray-100 to-white">
      <motion.div 
        className="flex flex-col md:flex-row max-w-3xl gap-6 bg-white p-6 rounded-lg shadow-md"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="w-[350px] relative mr-8">
          <img
            className="w-[100%] h-auto rounded-lg shadow-md"
            src="https://res.cloudinary.com/dackig67m/image/upload/v1728840647/register_srtwnf.png"
            alt="Register"
          />
        </div>

        <div className="flex flex-col w-[400px] justify-start items-start gap-6">
          <h2 className="text-black text-4xl font-normal text-center md:text-left">Tạo tài khoản của bạn</h2>
          {error && <div className="text-red-500 mb-4 text-center">{error}</div>}
          <form onSubmit={handleRegister} className="flex flex-col gap-6">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex flex-col w-full">
                <label className="text-[#1c1b1f] text-sm">Họ</label>
                <input
                  type="text"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  className="w-full px-4 input-field border rounded-md focus:outline-none "
                  required
                  placeholder=""
                />
              </div>
              <div className="flex flex-col w-full">
                <label className="text-[#1c1b1f] text-sm">Tên</label>
                <input
                  type="text"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  className="w-full px-4 input-field border rounded-md focus:outline-none "
                  required
                  placeholder=""
                />
              </div>
            </div>

            <div className="flex flex-col">
              <label className="text-[#1c1b1f] text-sm">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 input-field border rounded-md focus:outline-none "
                required
                style={{ color: 'black' }}
                placeholder=""
              />
            </div>

            <div className="flex flex-col">
              <label className="text-[#1c1b1f] text-sm">Mật khẩu</label>
              <Input.Password
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full input-field border rounded-md focus:outline-none "
                required
                placeholder=""
              />
            </div>

            <div className="flex flex-col">
              <label className="text-[#1c1b1f] text-sm">Nhập lại mật khẩu</label>
              <Input.Password
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full input-field border rounded-md focus:outline-none "
                required
                placeholder=""
              />
            </div>

            <div className="flex items-center border-black">
              <Checkbox
                checked={agreeTerms}
                onChange={(e) => setAgreeTerms(e.target.checked)}
                className="checkbox "
              />
              <span className="text-sm " style={{ color: 'black' }}>
                  Tôi đồng ý với tất cả các Điều khoản và Chính sách quyền riêng tư
              </span>
            </div>

            <div className="flex items-center justify-center">
              <button 
                type="submit" 
                className="w-full bg-black text-white py-2 rounded-md hover:bg-gray-800 transition duration-300 ease-in-out"
              >
                Đăng Ký
              </button>
            </div>
          </form>
        </div>
      </motion.div>
    </div>
  );
};

export default Register;
