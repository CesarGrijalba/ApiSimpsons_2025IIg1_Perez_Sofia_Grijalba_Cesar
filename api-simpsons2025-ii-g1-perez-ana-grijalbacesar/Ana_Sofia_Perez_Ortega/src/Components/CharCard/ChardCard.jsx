import * as React from 'react';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Typography from '@mui/material/Typography';
import CardActionArea from '@mui/material/CardActionArea';
import './CharCard.css'; // 👈 Importar estilos externos

const CharCard = (props) => {
  return (
    <Card className="char-card">
      <CardActionArea>
        <div className="char-card-img-container">
          <CardMedia
          
            component="img"
            image={props.img}
            alt={`${props.nombre} - ${props.race}`}
            className="char-card-img"
          />
        </div>
        <CardContent>
          <Typography className="char-card-title">
            {props.nombre}<br />{props.race}
          </Typography>
        </CardContent>
      </CardActionArea>
    </Card>
  );
};
<Card className="char-card no-overflow"></Card>

CharCard.defaultProps = {
  img: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS8GAcNf2A8wsr7rHBPhxfvi36V6Aq2kswNUg&s",
  nombre: "LALA",
  race: "No identificada"
};

export default CharCard;
