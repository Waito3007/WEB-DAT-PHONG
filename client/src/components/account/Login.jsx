import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Form, Input, Button, Typography, message } from 'antd';
import 'animate.css'; // Import animate.css

const { Title } = Typography;

const Login = () => {
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleLogin = async (values) => {
    setError(null); // Reset lỗi trước khi gửi yêu cầu

    try {
      const response = await fetch('/api/users/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: values.email, password: values.password }),
      });

      const data = await response.json();
      if (response.ok) {
        localStorage.setItem('token', data.token); // Store token
        localStorage.setItem('user', JSON.stringify(data.user)); // Store user info
        message.success('Đăng nhập thành công'); // Sử dụng Ant Design message
        navigate('/'); // Redirect to profile page

      } else {
        setError(data.msg || 'Có lỗi xảy ra');
        message.error(data.msg || 'Có lỗi xảy ra');
      }
    } catch (err) {
      console.error('Lỗi mạng hoặc server:', err);
      setError('Có lỗi xảy ra, vui lòng thử lại sau.');
      message.error('Có lỗi xảy ra, vui lòng thử lại sau.');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-purple-600 via-pink-500 to-red-500">
    {/* Điều chỉnh chiều rộng form */}
    <div className="bg-white p-10 rounded-lg shadow-2xl w-full max-w-md mx-auto transform hover:scale-105 transition-all duration-500">
      <Title level={2} className="text-center text-gray-800 mb-6 animate__animated animate__fadeInDown">
        Đăng nhập
      </Title>
      <Form
        name="login"
        onFinish={handleLogin}
        layout="vertical"
      >
        <Form.Item
          label="Email"
          name="email"
          rules={[{ required: true, message: 'Vui lòng nhập email!' }]}
        >
          <Input
            type="email"
            className="border-gray-300 focus:border-pink-500 focus:ring-pink-500"
            required
          />
        </Form.Item>
  
        <Form.Item
          label="Mật khẩu"
          name="password"
          rules={[{ required: true, message: 'Vui lòng nhập mật khẩu!' }]}
        >
          <Input.Password
            className="border-gray-300 focus:border-pink-500 focus:ring-pink-500"
            required
          />
        </Form.Item>
  
        {error && <p className="text-red-500 text-sm">{error}</p>}
  
        <Form.Item>
          <Button
            type="primary"
            htmlType="submit"
            className="w-full bg-pink-500 hover:bg-pink-600 border-pink-500 hover:border-pink-600 transition-all duration-300 ease-in-out transform hover:scale-105"
          >
            Đăng nhập
          </Button>
        </Form.Item>
      </Form>
    </div>
  </div>  
  );
};

export default Login;
