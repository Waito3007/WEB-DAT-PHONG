// config/cloudinary.js
const cloudinary = require('cloudinary').v2;
require('dotenv').config(); // Đảm bảo tải các biến môi trường từ file .env

// Cấu hình Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,  // Tên Cloudinary của bạn
  api_key: process.env.CLOUDINARY_API_KEY,        // Khóa API Cloudinary
  api_secret: process.env.CLOUDINARY_API_SECRET    // Bí mật API Cloudinary
});

// Hàm upload ảnh lên Cloudinary
const uploadImageToCloudinary = async (imagePath) => {
  try {
    const result = await cloudinary.uploader.upload(imagePath);
    return result;
  } catch (error) {
    console.error('Lỗi upload ảnh lên Cloudinary:', error);
    throw error;
  }
};

module.exports = {
  cloudinary,
  uploadImageToCloudinary
};
