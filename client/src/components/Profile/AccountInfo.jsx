<<<<<<< HEAD
import React, { useState, useEffect } from "react";
import axios from "axios";

const AccountInfo = ({ user }) => {
  const [isEditing, setIsEditing] = useState({
    name: false,
    email: false,
    phoneNumber: false,
    address: false,
    dateOfBirth: false,
  });

  const [formData, setFormData] = useState({ ...user });
  const [saveError, setSaveError] = useState(null);
  const [saveSuccess, setSaveSuccess] = useState(false);

  useEffect(() => {
    setFormData({ ...user });
    setSaveError(null);
    setSaveSuccess(false);
  }, [user]);

  const handleEdit = (field) => {
    setIsEditing({ ...isEditing, [field]: true });
  };

  const handleSave = async (field) => {
    try {
      const response = await axios.put(
        "http://localhost:5000/api/Profile/me",
        { [field]: formData[field] },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      if (response.status === 200) {
        setSaveError(null);
        setSaveSuccess(true);
        handleCancel(field); // Thoát chế độ chỉnh sửa khi lưu thành công
      } else {
        setSaveError("Có lỗi xảy ra khi lưu dữ liệu.");
      }
    } catch (error) {
      setSaveError("Lỗi khi cập nhật thông tin. Vui lòng thử lại.");
      console.error(
        "Lỗi khi cập nhật thông tin:",
        error.response?.data || error.message
      );
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleCancel = (field) => {
    setFormData({ ...user });
    setIsEditing({ ...isEditing, [field]: false });
    setSaveError(null);
    setSaveSuccess(false);
  };

  return (
    <div className="mt-8 p-6 bg-white rounded shadow-md">
      <h2 className="text-2xl font-bold mb-4 text-black">Tài khoản</h2>
      {saveError && <p className="text-red-500">{saveError}</p>}
      {saveSuccess && <p className="text-green-500">Lưu thành công!</p>}
      <div className="space-y-4">
        {["name", "email", "phoneNumber", "address", "dateOfBirth"].map(
          (field) => (
            <div className="flex justify-between items-center" key={field}>
              <div>
                <p className="text-black">
                  {field.charAt(0).toUpperCase() + field.slice(1)}
                </p>
                {isEditing[field] ? (
                  <input
                    type={field === "dateOfBirth" ? "date" : "text"}
                    name={field}
                    value={formData[field]}
                    onChange={handleChange}
                    className="border border-gray-300 rounded p-2 mt-1"
                  />
                ) : (
                  <p className="font-semibold text-black">
                    {field === "dateOfBirth"
                      ? new Date(formData[field]).toLocaleDateString()
                      : formData[field]}
                  </p>
                )}
              </div>
              {isEditing[field] ? (
                <div>
                  <button
                    onClick={() => handleSave(field)}
                    className="text-black border border-black px-4 py-2 rounded transition duration-200 hover:bg-gray-200"
                  >
                    Lưu
                  </button>
                  <button
                    onClick={() => handleCancel(field)}
                    className="text-black border border-black px-4 py-2 ml-2 rounded transition duration-200 hover:bg-gray-200"
                  >
                    Hủy
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => handleEdit(field)}
                  className="text-black border border-black px-4 py-2 rounded transition duration-200 hover:bg-gray-200"
                >
                  Thay đổi
                </button>
              )}
            </div>
          )
        )}
=======
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
>>>>>>> origin/huy
      </div>
    </div>
  );
};

export default AccountInfo;
