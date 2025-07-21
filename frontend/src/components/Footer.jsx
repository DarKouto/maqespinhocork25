import { Box, Typography, Link } from '@mui/material';

function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <Box
      component="footer" 
      sx={{
        width: '100%',
        mt: 8, // Margem superior para separar do conteúdo acima
        py: 3, // Padding vertical
        px: 2, // Padding horizontal
        backgroundColor: 'primary.main', // Cor de fundo do Material UI
        color: 'white',
        textAlign: 'center',
        boxShadow: '0px -2px 4px rgba(0, 0, 0, 0.2)',
      }}
    >
      <Typography variant="body2">
        Copyright © {currentYear}: MaqEspinhoCork.com - {' '}
        <Link
          href="https://github.com/DarKouto"
          color="inherit" // Mantém a cor do texto do footer
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