import React from "react";
import "../assets/css/HomePage.css";
import HeroSection from "../components/HomePage/HomeNavbar";
import SearchHotel from "../components/SearchPage/SearchHotel";
import HotelList from "../components/SearchPage/HotelList";
import Footer from "../components/HomePage/Footer";

function SearchPage() {
  return (
    <div className="searchpage">
      <HeroSection />
      <SearchHotel />
      <HotelList />
      <Footer />
    </div>
  );
}

export default SearchPage;
