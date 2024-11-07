import React, { useState } from "react";
import "../assets/css/style.css";
import HeroSection from "../components/HomePage/HomeNavbar";
import SearchHotel from "../components/SearchPage/SearchHotel";
import HotelList from "../components/SearchPage/HotelList";
import Footer from "../components/HomePage/Footer";
import SearchPlaces from "../components/HomePage/SearchPlaces";
function SearchPage() {
  const [hotels, setHotels] = useState([]); // State để lưu danh sách khách sạn
  const [filteredHotels, setFilteredHotels] = useState([]); // State để lưu danh sách khách sạn đã lọc

  return (
    <div className="searchpage">
      <HeroSection />
      <SearchHotel setFilteredHotels={setFilteredHotels} setHotels={setHotels} hotels={hotels} />
      <HotelList hotels={filteredHotels} />
      <Footer />
    </div>
  );
}

export default SearchPage;
