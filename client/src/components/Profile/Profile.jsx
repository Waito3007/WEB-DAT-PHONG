import React, { useEffect, useState } from "react";
import axios from "axios";
import Avatar from "./Avatar";
import CoverImage from "./CoverImage";
import TabComponent from "./TabComponent";
import HeroSection from "../HomePage/HomeNavbar";
import Footer from "../HomePage/Footer";

const Profile = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const response = await axios.get("/api/profile/me", {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });
        setUser(response.data);
      } catch (error) {
        console.error("Lỗi khi lấy thông tin hồ sơ:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserProfile();
  }, []);

  if (loading) {
    return <div>Đang tải...</div>;
  }

  return (
    <div>
      <HeroSection />
      <CoverImage />
      {user && (
        <div className="flex justify-center">
          <Avatar name={user.name} email={user.email} />
        </div>
      )}
      {user && <TabComponent user={user} />}

      <Footer />
    </div>
  );
};

export default Profile;
