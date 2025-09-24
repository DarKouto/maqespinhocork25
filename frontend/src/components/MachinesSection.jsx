import { useState } from 'react';
import { Typography, Container, Grid, Card, CardMedia, CardContent, CardActions, Button, Box } from '@mui/material';
import MachineDetailsDialog from './MachineDetailsDialog';
import a1 from '../images/a1.jpeg';
import b1 from '../images/b1.jpeg';
import c1 from '../images/c1.jpeg';
import d1 from '../images/d1.jpeg';
import e1 from '../images/e1.jpeg';
import f1 from '../images/f1.jpeg';


const removeAccents = (str) => {
  return str.normalize('NFD').replace(/[\u0300-\u036f]/g, "");
};

function MachinesSection({ searchTerm, setSearchTerm }) { 
  const machines = [
    {
      id: 1,
      name: 'Ponçadeira',
      description: 'Máquina de Ponçar Rolhas.',
      imageUrl: a1,
    },
    {
      id: 2,
      name: 'Lixadeira / Topejadeira',
      description: 'Máquina de Topejar Rolhas.',
      imageUrl: b1,
    },
    {
      id: 3,
      name: 'Aspirador de Pó',
      description: 'Aspirador de Pó / Dust Collector com duas saídas.',
      imageUrl: c1,
    },
    {
      id: 4,
      name: 'Máquina de Contar Rolhas',
      description: 'Máquina de Contar Rolhas Automática.',
      imageUrl: d1,
    },
    {
      id: 5,
      name: 'Alimentador Automático / "Girafa',
      description: 'Alimentador Automático / "Girafa. Produto MEC: MaqEspinhoCork',
      imageUrl: e1,
    },
    {
      id: 6,
      name: 'Marcadeira a Tinta',
      description: 'Marcadeira de Rolhas completa a Tinta',
      imageUrl: f1,
    },
  ];
  
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedMachine, setSelectedMachine] = useState(null);

  const handleOpenDialog = (machine) => {
    setSelectedMachine(machine);
    setOpenDialog(true);
  };

  const handleCloseDialogAndClearSearch = () => {
    setOpenDialog(false);
    setSelectedMachine(null);
    setSearchTerm('');
  };

  const filteredMachines = machines.filter(machine => {
    const searchTermNormalized = removeAccents(searchTerm.toLowerCase());
    const nameNormalized = removeAccents(machine.name.toLowerCase());
    const descriptionNormalized = removeAccents(machine.description.toLowerCase());
    
    return nameNormalized.includes(searchTermNormalized) || descriptionNormalized.includes(searchTermNormalized);
  });

  return (
    <Container maxWidth="lg">
      <Box sx={{ p: 3 }}>
        <Typography variant="h4" component="h2" gutterBottom align="center" sx={{ mb: 6, mt: 6 }}>
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
      </Box>

      <MachineDetailsDialog
        machine={selectedMachine}
        open={openDialog}
        handleClose={handleCloseDialogAndClearSearch}
      />
     <Box sx={{ mb: 4 }}>
     </Box>
    </Container>
    
  );
}

export default MachinesSection;