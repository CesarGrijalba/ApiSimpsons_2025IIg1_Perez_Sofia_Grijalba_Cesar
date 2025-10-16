import "./CharacterPage.css";
import { useParams, Link } from "react-router-dom";
import { useState, useEffect } from "react";
import CharCard from "../../Components/CharCard/ChardCard";

// Helper para imágenes desde el CDN correcto
const cdn = (p, size = 500) => (p ? `https://cdn.thesimpsonsapi.com/${size}${p}` : "/placeholder.jpg");

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

  const getEndpoint = () => {
    switch (type) {
      case "locations":
        return "locations";
      case "episodes":
        return "episodes";
      default:
        return "characters";
    }
  };

  const getTitle = () => {
    switch (type) {
      case "locations":
        return "Locaciones de los Simpson";
      case "episodes":
        return "Episodios de los Simpson";
      default:
        return "Personajes de los Simpson";
    }
  };

  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);

      const endpoint = getEndpoint();
      const response = await fetch(`https://thesimpsonsapi.com/api/${endpoint}?page=${currentPage}`);
      if (!response.ok) throw new Error(`Error ${response.status}: ${response.statusText}`);

      const result = await response.json();
      const items = Array.isArray(result) ? result : result.results || [];

      setData(items);
      setTotalPages(result.pages || 1);
      setHasNextPage(Boolean(result.next));
      setHasPrevPage(Boolean(result.prev));
      setTotalCount(result.count ?? items.length ?? 0);
    } catch (err) {
      setError(err.message || "Error al cargar");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    setCurrentPage(1); // si cambias de tipo, vuelve al inicio
  }, [type]);

  useEffect(() => {
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [type, currentPage]);

  const goToNextPage = () => hasNextPage && setCurrentPage((p) => p + 1);
  const goToPrevPage = () => hasPrevPage && setCurrentPage((p) => Math.max(1, p - 1));
  const goToPage = (page) => page >= 1 && page <= totalPages && setCurrentPage(page);

  const renderContent = () => {
    if (type === "locations") {
      return data.map((item) => {
        const path = item.image_path ?? item.portrait_path;
        const src = cdn(path);
        // algunas APIs usan otros nombres para el tipo
        const locType = item.type || item.location_type || item.category || "";

        return (
          <div key={item.id} className="item-card" style={{ textDecoration: "none", color: "inherit" }}>
            <img
              src={src}
              alt={item.name}
              style={{ width: "100%", height: 160, objectFit: "cover", borderRadius: 10, marginBottom: 8 }}
              onError={(e) => (e.currentTarget.src = "/placeholder.jpg")}
            />
            <h3 style={{ marginTop: 0 }}>{item.name}</h3>
            {locType && <p style={{ opacity: 0.8, margin: 0 }}>Tipo: {locType}</p>}
          </div>
        );
      });
    }

    if (type === "episodes") {
      const fmt = (d) => (d ? new Date(d).toLocaleDateString() : "—");
      return data.map((item) => {
        const path = item.image_path ?? item.portrait_path;
        const src = cdn(path);
        const epNum = item.episode_number ?? item.episode;

        return (
          <div key={item.id} className="item-card" style={{ textDecoration: "none", color: "inherit" }}>
            <img
              src={src}
              alt={item.name}
              style={{ width: "100%", height: 160, objectFit: "cover", borderRadius: 10, marginBottom: 8 }}
              onError={(e) => (e.currentTarget.src = "/placeholder.jpg")}
            />
            <h3 style={{ marginTop: 0 }}>{item.name}</h3>
            <p style={{ margin: 0, opacity: 0.8 }}>
              Temporada: {item.season ?? "—"} · Episodio: {epNum ?? "—"}
            </p>
            <small>Emisión: {fmt(item.air_date)}</small>
          </div>
        );
      });
    }

    // default: personajes (sí son clickeables hacia /details/:id)
    return data.map((element) => (
      <div key={element.id}>
        <Link to={"/details/" + element.id} title="Ver detalles del personaje">
          <CharCard img={cdn(element.portrait_path)} nombre={element.name} race={element.occupation || "Springfield"} />
        </Link>
      </div>
    ));
  };

  if (loading) return <div className="loading">Cargando {getTitle().toLowerCase()}...</div>;
  if (error) return <div className="error">Error: {error}</div>;

  const start = Math.max(1, Math.min(totalPages - 4, currentPage - 2));
  const pages = Array.from({ length: Math.min(5, totalPages) }, (_, i) => start + i);

  return (
    <main id="character-page">
      <h1 id="title-character">{getTitle()}</h1>

      <div id="characters-species">
        {data.length > 0 ? (
          renderContent()
        ) : (
          <div className="no-results">No se encontraron resultados para esta categoría.</div>
        )}
      </div>

      {/* Controles de paginación */}
      {!loading && totalPages > 1 && (
        <div className="pagination-controls">
          <button onClick={goToPrevPage} disabled={!hasPrevPage} className="pagination-btn">
            ← Anterior
          </button>

          <div className="page-info">
            <span>
              Página {currentPage} de {totalPages}
            </span>
            <span className="total-count">
              ({totalCount} {type === "episodes" ? "episodios" : type === "locations" ? "locaciones" : "personajes"} total)
            </span>
          </div>

          <div className="page-numbers">
            {pages.map((pageNumber) => (
              <button
                key={pageNumber}
                onClick={() => goToPage(pageNumber)}
                className={`page-number-btn ${currentPage === pageNumber ? "active" : ""}`}
              >
                {pageNumber}
              </button>
            ))}
          </div>

          <button onClick={goToNextPage} disabled={!hasNextPage} className="pagination-btn">
            Siguiente →
          </button>
        </div>
      )}
    </main>
  );
};

export default CharacterPage;
