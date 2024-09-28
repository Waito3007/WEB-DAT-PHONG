import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Profile = () => {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProfile = async () => {
      const token = localStorage.getItem('token');
      if (!token) {
        navigate('/login');
        return;
      }

      try {
        const response = await fetch('/api/profile', {
          headers: { 'Authorization': `Bearer ${token}` },
        });
        const data = await response.json();
        if (response.ok) {
          setUser(data);
        } else {
          navigate('/login');
        }
      } catch (err) {
        console.error('Lỗi mạng hoặc server:', err);
        navigate('/login');
      }
    };

    fetchProfile();
  }, [navigate]);

  if (!user) {
    return <div>Loading...</div>;
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-6 rounded-lg shadow-md w-full max-w-md">
        <h2 className="text-2xl font-bold mb-6 text-center">Thông tin cá nhân</h2>
        <div className="mb-4">
          <label className="block text-gray-700">Họ Tên</label>
          <p>{user.name}</p>
        </div>
        <div className="mb-4">
          <label className="block text-gray-700">Email</label>
          <p>{user.email}</p>
        </div>
        <div className="mb-4">
          <label className="block text-gray-700">Vai trò</label>
          <p>{user.role}</p>
        </div>
        <div className="mb-4">
          <label className="block text-gray-700">Ngày đăng ký</label>
          <p>{new Date(user.registrationDate).toLocaleDateString()}</p>
        </div>
      </div>
    </div>
  );
};

export default Profile;