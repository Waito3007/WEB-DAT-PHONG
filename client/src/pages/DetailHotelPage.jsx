// HomePage.jsx
import React from "react";
import "../assets/css/HomePage.css";
import HeroSection from "../components/HomePage/HomeNavbar";
import OrderRoom from "../components/DetailHotel/Orderroom";
import HotelImage from "../components/DetailHotel/HotelImage";
import Introduction from "../components/DetailHotel/Introduction";
import Amenities from "../components/DetailHotel/Amenities";
import Review from "../components/DetailHotel/Review.jsx";
import Footer from "../components/HomePage/Footer";

function DetailHotelPage() {
  return (
    <div className="DetailHotelPage">
      <HeroSection />
      <OrderRoom />
      <HotelImage />
      <Introduction />
      <Amenities />
      <Review />
      <Footer />
    </div>
  );
}

export default DetailHotelPage;
