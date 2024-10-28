import React from 'react';
import '../../assets/css/FavoritesPage.css'; // Đường dẫn chính xác đến tệp CSS

const hotels = [
  {
    id: 1,
    name: 'Stay Night Hà Nội',
    location: 'Hà Nội',
    rating: 5,
    reviews: 276,
    price: '12,000,000',
    image: '/phong1.png',
  },
  {
    id: 2,
    name: 'Stay Night Hồ Chí Minh',
    location: 'Hồ Chí Minh',
    rating: 4.5,
    reviews: 543,
    price: '12,000,000',
    image: '/phong1.png',
  },
  {
    id: 3,
    name: 'Stay Night Cần Thơ',
    location: 'Cần Thơ',
    rating: 4.3,
    reviews: 345,
    price: '12,000,000',
    image: '/phong1.png',
  },
];

export default function FavoritesPage() {
  return (
    <div className="favorites-page">
      <header className="favorites-header">
        <h1 className="text-2xl font-bold">staynight</h1>
        <div  style={{padding:'10px'   , display:'flex'}}>
          <button className="text-white mx-2">🤍 Yêu thích</button>
          <div className="flex items-center">
    <img src="avta.png" alt="User" className="w-6 h-6"  style={{ width: "50px",height: "50px"   }}  />
    <span className="mx-2">Người dùng</span>
</div>
        </div>
      </header>

      <main className="favorites-main">
        <h2 className="text-2xl font-bold mb-4">Yêu thích</h2>
        <div className="space-y-6">
          {hotels.map((hotel) => (
            <div key={hotel.id} className="hotel-card">
              <img src={hotel.image} alt={hotel.name} className="hotel-image" />
              <div className="hotel-info">
                
                <div className="flex justify-between items-center">
                <h3 className="hotel-title">{hotel.name}</h3>
                <span className="hotel-price">{hotel.price} VND</span>
                </div>

                <p className="text-gray-600"style={{ marginTop: '10px' }}>📍{hotel.location}</p>
                <div className="flex items-center my-2">
                  <span className="text-yellow-500 text-lg"  style={{ color: 'black' }}>⭐⭐⭐⭐⭐ Khách Sạn 5 Sao </span>
                </div>

                <div className="flex items-center my-2">
                  <span className="square">{hotel.rating}</span>
                  <span className="text-gray-600 ml-2" style={{ fontWeight: "bold",fontSize: "20px" }}>{hotel.reviews} đánh giá</span>
                </div>


                <hr class="my-line"></hr>

                  <button className="bg-black text-white px-4 py-2 rounded-lg"  style={{ width: '100%', fontSize: '20px' }}>Đặt phòng</button>
              </div>
            </div>
          ))}
        </div>
      </main>

      <footer className="favorites-footer">
        <div className="max-w-6xl mx-auto grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
          <div>
            <h3 className="font-bold text-lg">Stay Night</h3>
            <div className="flex space-x-2 mt-2">
            <a href="https://www.facebook.com" target="_blank" rel="noopener noreferrer" className="flex items-center text-white">
                <img src="facebook.svg" alt="Facebook" className="w-6 h-6" />
                
            </a>
            <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="flex items-center text-white">
                <img src="x.png" alt="Twitter" className="w-6 h-6 mr-1" />
                
            </a>
            <a href="https://www.google.com" target="_blank" rel="noopener noreferrer" className="flex items-center text-white">
                <img src="google.png" alt="Google" className="w-6 h-6 mr-1" />
                
            </a>      
       </div>
          </div>
          <div>
            <h3 className="font-bold text-lg">Điểm đến</h3>
            <p>Hà Nội</p>
            <p>HCM</p>
            <p>Cần Thơ</p>
            <p>SaPa</p>
          </div>
          <div>
            <h3 className="font-bold text-lg">Hoạt động</h3>
            <p>Dinh Độc lập</p>
            <p>Ẩm Thực Đường Phố</p>
            <p>Chợ nổi cái răng</p>
            <p>Nhà thờ đức bà</p>
          </div>
          <div>
            <h3 className="font-bold text-lg">Blog du lịch</h3>
            <p>Hướng dẫn du lịch Huy</p>
            <p>Hướng dẫn du lịch seng</p>
            <p>Hướng dẫn du lịch nghĩa</p>
          </div>
          <div>
            <h3 className="font-bold text-lg">Về chúng tôi</h3>
            <p>Du lịch bền vững</p>
            <p>Truyền thông</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
