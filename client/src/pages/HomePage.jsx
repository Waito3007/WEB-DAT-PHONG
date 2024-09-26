// HomePage.jsx
import React from "react";
import "./HomePage.css";
import HeroSection from "../components/common/HeroSection";
import SearchFlights from "../components/common/SearchFlights";
import PopularDestinations from "../components/common/PopularDestinations";
import ReviewsSection from "../components/common/ReviewsSection";
import Footer from "../components/common/Footer";

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
