import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App.jsx';

// Importa o ChakraProvider E extendTheme do pacote principal @chakra-ui/react
import { ChakraProvider, extendTheme } from '@chakra-ui/react'; // <--- AMBOS AQUI!

// Cria um tema básico. O extendTheme({}) usa o tema padrão como base.
const customTheme = extendTheme({}); // <--- Cria um tema mesmo que vazio

createRoot(document.getElementById('root')).render(
  <StrictMode>
    {/* Passa o tema customTheme para o ChakraProvider */}
    <ChakraProvider theme={customTheme}> {/* <--- USA O TEMA CRIADO */}
      <App />
    </ChakraProvider>
  </StrictMode>,
);