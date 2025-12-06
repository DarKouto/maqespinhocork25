import { Navigate } from 'react-router-dom';
import { useAuth } from '../AuthContext';
import { CircularProgress, Box } from '@mui/material';

function ProtectedRoute({ element: Component, ...rest }) {
  const { isAuthenticated, loading } = useAuth();

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

  if (!isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  return <Component {...rest} />;
}

export default ProtectedRoute;