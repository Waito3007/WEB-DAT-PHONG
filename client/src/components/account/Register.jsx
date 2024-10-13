import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../../App.css';

const Register = () => {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    setError(null);

    // Kiểm tra mật khẩu và mật khẩu nhập lại
    if (password !== confirmPassword) {
      setError('Mật khẩu và mật khẩu nhập lại không khớp');
      return;
    }

    const registrationDate = new Date().toISOString();

    try {
      const response = await fetch('/api/users/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ firstName, lastName, email, password, registrationDate }),
      });

      const data = await response.json();
      if (response.ok) {
        localStorage.setItem('token', data.token);
        localStorage.setItem('user', JSON.stringify(data.user));
        alert('Đăng ký thành công');
        navigate('/profile');
      } else {
        setError(data.msg || 'Có lỗi xảy ra');
      }
    } catch (err) {
      console.error('Lỗi mạng hoặc server:', err);
      setError('Có lỗi xảy ra, vui lòng thử lại sau.');
    }
  };

  return (
    <div className="w-[1440px] h-[1024px] pl-[104px] pr-[161px] py-[104px] bg-white justify-start items-start gap-[47px] inline-flex">
      <div className="w-[488px] h-[816px] relative">
        <img className="w-[486.42px] h-[816px] left-0 top-0 absolute rounded-[30px]" src="https://via.placeholder.com/486x816" alt="Register" />
      </div>

      <div className="w-[640px] self-stretch flex-col justify-start items-start gap-12 inline-flex">
        <h2 className="text-black text-[40px] font-normal">Đăng Ký</h2>
        {error && <div className="text-red-500 mb-4">{error}</div>}
        <form onSubmit={handleRegister} className="self-stretch h-[618px] flex-col justify-start items-start gap-10 flex">
          <div className="flex gap-6">
            <div className="flex flex-col">
              <label className="text-[#1c1b1f] text-sm">Tên</label>
              <input
                type="text"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-md"
                required
              />
            </div>
            <div className="flex flex-col">
              <label className="text-[#1c1b1f] text-sm">Họ</label>
              <input
                type="text"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-md"
                required
              />
            </div>
          </div>

          <div className="flex flex-col">
            <label className="text-[#1c1b1f] text-sm">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-md"
              required
            />
          </div>

          <div className="flex flex-col">
            <label className="text-[#1c1b1f] text-sm">Mật khẩu</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-md"
              required
            />
          </div>

          <div className="flex flex-col">
            <label className="text-[#1c1b1f] text-sm">Nhập lại mật khẩu</label>
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-md"
              required
            />
          </div>

          <div className="flex items-center justify-center">
            <button type="submit" className="w-full bg-blue-500 text-white py-2 rounded-md">
              Đăng Ký
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Register;