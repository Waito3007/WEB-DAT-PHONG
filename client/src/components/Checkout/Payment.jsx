import React, { useState, useEffect } from "react";
import axios from "axios";
import { notification } from "antd";
import { useNavigate } from "react-router-dom";
import { Modal, Button } from "@mui/material";

const Payment = ({
  roomDetails,
  checkInDate,
  checkOutDate,
  email,
  phone,
  totalPrice,
}) => {
  const [userId, setUserId] = useState(null);
  const [modalOpen, setModalOpen] = useState(false); // Trạng thái của modal
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserId = async () => {
      try {
        const response = await axios.get("/api/profile/me", {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });
        setUserId(response.data._id);
      } catch (error) {
        console.error("Lỗi lấy thông tin người dùng:", error);
        navigate("/login");
      }
    };

    fetchUserId();
  }, [navigate]);

  const handlePaymentMethod = async (method) => {
    if (!checkInDate || !checkOutDate || !email || !phone) {
      notification.info({
        message: "Thiếu Thông Tin Đặt Phòng",
        description: "Vui lòng nhập đủ thông tin.",
      });
      return;
    }

    try {
      if (method === "Momo") {
        const response = await axios.post("/api/checkout/payment", {
          amount: totalPrice, // Giá tiền tổng
          checkInDate,
          checkOutDate,
          phoneBooking: phone,
          emailBooking: email,
          userId: userId || undefined,
          roomId: roomDetails._id, // ID phòng
        });

        window.location.href = response.data.payUrl; // Redirect tới URL thanh toán Momo
      } else if (method === "TrucTiep") {
        const orderId = "TIENMAT" + Math.random().toString(36).substring(2, 15); // Tạo orderId ngẫu nhiên cho thanh toán tiền mặt

        const response = await axios.post("/api/checkout/confirm", {
          userId: userId || undefined,
          roomId: roomDetails._id,
          checkInDate,
          checkOutDate,
          phoneBooking: phone,
          emailBooking: email,
          paymentStatus: "Pending",
          orderId: orderId,
          priceBooking: totalPrice,
        });

        alert("Đặt phòng thành công! Mã đơn hàng: " + orderId); // Hiển thị mã đơn hàng
        setModalOpen(false); // Đóng modal
        navigate("/myprofile");
      }
    } catch (error) {
      console.error("Lỗi khi thanh toán:", error);
      alert("Có lỗi xảy ra khi thanh toán. Vui lòng thử lại!");
    }
  };

  return (
    <div className="payment bg-white p-4 mt-4 rounded-lg shadow-md">
      <button
        onClick={() => setModalOpen(true)} // Mở modal
        className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 transition"
      >
        Thanh Toán
      </button>

      {/* Modal để chọn phương thức thanh toán */}
      <Modal
        open={modalOpen}
        onClose={() => setModalOpen(false)} // Đóng modal khi thoát
      >
        <div className="modal-content p-4 bg-white rounded shadow-lg w-1/3 mx-auto mt-20">
          <h2 className="text-center mb-4">Chọn phương thức thanh toán</h2>
          <div className="flex justify-around">
            <Button
              variant="contained"
              color="primary"
              onClick={() => handlePaymentMethod("Momo")}
            >
              Thanh toán qua Momo
            </Button>
            <Button
              variant="contained"
              color="secondary"
              onClick={() => handlePaymentMethod("TrucTiep")}
            >
              Thanh toán trực tiếp
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default Payment;
