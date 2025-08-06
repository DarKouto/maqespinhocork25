import { Box, Toolbar } from '@mui/material';
import { GlobalStyles } from '@mui/system';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import AppBar from './components/AppBar';
import HeroSection from './components/HeroSection';
import Footer from './components/Footer';
import Contactos from './components/Contactos';
import MachinesSection from './components/MachinesSection'; // <--- Importa o MachinesSection

function App() {
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

      <AppBar />
      <Toolbar />

      <Box sx={{ flexGrow: 1 }}>
        <Routes>
          <Route path="/" element={
            <>
              <HeroSection />
              
              <Box id="content-start" sx={{ p: 3 }}>
                <MachinesSection />
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