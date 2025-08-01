const fs = require('fs');
const path = require('path');

const API_URL = 'https://web-dat-phong.onrender.com';

// Danh sách các file cần sửa
const files = [
  'client/src/components/HomePage/PopularDestinations.jsx',
  'client/src/components/HomePage/Mostpopularguests.jsx',
  'client/src/components/SearchPage/SearchHotel.jsx',
  'client/src/components/hotel_manager/MyHotel.jsx',
  'client/src/components/hotel_manager/HotelRooms.jsx',
  'client/src/components/hotel_manager/RoomDetail.jsx',
  'client/src/components/DetailRoom/DetailRoom.jsx',
  'client/src/components/DetailHotel/HotelImage.jsx',
  'client/src/pages/CheckoutPage.jsx',
  'client/src/components/FavoritesPage/FavoritesPage.jsx',
  'client/src/pages/BookingStatusPage.jsx',
  'client/src/pages/Admin/UsersPage.jsx',
  'client/src/pages/Admin/SalesPage.jsx',
  'client/src/pages/Admin/OrdersPage.jsx',
  'client/src/pages/Admin/HotelManagerPage.jsx'
];

// Các pattern cần thay thế
const patterns = [
  { from: /\/api\//g, to: `${API_URL}/api/` },
  { from: /'/api\//g, to: `'${API_URL}/api/` },
  { from: /"/api\//g, to: `"${API_URL}/api/` },
  { from: /`\/api\//g, to: `\`${API_URL}/api/` }
];

files.forEach(file => {
  const filePath = path.join(__dirname, file);
  
  if (fs.existsSync(filePath)) {
    let content = fs.readFileSync(filePath, 'utf8');
    
    // Thêm API_URL constant nếu chưa có
    if (!content.includes('const API_URL = process.env.REACT_APP_API_URL')) {
      const importIndex = content.lastIndexOf('import');
      const nextLineIndex = content.indexOf('\n', importIndex);
      content = content.slice(0, nextLineIndex + 1) + 
               '\nconst API_URL = process.env.REACT_APP_API_URL;\n' + 
               content.slice(nextLineIndex + 1);
    }
    
    // Thay thế tất cả các pattern
    patterns.forEach(pattern => {
      content = content.replace(pattern.from, pattern.to);
    });
    
    fs.writeFileSync(filePath, content, 'utf8');
    console.log(`Updated: ${file}`);
  } else {
    console.log(`File not found: ${file}`);
  }
});

console.log('All files updated successfully!');
