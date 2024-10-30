import React, { useEffect, useState } from "react";
import "../assets/css/Profile.css";
import HeroSection from "../components/HomePage/HomeNavbar";
import CoverImage from "../components/Profile/CoverImage";
import Avatar from "../components/Profile/Avatar";
import TabComponent from "../components/Profile/TabComponent";
import Footer from "../components/HomePage/Footer";
import axios from "axios";

function ProfilePage() {
  const [user, setUser] = useState(null); // State để lưu dữ liệu người dùng

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await axios.get("/api/profile/me"); // Gửi yêu cầu lấy dữ liệu người dùng
        setUser(response.data); // Cập nhật state với dữ liệu người dùng
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };

    fetchUserData();
  }, []);

  return (
    <div className="ProfilePage">
      <HeroSection />
      <CoverImage />
      {user && ( // Kiểm tra nếu có dữ liệu người dùng
        <>
          <Avatar name={user.name} email={user.email} />{" "}
          {/* Truyền dữ liệu người dùng cho Avatar */}
          <TabComponent user={user} />{" "}
          {/* Truyền dữ liệu người dùng cho TabComponent */}
        </>
      )}
      <Footer />
    </div>
  );
}
export default ProfilePage;
