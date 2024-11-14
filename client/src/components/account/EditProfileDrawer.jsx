import React, { useState, useEffect } from 'react';
import { Drawer, Button, TextField, Typography, IconButton, Divider } from '@mui/material';
import { Save as SaveIcon } from '@mui/icons-material';
import { Lock } from 'lucide-react';  // Import các icon từ lucide-react

const EditProfileDrawer = ({ visible, onClose, user, onEditSubmit, onPasswordChange }) => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        age: '',  // Thêm trường tuổi vào formData
    });

    const [ageError, setAgeError] = useState('');  // State để lưu lỗi cho tuổi

    // Khi Drawer mở ra và user có dữ liệu, cập nhật lại formData
    useEffect(() => {
        if (user) {
            setFormData({
                name: user.name || '',
                email: user.email || '',
                age: user.age || '',  // Cập nhật tuổi từ user nếu có
            });
        }
    }, [user, visible]); // Chạy lại khi user hoặc visible thay đổi

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value,
        });
    };

    const validateAge = (age) => {
        const ageNumber = parseInt(age, 10);
        if (isNaN(ageNumber) || ageNumber < 18 || ageNumber > 120) {
            setAgeError('Tuổi phải từ 18 đến 120');
            return false;
        } else {
            setAgeError('');
            return true;
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        // Kiểm tra độ tuổi trước khi gửi dữ liệu
        if (validateAge(formData.age)) {
            onEditSubmit(formData);  // Gửi dữ liệu chỉnh sửa
        }
    };

    return (
        <Drawer
            anchor="right"
            open={visible}
            onClose={onClose}
            sx={{ width: 400 }}
        >
            <div style={{ padding: '20px', width: '100%' }}>
                <Typography variant="h6" gutterBottom>
                    Chỉnh sửa hồ sơ
                </Typography>

                <form onSubmit={handleSubmit}>
                    {/* Trường chỉnh sửa tên */}
                    <TextField
                        label="Tên"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        fullWidth
                        margin="normal"
                        variant="outlined"
                    />

                    {/* Trường chỉnh sửa email */}
                    <TextField
                        label="Email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        fullWidth
                        margin="normal"
                        variant="outlined"
                    />

                    {/* Trường chỉnh sửa tuổi */}
                    <TextField
                        label="Tuổi"
                        name="age"
                        value={formData.age}
                        onChange={handleChange}
                        fullWidth
                        margin="normal"
                        variant="outlined"
                        type="number"  // Giới hạn kiểu dữ liệu là số
                        inputProps={{
                            min: 18,
                            max: 120,
                        }}
                        error={!!ageError}  // Hiển thị lỗi nếu có
                        helperText={ageError}  // Hiển thị thông báo lỗi
                    />

                    {/* Button để mở form thay đổi mật khẩu */}
                    <div style={{ marginTop: '10px' }}>
                        <Button
                            variant="text"
                            onClick={onPasswordChange}
                            startIcon={<Lock />}
                            sx={{ color: '#1976d2' }}
                        >
                            Thay đổi mật khẩu
                        </Button>
                    </div>

                    <Divider sx={{ margin: '20px 0' }} />

                    {/* Nút cập nhật */}
                    <Button
                        variant="contained"
                        color="primary"
                        type="submit"
                        startIcon={<SaveIcon />}
                        sx={{ marginRight: '10px' }}
                    >
                        Cập nhật
                    </Button>
                </form>
            </div>
        </Drawer>
    );
};

export default EditProfileDrawer;
