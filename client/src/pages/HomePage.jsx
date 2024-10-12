// HomePage.jsx
import React from "react";
import "../assets/css/HomePage.css";
import HeroSection from "../components/HomePage/HomeNavbar";
import ImageHome from "../components/HomePage/imagehome";
import SearchPlaces from "../components/HomePage/SearchPlaces";
import PopularDestinations from "../components/HomePage/PopularDestinations";
import TravelCards from "../components/HomePage/Tophotel";
import Mostpopularguests from "../components/HomePage/Mostpopularguests";
import Endow from "../components/HomePage/endow";
import Footer from "../components/HomePage/Footer";

function HomePage() {
  return (
    <div className="homepage">
      <HeroSection />
      <ImageHome />
      <SearchPlaces />
      <PopularDestinations />
      <TravelCards />
      <Mostpopularguests />
      <Endow />
      <Footer />
    </div>
  );
}

export default HomePage;
