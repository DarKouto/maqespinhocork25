// src/components/Footer.jsx
import { Box, Typography, Link } from '@mui/material';

function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <Box
      component="footer" 
      sx={{
        width: '100%',
        mt: 8,
        py: 3,
        backgroundColor: 'primary.main',
        color: 'white',
        textAlign: 'center',
        boxShadow: '0px -2px 4px rgba(0, 0, 0, 0.2)',
        ml: 'auto', 
        mr: 'auto', 
        maxWidth: '100%', 
      }}
    >
      <Typography 
        variant="body2" 
        sx={{ 
          px: 2, 
          display: 'block', 
        }}
      >
        Copyright © {currentYear}: MaqEspinhoCork.com - {' '}
        <Link
          href="https://github.com/DarKouto"
          color="inherit"
          underline="hover"
          target="_blank"
          rel="noopener noreferrer"
        >
          Desenvolvido por Daniel Couto (DarKouto)
        </Link>
      </Typography>
    </Box>
  );
}

export default Footer;