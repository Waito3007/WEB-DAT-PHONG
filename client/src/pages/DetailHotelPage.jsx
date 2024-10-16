
import React from "react";
import "../assets/css/HomePage.css";
import HeroSection from "../components/HomePage/HomeNavbar";
import OrderRoom from "../components/DetailHotel/Orderroom";
import HotelImage from "../components/DetailHotel/HotelImage";
import Footer from "../components/HomePage/Footer";
function DetailHotelPage() {
  return (
    <div className="DetailHotelPage">
      <HeroSection />
      <OrderRoom />
      {/* <HotelImage /> */}
      <Footer />
    </div>
  );
}

export default DetailHotelPage;
