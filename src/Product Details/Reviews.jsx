import React, { useEffect, useState } from 'react';
import axios from 'axios';

import './reviews.css';

const Reviews = ({ productId }) => {
  const [reviews, setReviews] = useState([]);
  const [newReview, setNewReview] = useState({ rating: 1, reviewText: '' });
  const [error, setError] = useState('');


  useEffect(() => {
    fetchReviews();
  }, [productId]);

  const fetchReviews = async () => {
    try {
      const response = await axios.get(`${process.env.REACT_APP_LOCAL}/api/reviews/${productId}`);
      setReviews(response.data);
    } catch (error) {
      console.error('Error fetching reviews:', error);
    }
  };

  const handleSubmitReview = async () => {
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    if (!currentUser) {
      setError('You need to be logged in to submit a review.');
      return;
    }

    try {
      await axios.post(`${process.env.REACT_APP_LOCAL}/api/reviews`, {
        productId,
        userEmail: currentUser.email,
        rating: newReview.rating,
        reviewText: newReview.reviewText,
      });
      setNewReview({ rating: 1, reviewText: '' });
      fetchReviews(); // Refresh reviews
    } catch (error) {
      console.error('Error adding review:', error);
    }
  };

  const handleRatingChange = (rating) => {
    setNewReview({ ...newReview, rating });
  };

  

  return (
    <div className="reviews-container">
      <h3>Reviews</h3>
      {error && <p className="error">{error}</p>}
      <div className="review-form">
        <label>Rating:</label>
        <div className="rating-stars">
          {[1, 2, 3, 4, 5].map((star) => (
            <span
              key={star}
              className={`star ${newReview.rating >= star ? 'filled' : ''}`}
              onClick={() => handleRatingChange(star)}
            >
              ★
            </span>
          ))}
        </div>
        <label>Review:</label>
        <div className="emoji-container">
          <textarea
            value={newReview.reviewText}
            onChange={(e) => {
              console.log('Review Text Changed:', e.target.value); // Debugging line
              setNewReview({ ...newReview, reviewText: e.target.value });
            }}
            placeholder="Add your review "
          />
         
        </div>
        <button onClick={handleSubmitReview}>Submit Review</button>
      </div>
      <div className="reviews-list">
        {reviews.map((review) => (
          <div key={review.id} className="review-item">
            <p><strong>{review.userEmail}</strong> rated {review.rating} <span className="stars">{'★'.repeat(review.rating)}</span></p>
            <p>{review.reviewText}</p>
            <p><em>Reviewed on {new Date(review.createdAt).toLocaleDateString()}</em></p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Reviews;
