import React, { useState, useEffect } from 'react';
import { Drawer, List, ListItem, ListItemText, Grid, Typography, Pagination } from '@mui/material';
import { HiX } from 'react-icons/hi';
import axios from 'axios';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom'; // Import useNavigate để điều hướng
import 'animate.css'; // Import Animate.css

const BookingCard = ({ open, onClose }) => {
  const [roomsData, setRoomsData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1); // Lưu trạng thái trang hiện tại
  const roomsPerPage = 4; // Số phòng mỗi trang

  const navigate = useNavigate(); // Khởi tạo useNavigate

  useEffect(() => {
    if (open) {
      fetchBookedRooms();
    }
  }, [open, currentPage]);

  const fetchBookedRooms = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.get('/api/booking', {
        headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` },
      });
      // Lọc các booking có trạng thái paymentStatus là "Complete"
      const filteredRooms = response.data.filter(
        (booking) => booking.paymentStatus === 'Complete'
      );
      setRoomsData(filteredRooms);
    } catch (err) {
      setError('Lỗi khi tải dữ liệu đặt phòng.');
    } finally {
      setLoading(false);
    }
  };

  const handleRoomClick = (hotelId) => {
    // Điều hướng đến trang chi tiết khách sạn
    navigate(`/detailhotel/${hotelId}`);
  };

  // Xử lý phân trang
  const indexOfLastRoom = currentPage * roomsPerPage;
  const indexOfFirstRoom = indexOfLastRoom - roomsPerPage;
  const currentRooms = roomsData.slice(indexOfFirstRoom, indexOfLastRoom);

  // Thay đổi trang
  const paginate = (event, pageNumber) => {
    setCurrentPage(pageNumber);
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
              Khách sạn bạn đã đặt
            </Typography>
            <button onClick={onClose} className="close-button">
              <HiX size={24} />
            </button>
          </div>

          {error && (
            <div className="error-message">
              <Typography variant="body1">{error}</Typography>
            </div>
          )}

          <List>
            {currentRooms.length === 0 ? (
              <ListItem>
                <ListItemText primary="Bạn chưa có đặt phòng nào hoàn tất." />
              </ListItem>
            ) : (
              currentRooms.map((booking) => (
                <div
                  key={booking._id}
                  className="hotel-item animate__animated animate__fadeInUp"
                  onClick={() => handleRoomClick(booking.room.hotel._id)}
                >
                  <Grid container spacing={2} alignItems="center">
                    {/* Hình ảnh khách sạn */}
                    <Grid item xs={4} sm={3}>
                      <img
                        src={booking.room.hotel.imagehotel[0]}
                        alt={booking.room.hotel.name}
                        className="hotel-image"
                      />
                    </Grid>

                    {/* Thông tin khách sạn */}
                    <Grid item xs={8} sm={9}>
                      <div className="hotel-info">
                        <Typography variant="h6">{booking.room.hotel.name}</Typography>
                        <Typography variant="body2" className="price">
                          {booking.priceBooking.toLocaleString()} VND
                        </Typography>
                      </div>
                    </Grid>
                  </Grid>
                  <hr />
                </div>
              ))
            )}
          </List>

          {/* Phân trang */}
          {roomsData.length > roomsPerPage && (
            <div className="pagination-container">
              <Pagination
                count={Math.ceil(roomsData.length / roomsPerPage)}
                page={currentPage}
                onChange={paginate}
                color="primary"
              />
            </div>
          )}
        </div>
      </Drawer>
    </motion.div>
  );
};

export default BookingCard;
