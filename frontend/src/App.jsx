import { Box, Typography, Toolbar } from '@mui/material';
import AppBar from './components/AppBar'
import HeroSection from './components/HeroSection';
import Footer from './components/Footer';
import Contactos from './pages/Contactos'

function App() {
  return (
    <>
      <Box sx={{ flexGrow: 1 }}>

        <AppBar />
        <Toolbar />

        <Contactos />

        <HeroSection /> {/* <--- Adiciona a tua Hero Section aqui */}

        <Box sx={{ p: 3 }}>
          <Typography variant="h4" gutterBottom>
            Bem-vindo à MEC: MaqEspinhoCork v2025!
          </Typography>

          <Typography variant="body1" component="p">
            O site está a ganhar forma. Esta é a área de conteúdo principal.
          </Typography>
        </Box>
        <Footer />
      </Box>
    </>
  )
}

export default App