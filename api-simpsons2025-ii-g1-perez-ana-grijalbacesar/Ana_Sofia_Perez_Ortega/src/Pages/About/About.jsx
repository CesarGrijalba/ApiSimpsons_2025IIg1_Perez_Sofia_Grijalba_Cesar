import React from 'react';
import { Container, Typography, Card, CardContent, CardMedia, Box, Grid } from '@mui/material';
import './About.css';


const About = () => {
  const characters = [
 
 
  ];

  

  return (
    <Container maxWidth="md" className="container">
      <Box display="flex" justifyContent="center">
        <Card >
          <CardMedia
            className="card-media"
            image="https://disney.images.edge.bamgrid.com/ripcut-delivery/v2/variant/disney/da6c5250-ffe6-48ce-86be-1633940ee568/compose?aspectRatio=1.78&format=webp&width=1200"
            alt="The Simpsons"
          />
          <CardContent>
            <Typography variant="h5" component="div" align="center">
              La historia de Los Simpson
            </Typography>
            <Typography variant="body2" color="text.secondary" align="justify">
            Los Simpson nacieron como cortos animados en The Tracey Ullman Show en 1987,
            creados por Matt Groening. Debido a su éxito, se convirtieron en una serie 
            independiente que debutó en 1989 y se estrenó a nivel regular en enero de 
            1990 en Fox. La serie se basa en una familia disfuncional y ha sido un hito 
            cultural, ganando numerosos premios y recibiendo una estrella en el Paseo de 
            la Fama de Hollywood en el año 2000. 
            </Typography>
          </CardContent>
        </Card>
      </Box>
      <Grid container spacing={2} style={{ marginTop: '20px' }}>
        {characters.map((character, index) => (
          <Grid item xs={12} sm={4} key={index}>
            <Card className="card">
              <CardMedia
                component="img"
                height="200"
                image={character.image}
                alt={character.name}
              />
              <CardContent>
                <Typography variant="h6" component="div" align="center">
                  {character.name}
                </Typography>
                <Typography variant="body2" color="text.secondary" align="justify">
                  {character.description}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      <Box className="footer-bar">
  <Typography variant="body1" align="center">
    © 2025 - ANA SOFÍA PÉREZ ORTEGA - CESAR GRIJALBA
  </Typography>
</Box>

    </Container>
  );
};



export default About;
