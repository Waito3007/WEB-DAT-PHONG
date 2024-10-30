import React, { useEffect, useState } from "react";
import axios from "axios";
import Avatar from "./Avatar";
import AccountInfo from "./AccountInfo";
import CoverImage from "./CoverImage";
import TabComponent from "./TabComponent";

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
        console.error("Error fetching user profile:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserProfile();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <CoverImage />
      {user && (
        <div className="flex justify-center">
          <Avatar name={user.name} email={user.email} />
        </div>
      )}
      {user && <TabComponent user={user} />}
    </div>
  );
};

export default Profile;
