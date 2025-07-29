// src/App.jsx
import { Box, Typography, Toolbar } from '@mui/material';
import { GlobalStyles } from '@mui/system'; // <-- Importa GlobalStyles
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import AppBar from './components/AppBar';
import HeroSection from './components/HeroSection';
import Footer from './components/Footer';
import Contactos from './components/Contactos';

function App() {
  return (
    <Router>
      {/* GlobalStyles para remover margens/paddings padrão do navegador */}
      <GlobalStyles
        styles={{
          html: {
            margin: 0,
            padding: 0,
            width: '100%',
            height: '100%',
            overflowX: 'hidden', // Evita scroll horizontal indesejado
            boxSizing: 'border-box', // Garante que padding e border estão incluídos na largura/altura
          },
          body: {
            margin: 0,
            padding: 0,
            width: '100%',
            height: '100%',
            overflowX: 'hidden',
            boxSizing: 'border-box',
            maxWidth: '100vw', // Garante que o body ocupa a largura total da viewport
          },
          // Opcional, mas útil para o elemento root do React app
          '#root': {
            margin: 0,
            padding: 0,
            width: '100%',
            height: '100%',
            boxSizing: 'border-box',
          },
        }}
      />

      <AppBar />
      <Toolbar />

      <Box sx={{ flexGrow: 1 }}>
        <Routes>
          <Route path="/" element={
            <>
              <HeroSection />
              {/* Esta Box interna agora SIM terá padding, para que o texto não cole às bordas */}
              <Box sx={{ p: 3 }}> {/* Ajustei para p: 3, mas podes mudar se quiseres mais/menos espaço */}
                <Typography variant="h4" gutterBottom>
                  Bem-vindo à MEC: MaqEspinhoCork v2025!
                </Typography>
                <Typography variant="body1" component="p">
                  O site está a ganhar forma. Esta é a área de conteúdo principal.
                </Typography>
              </Box>
            </>
          } />
          <Route path="/contactos" element={<Contactos />} />
        </Routes>
      </Box>

      <Footer />
    </Router>
  );
}

export default App;