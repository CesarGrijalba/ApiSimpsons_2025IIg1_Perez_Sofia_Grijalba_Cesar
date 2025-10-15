import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import "./HomePage.css";

import CharCard from '../../Components/CharCard/ChardCard';

const HomePage = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [hasNextPage, setHasNextPage] = useState(false);
  const [hasPrevPage, setHasPrevPage] = useState(false);
  const [totalCount, setTotalCount] = useState(0);

  // Imágenes del carrusel cambiadas a los Simpson
  const carouselImages = [
    "https://disney.images.edge.bamgrid.com/ripcut-delivery/v2/variant/disney/da6c5250-ffe6-48ce-86be-1633940ee568/compose?aspectRatio=1.78&format=webp&width=1200",
    "https://ichef.bbci.co.uk/ace/ws/640/amz/worldservice/live/assets/images/2015/02/14/150214012822_sp_los_simpson__624x351_ap.jpg.webp",
    "https://elordenmundial.com/wp-content/uploads/2021/12/Sale-a-la-luz-el-primer-episodio-de-Los-Simpson-scaled.jpg",
    "https://media.revistagq.com/photos/6273a37b59a71da663df5d84/master/pass/los-simpson-cover.jpeg"
  ];

  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex((prevIndex) => (prevIndex + 1) % carouselImages.length);
    }, 3000); // Cambia la imagen cada 3 segundos

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const fetchSimpsonsCharacters = async () => {
      try {
        setLoading(true);
        const response = await fetch(`https://thesimpsonsapi.com/api/characters?page=${currentPage}`);
        const result = await response.json();
        
        setData(result.results || []);
        setTotalPages(result.pages || 1);
        setHasNextPage(result.next !== null);
        setHasPrevPage(result.prev !== null);
        setTotalCount(result.count || 0);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching Simpson characters:", error);
        setLoading(false);
      }
    };

    fetchSimpsonsCharacters();
  }, [currentPage]);

  const goToPage = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  const goToNextPage = () => {
    if (hasNextPage) {
      setCurrentPage(prev => prev + 1);
    }
  };

  const goToPrevPage = () => {
    if (hasPrevPage) {
      setCurrentPage(prev => prev - 1);
    }
  };

  return (
    <main id='home-page'>
      {/* Carrusel de imágenes */}
      <div className="carousel-container">
        <div className="carousel-track">
          <img src={carouselImages[currentImageIndex]} alt={`Los Simpson ${currentImageIndex}`} />
        </div>
      </div>

      {/* Enlaces de navegación */}
      <div className="navigation-links" style={{ textAlign: 'center', margin: '20px 0' }}>
        <h2>Explora el mundo de los Simpson</h2>
        <div style={{ display: 'flex', gap: '20px', justifyContent: 'center', flexWrap: 'wrap' }}>
          <Link to="/simpson/characters" style={{ padding: '10px 20px', backgroundColor: '#007bff', color: 'white', textDecoration: 'none', borderRadius: '5px' }}>
            Personajes
          </Link>
          <Link to="/simpson/locations" style={{ padding: '10px 20px', backgroundColor: '#e91e63', color: 'white', textDecoration: 'none', borderRadius: '5px' }}>
            Locaciones
          </Link>
          <Link to="/simpson/episodes" style={{ padding: '10px 20px', backgroundColor: '#4caf50', color: 'white', textDecoration: 'none', borderRadius: '5px' }}>
            Episodios
          </Link>
        </div>
      </div>

      <div id='characters'>
        {data.map((element) => (
          <Link key={element.id} to={"/details/" + element.id}>
            <CharCard 
              img={`https://cdn.thesimpsonsapi.com/500${element.portrait_path}`} 
              nombre={element.name} 
              race={element.occupation || "Springfield"} 
            />
          </Link>
        ))}
      </div>
      
      {loading && <p>Cargando personajes de los Simpson...</p>}
      
      {/* Controles de paginación */}
      {!loading && (
        <div className="pagination-controls">
          <button 
            onClick={goToPrevPage}
            disabled={!hasPrevPage}
            className="pagination-btn"
          >
            ← Anterior
          </button>
          
          <div className="page-info">
            <span>Página {currentPage} de {totalPages}</span>
            <span className="total-count">({totalCount} personajes total)</span>
          </div>
          
          <div className="page-numbers">
            {Array.from({ length: Math.min(4, totalPages) }, (_, i) => {
              const pageNumber = Math.max(1, Math.min(totalPages - 4, currentPage - 2)) + i;
              return (
                <button
                  key={pageNumber}
                  onClick={() => goToPage(pageNumber)}
                  className={`page-number-btn ${currentPage === pageNumber ? 'active' : ''}`}
                >
                  {pageNumber}
                </button>
              );
            })}
          </div>
          
          <button 
            onClick={goToNextPage}
            disabled={!hasNextPage}
            className="pagination-btn"
          >
            Siguiente →
          </button>
        </div>
      )}
    </main>
  );
};

export default HomePage;
