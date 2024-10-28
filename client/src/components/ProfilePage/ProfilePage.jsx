import '../../assets/css/ProfilePage.css'; // Đường dẫn chính xác đến tệp CSS
import React, { useState } from 'react';
import Header from '../ProfilePage/Header';
import Footer from '../ProfilePage/Footer';
import AccountTabs from '../ProfilePage/AccountTabs';
import AccountInfo from '../ProfilePage/AccountInfo';

const ProfilePage = () => {
  const [activeTab, setActiveTab] = useState('Tài khoản');

  return (
    <div className="profile-page ">
      <Header />
      <div className="flex-grow p-8">
        <div className="mx-auto">
          <div className="bg-gray-100 p-4 rounded-lg">

            <div className="room-container">
              <img src="phong1.png" alt="Ảnh phòng nền" className="background-image" />
              <img src="avta.png" alt="Ảnh đại diện" className="profile-image" />
            </div>

          </div>
          <button className="mt-4 mx-auto block bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-700 transition" style={{marginTop:'30px'}}>
            Tải lên ảnh mới
          </button>
        </div>
        <AccountTabs activeTab={activeTab} setActiveTab={setActiveTab} />
        {activeTab === 'Tài khoản' && <AccountInfo />}
        {/* Điều kiện để hiển thị nội dung tab khác nếu cần */}
      </div>
      <Footer />
    </div>
  );
};

export default ProfilePage;
