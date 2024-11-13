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
    </div>
  );
}