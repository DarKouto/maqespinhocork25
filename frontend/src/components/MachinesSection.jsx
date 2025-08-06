import { Box, Typography, Container, Grid, Card, CardMedia, CardContent, CardActions, Button } from '@mui/material';

function MachinesSection() {
  // Dados de máquinas de placeholder
  const machines = [
    {
      id: 3, // Começamos com a Maq 3, como pediste
      name: 'Máquina de Seleção Ótica de Rolhas',
      description: 'Tecnologia avançada para seleção automática de rolhas por qualidade e defeitos.',
      imageUrl: 'https://placehold.co/300x300/a3e635/000000?text=Maq+3', // Imagem placeholder mais pequena
    },
    {
      id: 4,
      name: 'Linha de Acabamento de Superfície',
      description: 'Sistema completo para lixagem e tratamento de superfície de produtos de cortiça.',
      imageUrl: 'https://placehold.co/300x300/a3e635/000000?text=Maq+4', // Imagem placeholder mais pequena
    },
    {
      id: 5,
      name: 'Transportador de Correia Reforçado',
      description: 'Solução de transporte eficiente para movimentação de materiais pesados na fábrica.',
      imageUrl: 'https://placehold.co/300x300/a3e635/000000?text=Maq+5', // Imagem placeholder mais pequena
    },
    {
      id: 6,
      name: 'Sistema de Embalagem Automatizado',
      description: 'Embalagem rápida e segura para rolhas e outros produtos acabados de cortiça.',
      imageUrl: 'https://placehold.co/300x300/a3e635/000000?text=Maq+6', // Imagem placeholder mais pequena
    },
    {
      id: 7,
      name: 'Máquina de Corte de Cortiça XPTO',
      description: 'Equipamento de alta precisão para corte e acabamento de rolhas de cortiça.',
      imageUrl: 'https://placehold.co/300x300/a3e635/000000?text=Maq+7', // Imagem placeholder mais pequena
    },
    {
      id: 8,
      name: 'Prensa Hidráulica Industrial',
      description: 'Prensa robusta para compactação de aglomerados de cortiça, ideal para grandes volumes.',
      imageUrl: 'https://placehold.co/300x300/a3e635/000000?text=Maq+8', // Imagem placeholder mais pequena
    },
  ];

  return (
    <Container maxWidth="lg" sx={{ mt: 8, mb: 8 }}> {/* Mantido maxWidth="lg" para dar mais espaço ao Grid */}
      <Typography variant="h4" component="h2" gutterBottom align="center" sx={{ mb: 6 }}>
        Nossas Máquinas em Destaque
      </Typography>

      <Grid container spacing={4} justifyContent="center"> {/* Adicionado justifyContent para centralizar os itens */}
        {machines.map((machine) => (
          <Grid item key={machine.id} xs={12} sm={6} md={4}> {/* md={4} significa 3 por linha em desktop */}
            <Card sx={{
              height: '100%',
              display: 'flex',
              flexDirection: 'column',
              boxShadow: '0 4px 8px rgba(0,0,0,0.1)',
              maxWidth: 345, // <--- NOVO: Define a largura máxima do Card
              margin: '0 auto', // <--- NOVO: Centra o Card dentro do seu item Grid
            }}>
              <CardMedia
                component="img"
                sx={{ 
                  objectFit: 'cover',
                  aspectRatio: '1/1',
                  width: '100%',
                }}
                image={machine.imageUrl}
                alt={machine.name}
              />
              <CardContent sx={{ flexGrow: 1 }}>
                <Typography gutterBottom variant="h5" component="div">
                  {machine.name}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {machine.description}
                </Typography>
              </CardContent>
              <CardActions sx={{ justifyContent: 'flex-end', p: 2 }}>
                <Button size="small" variant="contained" color="primary">
                  Ver Detalhes
                </Button>
              </CardActions>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Container>
  );
}

export default MachinesSection;