import React from "react";

const Review = () => {
  const reviews = [
    {
      id: 1,
      name: "Công tử cần thơ",
      comment: "Lorem ipsum dolor sit amet, consectetur adipiscing elit...",
      avatar: "logo512.png", // Đường dẫn đến ảnh đại diện
    },
    {
      id: 2,
      name: "Sengvu",
      comment: "Lorem ipsum dolor sit amet, consectetur adipiscing elit...",
      avatar: "logo512.png",
    },
    {
      id: 3,
      name: "Hoanghuy",
      comment: "Lorem ipsum dolor sit amet, consectetur adipiscing elit...",
      avatar: "logo512.png",
    },
    {
      id: 4,
      name: "Nhân",
      comment: "Lorem ipsum dolor sit amet, consectetur adipiscing elit...",
      avatar: "logo512.png",
    },
    {
      id: 5,
      name: "Phương",
      comment: "Lorem ipsum dolor sit amet, consectetur adipiscing elit...",
      avatar: "logo512.png",
    },
  ];

  return (
    <div className="review-container">
      <div className="overall-rating">
        <div className="rating-score">
          <h2>4.2</h2>
        </div>
        <div className="rating-cc">
          <p>Rất tốt</p>
          <p>371 đánh giá</p>
        </div>
        <button className="submit-review">Gửi đánh giá</button>
      </div>
      <div className="reviews-list">
        {reviews.map((review) => (
          <div key={review.id} className="review-item">
            <img src={review.avatar} alt={review.name} className="avatar" />
            <div className="review-content">
              <h4>{review.name}</h4>
              <p>{review.comment}</p>
            </div>
            <button className="flag-button">🚩</button>
          </div>
        ))}
      </div>
      <div className="pagination">
        <span>1 of 40</span>
        <button>{"<"}</button>
        <button>{">"}</button>
      </div>
    </div>
  );
};

export default Review;
