// ReviewsSection.jsx
import React from "react";

const ReviewsSection = () => {
  const reviews = [
    {
      text: '"Một ý thức cộng đồng thực sự được nuôi dưỡng"',
      comment:
        "Thực sự đánh giá cao sự giúp đỡ và hỗ trợ từ các nhân viên trong thời điểm khó khăn này. Cảm ơn Katie vì...",
      reviewer: "Hoàng Huy",
      rating: "★★★★★",
      source: "Google",
      image: "rvhcm.png",
    },
    {
      text: '"Cơ sở vật chất tuyệt vời. Sạch sẽ, sang trọng, sáng sủa."',
      comment:
        "Một ý thức cộng đồng thực sự được nuôi dưỡng! Thực sự đánh giá cao sự giúp đỡ và hỗ trợ từ các nhân viên. . .",
      reviewer: "SengVu",
      rating: "★★★★★",
      source: "Google",
      image: "rvhcm.png",
    },
    {
      text: '"Một ý thức cộng đồng thực sự được nuôi dưỡng"',
      comment:
        "Thực sự đánh giá cao sự giúp đỡ và hỗ trợ từ các nhân viên trong thời điểm khó khăn này...",
      reviewer: "công tử cần thơ",
      rating: "★★★★★",
      source: "Google",
      image: "rvhcm.png",
    },
  ];

  return (
    <section className="reviews-section">
      <h2>Đánh giá</h2>
      {/* <p>What people say about Clara Hotel facilities</p> */}
      <div className="reviews-container">
        {reviews.map((review, index) => (
          <div key={index} className="review-card">
            <p className="review-text">{review.text}</p>
            <p>{review.comment}</p>
            <p className="reviewer">{review.reviewer}</p>
            <span className="rating">{review.rating}</span>
            <p className="review-source">{review.source}</p>
            <img src={review.image} alt={`Review ${index + 1}`} />
          </div>
        ))}
      </div>
    </section>
  );
};

export default ReviewsSection;
