import { useState, useEffect } from 'react';
import { Typography, Container, Grid, Card, CardMedia, CardContent, CardActions, Button, Box } from '@mui/material';
import MachineDetailsDialog from './MachineDetailsDialog';

const removeAccents = (str) => {
  return str.normalize('NFD').replace(/[\u0300-\u036f]/g, "");
};

function MachinesSection({ searchTerm, setSearchTerm }) {
    // Estado para guardar as máquinas da API
    const [machines, setMachines] = useState([]);
    // Estado para o carregamento e erros
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
  
    useEffect(() => {
      const fetchMachines = async () => {
        try {
          const response = await fetch('http://localhost:5000/maquinas');

          if (!response.ok) {
            throw new Error(`Erro: ${response.status}`);
          }
          const data = await response.json();
          setMachines(data);
        } catch (error) {
          setError(error.message);
        } finally {
          setLoading(false);
        }
      };
      
      fetchMachines();
    }, []); // O array vazio assegura que o efeito só corre uma vez
  
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
  
    if (loading) return <div>A carregar máquinas...</div>;
    if (error) return <div>Erro ao carregar máquinas: {error}</div>;

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