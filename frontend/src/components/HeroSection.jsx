import { Box, Typography, Button } from '@mui/material';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';

function HeroSection() {
  const backgroundImage = './src/images/fundo-placeholder.jpg';

  const handleScrollDown = () => {
    window.scrollBy({
      top: window.innerHeight * 0.8,
      behavior: 'smooth'
    });
  };

  return (
    <Box
      sx={{
        backgroundImage: `url(${backgroundImage})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundAttachment: 'fixed',
        // Altura ajustada: de 80vh para 60vh
        minHeight: '60vh', // <--- Alterado aqui!
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        color: 'white',
        textAlign: 'center',
        p: 4,
        textShadow: '2px 2px 4px rgba(0,0,0,0.7)',
      }}
    >
      <Typography variant="h3" component="h1" gutterBottom sx={{ maxWidth: '800px' }}>
        MEC: MaqEspinhoCork <br/>
        Compra, venda e manutenção de todos os equipamentos industriais.
      </Typography>

      <Button
        variant="contained"
        size="large"
        endIcon={<KeyboardArrowDownIcon />}
        onClick={handleScrollDown}
        sx={{
          mt: 4,
          backgroundColor: 'rgba(255, 255, 255, 0.2)',
          color: 'white',
          '&:hover': {
            backgroundColor: 'rgba(255, 255, 255, 0.3)',
          },
          borderRadius: '50%',
          minWidth: '56px',
          height: '56px',
          padding: 0,
        }}
      >
      </Button>
    </Box>
  );
}

export default HeroSection;