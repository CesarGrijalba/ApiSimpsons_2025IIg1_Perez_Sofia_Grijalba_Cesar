import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import "./App.css"
import HomePage from "./Pages/HomePage/HomePage";
import CharacterPage from "./Pages/CharacterPage/CharacterPage";
import AboutPage from "./Pages/AboutPage/AboutPage";
import Footer from "./Components/Footer/Footer";
import About from './Pages/About/About';


const App = () => {
  return (
    <Router>
      <Routes>
        {/* Rutas estaticas */}
        <Route path="/" element={<HomePage />} />
        <Route path="/about" element={<About />} />
        {/* Rutas específicas para filtrar por tipo */}
        <Route path="/simpson/:type" element={<CharacterPage />} />
        {/* Ruta para detalles de personajes */}
        <Route path="/details/:id" element={<AboutPage />} />
      </Routes>
      <Footer />
    </Router>
  )
}

export default App
