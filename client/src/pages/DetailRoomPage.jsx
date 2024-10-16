
import React from "react";
import "../assets/css/style.css";
import HeroSection from "../components/HomePage/HomeNavbar";
import DetailRoom from "../components/DetailRoom/DetailRoom";
import Footer from "../components/HomePage/Footer";
function DetailRoomPage() {
  return (
    <div className="DetailRoomPage">
      <HeroSection />
      <Footer />
    </div>
  );
}

export default DetailRoomPage;
