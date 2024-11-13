import React, { useState, useEffect } from 'react';
import { Modal, Button, Input, DatePicker, message } from 'antd';
import axios from 'axios';
import moment from 'moment';

const EditBookingModal = ({ booking, onClose, onUpdate }) => {
  const [email, setEmail] = useState(booking.emailBooking || '');
  const [name, setName] = useState(booking.user.name || '');
  const [phone, setPhone] = useState(booking.phoneBooking || '');
  const [checkInDate, setCheckInDate] = useState(moment(booking.checkInDate));
  const [checkOutDate, setCheckOutDate] = useState(moment(booking.checkOutDate));
  const [totalPrice, setTotalPrice] = useState(booking.totalPrice);

  // Tính toán tổng tiền khi thay đổi ngày Check-In hoặc Check-Out
  useEffect(() => {
    if (checkInDate && checkOutDate) {
      const days = checkOutDate.diff(checkInDate, 'days');
      const calculatedTotalPrice = days * booking.room.price;
      setTotalPrice(calculatedTotalPrice);
    }
  }, [checkInDate, checkOutDate, booking.room.price]);

  const handleSave = async () => {
    try {
      const updatedData = {
        user: { email, name },
        phoneBooking: phone,
        checkInDate: checkInDate.toISOString(),
        checkOutDate: checkOutDate.toISOString(),
        totalPrice
      };

      const response = await axios.put(`/${booking._id}/update`, updatedData);
      if (response.status === 200) {
        message.success('Cập nhật thông tin thành công!');
        onUpdate(response.data); // Gọi hàm onUpdate để cập nhật booking trong danh sách
        onClose();
      } else {
        message.error('Failed to update booking');
      }
    } catch (error) {
      
    }
  };

  return (
    <Modal
      title="Chỉnh sửa thông tin đặt phòng"
      visible={true}
      onCancel={onClose}
      footer={[
        <Button key="cancel" onClick={onClose}>
          Hủy
        </Button>,
        <Button key="save" type="primary" onClick={handleSave}>
          Lưu
        </Button>
      ]}
    >
      <div>
        <label>Email:</label>
        <Input value={email} onChange={(e) => setEmail(e.target.value)} />
      </div>
      <div style={{ marginTop: '1rem' }}>
        <label>Số điện thoại:</label>
        <Input value={phone} onChange={(e) => setPhone(e.target.value)} />
      </div>
      <div style={{ marginTop: '1rem' }}>
        <label>Ngày Check-In:</label>
        <DatePicker
          value={checkInDate}
          onChange={(date) => setCheckInDate(date)}
          format="DD-MM-YYYY"
        />
      </div>
      <div style={{ marginTop: '1rem' }}>
        <label>Ngày Check-Out:</label>
        <DatePicker
          value={checkOutDate}
          onChange={(date) => setCheckOutDate(date)}
          format="DD-MM-YYYY"
        />
      </div>
      <div style={{ marginTop: '1rem' }}>
        <label>Tổng tiền:</label>
        <Input value={totalPrice} disabled />
      </div>
    </Modal>
  );
};

export default EditBookingModal;
