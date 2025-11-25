import { Box, Typography, Container, Button } from '@mui/material';
import { useAuth } from '../AuthContext';

function Dashboard() {
    // Usamos o useAuth para aceder a dados do utilizador e a função de logout
    const { logout, token } = useAuth();
    
    // Simplificamos o token para mostrar apenas os primeiros e últimos caracteres
    const displayToken = token ? `${token.substring(0, 10)}...${token.substring(token.length - 10)}` : 'Nenhum token';

    return (
        <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
            <Box sx={{ p: 4, bgcolor: 'background.paper', borderRadius: 2, boxShadow: 3 }}>
                <Typography variant="h4" component="h1" gutterBottom sx={{ fontWeight: 'bold' }}>
                    Área de Administração (Dashboard)
                </Typography>
                <Typography variant="body1" paragraph>
                    Bem-vindo, Daniel. Esta é a área restrita onde podes gerir o stock da Maqespinhocork.
                </Typography>
                
                <Box sx={{ mt: 3, p: 2, bgcolor: '#f0f0f0', borderRadius: 1 }}>
                    <Typography variant="subtitle2">
                        Token JWT Ativo (APENAS DEBUG):
                    </Typography>
                    <Typography variant="caption" sx={{ wordBreak: 'break-all' }}>
                        {displayToken}
                    </Typography>
                </Box>

                <Button 
                    variant="contained" 
                    color="secondary" 
                    onClick={logout} 
                    sx={{ mt: 3 }}
                >
                    Fazer Logout
                </Button>
            </Box>
        </Container>
    );
}

export default Dashboard;