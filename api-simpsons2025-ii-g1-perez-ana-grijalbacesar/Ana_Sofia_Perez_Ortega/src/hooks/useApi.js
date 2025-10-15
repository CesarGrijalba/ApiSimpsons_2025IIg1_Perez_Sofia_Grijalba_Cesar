import { useState, useEffect } from 'react';

/**
 * Hook personalizado para consumir APIs con fetch
 * @param {string} url - URL de la API
 * @param {object} options - Opciones adicionales para fetch
 * @returns {object} - { data, loading, error, refetch }
 */
export const useApi = (url, options = {}) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          ...options.headers
        },
        ...options
      });

      if (!response.ok) {
        throw new Error(`Error ${response.status}: ${response.statusText}`);
      }

      const result = await response.json();
      setData(result);
    } catch (err) {
      console.error('Error fetching data:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (url) {
      fetchData();
    }
  }, [url]);

  const refetch = () => {
    fetchData();
  };

  return { data, loading, error, refetch };
};

// Configuraciones predefinidas para diferentes APIs
export const API_CONFIGS = {
  simpsons: {
    baseUrl: 'https://thesimpsonsapi.com/api',
    endpoints: {
      characters: '/characters',
      character: (id) => `/characters/${id}`
    }
  },
  dragonball: {
    baseUrl: 'https://dragonball-api.com/api',
    endpoints: {
      characters: '/characters?limit=50',
      character: (id) => `/characters/${id}`
    }
  },
  rickandmorty: {
    baseUrl: 'https://rickandmortyapi.com/api',
    endpoints: {
      characters: '/character',
      character: (id) => `/character/${id}`
    }
  }
  // Agrega más APIs según necesites
};

/**
 * Hook específico para consumir API de personajes
 * @param {string} apiName - Nombre de la API (dragonball, simpsons, etc.)
 * @param {string} endpoint - Endpoint específico
 * @returns {object} - { data, loading, error, refetch }
 */
export const useCharactersApi = (apiName = 'simpsons', endpoint = 'characters') => {
  const config = API_CONFIGS[apiName];

  if (!config) {
    throw new Error(`API configuration for "${apiName}" not found`);
  }

  const url = `${config.baseUrl}${config.endpoints[endpoint]}`;
  return useApi(url);
};

/**
 * Hook específico para la API de los Simpson que maneja paginación
 * @param {number} maxPages - Número máximo de páginas a cargar (default: 5)
 * @returns {object} - { data, loading, error, refetch }
 */
export const useSimpsonsCharacters = (maxPages = 5) => {
  const [allCharacters, setAllCharacters] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchAllCharacters = async () => {
    try {
      setLoading(true);
      setError(null);
      const charactersPromises = [];

      // La API de Simpson devuelve 20 personajes por página
      for (let page = 1; page <= maxPages; page++) {
        charactersPromises.push(
          fetch(`https://thesimpsonsapi.com/api/{page}`)
            .then(response => {
              if (!response.ok) {
                throw new Error(`Error ${response.status}: ${response.statusText}`);
              }
              return response.json();
            })
        );
      }

      const results = await Promise.all(charactersPromises);
      const allData = results.flatMap(result => result.docs || result || []);

      setAllCharacters(allData);
    } catch (err) {
      console.error('Error fetching Simpson characters:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAllCharacters();
  }, [maxPages]);

  const refetch = () => {
    fetchAllCharacters();
  };

  return {
    data: allCharacters,
    loading,
    error,
    refetch
  };
};
