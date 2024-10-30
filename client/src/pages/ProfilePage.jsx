import React, { useEffect, useState } from "react";
import "../assets/css/Profile.css";
import HeroSection from "../components/HomePage/HomeNavbar";
import CoverImage from "../components/Profile/CoverImage";
import Avatar from "../components/Profile/Avatar";
import TabComponent from "../components/Profile/TabComponent";
import Footer from "../components/HomePage/Footer";
import axios from "axios";

function ProfilePage() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await axios.get("/api/profile/me", {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`, // Nếu cần
          },
        });
        setUser(response.data);
      } catch (error) {
        console.error("Lỗi khi lấy thông tin người dùng:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, []);

  if (loading) {
    return <div>Đang tải...</div>;
  }

  return (
    <div className="ProfilePage">
      <HeroSection />
      <CoverImage />
      {user && (
        <>
          <Avatar name={user.name} email={user.email} />
          <TabComponent user={user} />
        </>
      )}
      <Footer />
    </div>
  );
}

export default ProfilePage;
