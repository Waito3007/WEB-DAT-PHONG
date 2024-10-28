import React from "react";
import { motion } from "framer-motion";
import "../assets/css/style.css";
import HeroSection from "../components/HomePage/HomeNavbar";
import DetailRoom from "../components/DetailRoom/DetailRoom";
import Footer from "../components/HomePage/Footer";

function DetailRoomPage() {
  return (
    <motion.div
      className="DetailRoomPage"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 1 }}
    >
      <HeroSection />
      <DetailRoom />
      <Footer />
    </motion.div>
  );
}

export default DetailRoomPage;
