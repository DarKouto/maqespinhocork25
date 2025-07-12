import Button from '@mui/material/Button'; // Importa o componente Button do MUI
import Typography from '@mui/material/Typography'; // Para textos (equivalente a Heading/Text do Chakra)
import Box from '@mui/material/Box'; // O Box do MUI é similar ao do Chakra

function App() {
  return (
    <>
      {/* O Box do MUI pode ser usado para layout e spacing  */}
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          minHeight: '100vh', // Para que o conteúdo ocupe a altura total da viewport
          bgcolor: 'grey.100', // Cor de fundo do MUI
          p: 4 // padding
        }}
      >
        {/* Typography para títulos e textos */}
        <Typography variant="h1" component="h1" gutterBottom>
          MaqEspinhoCork 2025
        </Typography>

        <Typography variant="body1" component="p" sx={{ mb: 4 }}> {/* mb para margin-bottom */}
          Site em construção
        </Typography>

        {/* Botão do Material UI */}
        <Button variant="contained" color="primary" onClick={() => alert('Olá do Material UI!')}>
          Clica-me!
        </Button>
      </Box>
    </>
  )
}

export default App