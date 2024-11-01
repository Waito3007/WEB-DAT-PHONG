import React from 'react';
import { motion } from "framer-motion";
import ProfilePage from '../components/account/profilevip';
import Footer from "../components/HomePage/Footer";
import HomeNavbar from "../components/HomePage/HomeNavbar";
const UserProfile = () => {
    return (
        <motion.div
        className="profilepage"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1 }}
      >
        <HomeNavbar />
        <ProfilePage/>

        <Footer />

      </motion.div>
    );
};

export default UserProfile;
