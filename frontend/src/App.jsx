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

        </Box>
      </Box>
    </>
  )
}

export default App