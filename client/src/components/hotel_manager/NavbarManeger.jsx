import React from 'react';
import { Link } from 'react-router-dom';

const Navbar = () => {
  return (
    <nav className="bg-gray-800 p-4">
      <ul className="flex space-x-4">
        <li>
          <Link to="/add-hotel" className="text-white">Thêm Khách Sạn</Link>
        </li>
        <li>
          <Link to="/add-room" className="text-white">Thêm Phòng</Link>
        </li>
        <li>
          <Link to="/hotel-rooms" className="text-white">Danh Sách Phòng</Link>
        </li>
        <li>
          <Link to="/my-hotel" className="text-white">Khách Sạn Của Tôi</Link>
        </li>
      </ul>
    </nav>
  );
};

export default Navbar;
