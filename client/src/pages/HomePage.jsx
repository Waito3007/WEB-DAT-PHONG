// HomePage.jsx
import React from "react";
import "../assets/css/HomePage.css";
import HeroSection from "../components/HomePage/HomeNavbar";
import SearchFlights from "../components/HomePage/SearchFlights";
import PopularDestinations from "../components/HomePage/PopularDestinations";
import ReviewsSection from "../components/HomePage/ReviewsSection";
import Footer from "../components/HomePage/Footer";

function HomePage() {
  return (
    <div className="homepage">
      <HeroSection />
      <SearchFlights />
      <PopularDestinations />
      <ReviewsSection />
      <Footer />
    </div>
  );
}

export default HomePage;
