import { useState, useEffect } from 'react';
import { Typography, Container, Grid, Card, CardMedia, CardContent, CardActions, Button, Box } from '@mui/material';
import MachineDetailsDialog from './MachineDetailsDialog';
// 🚨 MANTIDOS: Os imports locais
import f1 from '../images/f1.jpeg';


const PLACEHOLDER_URL = 'https://via.placeholder.com/200/90A4AE/FFFFFF?text=Sem+Imagem';

const removeAccents = (str) => {
  return str.normalize('NFD').replace(/[\u0300-\u036f]/g, "");
};

function MachinesSection({ searchTerm, setSearchTerm }) { 
  // ESTADOS PARA DADOS DA API E CONTROLO DE CARREGAMENTO
  const [apiMachines, setApiMachines] = useState([]);
  const [isLoading, setIsLoading] = useState(true); 
  const [error, setError] = useState(null); 
  
  // DADOS HARDCODE (ID's NEGATIVOS para evitar conflito com a API)
  const machines = [
    {
      id: -6, 
      name: 'Marcadeira a Tinta',
      description: 'Marcadeira de Rolhas completa a Tinta',
      imageUrl: f1, // Usa o import local
      images: [f1],
    },
  ];
  
  // FETCH DE DADOS DA API
  useEffect(() => {
    const API_URL = '/api/'; 

    fetch(API_URL)
      .then(response => {
        if (!response.ok) {
          throw new Error('Falha ao obter dados da API.');
        }
        return response.json();
      })
      .then(data => {
        
        const machinesWithImages = data.map(m => {
            // 🚨 ALTERAÇÃO CRÍTICA: Se a máquina tiver imagens, usa a primeira URL do Cloudinary.
            const imageUrl = (m.imagens && m.imagens.length > 0) 
                             ? m.imagens[0] 
                             : PLACEHOLDER_URL;

            return {
                id: Number(m.id), 
                name: m.nome, 
                description: m.descricao, 
                imageUrl: imageUrl, // URL do Cloudinary (ou placeholder)
                images: m.imagens || [], // Array completo de URLs
            };
        });
        
        setApiMachines(machinesWithImages);
        setIsLoading(false);
      })
      .catch(err => {
        console.error("Erro na busca da API:", err);
        setError("Não foi possível carregar o stock da API."); 
        setIsLoading(false);
      });
  }, []); 


  // COMBINAÇÃO: Hardcode + API
  const allMachines = [...machines, ...apiMachines]; 

  
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

  // DIAGNÓSTICO: DESATIVA O FILTRO TEMPORARIAMENTE
  const filteredMachines = allMachines.filter(machine => { 
    // Filtro de segurança (Objeto e Nome não podem ser nulos)
    if (!machine || !machine.name) {
        return false;
    }

    // Definir a descrição como "" se for nula/undefined
    const description = machine.description || "";
    
    const searchTermNormalized = removeAccents(searchTerm.toLowerCase());
    const nameNormalized = removeAccents(machine.name.toLowerCase());
    
    // USAR a variável 'description' corrigida
    const descriptionNormalized = removeAccents(description.toLowerCase()); 
    
    return nameNormalized.includes(searchTermNormalized) || descriptionNormalized.includes(searchTermNormalized);
});
  
  // FEEDBACK DE CARREGAMENTO E ERRO
  if (isLoading && allMachines.length === 0) {
      return (
        <Container maxWidth="lg">
          <Typography variant="h6" align="center" sx={{ mt: 6 }}>
            A carregar stock...
          </Typography>
        </Container>
      );
    }
  
  if (error) {
      return (
        <Container maxWidth="lg">
          <Typography variant="h6" align="center" color="error" sx={{ mt: 6 }}>
            {error}
          </Typography>
        </Container>
      );
    }


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
                      // Usa machine.imageUrl, que será o import local (para hardcoded) ou o URL do Cloudinary (para API)
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