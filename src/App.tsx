import { useRef, useState, useEffect, useMemo } from 'react';
import HTMLFlipBook from 'react-pageflip';
import './App.css';
import BookCard from './components/BookCard';
import BookPreview from './components/BookPreview';

function App () 
{
  // Ref tipado correctamente para react-pageflip
  // El tipo correcto para el ref de react-pageflip es 'any' si no hay tipos exportados
  const bookRef = useRef<any>(null);
  const [windowSize, setWindowSize] = useState({ width: window.innerWidth, height: window.innerHeight });
  const [isPortrait, setIsPortrait] = useState(window.innerHeight > window.innerWidth);

  // Control de Selección de Libro
  const [selectedBook, setSelectedBook] = useState<string | null>(null); // null = Biblioteca, 'book-1' = Cuento actual
  const [showBook, setShowBook] = useState(false);
  const [currentPage, setCurrentPage] = useState(0);
  const [showSlider, setShowSlider] = useState(false);
  
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
      id                  : 'book-1',
      title               : 'El primer año',
      description         : 'Capítulos 0-13',
      coverModules        : import.meta.glob('./assets/books/book-1/images/covers/*.{png,jpg,jpeg,webp}', { eager: true }) as Record<string, { default: string }>,
      chapter0Modules     : import.meta.glob('./assets/books/book-1/images/chapter-0/*.{png,jpg,jpeg,webp}', { eager: true }) as Record<string, { default: string }>,
      characterDescModules: import.meta.glob('./assets/books/book-1/images/character-description/*.{png,jpg,jpeg,webp}', { eager: true }) as Record<string, { default: string }>,
      chapterModules      : import.meta.glob('./assets/books/book-1/images/chapter-*/*.{png,jpg,jpeg,webp}', { eager: true }) as Record<string, { default: string }>,
      finalChapterModules : import.meta.glob('./assets/books/book-1/images/final-chapter/*.{png,jpg,jpeg,webp}', { eager: true }) as Record<string, { default: string }>,
      portadaName         : 'cover-1',
      contraportadaName   : 'cover-2',
    },
    // Puedes agregar más libros aquí siguiendo el mismo formato
    // {
    //   id: 'book-2',
    //   title: 'Otro Libro',
    //   description: 'Capítulos 1-5',
    //   coverModules: import.meta.glob('./assets/books/book-2/images/covers/*.{png,jpg,jpeg,webp}', { eager: true }),
    //   ...
    //   portadaName: 'cover-1',
    //   contraportadaName: 'cover-2',
    // },
  ];

  // Encuentra el libro seleccionado
  const selectedBookObj = books.find(b => b.id === selectedBook);

  // Utilidades para el libro seleccionado
  const portada = selectedBookObj ? Object.keys(selectedBookObj.coverModules).find(p => p.includes(selectedBookObj.portadaName)) ?? undefined : undefined;
  const contraportada = selectedBookObj ? Object.keys(selectedBookObj.coverModules).find(p => p.includes(selectedBookObj.contraportadaName)) ?? undefined : undefined;
  
  const paginasLibro = useMemo(() => 
  {
    if (!selectedBookObj) return [];
    const getOrderedImages = (modules: Record<string, { default: string }>) =>
      Object.keys(modules)
        .sort((a, b) => a.localeCompare(b, undefined, { numeric: true }))
        .map(path => (modules[path] as { default: string }).default);
    return [
      ...getOrderedImages(selectedBookObj.chapter0Modules),
      ...getOrderedImages(selectedBookObj.characterDescModules),
      ...getOrderedImages(selectedBookObj.chapterModules).filter(p => /chapter-(0[1-9]|1[0-3])/.test(p)),
      ...getOrderedImages(selectedBookObj.finalChapterModules),
      contraportada ? selectedBookObj.coverModules[contraportada]?.default : undefined
    ].filter(Boolean);
  }, [selectedBookObj, contraportada]);

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
            {books.map(book => 
            {
              const portadaKey = Object.keys(book.coverModules).find(p => p.includes(book.portadaName));
              return (
                <BookCard
                  key={book.id}
                  title={book.title}
                  description={book.description}
                  coverSrc={portadaKey ? book.coverModules[portadaKey]?.default : ''}
                  onClick={() => setSelectedBook(book.id)}
                />
              );
            })}
          </div>
        </div>
      )}

      {/* 2. VISTA PREVIA (La portada individual antes de abrirlo) */}
      {selectedBook && selectedBookObj && !showBook && (
        <BookPreview
          coverSrc={portada ? selectedBookObj.coverModules[portada]?.default : ''}
          onOpen={() => setShowBook(true)}
          onBack={goToLibrary}
        />
      )}

      {/* 3. CONTRAPORTADA FINAL */}
      {showBook && isAtLastPage && selectedBookObj && (
        <div className="cover-container">
          <img src={contraportada ? selectedBookObj.coverModules[contraportada]?.default : ''} alt="Contraportada" className="cover-img" />
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
            onFlip={e => setCurrentPage(e.data)}
            className="flipbook"
            style={{}}
            startPage={0}
            minWidth={100}
            maxWidth={2000}
            minHeight={100}
            maxHeight={2000}
            drawShadow={true}
            flippingTime={1000}
            useMouseEvents={true}
            clickEventForward={true}
            mobileScrollSupport={true}
            showPageCorners={true}
            startZIndex={0}
            autoSize={true}
            maxShadowOpacity={0.5}
            swipeDistance={30}
            disableFlipByClick={false}
          >
            {paginasLibro.map((img, index) => (
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
                onChange={(e) => bookRef.current?.pageFlip()?.turnToPage(parseInt((e.target as HTMLInputElement).value))}
              />
            </div>
          )}

          <div className="navigation-footer">
            <button className="nav-btn" onClick={() => bookRef.current?.pageFlip()?.flipPrev()}>←</button>
            <div className="footer-center-group">
              <button className="nav-btn home-btn" onClick={goToLibrary} title="Ir a la biblioteca">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 12L12 3l9 9" /><path d="M9 21V9h6v12" /></svg>
              </button>
              <button className={`nav-btn search-btn ${showSlider ? 'active' : ''}`} onClick={() => setShowSlider(!showSlider)}>
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
              </button>
            </div>
            <button className="nav-btn" onClick={() => bookRef.current?.pageFlip()?.flipNext()}>→</button>
          </div>
        </>
      )}
    </div>
  );
}

export default App;