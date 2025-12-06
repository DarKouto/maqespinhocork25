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
  useMediaQuery,
  CircularProgress,
  Snackbar,
  Alert,
  InputAdornment, 
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import SearchIcon from '@mui/icons-material/Search';
import AccountCircle from '@mui/icons-material/AccountCircle';
import SettingsIcon from '@mui/icons-material/Settings';
import PermContactCalendarIcon from '@mui/icons-material/PermContactCalendar';
import LogoutIcon from '@mui/icons-material/Logout'; 
import DashboardIcon from '@mui/icons-material/Dashboard';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import { useState } from 'react';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import { useTheme } from '@mui/material/styles';
import { useAuth } from '../AuthContext'; 

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

function AppBar({ searchTerm, setSearchTerm }) {
  const { isAuthenticated, login, logout, loading, error, setError } = useAuth();
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [openLoginDialog, setOpenLoginDialog] = useState(false);
  const [loginForm, setLoginForm] = useState({ username: '', password: '' });
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [showPassword, setShowPassword] = useState(false); 
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const handleCloseSnackbar = () => {
    setSnackbarOpen(false);
  };

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const handleClickOpenLoginDialog = () => {
    setLoginForm({ username: '', password: '' });
    setShowPassword(false); 
    setOpenLoginDialog(true);
  };

  const handleCloseLoginDialog = () => {
    setOpenLoginDialog(false);
  };
  
  const handleFormChange = (e) => {
    const { id, value } = e.target;
    setLoginForm(prev => ({ ...prev, [id]: value }));
  };

  const handleClickShowPassword = () => {
    setShowPassword((show) => !show);
  };

  const handleMouseDownPassword = (event) => {
    event.preventDefault();
  };

  const handleLogin = async () => {
    if (!loginForm.username || !loginForm.password) {
      alert("Preencha ambos os campos.");
      return;
    }

    const success = await login(loginForm.username, loginForm.password);
    
    if (success) {
      handleCloseLoginDialog();
      setSnackbarOpen(true);
    } else {
      setSnackbarOpen(true);
    }
  };
  
  const handleLogout = () => {
    logout();
    setSnackbarOpen(true);
  };
  
  const handleAdminClick = () => {
    navigate('/admin');
  };

  const handleSearchChange = (event) => {
    const term = event.target.value;
    setSearchTerm(term);
    
    if (term.length > 0 && !isMobile) {
      const targetElement = document.getElementById('content-start');
      if (targetElement) {
        targetElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }
  };

  const navItems = [
    { name: 'Máquinas', path: '/', icon: <SettingsIcon /> },
    { name: 'Contactos', path: '/contactos', icon: <PermContactCalendarIcon /> },
    ...(isAuthenticated ? [{ name: 'Dashboard', path: '/admin', icon: <DashboardIcon /> }] : []),
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
        {isAuthenticated && (
          <ListItem disablePadding>
            <ListItemButton onClick={handleLogout} sx={{ textAlign: 'center' }}>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '100%' }}>
                <LogoutIcon />
                <ListItemText primary="Logout" sx={{ ml: 1 }} />
              </Box>
            </ListItemButton>
          </ListItem>
        )}
      </List>
    </Box>
  );

  return (
    <MuiAppBar position="fixed">
      <Container maxWidth="lg" sx={{ px: { xs: 2, sm: 6, md: 8 } }}>
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
              variant="h5"
              noWrap
              component="div"
              sx={{ display: { xs: 'none', sm: 'block' }, mr: 4, fontWeight: 'bold' }}
            >
              <MuiLink component={RouterLink} to="/" color="inherit" underline="none">
                M.E.C.
              </MuiLink>
            </Typography>
            <Box sx={{ display: { xs: 'none', sm: 'flex' }, mr: 2, gap: 2 }}>
              {navItems.filter(item => item.path !== '/admin').map((item) => ( 
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
                value={searchTerm}
                onChange={handleSearchChange}
              />
            </Search>
          </Box>
          <Box sx={{ ml: { xs: 'auto', sm: 0 } }}>
            <IconButton
              size="large"
              edge="end"
              color="inherit"
              aria-label={isAuthenticated ? "Logout ou Dashboard" : "Login de administrador"}
              onClick={isAuthenticated ? handleAdminClick : handleClickOpenLoginDialog}
            >
              {isAuthenticated ? <DashboardIcon /> : <AccountCircle />}
            </IconButton>
            
            {isAuthenticated && (
                <IconButton
                    size="large"
                    edge="end"
                    color="inherit"
                    aria-label="Logout"
                    onClick={handleLogout}
                    sx={{ display: { xs: 'none', sm: 'inline-flex' } }}
                >
                    <LogoutIcon />
                </IconButton>
            )}        
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
      <Dialog open={openLoginDialog} onClose={handleCloseLoginDialog} component="form" onSubmit={(e) => { e.preventDefault(); handleLogin(); }}>
        <DialogTitle>Login de Administrador</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            id="username"
            label="Utilizador"
            type="text"
            fullWidth
            variant="standard"
            value={loginForm.username}
            onChange={handleFormChange}
            error={!!error}
          />
          <TextField
            margin="dense"
            id="password" 
            label="Password"
            type={showPassword ? 'text' : 'password'}
            fullWidth
            variant="standard"
            value={loginForm.password}
            onChange={handleFormChange}
            error={!!error}
            helperText={error}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    aria-label="alternar visibilidade da password"
                    onClick={handleClickShowPassword}
                    onMouseDown={handleMouseDownPassword}
                    edge="end"
                    color={error ? "error" : "default"} 
                  >
                    {showPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseLoginDialog} disabled={loading}>Cancelar</Button>
          <Button 
            onClick={handleLogin} 
            color="primary"
            disabled={loading}
            endIcon={loading ? <CircularProgress size={20} color="inherit" /> : null}
          >
            {loading ? 'A Entrar...' : 'Entrar'}
          </Button>
        </DialogActions>
      </Dialog>

      <Snackbar open={snackbarOpen} autoHideDuration={6000} onClose={handleCloseSnackbar}>
        <Alert onClose={handleCloseSnackbar} severity={error ? "error" : "success"} sx={{ width: '100%' }}>
          {error 
            ? error 
            : (isAuthenticated ? "Login efetuado com sucesso!" : "Sessão encerrada (Logout).")}
        </Alert>
      </Snackbar>
    </MuiAppBar>
  );
}

export default AppBar;