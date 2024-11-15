import React, { useState } from 'react';
import {
  Drawer,
  Typography,
  TextField,
  Button,
  CircularProgress,
  Box,
  Slide,
} from '@mui/material';
import axios from 'axios';

const RatingDrawer = ({ open, onClose, hotel }) => {
  const [rating, setRating] = useState(5); // Điểm mặc định
  const [comment, setComment] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);

  const handleSubmit = async () => {
    setLoading(true);
    setMessage(null);

    try {
      const response = await axios.post(
        '/api/detail/rate',
        { hotel: hotel._id, rating, comment },
        { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } }
      );

      setMessage(response.data.message);
      setRating(5); // Reset đánh giá
      setComment(''); // Reset bình luận
    } catch (err) {
      setMessage(err.response?.data?.message || 'Có lỗi xảy ra!');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Drawer
      anchor="right" // Hiển thị từ bên phải
      open={open}
      onClose={onClose}
      PaperProps={{
        sx: {
          width: '400px', // Độ rộng Drawer
          padding: '20px',
          backgroundColor: '#f9f9f9', // Màu nền
          boxShadow: '0px 4px 20px rgba(0, 0, 0, 0.1)', // Đổ bóng
        },
      }}
    >
      <Slide direction="left" in={open} mountOnEnter unmountOnExit>
        <Box>
          <Typography
            variant="h5"
            sx={{ marginBottom: '16px', fontWeight: 'bold', color: '#333' }}
          >
            Đánh giá khách sạn: {hotel.name}
          </Typography>

          <TextField
            type="number"
            label="Điểm (1-10)"
            value={rating}
            onChange={(e) => setRating(Math.max(1, Math.min(10, Number(e.target.value))))}
            fullWidth
            sx={{ marginBottom: '16px' }}
          />

          <TextField
            label="Bình luận"
            multiline
            rows={4}
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            fullWidth
            sx={{ marginBottom: '16px' }}
          />

          {loading ? (
            <CircularProgress sx={{ display: 'block', margin: '0 auto' }} />
          ) : (
            <Button
              variant="contained"
              color="primary"
              onClick={handleSubmit}
              sx={{
                backgroundColor: '#007BFF',
                '&:hover': { backgroundColor: '#0056b3' },
              }}
            >
              Xác nhận
            </Button>
          )}

          {message && (
            <Typography
              variant="body1"
              sx={{
                color: message.includes('thành công') ? 'green' : 'red',
                marginTop: '16px',
                textAlign: 'center',
              }}
            >
              {message}
            </Typography>
          )}
        </Box>
      </Slide>
    </Drawer>
  );
};

export default RatingDrawer;
