import { useState } from 'react';
import { Typography, Container, Grid, Card, CardMedia, CardContent, CardActions, Button, Box } from '@mui/material';
import MachineDetailsDialog from './MachineDetailsDialog';

// Função auxiliar para remover acentos
const removeAccents = (str) => {
  return str.normalize('NFD').replace(/[\u0300-\u036f]/g, "");
};

function MachinesSection({ searchTerm }) { 
  const machines = [
    {
      id: 3,
      name: 'Máquina de Seleção Ótica de Rolhas',
      description: 'Tecnologia avançada para seleção automática de rolhas por qualidade e defeitos.',
      imageUrl: 'https://placehold.co/300x300/a3e635/000000?text=Maq+3',
    },
    {
      id: 4,
      name: 'Linha de Acabamento de Superfície',
      description: 'Sistema completo para lixagem e tratamento de superfície de produtos de cortiça.',
      imageUrl: 'https://placehold.co/300x300/a3e635/000000?text=Maq+4',
    },
    {
      id: 5,
      name: 'Transportador de Correia Reforçado',
      description: 'Solução de transporte eficiente para movimentação de materiais pesados na fábrica.',
      imageUrl: 'https://placehold.co/300x300/a3e635/000000?text=Maq+5',
    },
    {
      id: 6,
      name: 'Sistema de Embalagem Automatizado',
      description: 'Embalagem rápida e segura para rolhas e outros produtos acabados de cortiça.',
      imageUrl: 'https://placehold.co/300x300/a3e635/000000?text=Maq+6',
    },
    {
      id: 7,
      name: 'Máquina de Corte de Cortiça XPTO',
      description: 'Equipamento de alta precisão para corte e acabamento de rolhas de cortiça.',
      imageUrl: 'https://placehold.co/300x300/a3e635/000000?text=Maq+7',
    },
    {
      id: 8,
      name: 'Prensa Hidráulica Industrial',
      description: 'Prensa robusta para compactação de aglomerados de cortiça, ideal para grandes volumes.',
      imageUrl: 'https://placehold.co/300x300/a3e635/000000?text=Maq+8',
    },
  ];
  
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedMachine, setSelectedMachine] = useState(null);

  const handleOpenDialog = (machine) => {
    setSelectedMachine(machine);
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setSelectedMachine(null);
  };

  const filteredMachines = machines.filter(machine => {
    const searchTermNormalized = removeAccents(searchTerm.toLowerCase());
    const nameNormalized = removeAccents(machine.name.toLowerCase());
    const descriptionNormalized = removeAccents(machine.description.toLowerCase());
    
    return nameNormalized.includes(searchTermNormalized) || descriptionNormalized.includes(searchTermNormalized);
  });

  return (
    <Container maxWidth="lg" sx={{ mt: 6, mb: 8 }}>
      <Typography variant="h4" component="h2" gutterBottom align="center" sx={{ mb: 6 }}>
        Nossas Máquinas Disponíveis para Venda
      </Typography>

      <Grid container spacing={4} justifyContent="center">
        {filteredMachines.length > 0 ? (
          filteredMachines.map((machine) => (
            <Grid item key={machine.id} xs={12} sm={6} md={4}>
              <Card sx={{
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                boxShadow: '0 4px 8px rgba(0,0,0,0.1)',
                maxWidth: 345,
                margin: '0 auto',
              }}>

                <Box
                  onClick={() => handleOpenDialog(machine)}
                  sx={{ cursor: 'pointer', '&:hover': { opacity: 0.8 } }}
                >
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
                </Box>
                {/* --- FIM DA NOVA CAIXA CLICÁVEL --- */}
                
                <CardActions sx={{ justifyContent: 'flex-end', p: 2 }}>
                  <Button 
                    size="small" 
                    variant="contained" 
                    color="primary"
                    onClick={() => handleOpenDialog(machine)}
                  >
                    Ver Detalhes
                  </Button>
                </CardActions>
              </Card>
            </Grid>
          ))
        ) : (
          <Grid item xs={12}>
            <Typography variant="h6" align="center" color="text.secondary">
              Nenhuma máquina encontrada.
            </Typography>
          </Grid>
        )}
      </Grid>

      <MachineDetailsDialog
        machine={selectedMachine}
        open={openDialog}
        handleClose={handleCloseDialog}
      />
    </Container>
  );
}

export default MachinesSection;