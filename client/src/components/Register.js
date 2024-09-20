// src/components/Register.js
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Register = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('Customer'); // Mặc định là 'Customer'
  const [error, setError] = useState(null); // Trạng thái lỗi
  const navigate = useNavigate(); // Hook để chuyển hướng

  const handleRegister = async (e) => {
    e.preventDefault();
    setError(null); // Reset lỗi trước khi gửi yêu cầu
    try {
      const response = await fetch('/api/users/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password, role }),
      });
  
      const data = await response.json();
      if (response.ok) {
        alert('Đăng ký thành công');
        navigate('/login'); // Chuyển hướng đến trang đăng nhập
      } else {
        setError(data.msg || 'Có lỗi xảy ra'); // Cập nhật lỗi từ server hoặc thông báo lỗi chung
      }
    } catch (err) {
      console.error('Lỗi mạng hoặc server:', err);
      setError('Có lỗi xảy ra, vui lòng thử lại sau.'); // Thông báo lỗi chung
    }
  };
  

  return (
    <div>
      <h2>Đăng Ký</h2>
      <form onSubmit={handleRegister}>
        <div>
          <label>Tên:</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Nhập tên"
            required
          />
        </div>
        <div>
          <label>Email:</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Nhập email"
            required
          />
        </div>
        <div>
          <label>Mật khẩu:</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Nhập mật khẩu"
            required
          />
        </div>
        <button type="submit">Đăng Ký</button>
      </form>
      {error && <p style={{ color: 'red' }}>{error}</p>} {/* Hiển thị thông báo lỗi */}
    </div>
  );
};

export default Register;
