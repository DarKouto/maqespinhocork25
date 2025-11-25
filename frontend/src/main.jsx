import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.jsx';

// NOVO IMPORT: Contexto de Autenticação
import { AuthProvider } from './AuthContext.jsx'; 
// NOVO IMPORT: Router para roteamento
import { BrowserRouter } from 'react-router-dom';

import { ThemeProvider, createTheme } from '@mui/material/styles';
const theme = createTheme();

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <ThemeProvider theme={theme}>
      <BrowserRouter> {/* O Router tem de envolver o AuthProvider */}
        <AuthProvider> 
          <App />
        </AuthProvider>
      </BrowserRouter>
    </ThemeProvider>
  </StrictMode>,
)