import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.jsx';

// Importa o ThemeProvider e o createTheme do Material UI
import { ThemeProvider, createTheme } from '@mui/material/styles';
// Cria um tema Material UI padrão
const theme = createTheme();

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <ThemeProvider theme={theme}>
      <App />
    </ThemeProvider>
  </StrictMode>,
)