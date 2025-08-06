// src/components/HeroSection.jsx
import { Box, Typography, Button } from '@mui/material';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import fundoPlaceholder from '../images/fundo-placeholder.jpg';

function HeroSection() {
  const backgroundImage = fundoPlaceholder;
  
  const handleScrollDown = () => {
    const targetElement = document.getElementById('content-start');
    if (targetElement) {
      targetElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <Box
      sx={{
        backgroundImage: `url(${backgroundImage})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundAttachment: 'fixed',
        minHeight: '50vh',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        color: 'white',
        textAlign: 'center',
        textShadow: '2px 2px 4px rgba(0,0,0,0.7)',
        width: '100vw',
        boxSizing: 'border-box',
      }}
    >
      <Box 
        sx={{ 
          p: 4, 
          maxWidth: '800px', 
          width: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        <Typography variant="h3" component="h1" gutterBottom>
          MEC: MaqEspinhoCork<br/>
          Equipamentos Industriais
        </Typography>

        <Button
          variant="contained"
          size="large"
          onClick={handleScrollDown}
          sx={{
            mt: 4,
            backgroundColor: 'rgba(255, 255, 255, 0.2)',
            color: 'white',
            '&:hover': {
              backgroundColor: 'rgba(255, 255, 255, 0.3)',
            },
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            px: 3,
            py: 1.5,
            borderRadius: 8,
          }}
        >
          <Typography variant="button" sx={{ mb: 0.5 }}>
            Ver Todas as Máquinas
          </Typography>
          <KeyboardArrowDownIcon />
        </Button>
      </Box>
    </Box>
  );
}

export default HeroSection;