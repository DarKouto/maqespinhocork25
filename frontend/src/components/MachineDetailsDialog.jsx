import { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Box,
  IconButton,
} from '@mui/material';
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';

function MachineDetailsDialog({ machine, open, handleClose }) {
  if (!machine) {
    return null;
  }

  const machineImages = [
    machine.imageUrl,
    'https://placehold.co/600x400/a3e635/000000?text=Foto+Detalhes+1',
    'https://placehold.co/600x400/a3e635/000000?text=Foto+Detalhes+2',
  ];

  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const handleNextImage = () => {
    setCurrentImageIndex((prevIndex) => (prevIndex + 1) % machineImages.length);
  };

  const handlePrevImage = () => {
    setCurrentImageIndex((prevIndex) => (prevIndex - 1 + machineImages.length) % machineImages.length);
  };
  
  useEffect(() => {
    if (open) {
      setCurrentImageIndex(0);
    }
  }, [open]);

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="md" fullWidth>
      <DialogTitle>
        <Typography variant="h5" component="div" align="center">
          {machine.name}
        </Typography>
      </DialogTitle>
      <DialogContent dividers>
        <Box 
          sx={{ 
            position: 'relative', 
            display: 'flex', 
            alignItems: 'center',
            justifyContent: 'center',
            p: 1
          }}>
          <IconButton
            onClick={handlePrevImage}
            disabled={machineImages.length <= 1}
            sx={{
              position: 'absolute',
              left: 0,
              zIndex: 1,
              color: 'white',
              backgroundColor: 'rgba(0, 0, 0, 0.4)',
              '&:hover': {
                backgroundColor: 'rgba(0, 0, 0, 0.6)',
              },
            }}
          >
            <ArrowBackIosIcon />
          </IconButton>

          <Box
            component="img"
            src={machineImages[currentImageIndex]}
            alt={`${machine.name} - ${currentImageIndex + 1}`}
            sx={{ 
              width: '100%', 
              height: 'auto', 
              borderRadius: 1,
              height: '50vh',
              objectFit: 'contain'
            }}
          />

          <IconButton
            onClick={handleNextImage}
            disabled={machineImages.length <= 1}
            sx={{
              position: 'absolute',
              right: 0,
              zIndex: 1,
              color: 'white',
              backgroundColor: 'rgba(0, 0, 0, 0.4)',
              '&:hover': {
                backgroundColor: 'rgba(0, 0, 0, 0.6)',
              },
            }}
          >
            <ArrowForwardIosIcon />
          </IconButton>
        </Box>
        
        <Box sx={{ mt: 2, textAlign: 'center' }}>
          <Typography variant="body1">
            {machine.description}
          </Typography>
        </Box>
      </DialogContent>
      <DialogActions sx={{ justifyContent: 'center' }}>
        <Button onClick={handleClose} color="primary" variant="contained">
          Fechar
        </Button>
      </DialogActions>
    </Dialog>
  );
}

export default MachineDetailsDialog;