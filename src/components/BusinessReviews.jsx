import React from "react";

export default function BusinessReviews({ reviews = [] }) {
  const visibleReviews = reviews.slice(0, 2);

  // ⭐ Calculate average rating
  const totalRatings = reviews.length;
  const avgRating =
    totalRatings > 0
      ? (
          reviews.reduce((sum, r) => sum + Number(r.rating || 0), 0) /
          totalRatings
        ).toFixed(1)
      : 0;

  return (
    <div className="business-reviews-card">
      
      {/* HEADER */}
      <div className="reviews-header">
        <div>
          <h3>Reviews</h3>

          {totalRatings > 0 && (
            <div className="rating-summary">
              ⭐ <span className="avg">{avgRating}</span>
              <span className="count"> ({totalRatings})</span>
            </div>
          )}
        </div>

        {reviews.length > 2 && (
          <span className="view-all">View all</span>
        )}
      </div>

      {/* NO REVIEWS */}
      {reviews.length === 0 ? (
        <div className="no-reviews">
          <p>No reviews yet – Be the first to write one</p>
          <button className="write-review-btn">
            Write a Review
          </button>
        </div>
      ) : (
        <div className="reviews-list">
          {visibleReviews.map((review, index) => (
            <div key={index} className="review-item">

              <div className="review-row">

                {/* PROFILE */}
                <div className="review-avatar">
                  {review.profilePic ? (
                    <img src={review.profilePic} alt="" />
                  ) : (
                    <div className="default-avatar">
                      {review.name?.charAt(0)}
                    </div>
                  )}
                </div>

                {/* CONTENT */}
                <div className="review-content">
                  <div className="review-top">
                    <span className="review-user">{review.name}</span>
                    <span className="review-rating">⭐ {review.rating}</span>
                  </div>

                  {/* CLEAN TEXT FIX */}
                  <p className="review-text">
                    {review.comment?.replace(/<[^>]*>?/gm, "")}
                  </p>
                </div>

              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}