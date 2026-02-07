import React from 'react';

interface BookPreviewProps {
  coverSrc: string;
  onOpen: () => void;
  onBack: () => void;
}

const BookPreview: React.FC<BookPreviewProps> = ({ coverSrc, onOpen, onBack }) => (
  <div className="cover-container">
    <img src={coverSrc} alt="Portada" className="cover-img" />
    <div className="cover-btns">
      <button className="open-btn" onClick={onOpen}>Abrir libro</button>
      <button className="back-btn" onClick={onBack}>Volver a Biblioteca</button>
    </div>
  </div>
);

export default BookPreview;
