// src/Components/Footer/Footer.jsx
import "./Footer.css";
import NavBar from "../NavBar/NavBar";
import { MdLocationOn, MdEmail, MdPhone, MdPublic } from "react-icons/md";

const Footer = () => {
  return (
    <footer className="footer">
      {/* Tu barra de navegación tal como la tienes */}
      <NavBar />

      {/* Bloque de información con íconos SVG (no requiere fuentes externas) */}
      <div className="footer__info">
        <p><MdLocationOn className="footer__icon" /> Tuluá, Valle del Cauca</p>
        <p>
          <MdEmail className="footer__icon" />
          <a href="mailto:contacto@ejemplo.com">contacto@ejemplo.com</a>
        </p>
        <p>
          <MdPhone className="footer__icon" />
          <a href="tel:+573000000000">+57 300 000 0000</a>
        </p>
        <p>
          <MdPublic className="footer__icon" />
          <a href="https://tu-sitio.com" target="_blank" rel="noreferrer">
            tu-sitio.com
          </a>
        </p>
      </div>

      <small className="footer__copy">
        © {new Date().getFullYear()} Proyecto Simpsons — Todos los derechos reservados.
      </small>
    </footer>
  );
};

export default Footer;
