import React, { useState } from 'react';
import { Drawer, TextField, Button, IconButton, Box, Typography } from '@mui/material';
import { X as CloseIcon } from 'lucide-react';

const ChangePasswordDrawer = ({ visible, onClose, onPasswordSubmit }) => {
    const [formData, setFormData] = useState({
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
    });

    const [error, setError] = useState('');

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value,
        });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        const { newPassword, confirmPassword } = formData;

        // Kiểm tra xem mật khẩu mới và xác nhận mật khẩu có trùng khớp không
        if (newPassword !== confirmPassword) {
            setError('Mật khẩu mới và xác nhận mật khẩu không khớp');
            return;
        }

        // Kiểm tra mật khẩu mới có chứa kí tự đặc biệt không
        const specialCharRegex = /[!@#$%^&*(),.?":{}|<>]/;
        if (!specialCharRegex.test(newPassword)) {
            setError('Mật khẩu mới phải chứa ít nhất một kí tự đặc biệt');
            return;
        }

        // Gọi hàm onPasswordSubmit để xử lý mật khẩu mới
        onPasswordSubmit(formData);
    };

    return (
        <Drawer
            anchor="right"
            open={visible}
            onClose={onClose}
            sx={{
                '& .MuiDrawer-paper': {
                    width: '400px',
                    padding: '20px',
                    backgroundColor: '#fff',
                    borderRadius: '10px 0 0 10px',
                    boxShadow: '0 4px 15px rgba(0, 0, 0, 0.2)',
                    overflow: 'hidden',
                },
            }}
        >
            <Box display="flex" justifyContent="space-between" alignItems="center">
                <Typography variant="h6" sx={{ fontSize: '1.5rem', color: '#1E90FF', fontWeight: 'bold' }}>
                    Đổi mật khẩu
                </Typography>
                <IconButton onClick={onClose} sx={{ color: '#000' }}>
                    <CloseIcon size={24} />
                </IconButton>
            </Box>

            <form onSubmit={handleSubmit}>
                <Box mt={3}>
                    <TextField
                        label="Mật khẩu hiện tại"
                        name="currentPassword"
                        type="password"
                        fullWidth
                        variant="outlined"
                        required
                        value={formData.currentPassword}
                        onChange={handleChange}
                        sx={{
                            marginBottom: 2,
                            borderRadius: '8px',
                            '& .MuiInputBase-root': {
                                backgroundColor: '#FFFAF0',
                                boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
                                color: '#000',  // Đặt màu chữ của ô nhập thành màu đen
                            },
                            '& .MuiInputLabel-root': {
                                color: '#000',
                            }
                        }}
                    />
                    <TextField
                        label="Mật khẩu mới"
                        name="newPassword"
                        type="password"
                        fullWidth
                        variant="outlined"
                        required
                        value={formData.newPassword}
                        onChange={handleChange}
                        sx={{
                            marginBottom: 2,
                            borderRadius: '8px',
                            '& .MuiInputBase-root': {
                                backgroundColor: '#FFFAF0',
                                boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
                                color: '#000',
                            },
                            '& .MuiInputLabel-root': {
                                color: '#000',
                            }
                        }}
                    />
                    <TextField
                        label="Xác nhận mật khẩu mới"
                        name="confirmPassword"
                        type="password"
                        fullWidth
                        variant="outlined"
                        required
                        value={formData.confirmPassword}
                        onChange={handleChange}
                        sx={{
                            marginBottom: 2,
                            borderRadius: '8px',
                            '& .MuiInputBase-root': {
                                backgroundColor: '#FFFAF0',
                                boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
                                color: '#000',
                            },
                            '& .MuiInputLabel-root': {
                                color: '#000',
                            }
                        }}
                    />
                    {error && (
                        <Typography color="error" sx={{ marginTop: '10px' }}>
                            {error}
                        </Typography>
                    )}
                </Box>

                <Button
                    type="submit"
                    variant="contained"
                    fullWidth
                    sx={{
                        marginTop: 3,
                        backgroundColor: '#1E90FF',
                        color: '#fff',
                        borderRadius: '8px',
                        '&:hover': {
                            backgroundColor: '#4682B4',
                        },
                        boxShadow: '0 4px 10px rgba(0, 0, 0, 0.2)',
                    }}
                >
                    Đổi mật khẩu
                </Button>
            </form>
        </Drawer>
    );
};

export default ChangePasswordDrawer;
