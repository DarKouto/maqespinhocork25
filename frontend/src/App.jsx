// src/App.jsx
import { useState } from 'react';
import { Box, Toolbar } from '@mui/material';
import { GlobalStyles } from '@mui/system';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

// --- NOVAS IMPORTAÇÕES ---
import { ThemeProvider } from '@mui/material/styles';
import theme from './theme';
// --- FIM NOVAS IMPORTAÇÕES ---

import AppBar from './components/AppBar';
import HeroSection from './components/HeroSection';
import Footer from './components/Footer';
import Contactos from './components/Contactos';
import MachinesSection from './components/MachinesSection';

function App() {
  const [searchTerm, setSearchTerm] = useState('');

  return (
    // Envolver toda a aplicação com o ThemeProvider
    <ThemeProvider theme={theme}> 
      <Router>
        <GlobalStyles
          styles={{
            html: {
              margin: 0,
              padding: 0,
              width: '100%',
              height: '100%',
              overflowX: 'hidden',
              boxSizing: 'border-box',
            },
            body: {
              margin: 0,
              padding: 0,
              width: '100%',
              height: '100%',
              overflowX: 'hidden',
              boxSizing: 'border-box',
              maxWidth: '100vw',
              backgroundColor: '#f5f5f5', // Usamos a cor do tema para o body
            },
            '#root': {
              margin: 0,
              padding: 0,
              width: '100%',
              height: '100%',
              boxSizing: 'border-box',
            },
          }}
        />

        <AppBar setSearchTerm={setSearchTerm} />
        <Toolbar />

        <Box sx={{ flexGrow: 1 }}>
          <Routes>
            <Route path="/" element={
              <>
                <HeroSection />
                
                <Box id="content-start" sx={{ p: 3 }}>
                  <MachinesSection searchTerm={searchTerm} />
                </Box>  
              </>
            } />
            <Route path="/contactos" element={<Contactos />} />
          </Routes>
        </Box>

        <Footer />
      </Router>
    </ThemeProvider>
  );
}

export default App;