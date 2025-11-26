// VERSION 0.86
import { useState } from 'react';
import { Routes, Route } from 'react-router-dom'; 
import { ThemeProvider } from '@mui/material/styles';
import theme from './theme';
import { CssBaseline, Box } from '@mui/material';
import AppBar from './components/AppBar';
import HeroSection from './components/HeroSection';
import MachinesSection from './components/MachinesSection';
import Footer from './components/Footer';
import Contactos from './components/Contactos';
import ProtectedRoute from './components/ProtectedRoute';
import Dashboard from './components/Dashboard';

function App() {
  const [searchTerm, setSearchTerm] = useState('');
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
        <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
          <AppBar searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
          <Box component="main" sx={{ flexGrow: 1, mt: 8 }}>
            <Routes>
              <Route path="/" element={
                <>
                  <HeroSection />
                  <div id="content-start">
                    <MachinesSection searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
                  </div>
                </>
              } />
              <Route path="/contactos" element={<Contactos />} />
              <Route 
                path="/admin" 
                element={<ProtectedRoute element={Dashboard} />} 
              />
            </Routes>
          </Box>
          <Footer />
        </Box>
    </ThemeProvider>
  );
}

export default App;