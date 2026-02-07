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

  // 1. DECLARACIÓN DE MÓDULOS (Esto debe ir aquí arriba)
  const coverModules = import.meta.glob('./assets/images/covers/*.{png,jpg,jpeg,webp}', { eager: true });
  const chapter0Modules = import.meta.glob('./assets/images/chapter-0/*.{png,jpg,jpeg,webp}', { eager: true });
  const characterDescModules = import.meta.glob('./assets/images/character-description/*.{png,jpg,jpeg,webp}', { eager: true });
  const chapterModules = import.meta.glob('./assets/images/chapter-*/*.{png,jpg,jpeg,webp}', { eager: true });
  const finalChapterModules = import.meta.glob('./assets/images/final-chapter/*.{png,jpg,jpeg,webp}', { eager: true });

  // Escuchar cambios de tamaño
  useEffect(() => {
    const handleResize = () => {
      setWindowSize({ width: window.innerWidth, height: window.innerHeight });
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const todasLasPaginas = useMemo(() => {
    const coverPaths = Object.keys(coverModules);
    const portada = coverPaths.find(p => p.includes('cover-1'));
    const contra = coverPaths.find(p => p.includes('cover-2'));

    // chapter-0
    const chapter0 = Object.keys(chapter0Modules)
      .sort((a, b) => a.localeCompare(b, undefined, { numeric: true }))
      .map((path) => chapter0Modules[path].default);

    // character-description
    const characterDesc = Object.keys(characterDescModules)
      .sort((a, b) => a.localeCompare(b, undefined, { numeric: true }))
      .map((path) => characterDescModules[path].default);

    // chapter-01 a chapter-13
    const chapterN = Object.keys(chapterModules)
      .filter(p => /chapter-(0[1-9]|1[0-3])\//.test(p))
      .sort((a, b) => a.localeCompare(b, undefined, { numeric: true }))
      .map((path) => chapterModules[path].default);

    // final-chapter
    const finalChapter = Object.keys(finalChapterModules)
      .sort((a, b) => a.localeCompare(b, undefined, { numeric: true }))
      .map((path) => finalChapterModules[path].default);

    // Portada sola
    const libroFinal = portada ? [coverModules[portada].default] : [];

    // Páginas interiores
    libroFinal.push(...chapter0);
    libroFinal.push(...characterDesc);
    libroFinal.push(...chapterN);
    libroFinal.push(...finalChapter);

    // Contraportada sola
    if (contra) libroFinal.push(coverModules[contra].default);

    return libroFinal;
  }, [coverModules, chapter0Modules, characterDescModules, chapterModules, finalChapterModules]);

  // Responsive: 1 página en móvil, 2 en PC
  const isMobile = windowSize.width <= 768;
  // Calcula el tamaño óptimo para cualquier orientación
  const maxWidth = Math.min(windowSize.width * 0.98, 900);
  const maxHeight = Math.min(windowSize.height * 0.85, 700);
  const bookWidth = maxWidth;
  const bookHeight = maxHeight;

  // Portada y páginas del libro
  const coverPaths = Object.keys(coverModules);
  const portada = coverPaths.find(p => p.includes('cover-1'));
  const contra = coverPaths.find(p => p.includes('cover-2'));

  // Páginas interiores
  const chapter0 = Object.keys(chapter0Modules)
    .sort((a, b) => a.localeCompare(b, undefined, { numeric: true }))
    .map((path) => chapter0Modules[path].default);
  const characterDesc = Object.keys(characterDescModules)
    .sort((a, b) => a.localeCompare(b, undefined, { numeric: true }))
    .map((path) => characterDescModules[path].default);
  const chapterN = Object.keys(chapterModules)
    .filter(p => /chapter-(0[1-9]|1[0-3])\//.test(p))
    .sort((a, b) => a.localeCompare(b, undefined, { numeric: true }))
    .map((path) => chapterModules[path].default);
  const finalChapter = Object.keys(finalChapterModules)
    .sort((a, b) => a.localeCompare(b, undefined, { numeric: true }))
    .map((path) => finalChapterModules[path].default);

  // Flipbook solo para páginas interiores
  const paginasLibro = [
    ...chapter0,
    ...characterDesc,
    ...chapterN,
    ...finalChapter,
    contra ? coverModules[contra].default : null
  ].filter(Boolean);

  // Estado para mostrar portada o flipbook
  const [showBook, setShowBook] = useState(false);

  return (
    <div className="main-container" style={{ width: '100vw', height: '100vh', minHeight: '100vh', minWidth: '100vw', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', background: '#f7f6f3', overflow: 'auto' }}>
      {!showBook && portada && (
        <div className="cover-container" style={{ width: '100%', maxWidth: bookWidth, height: bookHeight, margin: '40px auto', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
          <img src={coverModules[portada].default} alt="Portada" style={{ width: '100%', height: '100%', objectFit: 'contain', borderRadius: '16px' }} />
          <button style={{ marginTop: 32, padding: '12px 32px', borderRadius: '8px', background: '#bfa16b', color: '#fff', border: 'none', fontSize: '1.2rem', cursor: 'pointer' }} onClick={() => setShowBook(true)}>
            Abrir libro
          </button>
        </div>
      )}
      {showBook && (
        <div className="book-wrapper" style={{ margin: '32px 0', display: 'flex', justifyContent: 'center', alignItems: 'center', width: '100%', maxWidth: bookWidth, height: bookHeight }}>
          <HTMLFlipBook 
            width={bookWidth} 
            height={bookHeight}
            size="stretch"
            minWidth={300}
            maxWidth={1000}
            minHeight={400}
            maxHeight={1600}
            showCover={false}
            usePortrait={isMobile}
            startPage={0}
            drawShadow={false}
            flippingTime={1000}
            useMouseEvents={true}
            clickEventForward={true}
            className="flipbook"
            ref={bookRef}
            style={{ borderRadius: '16px', background: '#fff', width: '100%', height: '100%' }}
          >
            {paginasLibro.map((img, index) => (
              <div key={index} className="page-content" data-density="hard" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', width: '100%', height: '100%', background: '#fff' }}>
                {img ? (
                  <img 
                    src={img} 
                    alt={`Página ${index + 1}`} 
                    style={{ width: '100%', height: '100%', objectFit: 'contain', borderRadius: '8px' }}
                  />
                ) : null}
              </div>
            ))}
          </HTMLFlipBook>
        </div>
      )}
      {showBook && (
        <div className="navigation-footer" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '32px', marginBottom: '24px' }}>
          <button className="nav-btn" style={{ padding: '8px 20px', borderRadius: '8px', background: '#e0d9c8', border: 'none', fontSize: '1.1rem', cursor: 'pointer', boxShadow: '0 2px 8px rgba(0,0,0,0.06)' }} onClick={() => bookRef.current?.pageFlip().flipPrev()}>
            ← <span>Anterior</span>
          </button>
          <div className="pagination-dots">
            <span className="dot active" style={{ width: '12px', height: '12px', background: '#bfa16b', borderRadius: '50%', display: 'inline-block' }}></span>
          </div>
          <button className="nav-btn" style={{ padding: '8px 20px', borderRadius: '8px', background: '#e0d9c8', border: 'none', fontSize: '1.1rem', cursor: 'pointer', boxShadow: '0 2px 8px rgba(0,0,0,0.06)' }} onClick={() => bookRef.current?.pageFlip().flipNext()}>
            <span>Siguiente</span> →
          </button>
        </div>
      )}
    </div>
  );
}

export default App;