// @ts-nocheck
import React, { useRef, useState, useEffect, useMemo } from 'react';
import HTMLFlipBook from 'react-pageflip';
import './App.css';

function App() {
  const bookRef = useRef(null);
  const [windowSize, setWindowSize] = useState({ width: window.innerWidth, height: window.innerHeight });
  const [isPortrait, setIsPortrait] = useState(window.innerHeight > window.innerWidth);
  const [showBook, setShowBook] = useState(false);
  const [currentPage, setCurrentPage] = useState(0);
  const [showSlider, setShowSlider] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      setWindowSize({ width: window.innerWidth, height: window.innerHeight });
      setIsPortrait(window.innerHeight > window.innerWidth);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const coverModules = import.meta.glob('./assets/images/covers/*.{png,jpg,jpeg,webp}', { eager: true });
  const chapter0Modules = import.meta.glob('./assets/images/chapter-0/*.{png,jpg,jpeg,webp}', { eager: true });
  const characterDescModules = import.meta.glob('./assets/images/character-description/*.{png,jpg,jpeg,webp}', { eager: true });
  const chapterModules = import.meta.glob('./assets/images/chapter-*/*.{png,jpg,jpeg,webp}', { eager: true });
  const finalChapterModules = import.meta.glob('./assets/images/final-chapter/*.{png,jpg,jpeg,webp}', { eager: true });

  const portada = Object.keys(coverModules).find(p => p.includes('cover-1'));
  const contraportada = Object.keys(coverModules).find(p => p.includes('cover-2'));

  const paginasLibro = useMemo(() => {
    const getOrderedImages = (modules) => Object.keys(modules)
      .sort((a, b) => a.localeCompare(b, undefined, { numeric: true }))
      .map(path => modules[path].default);

    return [
      ...getOrderedImages(chapter0Modules),
      ...getOrderedImages(characterDescModules),
      ...getOrderedImages(chapterModules).filter(p => /chapter-(0[1-9]|1[0-3])\//.test(p)),
      ...getOrderedImages(finalChapterModules),
      coverModules[contraportada]?.default // La contraportada va al final del array
    ].filter(Boolean);
  }, [coverModules, chapter0Modules, characterDescModules, chapterModules, finalChapterModules]);

  const bookWidth = isPortrait ? windowSize.width * 0.9 : Math.min(windowSize.width * 0.45, 500);
  const bookHeight = isPortrait ? Math.min(windowSize.height * 0.7, 600) : Math.min(windowSize.height * 0.8, 600);

  const goToStart = () => {
    bookRef.current?.pageFlip().turnToPage(0);
    setShowBook(false);
    setCurrentPage(0);
    setShowSlider(false);
  };

  // Variables de control de estado visual
  const isAtLastPage = currentPage === paginasLibro.length - 1;

  return (
    <div className="main-container">
      
      {/* 1. PORTADA INICIAL (Cover 1) */}
      {!showBook && portada && (
        <div className="cover-container">
          <img src={coverModules[portada].default} alt="Portada" className="cover-img" />
          <button className="open-btn" onClick={() => setShowBook(true)}>Abrir libro</button>
        </div>
      )}

      {/* 2. CONTRAPORTADA FINAL (Cover 2) */}
      {showBook && isAtLastPage && (
        <div className="cover-container">
          <img src={coverModules[contraportada].default} alt="Contraportada" className="cover-img" />
          <button className="open-btn" onClick={goToStart}>Volver al Inicio</button>
        </div>
      )}

      {/* 3. EL LIBRO (Siempre renderizado si showBook es true, pero oculto si es la última página) */}
      {showBook && (
        <div className="book-stage" style={{ display: isAtLastPage ? 'none' : 'flex' }}>
          <HTMLFlipBook
            width={bookWidth}
            height={bookHeight}
            size="fixed"
            showCover={false}
            usePortrait={isPortrait}
            ref={bookRef}
            onFlip={e => setCurrentPage(e.data)}
            className="flipbook"
          >
            {paginasLibro.map((img, index) => (
              <div key={index} className="page-content">
                <img src={img} alt={`Página ${index + 1}`} className="page-img" />
              </div>
            ))}
          </HTMLFlipBook>
        </div>
      )}

      {/* 4. NAVEGACIÓN (Slider y Footer) */}
      {showBook && (
        <>
          {showSlider && (
            <div className="slider-container">
              <span className="page-indicator">Página {currentPage + 1} de {paginasLibro.length}</span>
              <input 
                type="range" min="0" max={paginasLibro.length - 1} value={currentPage} className="page-slider"
                onChange={(e) => bookRef.current?.pageFlip().turnToPage(parseInt(e.target.value))}
              />
            </div>
          )}

          <div className="navigation-footer">
            <button className="nav-btn" onClick={() => bookRef.current?.pageFlip().flipPrev()}>←</button>
            <div className="footer-center-group">
              <button className="nav-btn home-btn" onClick={goToStart}>
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 12L12 3l9 9" /><path d="M9 21V9h6v12" /></svg>
              </button>
              <button className={`nav-btn search-btn ${showSlider ? 'active' : ''}`} onClick={() => setShowSlider(!showSlider)}>
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
              </button>
            </div>
            <button className="nav-btn" onClick={() => bookRef.current?.pageFlip().flipNext()}>→</button>
          </div>
        </>
      )}
    </div>
  );
}

export default App;