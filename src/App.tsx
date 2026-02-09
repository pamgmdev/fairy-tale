// @ts-nocheck
import { useRef, useState, useEffect, useMemo } from 'react';
import HTMLFlipBook from 'react-pageflip';
import './App.css';
import BookCard from './components/BookCard';
import BookPreview from './components/BookPreview';

function App () 
{
  const bookRef = useRef<any> (null);
  const [windowSize, setWindowSize] = useState ({ width: window.innerWidth, height: window.innerHeight });
  const [isPortrait, setIsPortrait] = useState (window.innerHeight > window.innerWidth);

  // Control de Selección de Libro
  const [selectedBook, setSelectedBook] = useState<string | null> (null); 
  const [showBook, setShowBook] = useState (false);
  const [currentPage, setCurrentPage] = useState (0);
  const [showSlider, setShowSlider] = useState (false);
  
  useEffect (() => 
  {
    const handleResize = () => 
    {
      setWindowSize ({ width: window.innerWidth, height: window.innerHeight });
      setIsPortrait (window.innerHeight > window.innerWidth);
    };
    window.addEventListener ('resize', handleResize);
    return () => window.removeEventListener ('resize', handleResize);
  }, []);


  // --- SOPORTE PARA MÚLTIPLES LIBROS ---
  // Define aquí los libros disponibles
  const books = [
    {
      id               : 'book-1',
      title            : 'El primer año',
      description      : 'Capítulos 0-13',
      allImages        : import.meta.glob ('./assets/books/book-1/images/**/*.{png,jpg,jpeg,webp,PNG,JPG,JPEG,WEBP}', { eager: true }) as Record<string, { default: string }>,
      portadaName      : 'cover-1',
      contraportadaName: 'cover-2'
    }
  ];

  const selectedBookObj = books.find (b => b.id === selectedBook);

  // --- Lógica de Procesamiento de Imágenes ---
  const allPaths = selectedBookObj ? Object.keys (selectedBookObj.allImages) : [];
  
  const portadaPath = allPaths.find (p => p.includes (selectedBookObj?.portadaName || ''));
  const contraPath = allPaths.find (p => p.includes (selectedBookObj?.contraportadaName || ''));

  const paginasLibro = useMemo (() => 
  {
    if (!selectedBookObj) return [];

    const sortedPaths = [...allPaths].sort ((a, b) => a.localeCompare (b, undefined, { numeric: true }));

    // Filtramos para que no se repitan las portadas en el centro del libro
    const interiorPages = sortedPaths
      .filter (p => p !== portadaPath && p !== contraPath)
      .map (path => selectedBookObj.allImages[path].default);

    const fullBook = [...interiorPages];
    
    if (contraPath) 
    {
      fullBook.push (selectedBookObj.allImages[contraPath].default);
    }

    return fullBook.filter (Boolean);
  }, [selectedBookObj, allPaths, portadaPath, contraPath]);

  const bookWidth = isPortrait ? windowSize.width * 0.9 : Math.min (windowSize.width * 0.45, 500);
  const bookHeight = isPortrait ? Math.min (windowSize.height * 0.7, 600) : Math.min (windowSize.height * 0.8, 600);

  const goToLibrary = () => 
  {
    setSelectedBook (null);
    setShowBook (false);
    setCurrentPage (0);
    setShowSlider (false);
  };

  const isAtLastPage = currentPage === paginasLibro.length - 1;

  return (
    <div className="main-container">
      
      {/* 1. VISTA DE BIBLIOTECA (La estantería) */}
      {!selectedBook && (
        <div className="library-container">
          <h1 className="library-title">Nuestras Historias</h1>
          <div className="book-grid">
            {books.map (book => 
            {
              const pKey = Object.keys (book.allImages).find (p => p.includes (book.portadaName));
              return (
                <BookCard
                  key={book.id}
                  title={book.title}
                  description={book.description}
                  coverSrc={pKey ? book.allImages[pKey].default : ''}
                  onClick={() => setSelectedBook (book.id)}
                />
              );
            })}
          </div>
        </div>
      )}

      {/* 2. VISTA PREVIA (La portada individual antes de abrirlo) */}
      {selectedBook && selectedBookObj && !showBook && (
        <BookPreview
          coverSrc={portadaPath ? selectedBookObj.allImages[portadaPath].default : ''}
          onOpen={() => setShowBook (true)}
          onBack={goToLibrary}
        />
      )}

      {/* 3. CONTRAPORTADA FINAL */}
      {showBook && isAtLastPage && selectedBookObj && (
        <div className="cover-container">
          <img src={contraPath ? selectedBookObj.allImages[contraPath].default : ''} alt="Contraportada" className="cover-img" />
          <button className="open-btn" onClick={goToLibrary}>Cerrar Libro</button>
        </div>
      )}

      {/* 4. EL LIBRO INTERACTIVO */}
      {showBook && (
        <div className="book-stage" style={{ display: isAtLastPage ? 'none' : 'flex' }}>
          <HTMLFlipBook
            width={bookWidth}
            height={bookHeight}
            size="fixed"
            showCover={false}
            usePortrait={isPortrait}
            ref={bookRef}
            onFlip={e => setCurrentPage (e.data)}
            className="flipbook"
            startPage={0}
            drawShadow={true}
            flippingTime={1000}
            useMouseEvents={true}
          >
            {paginasLibro.map ((img, index) => (
              <div key={index} className="page-content">
                <img src={img} alt={`Página ${index + 1}`} className="page-img" />
              </div>
            ))}
          </HTMLFlipBook>
        </div>
      )}

      {/* 5. NAVEGACIÓN */}
      {showBook && (
        <>
          {showSlider && (
            <div className="slider-container">
              <span className="page-indicator">Página {currentPage + 1} de {paginasLibro.length}</span>
              <input 
                type="range" min="0" max={paginasLibro.length - 1} value={currentPage} className="page-slider"
                onChange={(e) => bookRef.current?.pageFlip ()?.turnToPage (parseInt (e.target.value))}
              />
            </div>
          )}

          <div className="navigation-footer">
            <button className="nav-btn" onClick={() => bookRef.current?.pageFlip ()?.flipPrev ()}>←</button>
            <div className="footer-center-group">
              <button className="nav-btn home-btn" onClick={goToLibrary}>
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 12L12 3l9 9" /><path d="M9 21V9h6v12" /></svg>
              </button>
              <button className={`nav-btn search-btn ${showSlider ? 'active' : ''}`} onClick={() => setShowSlider (!showSlider)}>
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
              </button>
            </div>
            <button className="nav-btn" onClick={() => bookRef.current?.pageFlip ()?.flipNext ()}>→</button>
          </div>
        </>
      )}
    </div>
  );
}

export default App;