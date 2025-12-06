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

  const machineImages = (machine.images && machine.images.length > 0)
    ? machine.images
    : [machine.imageUrl];

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

  if (machineImages.length === 0) {
      return null; 
  }

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
          
          {machineImages.length > 1 && (
            <IconButton
              onClick={handlePrevImage}
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
          )}

          <Box
            component="img"
            src={machineImages[currentImageIndex]}
            alt={`${machine.name} - ${currentImageIndex + 1}`}
            sx={{ 
              width: '100%', 
              height: 'auto', 
              borderRadius: 1,
              objectFit: 'contain',
              height: { xs: '30vh', sm: '40vh', md: '50vh' },
            }}
          />

          {machineImages.length > 1 && (
            <IconButton
              onClick={handleNextImage}
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
          )}
        </Box>
        
        
        <Box sx={{ mt: 3, textAlign: 'center' }}>
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