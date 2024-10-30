// components/RatingCard.jsx
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

const RatingCard = () => {
  const { hotelId } = useParams(); // Lấy hotelId từ URL
  const [ratings, setRatings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchRatings = async () => {
      try {
        const response = await fetch(`/api/detail/${hotelId}/ratings`);
        if (!response.ok) {
          throw new Error('Có lỗi xảy ra khi lấy đánh giá');
        }
        const data = await response.json();
        setRatings(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchRatings();
  }, [hotelId]);

  // Hàm tính thời gian đã trôi qua
  const getTimeAgo = (date) => {
    const now = new Date();
    const diffInSeconds = Math.floor((now - new Date(date)) / 1000);
    
    if (diffInSeconds < 60) return `${diffInSeconds} giây trước`;
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)} phút trước`;
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)} giờ trước`;
    return `${Math.floor(diffInSeconds / 86400)} ngày trước`;
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div>
      {ratings.map((rating) => {
        const { user, comment, rating: score, date, lastModified } = rating;

        // Kiểm tra xem user có tồn tại không
        const userName = user ? user.name : "Người dùng không xác định";
        const userAvatar = user && user.avatar ? user.avatar : 'https://img.freepik.com/premium-vector/default-avatar-profile-icon-social-media-user-image-gray-avatar-icon-blank-profile-silhouette-vector-illustration_561158-3485.jpg';

        return (
          <div key={rating._id} className="text-black flex items-start mb-4 p-2 border border-gray-200 rounded shadow-sm">
            <img 
              src={userAvatar} 
              alt={userName} 
              className="w-10 h-10 rounded-full mr-3" 
            />
            <div className="flex-grow">
              <div className="flex justify-between text-black">
                <h4 className="font-bold">{userName}</h4>
                <span className="text-sm text-gray-500">{getTimeAgo(lastModified || date)}</span>
              </div>
              <div className="text-yellow-500">
                {Array.from({ length: 10 }, (_, index) => (
                  <span key={index} className={index < score ? "★" : "☆"} />
                ))}
              </div>
              <p className="mt-1">{comment}</p>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default RatingCard;
