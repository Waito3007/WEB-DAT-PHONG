import React, { useState } from "react";
import axios from "axios";
import { Modal, Rate, Button, message, Input } from "antd";

const { TextArea } = Input;

const RatingComponent = ({ hotelId, onClose }) => {
  const [rating, setRating] = useState(0); // Lưu rating của người dùng
  const [comment, setComment] = useState(""); // Lưu nhận xét của người dùng
  const [isSubmitting, setIsSubmitting] = useState(false); // Trạng thái gửi đánh giá

  // Hàm gửi đánh giá đến API
  const submitRating = async () => {
    if (rating === 0) {
      message.error("Vui lòng chọn mức đánh giá.");
      return;
    }

    console.log("Submitting Rating...");
    console.log("Hotel ID:", hotelId);  // Log hotelId
    const userId = localStorage.getItem("userId");
    console.log("User ID:", userId); // Log userId, giả sử userId lưu trong localStorage

    // Kiểm tra hotelId và userId
    if (!hotelId) {
      message.error("Thông tin khách sạn không đầy đủ để gửi đánh giá.");
      return;
    }
    if (!userId) {
      message.error("Bạn chưa đăng nhập. Vui lòng đăng nhập để gửi đánh giá.");
      return;
    }

    setIsSubmitting(true); // Bật trạng thái đang gửi
    try {
      // Gọi API để gửi rating và comment
      const response = await axios.post(
        `/api/rating/${hotelId}`,
        { rating, comment } // Dữ liệu gửi đi (không có bookingId)
      );

      if (response.status === 201) {
        message.success("Đánh giá của bạn đã được gửi!");
        onClose(); // Đóng modal sau khi gửi thành công
      } else {
        message.error(response.data.msg || "Đã xảy ra lỗi khi gửi đánh giá.");
      }
    } catch (error) {
      console.error("API Error:", error);  // Log lỗi nếu có
      message.error("Lỗi kết nối. Vui lòng thử lại.");
    } finally {
      setIsSubmitting(false); // Tắt trạng thái gửi
    }
  };

  return (
    <Modal
      title="Đánh giá khách sạn"
      visible={true}
      onCancel={onClose}
      footer={null} // Không hiển thị nút mặc định
    >
      <div className="flex flex-col items-center">
        <h3 className="text-lg font-semibold mb-4">Đánh giá khách sạn</h3>
        
        {/* Chọn đánh giá sao */}
        <Rate
          onChange={(value) => setRating(value)} // Cập nhật rating khi người dùng chọn
          value={rating}
          style={{ fontSize: "24px", marginBottom: "20px" }}
        />

        {/* Nhập nhận xét */}
        <TextArea
          rows={4}
          value={comment}
          onChange={(e) => setComment(e.target.value)} // Cập nhật nhận xét khi người dùng nhập
          placeholder="Nhập nhận xét của bạn..."
          style={{ marginBottom: "20px", width: "100%" }}
        />

        <div className="flex justify-center space-x-4">
          <Button onClick={onClose} disabled={isSubmitting}>
            Hủy
          </Button>
          <Button
            type="primary"
            onClick={submitRating}
            loading={isSubmitting}
            disabled={isSubmitting}
          >
            Gửi Đánh Giá
          </Button>
        </div>
      </div>
    </Modal>
  );
};

export default RatingComponent;
