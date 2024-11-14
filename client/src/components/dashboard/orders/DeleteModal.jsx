import React from "react";
import { Modal, notification } from "antd"; // Assuming you're using Ant Design for modals
import axios from "axios";

const DeleteModal = ({ isVisible, onCancel, booking, onDelete }) => {
  const handleDelete = () => {
    // Call the API to delete the booking
    axios
      .delete(`/api/booking/${booking._id}`)
      .then(() => {
        // After deletion, call the onDelete function to refresh the bookings list
        onDelete();
        onCancel(); // Close the modal after deletion
        notification.success({
          message: "Xoá thành công",
          description: "Bạn đã xoá thông tin đặt phòng thành công",
        });
      })
      .catch((error) => {
        console.error("Error deleting booking:", error);
        notification.error({
          message: "Lỗi khi xoá đặt phòng",
          description: "Có lỗi xảy ra khi xoá thông tin, vui lòng thử lại sau",
        });
      });
  };

  return (
    <Modal
      title="Xóa đặt phòng"
      visible={isVisible}
      onCancel={onCancel}
      onOk={handleDelete}
      okText="Xóa"
      cancelText="Hủy"
      centered
      okButtonProps={{
        danger: true, // Make the delete button red
      }}
    >
      <p>Bạn có chắc chắn muốn xóa đặt phòng này?</p>
      <p>
        <strong>{booking && booking.user.name}</strong>
      </p>
      <p>
        <strong>{booking && booking.orderId}</strong>
      </p>
    </Modal>
  );
};

export default DeleteModal;
