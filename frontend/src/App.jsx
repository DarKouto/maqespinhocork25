import { Box, Typography, Toolbar } from '@mui/material'; // Mantemos os que vamos usar aqui
import AppBar from './components/AppBar'

function App() {
  return (
    <>
      <Box sx={{ flexGrow: 1 }}>
        <AppBar />
        <Toolbar /> 
        
        <Box sx={{ p: 3 }}>

          <Typography variant="h4" gutterBottom>
            Bem-vindo à MaqEspinhoCork 2025!
          </Typography>

          <Typography variant="body1" component="p">
            O teu site está a ganhar forma. Esta é a área de conteúdo principal.
          </Typography>

          {Array.from({ length: 50 }).map((_, i) => (
            <Typography key={i} variant="body1" component="p">
              Conteúdo de exemplo para testar o scroll e a AppBar fixa. Linha {i + 1}.
            </Typography>
          ))}
        </Box>
      </Box>
    </>
  )
}

export default App