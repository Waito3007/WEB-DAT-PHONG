import React, { useEffect, useState } from "react";
import { Box, Tabs, Tab } from "@mui/material"; // Nhập các thành phần từ Material-UI
import AccountInfo from "./AccountInfo"; // Nhập AccountInfo từ file tương ứng
import BookingHotel from "./BookingHotel"; // Nhập BookingHotel từ file tương ứng
import axios from "axios";

const TabComponent = () => {
  const [user, setUser] = useState(null); // Khởi tạo state user
  const [value, setValue] = useState(0); // Khởi tạo state cho tab

  const handleChange = (event, newValue) => {
    setValue(newValue); // Cập nhật state value khi tab thay đổi
  };

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await axios.get("/api/profile/me");
        setUser(response.data); // Cập nhật user với dữ liệu từ API
      } catch (error) {
        console.error("Error fetching user:", error);
      }
    };

    fetchUser();
  }, []);

  return (
    <Box>
      <Tabs
        value={value}
        onChange={handleChange}
        aria-label="simple tabs example"
        centered
      >
        <Tab label="Tài khoản" />
        <Tab label="Lịch sử" />
        <Tab label="Phương thức thanh toán" />
      </Tabs>
      <Box mt={2}>
        {value === 0 && user && <AccountInfo user={user} />}
        {value === 1 && <BookingHotel />}
        {value === 2 && <div>Phương thức thanh toán content</div>}
      </Box>
    </Box>
  );
};

export default TabComponent;
