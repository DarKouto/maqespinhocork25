import { Box, Typography, Toolbar } from '@mui/material';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import AppBar from './components/AppBar'
import HeroSection from './components/HeroSection';
import Footer from './components/Footer';
import Contactos from './components/Contactos'

function App() {
  return (
    <Router>
      <Box sx={{ flexGrow: 1 }}>

        <AppBar />
        <Toolbar />

        <Routes>
          <Route path="/" element={
            <>
              <HeroSection />
              <Box sx={{ p: 3 }}>
                <Typography variant="h4" gutterBottom>
                  Bem-vindo à MEC: MaqEspinhoCork v2025!
                </Typography>
                <Typography variant="body1" component="p">
                  O site está a ganhar forma. Esta é a área de conteúdo principal.
                </Typography>
              </Box>
            </>
          }
          />
          <Route path="/contactos" element={<Contactos />} />
        </Routes>

        <Footer />
      </Box>
    </Router>
  )
}

export default App