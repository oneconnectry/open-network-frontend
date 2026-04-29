import React from "react";

export default function BusinessReviews({ reviews = [] }) {
  return (
    <div className="business-reviews-card">
      <div className="reviews-header">
        <h3>Reviews</h3>
      </div>

      {reviews.length === 0 ? (
        <div className="no-reviews">
          <p>No reviews yet – Be the first to write one</p>

          <button className="write-review-btn">
            Write a Review
          </button>
        </div>
      ) : (
        <div className="reviews-list">
          {reviews.map((review, index) => (
            <div key={index} className="review-item">
              <div className="review-top">
                <span className="review-user">{review.name}</span>
                <span className="review-rating">⭐ {review.rating}</span>
              </div>

              <p className="review-text">{review.comment}</p>

              <span className="review-date">{review.date}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}