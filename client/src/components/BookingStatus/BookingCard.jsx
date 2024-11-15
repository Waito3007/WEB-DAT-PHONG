import React, { useState, useEffect } from 'react';
import { Drawer, List, ListItem, ListItemText, Grid, Typography, Pagination, Button } from '@mui/material';
import { HiX } from 'react-icons/hi';
import axios from 'axios';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import 'animate.css';
import RatingDrawer from './RatingDrawer'; // Import RatingDrawer

const BookingCard = ({ open, onClose }) => {
  const [roomsData, setRoomsData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [ratingDrawerOpen, setRatingDrawerOpen] = useState(false); // Quản lý trạng thái RatingDrawer
  const [selectedHotel, setSelectedHotel] = useState(null); // Lưu khách sạn được chọn
  const roomsPerPage = 4;

  const navigate = useNavigate();

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
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      });
      const filteredRooms = response.data.filter(
        (booking) => booking.paymentStatus === 'Done'
      );
      setRoomsData(filteredRooms);
    } catch (err) {
      setError('Lỗi khi tải dữ liệu đặt phòng.');
    } finally {
      setLoading(false);
    }
  };

  const handleRoomClick = (hotelId) => {
    navigate(`/detailhotel/${hotelId}`);
  };

  const handleOpenRatingDrawer = (hotel) => {
    setSelectedHotel(hotel);
    setRatingDrawerOpen(true);
  };

  const handleCloseRatingDrawer = () => {
    setRatingDrawerOpen(false);
    setSelectedHotel(null);
  };

  const indexOfLastRoom = currentPage * roomsPerPage;
  const indexOfFirstRoom = indexOfLastRoom - roomsPerPage;
  const currentRooms = roomsData.slice(indexOfFirstRoom, indexOfLastRoom);

  const paginate = (event, pageNumber) => {
    setCurrentPage(pageNumber);
  };

  return (
    <>
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
                Lịch sử bạn đã đặt
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
                      <Grid item xs={4} sm={3}>
                        <img
                          src={booking.room.hotel.imagehotel[0]}
                          alt={booking.room.hotel.name}
                          className="hotel-image"
                        />
                      </Grid>

                      <Grid item xs={8} sm={6}>
                        <div className="hotel-info">
                          <Typography variant="h6">{booking.room.hotel.name}</Typography>
                          <Typography variant="body2" className="price">
                            {booking.priceBooking.toLocaleString()} VND
                          </Typography>
                        </div>
                      </Grid>

                      <Grid item xs={12} sm={3}>
                        <Button
                          variant="outlined"
                          color="primary"
                          onClick={(e) => {
                            e.stopPropagation(); // Ngăn chặn sự kiện click lan ra ngoài
                            handleOpenRatingDrawer(booking.room.hotel);
                          }}
                        >
                          Đánh giá
                        </Button>
                      </Grid>
                    </Grid>
                    <hr />
                  </div>
                ))
              )}
            </List>

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

      {/* Drawer Đánh giá */}
      {selectedHotel && (
        <RatingDrawer
          open={ratingDrawerOpen}
          onClose={handleCloseRatingDrawer}
          hotel={selectedHotel}
        />
      )}
    </>
  );
};

export default BookingCard;
