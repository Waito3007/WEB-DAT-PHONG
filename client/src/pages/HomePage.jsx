import React from "react";
import "../assets/css/HomePage.css";
import HeroSection from "../components/HomePage/HomeNavbar";
import SearchPlaces from "../components/HomePage/SearchPlaces";
import PopularDestinations from "../components/HomePage/PopularDestinations";
import TravelCards from "../components/HomePage/TravelCards";
import ReviewsSection from "../components/HomePage/ReviewsSection";
import Footer from "../components/HomePage/Footer";
import HotelPage from "../components/HomePage/HotelPage"; // Nhập đúng file HotelCard

function HomePage({ hotels }) {
  return (
    <div className="homepage">
      <HeroSection />
      <SearchPlaces />
      <PopularDestinations />
      <HotelPage/>
      <TravelCards />
      <ReviewsSection />
      <Footer />
    </div>
  );
}

export default HomePage;
