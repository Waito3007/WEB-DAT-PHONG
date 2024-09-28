// ReviewsSection.jsx
import React from "react";

const ReviewsSection = () => {
  const reviews = [
    {
      text: '"A real sense of community, nurtured"',
      comment:
        "Really appreciate the help and support from the staff during these tough times. Shoutout to Katie for...",
      reviewer: "Olga",
      rating: "★★★★★",
      source: "Google",
      image: "review1.jpg",
    },
    {
      text: '"The facilities are superb. Clean, slick, bright."',
      comment:
        "A real sense of community, nurtured! Really appreciate the help and support from the staff...",
      reviewer: "Thomas",
      rating: "★★★★★",
      source: "Google",
      image: "review2.jpg",
    },
    {
      text: '"A real sense of community, nurtured"',
      comment:
        "Really appreciate the help and support from the staff during these tough times...",
      reviewer: "Eliot",
      rating: "★★★★★",
      source: "Google",
      image: "review3.jpg",
    },
  ];

  return (
    <section className="reviews-section">
      <h2>Reviews</h2>
      <p>What people say about Clara Hotel facilities</p>
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
      <button className="see-all-btn">See All</button>
    </section>
  );
};

export default ReviewsSection;
