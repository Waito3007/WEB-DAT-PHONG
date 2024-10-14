// HomePage.jsx
import React from "react";
import "../assets/css/HomePage.css";
import HeroSection from "../components/HomePage/HomeNavbar";
import OrderRoom from "../components/DetailHotel/Orderroom";
import HotelImage from "../components/DetailHotel/HotelImage";

function DetailHotelPage() {
  return (
    <div className="DetailHotelPage">
      <HeroSection />
      <OrderRoom />
      <HotelImage />
    </div>
  );
}

export default DetailHotelPage;
