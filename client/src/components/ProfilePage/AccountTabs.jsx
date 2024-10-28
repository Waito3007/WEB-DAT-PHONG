import React from 'react';

const AccountTabs = ({ activeTab, setActiveTab }) => (
<div className="profile-tabs flex justify-center border-b-2 mt-5" style={{color:"black",    borderColor: "black",     marginTop: "90px"}}>
  <div className="profile-tab font-semibold cursor-pointer px-4 py-2 hover:bg-gray-100 hover:text-blue-600">Tài khoản</div>
  <div className="profile-tab font-semibold cursor-pointer px-4 py-2 hover:bg-gray-100 hover:text-blue-600">Lịch sử</div>
  <div className="profile-tab font-semibold cursor-pointer px-4 py-2 hover:bg-gray-100 hover:text-blue-600">Phương thức thanh toán</div>
</div>

);
export default AccountTabs;
