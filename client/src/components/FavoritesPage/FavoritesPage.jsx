import React, { useState, useEffect } from 'react';
import { Drawer, List, ListItem, ListItemText, CircularProgress, Grid, Typography } from '@mui/material';
import { HiX } from 'react-icons/hi'; 
import axios from 'axios';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom'; // Import useNavigate để điều hướng
import 'animate.css'; // Import Animate.css
import './FavoriteRoomsDrawer.css'; // Import CSS đã thay đổi

const FavoriteRoomsDrawer = ({ open, onClose }) => {
  const [roomsData, setRoomsData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate(); // Khởi tạo useNavigate

  useEffect(() => {
    if (open) {
      fetchFavoriteRooms();
    }
  }, [open]);

  const fetchFavoriteRooms = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.get('/api/favorite', {
        headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` },
      });
      setRoomsData(response.data);
    } catch (err) {
      setError('Lỗi khi tải dữ liệu phòng yêu thích.');
    } finally {
      setLoading(false);
    }
  };

  const handleRoomClick = (hotelId) => {
    // Điều hướng đến trang chi tiết khách sạn
    navigate(`/detailhotel/${hotelId}`);
  };

  return (
    <motion.div
      initial={{ x: '100%' }}
      animate={{ x: open ? 0 : '100%' }}
      exit={{ x: '100%' }}
      transition={{ type: 'spring', stiffness: 300, damping: 30 }}
    >
      <Drawer anchor="right" open={open} onClose={onClose}>
        <div className="drawer-container animate__animated animate__fadeInRight">
          <div className="drawer-header">
            <Typography variant="h5" component="h2" style={{ fontWeight: 700 }}>
              Khách sạn yêu thích của bạn
            </Typography>
            <button onClick={onClose} className="close-button">
              <HiX size={24} />
            </button>
          </div>

          {loading && (
            <div className="loading-container">
              <CircularProgress />
            </div>
          )}
          {error && (
            <div className="error-message">
              <Typography variant="body1">{error}</Typography>
            </div>
          )}

          <List>
            {roomsData.length === 0 ? (
              <ListItem>
                <ListItemText primary="Bạn chưa có khách sạn yêu thích nào." />
              </ListItem>
            ) : (
              roomsData.map((hotel) => (
                <div key={hotel.hotelId} className="hotel-item animate__animated animate__fadeInUp" onClick={() => handleRoomClick(hotel.hotelId)}>
                  <Grid container spacing={2} alignItems="center">
                    {/* Hình ảnh khách sạn */}
                    <Grid item xs={4} sm={3}>
                      <img 
                        src={hotel.imagehotel[0]} 
                        alt={hotel.name} 
                        className="hotel-image" 
                      />
                    </Grid>

                    {/* Thông tin khách sạn */}
                    <Grid item xs={8} sm={9}>
                      <div className="hotel-info">
                        <Typography variant="h6">{hotel.name}</Typography>
                        <Typography variant="body2" className="location">{hotel.location}</Typography>
                        <Typography variant="body2" className="rating">⭐ {hotel.stars} sao</Typography>
                        <Typography variant="body2" className="price">
                          {hotel.minPrice.toLocaleString()} VND - {hotel.maxPrice.toLocaleString()} VND
                        </Typography>
                      </div>
                    </Grid>
                  </Grid>
                  <hr />
                </div>
              ))
            )}
          </List>
        </div>
      </Drawer>
    </motion.div>
  );
};

export default FavoriteRoomsDrawer;
