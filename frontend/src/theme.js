// src/theme.js
import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    primary: {
      main: '#1a237e', // Um azul escuro, quase marinho
    },
    secondary: {
      main: '#8c9eff', // Um azul mais claro para o contraste e efeitos de hover
    },
    background: {
      default: '#f5f5dc', // Um tom de bege muito claro
      paper: '#ffffff', // Branco para Cards e outros elementos
    },
    text: {
      primary: '#212121', // Um cinzento escuro para o texto principal
      secondary: '#424242', // Um cinzento um pouco mais claro para texto secundário
    },
  },
  typography: {
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
  },
  components: {
    MuiAppBar: {
      styleOverrides: {
        root: {
          backgroundColor: '#1a237e', // Cor de fundo da AppBar a condizer com o primário
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 20,
        },
      },
    },
  },
});

export default theme;