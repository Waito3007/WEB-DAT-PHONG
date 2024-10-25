import React from "react";
import { motion } from "framer-motion";
import "../assets/css/style.css";
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
    <motion.div
      className="homepage"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 1 }}
    >
      <HeroSection />
      <ImageHome />
      <SearchPlaces />
      <PopularDestinations />
      <TravelCards />
      <Mostpopularguests />
      <Endow />
      <Footer />
    </motion.div>
  );
}

export default HomePage;
