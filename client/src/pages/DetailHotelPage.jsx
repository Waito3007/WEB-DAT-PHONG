import React from "react";
import { motion } from "framer-motion";
import "../assets/css/style.css";
import HeroSection from "../components/HomePage/HomeNavbar";
import OrderRoom from "../components/DetailHotel/Orderroom";
import HotelImage from "../components/DetailHotel/HotelImage";
import Footer from "../components/HomePage/Footer";

function DetailHotelPage() {
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
