
import React from "react";
import "../assets/css/HomePage.css";
import HeroSection from "../components/HomePage/HomeNavbar";
import OrderRoom from "../components/DetailHotel/Orderroom";
import Footer from "../components/HomePage/Footer";
function DetailRoomPage() {
  return (
    <div className="DetailRoomPage">
      <HeroSection />
      <DetailRoom  />
      <Footer />
    </div>
  );
}

export default DetailRoomPage;
