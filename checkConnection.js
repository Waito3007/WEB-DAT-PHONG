// checkConnection.js
const { cloudinary } = require('./config/cloudinary');

// Kiểm tra kết nối
cloudinary.api.ping()
  .then(response => {
    console.log('Kết nối thành công:', response);
  })
  .catch(error => {
    console.error('Lỗi khi kết nối:', error);
  });
