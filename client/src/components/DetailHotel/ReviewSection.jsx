import React from 'react';

const ReviewSection = ({ reviews, currentPage, totalPages }) => {
  return (
    <div className="reviews" style={{color:'black'}}>
      <h3 style={{fontSize:'30px'}}>Người dùng đánh giá</h3>
      <div class="rating-score" style={{fontSize:'20px'}}>
    <h1 style={{fontSize:'50px'}} >4.2</h1>
    <p>Rất tốt</p>
    <p>371 đánh giá</p>
  </div>
  <hr />
      {reviews.map((review, index) => (
        <div key={index} className="review">
            <img src={review.avatar} alt="Avatar" className="avatar" />
          <h4>
            {review.user}</h4>
          <p>{review.comment}</p>
        </div>
      ))}
      <Pagination currentPage={currentPage} totalPages={totalPages} />
    </div>
  );
};

const Pagination = ({ currentPage, totalPages }) => {
  return (
    <div className="pagination">
      <button disabled={currentPage === 1}>Previous</button>
      <span>{currentPage} of {totalPages}</span>
      <button disabled={currentPage === totalPages}>Next</button>
    </div>
  );
};

export default ReviewSection;
