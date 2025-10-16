import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import "./App.css";
import HomePage from "./Pages/HomePage/HomePage";
import CharacterPage from "./Pages/CharacterPage/CharacterPage";
import CharacterDetails from "./Pages/CharacterDetails.jsx";
import About from "./Pages/About/About";           // <-- usa UNO: About O AboutPage
// import AboutPage from "./Pages/AboutPage/AboutPage"; // (si prefieres este, usa este import y cambia la ruta)
import Footer from "./Components/Footer/Footer";

const App = () => {
  return (
    <Router>
      <Routes>
        {/* Rutas estáticas */}
        <Route path="/" element={<HomePage />} />
        <Route path="/about" element={<About />} /> 
        {/* Si prefieres AboutPage, cambia a: element={<AboutPage />} */}

        {/* Listado dinámico por tipo (characters/locations/episodes) */}
        <Route path="/simpson/:type" element={<CharacterPage />} />

        {/* Detalle por id del personaje */}
        <Route path="/details/:id" element={<CharacterDetails />} />
        
        {/* (Opcional) 404 */}
        {/* <Route path="*" element={<NotFound />} /> */}
      </Routes>

      <Footer />
    </Router>
  );
};

export default App;
