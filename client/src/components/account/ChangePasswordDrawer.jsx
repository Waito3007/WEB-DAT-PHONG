// ChangePasswordDrawer.jsx
import React from 'react';
import { Drawer, Form, Input, Button } from 'antd';

const ChangePasswordDrawer = ({ visible, onClose, onPasswordSubmit }) => {
    return (
        <Drawer
            title="Đổi mật khẩu"
            placement="right"
            onClose={onClose}
            visible={visible}
            bodyStyle={{ padding: '20px', backgroundColor: '#f8f9fa' }}
            titleStyle={{ fontSize: '1.5rem', textAlign: 'center', color: '#007bff' }}
            closable={false}
        >
            <Form onFinish={onPasswordSubmit}>
                <Form.Item
                    label="Mật khẩu hiện tại"
                    name="currentPassword"
                    rules={[{ required: true, message: 'Vui lòng nhập mật khẩu hiện tại!' }]}
                >
                    <Input.Password 
                        placeholder="Nhập mật khẩu hiện tại" 
                        style={{ borderRadius: '8px', border: '1px solid #ced4da', boxShadow: '0 2px 5px rgba(0, 0, 0, 0.1)' }} 
                    />
                </Form.Item>
                <Form.Item
                    label="Mật khẩu mới"
                    name="newPassword"
                    rules={[{ required: true, message: 'Vui lòng nhập mật khẩu mới!' }]}
                >
                    <Input.Password 
                        placeholder="Nhập mật khẩu mới" 
                        style={{ borderRadius: '8px', border: '1px solid #ced4da', boxShadow: '0 2px 5px rgba(0, 0, 0, 0.1)' }} 
                    />
                </Form.Item>
                <Form.Item
                    label="Xác nhận mật khẩu mới"
                    name="confirmPassword"
                    rules={[{ required: true, message: 'Vui lòng xác nhận mật khẩu mới!' }]}
                >
                    <Input.Password 
                        placeholder="Xác nhận mật khẩu mới" 
                        style={{ borderRadius: '8px', border: '1px solid #ced4da', boxShadow: '0 2px 5px rgba(0, 0, 0, 0.1)' }} 
                    />
                </Form.Item>
                <Form.Item>
                    <Button
                        type="primary"
                        htmlType="submit"
                        style={{ width: '100%', borderRadius: '8px', boxShadow: '0 2px 5px rgba(0, 0, 0, 0.1)' }}
                    >
                        Đổi mật khẩu
                    </Button>
                </Form.Item>
            </Form>
        </Drawer>
    );
};

export default ChangePasswordDrawer;
