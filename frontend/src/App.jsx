// src/App.jsx
import { useState } from 'react'; // <--- Importado useState
import { Box, Toolbar } from '@mui/material';
import { GlobalStyles } from '@mui/system';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import AppBar from './components/AppBar';
import HeroSection from './components/HeroSection';
import Footer from './components/Footer';
import Contactos from './components/Contactos';
import MachinesSection from './components/MachinesSection';

function App() {
  const [searchTerm, setSearchTerm] = useState(''); // <--- Novo estado para a pesquisa

  return (
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

      {/* Passar o setSearchTerm para o AppBar para que ele possa atualizar o estado */}
      <AppBar setSearchTerm={setSearchTerm} /> 
      <Toolbar />

      <Box sx={{ flexGrow: 1 }}>
        <Routes>
          <Route path="/" element={
            <>
              <HeroSection />
              
              <Box id="content-start" sx={{ p: 3 }}>
                {/* Passar o termo de pesquisa para o MachinesSection */}
                <MachinesSection searchTerm={searchTerm} /> 
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