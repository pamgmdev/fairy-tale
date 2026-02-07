import React from 'react';

interface BookCardProps {
  title: string;
  description: string;
  coverSrc: string;
  onClick: () => void;
}

const BookCard: React.FC<BookCardProps> = ({ title, description, coverSrc, onClick }) => (
  <div className="book-card" onClick={onClick}>
    <div className="book-cover-placeholder">
      <img src={coverSrc} alt={title} className="book-thumbnail" />
    </div>
    <h3>{title}</h3>
    <p>{description}</p>
  </div>
);

export default BookCard;
