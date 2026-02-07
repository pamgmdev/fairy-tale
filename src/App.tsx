// @ts-nocheck
import React, { useRef, useState, useEffect, useMemo } from 'react';
import HTMLFlipBook from 'react-pageflip';
import './App.css';

function App() {
  const bookRef = useRef(null);
  const [windowSize, setWindowSize] = useState({
    width: window.innerWidth,
    height: window.innerHeight,
  });
  const [isPortrait, setIsPortrait] = useState(window.innerHeight > window.innerWidth);
  const [showBook, setShowBook] = useState(false);

  const [currentPage, setCurrentPage] = useState(0);
  const goToStart = () => {
    bookRef.current?.pageFlip().turnToPage(0);
    setShowBook(false);
    setCurrentPage(0);
  };

  // Escuchar cambios de tamaño y orientación
  useEffect(() => {
    const handleResize = () => {
      setWindowSize({ width: window.innerWidth, height: window.innerHeight });
      setIsPortrait(window.innerHeight > window.innerWidth);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // CARGA DE MÓDULOS (Declaraciones de glob)
  const coverModules = import.meta.glob('./assets/images/covers/*.{png,jpg,jpeg,webp}', { eager: true });
  const chapter0Modules = import.meta.glob('./assets/images/chapter-0/*.{png,jpg,jpeg,webp}', { eager: true });
  const characterDescModules = import.meta.glob('./assets/images/character-description/*.{png,jpg,jpeg,webp}', { eager: true });
  const chapterModules = import.meta.glob('./assets/images/chapter-*/*.{png,jpg,jpeg,webp}', { eager: true });
  const finalChapterModules = import.meta.glob('./assets/images/final-chapter/*.{png,jpg,jpeg,webp}', { eager: true });

  const paginasLibro = useMemo(() => {
    const coverPaths = Object.keys(coverModules);
    const contra = coverPaths.find(p => p.includes('cover-2'));

    const getOrderedImages = (modules) => Object.keys(modules)
      .sort((a, b) => a.localeCompare(b, undefined, { numeric: true }))
      .map(path => modules[path].default);

    return [
      ...getOrderedImages(chapter0Modules),
      ...getOrderedImages(characterDescModules),
      ...getOrderedImages(chapterModules).filter(p => /chapter-(0[1-9]|1[0-3])\//.test(p)),
      ...getOrderedImages(finalChapterModules),
      contra ? coverModules[contra].default : null
    ].filter(Boolean);
  }, [coverModules, chapter0Modules, characterDescModules, chapterModules, finalChapterModules]);


  // En horizontal (landscape), bookWidth representa el ancho de UNA sola página. 
  // El componente dibujará dos, por lo que el ancho total será 2 * bookWidth.
  const bookWidth = isPortrait 
    ? windowSize.width * 0.9 
    : Math.min(windowSize.width * 0.45, 500); // 45% del ancho para cada página

  const bookHeight = isPortrait 
    ? Math.min(windowSize.height * 0.7, 600) 
    : Math.min(windowSize.height * 0.8, 600);

  const portada = Object.keys(coverModules).find(p => p.includes('cover-1'));
  const contraportada = Object.keys(coverModules).find(p => p.includes('cover-2'));

  return (
    <div className="main-container">
      {/* Portada inicial */}
      {!showBook && portada && (
        <div className="cover-container">
          <img src={coverModules[portada].default} alt="Portada" className="cover-img" />
          <button className="open-btn" onClick={() => setShowBook(true)}>
            Abrir libro
          </button>
        </div>
      )}

      {/* Contraportada final */}
      {showBook && contraportada && currentPage === paginasLibro.length - 1 && (
        <div className="cover-container">
          <img src={coverModules[contraportada].default} alt="Contraportada" className="cover-img" />
        </div>
      )}

      {/* Flipbook */}
      {showBook && currentPage !== paginasLibro.length - 1 && (
        <div className="book-stage">
          <HTMLFlipBook
            width={bookWidth}
            height={bookHeight}
            size="fixed"
            minWidth={200}
            maxWidth={1000}
            minHeight={300}
            maxHeight={1000}
            showCover={false}
            usePortrait={isPortrait}
            startPage={0}
            drawShadow={true}
            flippingTime={600}
            useMouseEvents={true}
            className="flipbook"
            ref={bookRef}
            onFlip={e => setCurrentPage(e.data)}
          >
            {paginasLibro.map((img, index) => (
              <div key={index} className="page-content">
                <img src={img} alt={`Página ${index + 1}`} className="page-img" />
              </div>
            ))}
          </HTMLFlipBook>
        </div>
      )}

      {/* Footer centrado con flex */}
      {showBook && (
        <div className="navigation-footer" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '0', width: '100%' }}>
          <button className="nav-btn" onClick={() => bookRef.current?.pageFlip().flipPrev()}>
            ← <span>Anterior</span>
          </button>
          <div style={{ flex: 1, display: 'flex', justifyContent: 'center' }}>
            <button 
              className="nav-btn home-btn" 
              onClick={goToStart}
              style={{ background: '#bfa16b', color: 'white', padding: '8px 16px', fontWeight: 'bold', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
              aria-label="Ir al inicio"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ verticalAlign: 'middle' }}>
                <path d="M3 12L12 3l9 9" />
                <path d="M9 21V9h6v12" />
              </svg>
            </button>
          </div>
          <button className="nav-btn" onClick={() => bookRef.current?.pageFlip().flipNext()}>
            <span>Siguiente</span> →
          </button>
        </div>
      )}
    </div>
  );
}

export default App;