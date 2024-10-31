import React from "react";

const Avatar = ({ name, email }) => {
  return (
    <div className="relative flex flex-col items-center">
      <div className="w-32 h-32 rounded-full border-4 border-white overflow-hidden">
        <img
          src="logo512.png" // Thay bằng URL ảnh đại diện thực tế
          alt="Avatar"
          className="w-full h-full object-cover"
        />
      </div>
      <button className="bg-red-500 p-2 rounded-full">
        <i className="fas fa-pencil-alt text-black"></i>
      </button>
      <div className="text-center mt-2 text-black">
        <h2 className="text-xl font-semibold">{name}</h2>
        <p className="text-gray-500">{email}</p>
      </div>
    </div>
  );
};
export default Avatar;
