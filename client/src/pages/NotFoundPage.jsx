import React from 'react';
import { Link } from 'react-router-dom'; // Đảm bảo đã cài đặt react-router-dom

const NotFoundPage = () => {
  return (
    <div className="absolute inset-0 flex items-center justify-center bg-white"> {/* Sử dụng absolute và inset-0 để kéo đầy khung hình */}
      <div className="text-center">
        <img
          src="404notfound.jpg" // Thay bằng URL của hình ảnh bạn muốn sử dụng
          alt="Not Found"
          className="mb-8"
        />
        <h1 className="text-4xl font-bold text-red-600 mb-4">404 Not Found</h1>
        <p className="text-lg text-gray-700 mb-6">
          The page you are looking for does not exist.
        </p>
        <Link to="/" className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition">
          Go Back Home
        </Link>
      </div>
    </div>
  );
};

export default NotFoundPage;
