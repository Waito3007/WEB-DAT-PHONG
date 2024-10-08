// HomePage.jsx
import React from "react";
import "../assets/css/HomePage.css";
import HeroSection from "../components/HomePage/HomeNavbar";
import ImageHome from "../components/HomePage/ImageHome";
import SearchPlaces from "../components/HomePage/SearchPlaces";
import PopularDestinations from "../components/HomePage/PopularDestinations";
import TravelCards from "../components/HomePage/TravelCards";
import ReviewsSection from "../components/HomePage/ReviewsSection";
import Footer from "../components/HomePage/Footer";

function HomePage() {
  return (
    <div className="homepage">
      <HeroSection />
      <ImageHome />
      <SearchPlaces />
      <PopularDestinations />
      <TravelCards />
      <ReviewsSection />
      <Footer />
    </div>
  );
}

export default HomePage;
