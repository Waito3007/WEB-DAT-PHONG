// EditProfileDrawer.jsx
import React from 'react';
import { Drawer, Form, Input, Button, message } from 'antd';

const EditProfileDrawer = ({ visible, onClose, user, onEditSubmit, onPasswordChange }) => {
    return (
        <Drawer
            title="Chỉnh sửa hồ sơ"
            placement="right"
            onClose={onClose}
            visible={visible}
            bodyStyle={{ padding: '20px', backgroundColor: '#f8f9fa' }}
            titleStyle={{ fontSize: '1.5rem', textAlign: 'center', color: '#007bff' }}
            closable={false}
        >
            <Form
                initialValues={{ name: user?.name, email: user?.email, age: user?.age }}
                onFinish={onEditSubmit}
            >
                <Form.Item
                    label="Tên"
                    name="name"
                    rules={[{ required: true, message: 'Vui lòng nhập tên!' }]}
                >
                    <Input 
                        placeholder="Nhập tên của bạn" 
                        style={{ borderRadius: '8px', border: '1px solid #ced4da', boxShadow: '0 2px 5px rgba(0, 0, 0, 0.1)' }} 
                    />
                </Form.Item>
                <Form.Item
                    label="Email"
                    name="email"
                    rules={[{ required: true, type: 'email', message: 'Vui lòng nhập email hợp lệ!' }]}
                >
                    <Input 
                        placeholder="Nhập email của bạn" 
                        style={{ borderRadius: '8px', border: '1px solid #ced4da', boxShadow: '0 2px 5px rgba(0, 0, 0, 0.1)' }} 
                    />
                </Form.Item>
                <Form.Item label="Tuổi" name="age">
                    <Input 
                        type="number" 
                        placeholder="Nhập tuổi của bạn" 
                        style={{ borderRadius: '8px', border: '1px solid #ced4da', boxShadow: '0 2px 5px rgba(0, 0, 0, 0.1)' }} 
                    />
                </Form.Item>
                <Form.Item>
                    <Button
                        type="default"
                        onClick={onPasswordChange}
                        style={{ width: '100%', borderRadius: '8px', marginBottom: '10px', backgroundColor: '#007bff', color: '#fff', border: 'none', boxShadow: '0 2px 5px rgba(0, 0, 0, 0.1)' }}
                    >
                        Đổi mật khẩu
                    </Button>
                </Form.Item>
                <Form.Item>
                    <Button
                        type="primary"
                        htmlType="submit"
                        style={{ width: '100%', borderRadius: '8px', boxShadow: '0 2px 5px rgba(0, 0, 0, 0.1)' }}
                    >
                        Lưu
                    </Button>
                </Form.Item>
            </Form>
        </Drawer>
    );
};

export default EditProfileDrawer;
