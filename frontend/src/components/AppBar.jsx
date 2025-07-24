import {
  AppBar as MuiAppBar,
  Toolbar,
  Typography,
  Box,
  IconButton,
  InputBase,
  alpha,
  styled,
  Link as MuiLink, // Importa o Link do Material UI como MuiLink
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
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import SearchIcon from '@mui/icons-material/Search';
import AccountCircle from '@mui/icons-material/AccountCircle';
import { useState } from 'react';
import { Link as RouterLink } from 'react-router-dom'; // Importa o Link do react-router-dom

// --- Componentes Estilizados para a Barra de Pesquisa ---
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

// --- Componente da AppBar ---
function AppBar() {
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

  const navItems = [
    { name: 'Máquinas', path: '/' },
    { name: 'Contactos', path: '/contactos' },
  ];

  const drawer = (
    <Box onClick={handleDrawerToggle} sx={{ textAlign: 'center' }}>
      <Typography variant="h6" sx={{ my: 2 }}>
        {/* Usar MuiLink com component=RouterLink para o logo no drawer */}
        <MuiLink component={RouterLink} to="/" color="inherit" underline="none">
          MEC
        </MuiLink>
      </Typography>
      <hr style={{ margin: '8px 0', border: 'none', borderBottom: '1px solid #ddd' }} />
      <List>
        {navItems.map((item) => (
          <ListItem key={item.name} disablePadding>
            {/* Usar ListItemButton com component=RouterLink */}
            <ListItemButton component={RouterLink} to={item.path} sx={{ textAlign: 'center' }}>
              <ListItemText primary={item.name} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
    </Box>
  );

  return (
    <MuiAppBar position="fixed">
      <Toolbar>
        {/* Ícone de menu para mobile */}
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

        {/* Grupo Esquerdo: Título, Links, Pesquisa */}
        <Box sx={{ display: 'flex', alignItems: 'center', flexGrow: 1 }}>
          {/* Título do site como Link para a root (1º elemento à esquerda em desktop) */}
          <Typography
            variant="h6"
            noWrap
            component="div"
            sx={{ display: { xs: 'none', sm: 'block' }, mr: 2 }}
          >
            {/* Usar MuiLink com component=RouterLink para o logo na AppBar */}
            <MuiLink component={RouterLink} to="/" color="inherit" underline="none">
              MEC
            </MuiLink>
          </Typography>

          {/* Links de navegação para desktop/tablet */}
          <Box sx={{ display: { xs: 'none', sm: 'block' }, mr: 2 }}>
            {navItems.map((item) => (
              // Usar MuiLink com component=RouterLink para os links de navegação
              <MuiLink
                key={item.name}
                component={RouterLink} // <--- A chave para a integração
                to={item.path}
                color="inherit"
                underline="none"
                sx={{ mx: 1 }}
              >
                <Typography variant="button">{item.name}</Typography>
              </MuiLink>
            ))}
          </Box>

          {/* Barra de Pesquisa */}
          <Search sx={{ mr: 2 }}>
            <SearchIconWrapper>
              <SearchIcon />
            </SearchIconWrapper>
            <StyledInputBase
              placeholder="Pesquisar..."
              inputProps={{ 'aria-label': 'search' }}
            />
          </Search>
        </Box>

        {/* Ícone/Link da Área de Admin (extrema direita) */}
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

      {/* Drawer (Menu Lateral) para Mobile */}
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

      {/* Diálogo de Login */}
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