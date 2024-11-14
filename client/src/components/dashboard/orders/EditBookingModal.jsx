import React, { useState, useEffect } from "react";
import { Modal, Input, Button, DatePicker, notification } from "antd";
import moment from "moment";
import axios from "axios"; // Thêm axios vào

const EditBookingModal = ({ visible, booking, onClose, onUpdate }) => {
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [checkInDate, setCheckInDate] = useState(null);
  const [checkOutDate, setCheckOutDate] = useState(null);
  const [totalPrice, setTotalPrice] = useState("");

  const [loading, setLoading] = useState(false);

  // Chạy khi modal mở để thiết lập dữ liệu ban đầu
  useEffect(() => {
    if (visible && booking) {
      setEmail(booking.emailBooking || "");
      setPhone(booking.phoneBooking || "");
      setCheckInDate(booking.checkInDate ? moment(booking.checkInDate) : null);
      setCheckOutDate(
        booking.checkOutDate ? moment(booking.checkOutDate) : null
      );
      setTotalPrice(booking.priceBooking || "");
    }
  }, [visible, booking]);

  // Hàm tính toán tổng tiền dựa trên ngày check-in và check-out
  const calculateTotalPrice = () => {
    if (checkInDate && checkOutDate) {
      const days = checkOutDate.diff(checkInDate, "days");
      // Giả sử giá phòng có sẵn trong booking
      const roomPrice = booking?.room?.price || 100; // Thay bằng giá thực tế
      setTotalPrice(days * roomPrice);
    }
  };

  // Xử lý khi thay đổi ngày check-in hoặc check-out
  const handleDateChange = () => {
    calculateTotalPrice();
  };

  // Lưu thông tin booking sau khi chỉnh sửa
  const handleSave = async () => {
    if (!email || !phone || !checkInDate || !checkOutDate) {
      notification.error({
        message: "Thông tin không hợp lệ",
        description: "Vui lòng điền đầy đủ thông tin",
      });
      return;
    }

    setLoading(true);
    try {
      // Chuẩn bị dữ liệu để gửi lên API
      const updatedBooking = {
        email: email,
        phoneBooking: phone,
        checkInDate: checkInDate.toISOString(),
        checkOutDate: checkOutDate.toISOString(),
        totalPrice: totalPrice,
      };

      // Gửi yêu cầu PUT tới API để cập nhật booking
      const response = await axios.put(
        `/api/booking/${booking._id}/update`,
        updatedBooking
      );
      onUpdate();
      setLoading(false);
      notification.success({
        message: "Cập nhật thành công",
      });
      onClose(); // Đóng modal sau khi lưu thành công
    } catch (error) {
      setLoading(false);
      notification.error({
        message: "Lỗi khi cập nhật",
        description: "Có lỗi xảy ra khi lưu thông tin đặt phòng",
      });
    }
  };

  return (
    <Modal
      title="Chỉnh sửa thông tin đặt phòng"
      visible={visible}
      onCancel={onClose}
      footer={[
        <Button key="cancel" onClick={onClose}>
          Hủy
        </Button>,
        <Button
          key="save"
          type="primary"
          loading={loading}
          onClick={handleSave}
        >
          Lưu
        </Button>,
      ]}
    >
      <div>
        <label>Email:</label>
        <Input value={email} onChange={(e) => setEmail(e.target.value)} />
      </div>
      <div style={{ marginTop: "1rem" }}>
        <label>Số điện thoại:</label>
        <Input value={phone} onChange={(e) => setPhone(e.target.value)} />
      </div>
      <div style={{ marginTop: "1rem" }}>
        <label>Ngày nhận phòng:</label>
        <DatePicker
          value={checkInDate}
          onChange={(date) => {
            setCheckInDate(date);
            handleDateChange();
          }}
          format="DD-MM-YYYY"
        />
      </div>
      <div style={{ marginTop: "1rem" }}>
        <label>Ngày trả phòng:</label>
        <DatePicker
          value={checkOutDate}
          onChange={(date) => {
            setCheckOutDate(date);
            handleDateChange();
          }}
          format="DD-MM-YYYY"
        />
      </div>
      <div style={{ marginTop: "1rem" }}>
        <label>Tổng tiền:</label>
        <Input value={totalPrice} disabled />
      </div>
    </Modal>
  );
};

export default EditBookingModal;
