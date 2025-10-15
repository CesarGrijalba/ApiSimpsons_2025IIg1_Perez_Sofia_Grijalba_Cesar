import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Container, Typography, Box, Grid, Button } from '@mui/material';
import './AboutPage.css';

function CharacterDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [character, setCharacter] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCharacter = async () => {
      try {
        // 🔹 Endpoint de The Simpsons API
        const response = await axios.get(`https://thesimpsonsapi.com/api/characters/${id}`);
        setCharacter(response.data);
      } catch (err) {
        console.error(err);
        setError('No se pudo cargar la información del personaje.');
      } finally {
        setLoading(false);
      }
    };

    fetchCharacter();
  }, [id]);

  if (loading) {
    return (
      <Container maxWidth="lg" id="character-detail">
        <Typography variant="h5">Cargando...</Typography>
      </Container>
    );
  }

  if (error) {
    return (
      <Container maxWidth="lg" id="character-detail">
        <Typography variant="h5">{error}</Typography>
      </Container>
    );
  }

  if (!character) {
    return (
      <Container maxWidth="lg" id="character-detail">
        <Typography variant="h5">Personaje no encontrado.</Typography>
      </Container>
    );
  }

  // 🔸 Si la API devuelve un array, usamos el primer elemento
  const charData = Array.isArray(character) ? character[0] : character;

  return (
    <Container maxWidth="lg" id="character-detail">
      <Typography variant="h4" gutterBottom>
        Detalles del personaje
      </Typography>

      <Grid container spacing={2} alignItems="center">
        <Grid item xs={12} sm={6} md={4}>
          <img
            src={charData.image}
            alt={charData.character}
            style={{ width: '100%', borderRadius: '12px' }}
          />
        </Grid>

        <Grid item xs={12} sm={6} md={8} className="character-info">
          <Box sx={{ mb: 2 }}>
            <div className="card-z">
              <p><span>Nombre:</span> {charData.character}</p>
              <p><span>Frase:</span> {charData.quote}</p>
              <p><span>Dirección:</span> {charData.direction}</p>
            </div>
          </Box>
        </Grid>
      </Grid>

      <Button
        variant="contained"
        className="back-button"
        onClick={() => navigate(-1)}
        sx={{
          mt: 3,
          backgroundColor: '#ffd90f',
          color: '#000',
          fontWeight: 700,
          '&:hover': { backgroundColor: '#ffea70' },
        }}
      >
        Atrás
      </Button>
    </Container>
  );
}

export default CharacterDetail;
