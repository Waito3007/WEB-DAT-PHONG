import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Input, Checkbox } from 'antd';
import '../../assets/css/Register.css'; // Nhập tệp CSS

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
        alert('Đăng ký thành công');
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
    <div className="flex flex-col md:flex-row justify-center items-start px-4 py-8 md:px-16 md:py-16 bg-white">
      <div className="w-[488px] h-[816px] relative">
        <img
          className="w-[80%] h-auto rounded-lg ml-4"
          src="https://res.cloudinary.com/dackig67m/image/upload/v1728840647/register_srtwnf.png"
          alt="Register" />
      </div>
      <div className="w-full md:w-1/2 flex flex-col justify-start items-start gap-6">
        <h2 className="text-black text-4xl font-normal text-center md:text-left">Tạo tài khoản của bạn</h2>
        {error && <div className="text-red-500 mb-4 text-center">{error}</div>}
        <form onSubmit={handleRegister} className="flex flex-col gap-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex flex-col w-full">
              <label className="text-[#1c1b1f] text-sm">Tên</label>
              <input
                type="text"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                className="w-full px-4 input-field" // Đảm bảo class input-field có mặt ở đây
                required
              />
            </div>
            <div className="flex flex-col w-full">
              <label className="text-[#1c1b1f] text-sm">Họ</label>
              <input
                type="text"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                className="w-full px-4 input-field" // Đảm bảo class input-field có mặt ở đây
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
              className="w-full px-4 input-field" // Đảm bảo class input-field có mặt ở đây
              required
              style={{ color: 'black' }} // Thay đổi màu chữ thành đen
            />
          </div>

          <div className="flex flex-col">
            <label className="text-[#1c1b1f] text-sm">Mật khẩu</label>
            <Input.Password
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full input-field"
              required
            />
          </div>

          <div className="flex flex-col">
            <label className="text-[#1c1b1f] text-sm">Nhập lại mật khẩu</label>
            <Input.Password
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full input-field"
              required
            />
          </div>

          <div className="flex items-center">
            <Checkbox
              checked={agreeTerms}
              onChange={(e) => setAgreeTerms(e.target.checked)}
              className="checkbox"
            />
            <span className="text-sm" style={{ color: 'black' }}>
              Tôi đồng ý với tất cả các Điều khoản và Chính sách quyền riêng tư
            </span>
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
