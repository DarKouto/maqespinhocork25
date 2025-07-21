import { Box, Typography, Link } from '@mui/material';

function Footer() {
  const currentYear = new Date().getFullYear(); // Obtém o ano atual dinamicamente
  const githubLink = "https://github.com/DarKouto";

  return (
    <Box
      component="footer" // Indica que este Box representa um elemento footer semântico
      sx={{
        width: '100%',
        mt: 8, // Margem superior para separar do conteúdo acima
        py: 3, // Padding vertical
        px: 2, // Padding horizontal
        backgroundColor: 'primary.main', // Cor de fundo do Material UI
        color: 'white', // Cor do texto
        textAlign: 'center',
        boxShadow: '0px -2px 4px rgba(0, 0, 0, 0.2)', // Sombra para dar um pouco de profundidade
      }}
    >
      <Typography variant="body2">
        Copyright © {currentYear}: MaqEspinhoCork.com - {' '}
        <Link
          href={githubLink}
          color="inherit" // Mantém a cor do texto do footer
          underline="hover" // Sublinha apenas ao passar o rato
          target="_blank" // Abre o link numa nova aba
          rel="noopener noreferrer" // Prática de segurança para links externos
        >
          Desenvolvido por Daniel Couto (DarKouto)
        </Link>
      </Typography>
    </Box>
  );
}

export default Footer;