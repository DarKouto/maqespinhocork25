import {
  AppBar as MuiAppBar,
  Toolbar,
  Typography,
  Box,
  IconButton,
  InputBase,
  alpha,
  styled,
  Link as MuiLink,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Container,
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import SearchIcon from '@mui/icons-material/Search';
import AccountCircle from '@mui/icons-material/AccountCircle';
import SettingsIcon from '@mui/icons-material/Settings';
import PermContactCalendarIcon from '@mui/icons-material/PermContactCalendar';
import { useState } from 'react';
import { Link as RouterLink } from 'react-router-dom';

const Search = styled('div')(({ theme }) => ({
  position: 'relative',
  borderRadius: theme.shape.borderRadius,
  backgroundColor: alpha(theme.palette.common.white, 0.15),
  '&:hover': {
    backgroundColor: alpha(theme.palette.common.white, 0.25),
  },
}));

const SearchIconWrapper = styled('div')(({ theme }) => ({
  padding: theme.spacing(0, 2),
  height: '100%',
  position: 'absolute',
  pointerEvents: 'none',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
}));

const StyledInputBase = styled(InputBase)(({ theme }) => ({
  color: 'inherit',
  width: '100%',
  '& .MuiInputBase-input': {
    padding: theme.spacing(1, 1, 1, 0),
    paddingLeft: `calc(1em + ${theme.spacing(4)})`,
    transition: theme.transitions.create('width'),
    width: '100%',
    [theme.breakpoints.up('sm')]: {
      width: '20ch',
      '&:focus': {
        width: '30ch',
      },
    },
  },
}));

function AppBar({ setSearchTerm }) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [openLoginDialog, setOpenLoginDialog] = useState(false);

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const handleClickOpenLoginDialog = () => {
    setOpenLoginDialog(true);
  };

  const handleCloseLoginDialog = () => {
    setOpenLoginDialog(false);
  };

  const handleLogin = () => {
    alert('Tentativa de Login (verifica a consola para valores)!');
    console.log('Username:', document.getElementById('username-input').value);
    console.log('Password:', document.getElementById('password-input').value);
    handleCloseLoginDialog();
  };

  const handleSearchChange = (event) => {
    const term = event.target.value;
    setSearchTerm(term);
    if (term.length > 0) {
      const targetElement = document.getElementById('content-start');
      if (targetElement) {
        targetElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }
  };

  const navItems = [
    { name: 'Máquinas', path: '/', icon: <SettingsIcon /> },
    { name: 'Contactos', path: '/contactos', icon: <PermContactCalendarIcon /> },
  ];

  const drawer = (
    <Box onClick={handleDrawerToggle} sx={{ textAlign: 'center' }}>
      <Typography variant="h6" sx={{ my: 2 }}>
        <MuiLink component={RouterLink} to="/" color="inherit" underline="none">
          M.E.C.
        </MuiLink>
      </Typography>
      <hr style={{ margin: '8px 0', border: 'none', borderBottom: '1px solid #ddd' }} />
      <List>
        {navItems.map((item) => (
          <ListItem key={item.name} disablePadding>
            <ListItemButton component={RouterLink} to={item.path} sx={{ textAlign: 'center' }}>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '100%' }}>
                {item.icon}
                <ListItemText primary={item.name} sx={{ ml: 1 }} />
              </Box>
            </ListItemButton>
          </ListItem>
        ))}
      </List>
    </Box>
  );

  return (
    <MuiAppBar position="fixed">
      <Container sx={{ px: { xs: 2, md: 4 } }}> {/* NOVO: Aumentado o padding horizontal */}
        <Toolbar disableGutters>
          <IconButton
            size="large"
            edge="start"
            color="inherit"
            aria-label="open drawer"
            sx={{ mr: 2, display: { xs: 'block', sm: 'none' } }}
            onClick={handleDrawerToggle}
          >
            <MenuIcon />
          </IconButton>
          <Box sx={{ display: 'flex', alignItems: 'center', flexGrow: 1 }}>
            <Typography
              variant="h5" // NOVO: Aumentei o tamanho do texto
              noWrap
              component="div"
              sx={{ display: { xs: 'none', sm: 'block' }, mr: 4, fontWeight: 'bold' }} // NOVO: Aumentei a margem e o peso da fonte
            >
              <MuiLink component={RouterLink} to="/" color="inherit" underline="none">
                M.E.C.
              </MuiLink>
            </Typography>
            <Box sx={{ display: { xs: 'none', sm: 'flex' }, mr: 2, gap: 2 }}>
              {navItems.map((item) => (
                <MuiLink
                  key={item.name}
                  component={RouterLink}
                  to={item.path}
                  color="inherit"
                  underline="none"
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    '&:hover': {
                      color: 'yellow',
                      transform: 'scale(1.1)',
                      transition: 'transform 0.3s ease-in-out, color 0.3s ease-in-out',
                    },
                  }}
                >
                  {item.icon}
                  <Typography variant="body1" sx={{ ml: 1, fontWeight: 'bold' }}>
                    {item.name}
                  </Typography>
                </MuiLink>
              ))}
            </Box>
            <Search sx={{ mr: 2 }}>
              <SearchIconWrapper>
                <SearchIcon />
              </SearchIconWrapper>
              <StyledInputBase
                placeholder="Pesquisar..."
                inputProps={{ 'aria-label': 'search' }}
                onChange={handleSearchChange}
              />
            </Search>
          </Box>
          <Box sx={{ ml: { xs: 'auto', sm: 0 } }}>
            <IconButton
              size="large"
              edge="end"
              color="inherit"
              aria-label="admin area"
              onClick={handleClickOpenLoginDialog}
            >
              <AccountCircle />
            </IconButton>
          </Box>
        </Toolbar>
      </Container>
      <nav>
        <Drawer
          variant="temporary"
          open={mobileOpen}
          onClose={handleDrawerToggle}
          ModalProps={{
            keepMounted: true,
          }}
          sx={{
            display: { xs: 'block', sm: 'none' },
            '& .MuiDrawer-paper': { boxSizing: 'border-box', width: 240 },
          }}
        >
          {drawer}
        </Drawer>
      </nav>
      <Dialog open={openLoginDialog} onClose={handleCloseLoginDialog}>
        <DialogTitle>Login de Administrador</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            id="username-input"
            label="Utilizador"
            type="text"
            fullWidth
            variant="standard"
          />
          <TextField
            margin="dense"
            id="password-input"
            label="Password"
            type="password"
            fullWidth
            variant="standard"
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseLoginDialog}>Cancelar</Button>
          <Button onClick={handleLogin}>Entrar</Button>
        </DialogActions>
      </Dialog>
    </MuiAppBar>
  );
}

export default AppBar;