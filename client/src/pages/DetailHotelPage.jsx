import React from "react";
import { motion } from "framer-motion";
import "../assets/css/style.css";
import HeroSection from "../components/HomePage/HomeNavbar";
import OrderRoom from "../components/DetailHotel/Orderroom";
import HotelImage from "../components/DetailHotel/HotelImage";
import Footer from "../components/HomePage/Footer";
import Introduce from "../components/DetailHotel/Introduce";
import RatingCard from "../components/DetailHotel/RatingCard";
function DetailHotelPage() {
  return (
    <>
      <HeroSection />
      <motion.div
        className="DetailHotelPage px-4 md:px-11 lg:px-36" // Thêm padding ngang
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1 }}
      >
        <OrderRoom />
        <HotelImage />
        <Introduce />
        <RatingCard />
      </motion.div>
      <Footer />
    </>
  );
}

export default DetailHotelPage;
