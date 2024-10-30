import React from "react";

const AccountInfo = ({ user }) => {
  return (
    <div className="mt-8 p-6 bg-white rounded shadow-md">
      <h2 className="text-2xl font-bold mb-4 text-black">Tài khoản</h2>
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <div>
            <p className="text-black">Name</p>
            <p className="font-semibold text-black">{user.name}</p>
          </div>
          <button className="text-black border border-black px-4 py-2 rounded transition duration-200 hover:bg-gray-200">
            Thay đổi
          </button>
        </div>
        <div className="flex justify-between items-center">
          <div>
            <p className="text-black">Email</p>
            <p className="font-semibold text-black">{user.email}</p>
          </div>
          <div>
            <button className="text-black border border-black px-4 py-2 rounded transition duration-200 hover:bg-gray-200">
              Thêm một email khác
            </button>
            <button className="text-black border border-black px-4 py-2 ml-2 rounded transition duration-200 hover:bg-gray-200">
              Thay đổi
            </button>
          </div>
        </div>
        <div className="flex justify-between items-center">
          <div>
            <p className="text-black">Password</p>
            <p className="font-semibold text-black">**********</p>
          </div>
          <button className="text-black border border-black px-4 py-2 rounded transition duration-200 hover:bg-gray-200">
            Thay đổi
          </button>
        </div>
        <div className="flex justify-between items-center">
          <div>
            <p className="text-black">Phone number</p>
            <p className="font-semibold text-black">{user.phoneNumber}</p>
          </div>
          <button className="text-black border border-black px-4 py-2 rounded transition duration-200 hover:bg-gray-200">
            Thay đổi
          </button>
        </div>
        <div className="flex justify-between items-center">
          <div>
            <p className="text-black">Address</p>
            <p className="font-semibold text-black">{user.address}</p>
          </div>
          <button className="text-black border border-black px-4 py-2 rounded transition duration-200 hover:bg-gray-200">
            Thay đổi
          </button>
        </div>
        <div className="flex justify-between items-center">
          <div>
            <p className="text-black">Date of birth</p>
            <p className="font-semibold text-black">
              {new Date(user.dateOfBirth).toLocaleDateString()}
            </p>
          </div>
          <button className="text-black border border-black px-4 py-2 rounded transition duration-200 hover:bg-gray-200">
            Thay đổi
          </button>
        </div>
      </div>
    </div>
  );
};

export default AccountInfo;
