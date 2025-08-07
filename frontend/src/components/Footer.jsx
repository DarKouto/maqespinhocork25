import { Box, Typography, Container, Link } from '@mui/material';
import GitHubIcon from '@mui/icons-material/GitHub';
import TerminalIcon from '@mui/icons-material/Terminal';

function Footer() {
  return (
    <Box
      component="footer"
      sx={{
        py: 2,
        px: 2,
        mt: 'auto',
        backgroundColor: (theme) =>
          theme.palette.mode === 'light'
            ? theme.palette.grey[200]
            : theme.palette.grey[800],
      }}
    >
      <Container maxWidth="lg">
        <Typography variant="body2" color="text.secondary" align="center">
          {'Copyright © '}{new Date().getFullYear()}{': '}
            MEC: MaqEspinhoCork 
        </Typography>

        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', mt: 1 }}>
          <Typography variant="body2" color="text.secondary" sx={{ mr: 1, display: 'flex', alignItems: 'center' }}>
            <TerminalIcon sx={{ fontSize: 16, mr: 0.5 }} />
            Desenvolvido por
          </Typography>
          <Link
            href="https://github.com/darkouto"
            target="_blank"
            rel="noopener noreferrer"
            color="inherit"
            underline="none"
            sx={{
              display: 'flex',
              alignItems: 'center',
              '&:hover': {
                color: 'primary.main', 
                transform: 'scale(1.05)',
                transition: 'transform 0.3s ease-in-out, color 0.3s ease-in-out',
              },
            }}
          >
            <GitHubIcon sx={{ fontSize: 16, mr: 0.5 }} />
            Daniel Couto (DarKouto)
          </Link>
        </Box>
        
      </Container>
    </Box>
  );
}

export default Footer;