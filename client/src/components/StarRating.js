import React from 'react';
import { FaStar, FaRegStar } from 'react-icons/fa';

const StarRating = ({ rating, onRatingChange, readOnly = false }) => {
  const totalStars = 5;
  
  const handleClick = (selectedRating) => {
    if (readOnly) return;
    onRatingChange(selectedRating);
  };

  return (
    <div className="rating">
      {[...Array(totalStars)].map((_, index) => {
        const ratingValue = index + 1;
        return (
          <span 
            key={index}
            className="rating-star"
            onClick={() => handleClick(ratingValue)}
            style={{ cursor: readOnly ? 'default' : 'pointer' }}
          >
            {ratingValue <= rating ? (
              <FaStar color="#ebcb8b" />
            ) : (
              <FaRegStar color="#ebcb8b" />
            )}
          </span>
        );
      })}
    </div>
  );
};

export default StarRating; 