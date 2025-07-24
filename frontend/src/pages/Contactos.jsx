import { Box, Typography, Container, Paper } from '@mui/material';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import PhoneIcon from '@mui/icons-material/Phone';
import EmailIcon from '@mui/icons-material/Email';

function Contactos() {
  return (
    <Container maxWidth="md" sx={{ mt: 10, mb: 4 }}>

      <Typography variant="h4" component="h1" gutterBottom align="center">
        Contactos
      </Typography>

      <Paper elevation={3} sx={{ p: 4, mt: 4, display: 'flex', flexDirection: { xs: 'column', md: 'row' }, gap: 4 }}>
        
        <Box sx={{ flex: 1 }}>
          <Typography variant="h6" gutterBottom mb={4}>
            Informações de Contacto
          </Typography>

          <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
            <LocationOnIcon sx={{ mr: 1 }} />
            <Typography variant="body1">
              Rua do Vergão 190<br />
              4520-614 São João de Ver
            </Typography>
          </Box>

          <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
            <PhoneIcon sx={{ mr: 1 }} />
            <Typography variant="body1">962 335 430</Typography>
          </Box>

          <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
            <EmailIcon sx={{ mr: 1 }} />
            <Typography variant="body1">jorgejimramos@gmail.com</Typography>
          </Box>
          
        </Box>

        <Box sx={{ flex: 1, minHeight: 300, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <iframe
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3013.568064435228!2d-8.555371516123818!3d40.94713279751086!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0xd23813bb6d038fb%3A0xdd821c6ce57e03d9!2sMaqespinhocork%20Lda!5e0!3m2!1spt-PT!2spt!4v1753367785535!5m2!1spt-PT!2spt"
            width="100%"
            height="100%"
            style={{ border: 0 }}
            allowFullScreen=""
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            title="Localização da MaqEspinhoCork"
          ></iframe>
        </Box>

      </Paper>
    </Container>
  );
}

export default Contactos;