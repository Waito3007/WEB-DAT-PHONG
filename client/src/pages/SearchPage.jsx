import React, { useState } from "react";
import "../assets/css/style.css";
import HeroSection from "../components/HomePage/HomeNavbar";
import SearchHotel from "../components/SearchPage/SearchHotel";
import HotelList from "../components/SearchPage/HotelList";
import Filter from "../components/SearchPage/Filter";
import Footer from "../components/HomePage/Footer";
function SearchPage() {
  const [hotels, setHotels] = useState([]); // State để lưu danh sách khách sạn
  const [filteredHotels, setFilteredHotels] = useState([]); // State để lưu danh sách khách sạn đã lọc

  return (
    <div className="searchpage">
      <HeroSection />
      <SearchHotel setFilteredHotels={setFilteredHotels} setHotels={setHotels} hotels={hotels}/>
      <div className="flex mx-7">
        <div className="basis-5/12 sticky top-0">
          <Filter/>
        </div>
        <HotelList hotels={filteredHotels} />      
      </div>
      <Footer />
    </div>
  );
}

export default SearchPage;
