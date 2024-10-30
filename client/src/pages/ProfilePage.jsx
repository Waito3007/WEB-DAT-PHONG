import React, { useEffect, useState } from "react";
import "../assets/css/Profile.css";
import HeroSection from "../components/HomePage/HomeNavbar";
import CoverImage from "../components/Profile/CoverImage";
import Avatar from "../components/Profile/Avatar";
import TabComponent from "../components/Profile/TabComponent";
import Footer from "../components/HomePage/Footer";
import axios from "axios";

function ProfilePage() {
<<<<<<< HEAD
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
=======
  const [user, setUser] = useState(null); // State để lưu dữ liệu người dùng
>>>>>>> origin/huy

  useEffect(() => {
    const fetchUserData = async () => {
      try {
<<<<<<< HEAD
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
=======
        const response = await axios.get("/api/profile/me"); // Gửi yêu cầu lấy dữ liệu người dùng
        setUser(response.data); // Cập nhật state với dữ liệu người dùng
      } catch (error) {
        console.error("Error fetching user data:", error);
>>>>>>> origin/huy
      }
    };

    fetchUserData();
  }, []);

<<<<<<< HEAD
  if (loading) {
    return <div>Đang tải...</div>;
  }

=======
>>>>>>> origin/huy
  return (
    <div className="ProfilePage">
      <HeroSection />
      <CoverImage />
<<<<<<< HEAD
      {user && (
        <>
          <Avatar name={user.name} email={user.email} />
          <TabComponent user={user} />
=======
      {user && ( // Kiểm tra nếu có dữ liệu người dùng
        <>
          <Avatar name={user.name} email={user.email} />{" "}
          {/* Truyền dữ liệu người dùng cho Avatar */}
          <TabComponent user={user} />{" "}
          {/* Truyền dữ liệu người dùng cho TabComponent */}
>>>>>>> origin/huy
        </>
      )}
      <Footer />
    </div>
  );
}
<<<<<<< HEAD

=======
>>>>>>> origin/huy
export default ProfilePage;
