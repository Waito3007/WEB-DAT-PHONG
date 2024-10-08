import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Form, Input, Button, Typography, message } from 'antd';

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
        navigate('/addhotel'); // Redirect to profile page
      } else {
        setError(data.msg || 'Có lỗi xảy ra');
        message.error(data.msg || 'Có lỗi xảy ra'); // Sử dụng Ant Design message
      }
    } catch (err) {
      console.error('Lỗi mạng hoặc server:', err);
      setError('Có lỗi xảy ra, vui lòng thử lại sau.');
      message.error('Có lỗi xảy ra, vui lòng thử lại sau.'); // Sử dụng Ant Design message
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-6 rounded-lg shadow-md w-full max-w-md mx-auto">
        <Title level={2} style={{ textAlign: 'center', color: 'black' }}>
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
              style={{
                borderColor: 'black', // Viền màu đen
              }}
              required
            />
          </Form.Item>

          {error && <p className="text-red-500 text-sm">{error}</p>}

          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              style={{
                width: '100%',
                backgroundColor: '#007bff',
                borderColor: 'black', // Viền màu đen
              }}
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