// config/cloudinary.js
require('dotenv').config();
const cloudinary = require('cloudinary').v2;

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME, // Tên cloud của bạn
  api_key: process.env.CLOUDINARY_API_KEY,       // API Key của bạn
  api_secret: process.env.CLOUDINARY_API_SECRET,  // API Secret của bạn
});


module.exports = cloudinary;
