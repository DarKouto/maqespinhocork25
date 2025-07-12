import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';

function App() {
  return (
    <>
      <Typography variant="h1" component="h1" gutterBottom>
        MaqEspinhoCork 2025
      </Typography>

      <Typography variant="body1" component="p" sx={{ mb: 4 }}>
        Site em construção
      </Typography>
      
      <Button variant="contained" color="primary" onClick={() => alert('Olá do Material UI!')}>
        Clica-me!
      </Button>
    </>
  )
}

export default App