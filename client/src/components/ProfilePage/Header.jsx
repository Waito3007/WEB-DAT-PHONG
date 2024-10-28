import React from 'react';

const Header = () => (
      <header className="profile-header">
        <h1 className="text-2xl font-bold">staynight</h1>
        <div  style={{padding:'10px'   , display:'flex'}}>
          <button className="text-white mx-2">🤍 Yêu thích</button>
          <div className="flex items-center">
    <img src="avta.png" alt="User" className="w-6 h-6"  style={{ width: "50px",height: "50px"   }}  />
    <span className="mx-2">Người dùng</span>
</div>

        </div>
      </header>
);

export default Header;
