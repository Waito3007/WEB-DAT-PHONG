import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import "../assets/css/style.css";
import HeroSection from "../components/HomePage/HomeNavbar";
import OrderRoom from "../components/DetailHotel/Orderroom";
import HotelImage from "../components/DetailHotel/HotelImage";
import Footer from "../components/HomePage/Footer";

function DetailHotelPage() {
  const [loading, setLoading] = useState(true);

  // Giả lập thời gian tải (bạn có thể thay đổi hoặc loại bỏ)
  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 2000); // Thay đổi thời gian tải theo nhu cầu

    return () => clearTimeout(timer);
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="text-2xl">Đang tải...</h1>
        </motion.div>
      </div>
    );
  }

  return (
    <motion.div
      className="DetailHotelPage"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 1 }}
    >
      <HeroSection />
      <OrderRoom />
      <HotelImage />
      <Footer />
    </motion.div>
  );
}

export default DetailHotelPage;
