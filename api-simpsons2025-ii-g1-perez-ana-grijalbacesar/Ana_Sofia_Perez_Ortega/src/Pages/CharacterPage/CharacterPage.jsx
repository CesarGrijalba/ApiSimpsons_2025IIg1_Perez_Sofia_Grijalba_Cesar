import "./CharacterPage.css";
import { useParams, Link } from "react-router-dom";
import { useState, useEffect } from "react";
import CharCard from "../../Components/CharCard/ChardCard";

const CharacterPage = () => {
  const { type } = useParams();
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [hasNextPage, setHasNextPage] = useState(false);
  const [hasPrevPage, setHasPrevPage] = useState(false);
  const [totalCount, setTotalCount] = useState(0);

  // Determinar el endpoint basado en el tipo de la URL
  const getEndpoint = () => {
    switch (type) {
      case 'locations':
        return 'locations';
      case 'episodes':
        return 'episodes';
      default:
        return 'characters';
    }
  };

  // Función para obtener datos de la API
  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const endpoint = getEndpoint();
      const response = await fetch(`https://thesimpsonsapi.com/api/${endpoint}?page=${currentPage}`);
      
      if (!response.ok) {
        throw new Error(`Error ${response.status}: ${response.statusText}`);
      }
      
      const result = await response.json();
      
      setData(result.results || []);
      setTotalPages(result.pages || 1);
      setHasNextPage(result.next !== null);
      setHasPrevPage(result.prev !== null);
      setTotalCount(result.count || 0);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [type, currentPage]);

  // Funciones de navegación
  const goToNextPage = () => hasNextPage && setCurrentPage(prev => prev + 1);
  const goToPrevPage = () => hasPrevPage && setCurrentPage(prev => prev - 1);
  const goToPage = (page) => page >= 1 && page <= totalPages && setCurrentPage(page);

  // Función para obtener el título
  const getTitle = () => {
    switch (type) {
      case 'locations':
        return 'Locaciones de los Simpson';
      case 'episodes':
        return 'Episodios de los Simpson';
      default:
        return 'Personajes de los Simpson';
    }
  };

  // Función para renderizar el contenido según el tipo
  const renderContent = () => {
    if (type === 'locations' || type === 'episodes') {
      return data.map((item) => (
        <div key={item.id} className="item-card">
          <h3>{item.name}</h3>
          {type === 'locations' && <p>Tipo: {item.type || 'Desconocido'}</p>}
          {type === 'episodes' && (
            <>
              <p>Temporada: {item.season}</p>
              <p>Episodio: {item.episode_number}</p>
              <p>Fecha: {item.air_date}</p>
            </>
          )}
        </div>
      ));
    }

    // Para personajes (default)
    return data.map((element) => (
      <div key={element.id}>
        <Link to={"/details/" + element.id}>
          <CharCard 
            img={`https://cdn.thesimpsonsapi.com/500${element.portrait_path}`} 
            nombre={element.name} 
            race={element.occupation || "Springfield"} 
          />           
        </Link>            
      </div>
    ));
  };

  if (loading) return <div className="loading">Cargando {getTitle().toLowerCase()}...</div>;
  if (error) return <div className="error">Error: {error}</div>;

  return (
    <main id='character-page'>
      <h1 id="title-character">{getTitle()}</h1>
      
      <div id="characters-species">
        {data.length > 0 ? renderContent() : (
          <div className="no-results">
            No se encontraron resultados para esta categoría.
          </div>
        )}
      </div>

      {/* Controles de paginación */}
      {!loading && totalPages > 1 && (
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
            <span className="total-count">({totalCount} {type === 'episodes' ? 'episodios' : type === 'locations' ? 'locaciones' : 'personajes'} total)</span>
          </div>
          
          <div className="page-numbers">
            {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
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
}

export default CharacterPage;
