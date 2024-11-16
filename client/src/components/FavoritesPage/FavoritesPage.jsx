import React, { useEffect, useState } from 'react';
import axios from 'axios';
import '../../assets/css/FavoritesPage.css'; 
import Footer from '../HomePage/Footer'; 
import HomeNavbar from '../HomePage/HomeNavbar'; 

export default function FavoritesPage() {
  const [hotels, setHotels] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null); 
  useEffect(() => {
    axios.get('http://localhost:5000/api/searchhotel/Search')
      .then(response => {
        console.log(response.data); 
        setHotels(response.data); 
        setLoading(false); 
      })
      .catch(error => {
        console.error("Có lỗi khi tải dữ liệu khách sạn!", error);
        setError("Có lỗi khi tải dữ liệu, vui lòng thử lại sau.");
        setLoading(false); 
      });
  }, []);

  return (

    <div>
     
     
    <div className="favorites-page">
      <div className="favorites-main" >
      <HomeNavbar />
        <h2 className="text-2xl font-bold mb-4" style={{ color: 'black' }}>Yêu thích</h2>

        {loading ? (
          <p>Đang tải dữ liệu...</p>
        ) : error ? (
          <p className="text-red-500">{error}</p>
        ) : (
          <div className="space-y-6">
            {hotels.length > 0 ? (
              hotels.map((hotel) => (
                <div key={hotel._id} className="hotel-card">
                  <img
                    src={hotel.imagehotel && hotel.imagehotel[0] ? hotel.imagehotel[0] : 'default-image.jpg'}
                    alt={hotel.name}
                    className="hotel-image"
                  />
                  <div className="hotel-info">
                    <div className="flex justify-between items-center">
                      <h3 className="hotel-title" style={{ color: 'black' }}>{hotel.name}</h3>
                      <span className="hotel-price">{hotel.lowestRoomPrice} VND</span>
                    </div>
                    <p className="text-gray-600 mt-2">📍{hotel.location}</p>
                    <div className="flex items-center my-2">
                      <span className="text-yellow-500 text-lg" style={{ color: 'black' }}>
                        ⭐⭐⭐⭐⭐ Khách sạn 5 sao
                      </span>
                    </div>
                    <div className="flex items-center my-2">
                      <span className="square">
                        {hotel.averageRating ? hotel.averageRating.toFixed(1) : 'N/A'}
                      </span>
                      <span className="text-gray-600 ml-2 font-bold text-lg">
                        {hotel.reviewsCount} đánh giá
                      </span>
                    </div>

                    <hr className="my-line" />

                    <button className="bg-black text-white px-4 py-2 rounded-lg w-full text-lg">
                      Đặt ngay
                    </button>
                  </div>
                </div>
              ))
            ) : (
              <p>Không có khách sạn yêu thích nào.</p>
            )}
          </div>
        )}

      </div>
      < Footer />

      </div>
 
    </div>

  );
}
