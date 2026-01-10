import { useState, useEffect, useRef } from "react";

// Dane slajdów z tekstami
const slides = [
  {
    id: 1,
    image: "https://images.unsplash.com/photo-1555774698-0b77e0d5fac6?w=1200",
    title: "SZERMIERKA HISTORYCZNA",
    description: "Dawne europejskie sztuki walki – sport walki oparty na odtwarzaniu dawnych europejskich technik bojowych."
  },
  {
    id: 2,
    image: "https://images.unsplash.com/photo-1599058917212-d750089bc07e?w=1200",
    title: "HEMA",
    description: "Dawne europejskie sztuki walki – sport walki oparty na odtwarzaniu dawnych europejskich technik bojowych. Łączy badania historyczne z praktyką, odtwarzając tradycyjne style szermierki i walki przy użyciu symulatorów broni historycznej, takich jak miecze, szable i inne."
  },
  {
    id: 3,
    image: "https://plus.unsplash.com/premium_photo-1661963063875-7f131e02bf75?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    title: "TRENINGI",
    description: "Profesjonalne zajęcia prowadzone przez doświadczonych instruktorów w nowoczesnych salach treningowych."
  },
  {
    id: 4,
    image: "https://images.unsplash.com/photo-1635365737298-3a64d9459d83?q=80&w=1177&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    title: "EKWIPUNEK",
    description: "Pełne wyposażenie treningowe dostępne dla wszystkich członków klubu."
  }
];

export default function LoginSlider() {
  const [index, setIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const [progress, setProgress] = useState(0);
  const intervalRef = useRef(null);
  const progressRef = useRef(null);

  const SLIDE_DURATION = 5000; // 5 sekund

  const prev = () => {
    setIndex((prev) => (prev - 1 + slides.length) % slides.length);
    setProgress(0);
  };

  const next = () => {
    setIndex((prev) => (prev + 1) % slides.length);
    setProgress(0);
  };

  const goToSlide = (slideIndex) => {
    setIndex(slideIndex);
    setProgress(0);
  };

  // Automatyczne przewijanie i pasek postępu
  useEffect(() => {
    if (isPlaying) {
      // Pasek postępu
      progressRef.current = setInterval(() => {
        setProgress((prev) => {
          if (prev >= 100) {
            return 0;
          }
          return prev + (100 / (SLIDE_DURATION / 50));
        });
      }, 50);

      // Zmiana slajdu
      intervalRef.current = setInterval(() => {
        setIndex((prev) => (prev + 1) % slides.length);
        setProgress(0);
      }, SLIDE_DURATION);
    }

    return () => {
      clearInterval(intervalRef.current);
      clearInterval(progressRef.current);
    };
  }, [isPlaying, index]);

  return (
    <div style={styles.slider}>
      {/* Obrazek z tekstem overlay */}
      <div style={styles.imageContainer}>
        <img
          key={index}
          src={slides[index].image}
          alt={slides[index].title}
          style={styles.image}
        />
        
        {/* Ciemna nakładka dla lepszej czytelności tekstu */}
        <div style={styles.overlay}></div>

        {/* Tekst na obrazku */}
        <div style={styles.textOverlay}>
          <h1 style={styles.title}>{slides[index].title}</h1>
          <p style={styles.description}>{slides[index].description}</p>
        </div>
      </div>

      {/* Numeracja slajdów (01, 02, 03, 04) */}
      <div style={styles.pagination}>
        {slides.map((slide, i) => (
          <button
            key={slide.id}
            onClick={() => goToSlide(i)}
            style={{
              ...styles.paginationButton,
              ...(i === index ? styles.paginationButtonActive : {})
            }}
          >
            {String(i + 1).padStart(2, '0')}
          </button>
        ))}
      </div>

      {/* Przyciski kontrolne */}
      <div style={styles.controls}>
        <button onClick={prev} style={styles.controlButton}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2">
            <polyline points="15 18 9 12 15 6"></polyline>
          </svg>
        </button>
        
        <button onClick={() => setIsPlaying(!isPlaying)} style={styles.controlButton}>
          {isPlaying ? (
            <svg width="20" height="20" viewBox="0 0 24 24" fill="white">
              <rect x="6" y="4" width="4" height="16"></rect>
              <rect x="14" y="4" width="4" height="16"></rect>
            </svg>
          ) : (
            <svg width="20" height="20" viewBox="0 0 24 24" fill="white">
              <polygon points="5 3 19 12 5 21 5 3"></polygon>
            </svg>
          )}
        </button>
        
        <button onClick={next} style={styles.controlButton}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2">
            <polyline points="9 18 15 12 9 6"></polyline>
          </svg>
        </button>
      </div>

      {/* Pasek postępu */}
      <div style={styles.progressBar}>
        <div 
          style={{
            ...styles.progressFill,
            width: `${progress}%`
          }}
        ></div>
      </div>
    </div>
  );
}

const styles = {
  slider: {
    width: '100%',
    height: '100%',
    position: 'relative',
    overflow: 'hidden',
    backgroundColor: '#000'
  },
  imageContainer: {
    width: '100%',
    height: '100%',
    position: 'relative'
  },
  image: {
    width: '100%',
    height: '100%',
    objectFit: 'cover',
    objectPosition: 'center',
    display: 'block'
  },
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: 'linear-gradient(to right, rgba(0, 0, 0, 0.7) 0%, rgba(0, 0, 0, 0.3) 50%, transparent 100%)',
    pointerEvents: 'none'
  },
  textOverlay: {
    position: 'absolute',
    top: '50%',
    left: '60px',
    transform: 'translateY(-50%)',
    maxWidth: '500px',
    color: 'white',
    zIndex: 10
  },
  title: {
    fontSize: '48px',
    fontWeight: 'bold',
    marginBottom: '20px',
    letterSpacing: '2px',
    textTransform: 'uppercase',
    lineHeight: '1.2'
  },
  description: {
    fontSize: '16px',
    lineHeight: '1.6',
    opacity: 0.9
  },
  pagination: {
    position: 'absolute',
    bottom: '80px',
    right: '60px',
    display: 'flex',
    gap: '15px',
    zIndex: 20
  },
  paginationButton: {
    background: 'transparent',
    border: 'none',
    color: 'rgba(255, 255, 255, 0.5)',
    fontSize: '16px',
    cursor: 'pointer',
    padding: '5px 0',
    fontWeight: '500',
    transition: 'all 0.3s ease',
    position: 'relative'
  },
  paginationButtonActive: {
    color: 'white',
    fontWeight: 'bold'
  },
  controls: {
    position: 'absolute',
    bottom: '20px',
    right: '60px',
    display: 'flex',
    gap: '10px',
    zIndex: 20
  },
  controlButton: {
    background: 'rgba(0, 0, 0, 0.8)',
    border: '1px solid rgba(255, 255, 255, 0.2)',
    color: 'white',
    width: '50px',
    height: '50px',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    transition: 'all 0.3s ease',
    backdropFilter: 'blur(10px)'
  },
  progressBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: '3px',
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    zIndex: 30
  },
  progressFill: {
    height: '100%',
    backgroundColor: 'white',
    transition: 'width 0.05s linear'
  }
};