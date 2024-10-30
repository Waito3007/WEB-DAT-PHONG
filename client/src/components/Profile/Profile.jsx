import React, { useEffect, useState } from "react";
import axios from "axios";
import Avatar from "./Avatar";
<<<<<<< HEAD
import CoverImage from "./CoverImage";
import TabComponent from "./TabComponent";
import HeroSection from "../HomePage/HomeNavbar";
import Footer from "../HomePage/Footer";
=======
import AccountInfo from "./AccountInfo";
import CoverImage from "./CoverImage";
import TabComponent from "./TabComponent";
>>>>>>> origin/huy

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
<<<<<<< HEAD
        console.error("Lỗi khi lấy thông tin hồ sơ:", error);
=======
        console.error("Error fetching user profile:", error);
>>>>>>> origin/huy
      } finally {
        setLoading(false);
      }
    };

    fetchUserProfile();
  }, []);

  if (loading) {
<<<<<<< HEAD
    return <div>Đang tải...</div>;
=======
    return <div>Loading...</div>;
>>>>>>> origin/huy
  }

  return (
    <div>
<<<<<<< HEAD
      <HeroSection />
=======
>>>>>>> origin/huy
      <CoverImage />
      {user && (
        <div className="flex justify-center">
          <Avatar name={user.name} email={user.email} />
        </div>
      )}
      {user && <TabComponent user={user} />}
<<<<<<< HEAD
      <Footer />
=======
>>>>>>> origin/huy
    </div>
  );
};

export default Profile;
