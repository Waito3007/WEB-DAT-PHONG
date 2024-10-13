import React from 'react';
import Header from './Header';
import ImageGallery from './ImageGallery';
import HotelInfo from './HotelInfo';
import AmenitiesList from './AmenitiesList';
import ReviewSection from './ReviewSection';
import './DetailHotel.css';

const HotelDetailPage = () => {
  const hotelData = {
    hotelName: "Stay Night Hà Nội",
    location: "Hà Nội",
    price: "2.202.000",
    images: [
      "Rectangle3.png",
      "Rectangle5.png",
      "Rectangle6.png",
      "Rectangle7.png",
      "Rectangle8.png"
    ],
    rating: 4.2,
    reviewCount: 371,
    description: "Tọa lạc tại Hà nội, trung tâm thành phố Hà Nội, Khách sạn Stay night đã trỗi dậy từ đống tro tàn của Khách sạn Clara lịch sử, nơi từng là Cung điện Ngoại giao cách đây 120 năm và đang tiếp đón các vị khách của mình bằng cách đảm nhận sứ mệnh hiếu khách này. Với 452 phòng và dãy phòng sang trọng, khu vực spa và tập thể dục rộng 8500 m2, 18 phòng họp bao gồm 4 phòng có thể chia ngăn và 3 sân hiên  cơ sở hạ tầng công nghệ mới nhất, Stay night là dự định sẽ là điểm thu hút nổi tiếng của thành phố. Các loại phòng và dãy phòng với nhiều kích cỡ khác nhau với tầm nhìn ra thành phố  cũng như 68 dãy phòng sang trọng riêng biệt, được cung cấp cho những vị khách đặc biệt với nhiều lựa chọn đa dạng.",
    amenities: ["🏊‍♂️Bể bơi ngoài trời",
      "🏊‍♂️Bể bơi trong nhà",
       "🌸Spa", 
       "🍴Nhà hàng",
       "🛎️Dịch vụ phòng", 
       "🏋️‍♀️Trung tâm thể hình",
       "🍷Quầy bar/Phòng chờ",
       "📶Wifi miễn phí",
       "☕Quầy cafe",
       "+24 tiện ích khác"],
    reviews: [

      { avatar:'Ellipse.png', user: "Công Tử", comment: "Lorem ipsum dolor sit amet..." },
      { avatar:'Ellipse1.png',user: "Sengvu", comment: "Lorem ipsum dolor sit amet..." },
      { avatar:'Ellipse1.png',user: "Sengvu", comment: "Lorem ipsum dolor sit amet..." },
      { avatar:'Ellipse2.png',user: "Sengvu", comment: "Lorem ipsum dolor sit amet..." },
      { avatar:'Ellipse2.png',user: "Sengvu", comment: "Lorem ipsum dolor sit amet..." },
      
      // Thêm nhiều đánh giá hơn
    ],
    currentPage: 1,
    totalPages: 40
  };

  return (
    <div className="hotel-detail-page">
      <Header hotelName={hotelData.hotelName} location={hotelData.location} price={hotelData.price} />
      <ImageGallery images={hotelData.images} />
      <HotelInfo rating={hotelData.rating} reviewCount={hotelData.reviewCount} description={hotelData.description} />
      <AmenitiesList amenities={hotelData.amenities} />
      <ReviewSection reviews={hotelData.reviews} currentPage={hotelData.currentPage} totalPages={hotelData.totalPages} />
    </div>
  );
};

export default HotelDetailPage;
