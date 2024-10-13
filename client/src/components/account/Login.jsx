import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Form, Input, Button, message } from 'antd';
import '../../App.css';
import { Content } from 'antd/es/layout/layout';

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
    <div className="w-[1440px] h-[1024px] pl-[89px] pr-[102px] py-[104px] bg-white justify-start items-start gap-[119px] inline-flex">
      <div className="w-[512px] self-stretch flex-col justify-start items-start gap-12 inline-flex">
        <div className="self-stretch h-[49px] flex-col justify-start items-start gap-4 flex">
          <div className="text-center text-black text-[40px] font-normal font-['Alexandria']">
            Đăng nhập tài khoản của bạn
          </div>
        </div>
        <Form
          name="login"
          onFinish={handleLogin}
          layout="vertical"
          className="self-stretch h-[451px] flex-col justify-start items-start gap-10 flex"
        >
          <div className="self-stretch h-[177px] flex-col justify-start items-start gap-6 flex">
            <Form.Item
              label="Email"
              name="email"
              rules={[{ required: true, message: 'Vui lòng nhập email!' }]}
            >
              <Input
                type="email"
                style={{
                  borderColor: 'black',
                }}
                className="w-[512px] h-14 rounded-tl rounded-tr"
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
                  borderColor: 'black',
                }}
                className="w-[512px] h-14 rounded-tl rounded-tr"
                required
              />
            </Form.Item>
          </div>

          {error && <p className="text-red-500 text-sm">{error}</p>}

          <div className="self-stretch justify-start items-center gap-[252px] inline-flex">
            <div className="w-[512px] text-right text-[#ff8682] text-sm font-medium font-['Montserrat']">
              Quên mật khẩu
            </div>
          </div>

          <div className="flex-col justify-start items-start gap-4 flex">
            <Form.Item>
              <Button
                type="primary"
                htmlType="submit"
                className="self-stretch h-12 px-4 py-2 bg-black rounded justify-center items-center gap-1"
              >
                Đăng nhập
              </Button>
            </Form.Item>
          </div>
        </Form>

        <div className="self-stretch text-center">
        <span style={{ color: '#112211', fontSize: '12px', fontWeight: '500', fontFamily: 'Montserrat' }}>
          Bạn chưa có tài khoản?
        </span>
        <span style={{ color: '#ff8682', fontSize: '12px', fontWeight: '600', fontFamily: 'Montserrat' }}>
          Đăng ký
        </span>
        </div>
      </div>
      <div className="w-[618px] h-[816px] relative">
        <img className="w-[616px] h-[816px] left-0 top-0 absolute rounded-[30px]" src="https://res.cloudinary.com/dackig67m/image/upload/v1728840647/register_srtwnf.png" alt="Login Image" />
        <div className="w-[616px] h-[58px] left-[2px] top-[816px] absolute bg-gradient-to-b from-black to-black rounded-tl-[30px] rounded-tr-[30px]" />
        <div className="h-2.5 left-[274px] top-[782px] absolute justify-start items-start gap-2 inline-flex">
          <div className="w-8 h-2.5 bg-[#8dd3bb] rounded-[5px]" />
          <div className="w-2.5 h-2.5 bg-white rounded-full" />
          <div className="w-2.5 h-2.5 bg-white rounded-full" />
        </div>
      </div>
    </div>
  );
};

export default Login;