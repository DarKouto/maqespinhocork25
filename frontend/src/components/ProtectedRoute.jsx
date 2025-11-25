import { Navigate } from 'react-router-dom';
import { useAuth } from '../AuthContext';
import { CircularProgress, Box } from '@mui/material';

function ProtectedRoute({ element: Component, ...rest }) {
  const { isAuthenticated, loading } = useAuth();

  // 1. Mostrar spinner se estiver a carregar
  if (loading) {
    return (
      <Box 
        sx={{ 
          display: 'flex', 
          justifyContent: 'center', 
          alignItems: 'center', 
          height: '100vh',
          mt: -8
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  // 2. Redirecionar se não estiver autenticado
  if (!isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  // 3. Renderizar o componente (Dashboard)
  return <Component {...rest} />;
}

export default ProtectedRoute;