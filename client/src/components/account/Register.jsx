import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../../App.css';
const Register = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role] = useState('Customer'); // Mặc định là 'Customer'
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    setError(null);

    const registrationDate = new Date().toISOString(); // Lấy ngày hiện tại

    try {
      const response = await fetch('/api/users/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password, role, registrationDate }), // Gửi registrationDate
      });

      const data = await response.json();
      if (response.ok) {
        localStorage.setItem('token', data.token); // Store token
        localStorage.setItem('user', JSON.stringify(data.user)); // Store user info
        alert('Đăng ký thành công');
        navigate('/profile'); // Redirect to profile page
      } else {
        setError(data.msg || 'Có lỗi xảy ra');
      }
    } catch (err) {
      console.error('Lỗi mạng hoặc server:', err);
      setError('Có lỗi xảy ra, vui lòng thử lại sau.');
    }
  };

  return (
    <div className="background flex items-center justify-center min-h-screen bg-gray-800 w-full">
      <div style={{ backgroundColor: 'rgb(1 2 2 / 42%)' }}  className=" p-8 rounded-lg shadow-md w-full max-w-md">
        <h2 className="text-2xl font-semibold text-center mb-6">Đăng Ký</h2>
        {error && <div className="text-red-500 mb-4">{error}</div>}
        <form onSubmit={handleRegister}>
          <div className="mb-4">
            <label className="block text-gray-300">Họ Tên</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-md"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-md"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700">Mật Khẩu</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-md"
              required
            />
          </div>
          <div className="phuong flex items-center justify-center ">
            <button type="submit" className="w-1/2 bg-blue-500 text-white py-2 rounded-md hover:bg-gradient-to-r hover:from-pink-200 hover:to-pink-600 transition duration-800 ease-in-out">Đăng Ký</button>

          </div>          
        </form>
      </div>
    </div>
  );
};

export default Register;
