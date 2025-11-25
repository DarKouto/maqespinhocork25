import { 
    Box, 
    Typography, 
    Container, 
    Button,
    CircularProgress,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    Alert
} from '@mui/material';
import { useAuth } from '../AuthContext';
import { useState, useEffect } from 'react';

function Dashboard() {
    // Incluímos protectedFetch e outros estados do AuthContext
    const { logout, token, protectedFetch, error, setError } = useAuth(); 
    const [machines, setMachines] = useState([]);
    const [isLoadingData, setIsLoadingData] = useState(true);

    const displayToken = token ? `${token.substring(0, 10)}...${token.substring(token.length - 10)}` : 'Nenhum token';

    // Função para buscar as máquinas
    const fetchMachines = async () => {
        setIsLoadingData(true);
        setError(null); // Limpamos erros antes de nova tentativa

        // Chamada à rota Flask protegida /api/admin/maquinas
        const { data, error: fetchError } = await protectedFetch('/api/admin/maquinas');
        
        if (data && data.maquinas) {
            setMachines(data.maquinas);
        } else if (fetchError) {
            console.error("Erro ao carregar máquinas:", fetchError);
        }
        setIsLoadingData(false);
    };

    // Carregar as máquinas quando o componente é montado
    useEffect(() => {
        if (token) {
            fetchMachines();
        }
    }, [token]); 

    return (
        <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
            <Box sx={{ p: 4, bgcolor: 'background.paper', borderRadius: 2, boxShadow: 3 }}>
                <Typography variant="h4" component="h1" gutterBottom sx={{ fontWeight: 'bold' }}>
                    Dashboard de Máquinas
                </Typography>
                <Typography variant="body1" paragraph>
                    Bem-vindo, Daniel. Podes gerir as tuas máquinas aqui.
                </Typography>
                
                {/* Visualização de Erro */}
                {error && (
                    <Alert severity="error" sx={{ mb: 2 }}>
                        {error}
                    </Alert>
                )}

                {/* Tabela de Máquinas */}
                <Box sx={{ mt: 4 }}>
                    <Typography variant="h5" component="h2" gutterBottom>
                        Listagem de Máquinas
                    </Typography>
                    
                    {isLoadingData ? (
                        <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
                            <CircularProgress />
                        </Box>
                    ) : machines.length === 0 ? (
                        <Alert severity="info">Nenhuma máquina encontrada no sistema.</Alert>
                    ) : (
                        <TableContainer component={Paper}>
                            <Table sx={{ minWidth: 650 }} aria-label="tabela de máquinas">
                                <TableHead>
                                    <TableRow sx={{ bgcolor: 'primary.main', '& .MuiTableCell-root': { color: 'white', fontWeight: 'bold' } }}>
                                        <TableCell>ID</TableCell>
                                        <TableCell>Título</TableCell>
                                        <TableCell>Preço</TableCell>
                                        <TableCell>Ano</TableCell>
                                        <TableCell>Ações</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {machines.map((machine) => (
                                        <TableRow
                                            key={machine.id}
                                            sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                                        >
                                            <TableCell component="th" scope="row">{machine.id}</TableCell>
                                            <TableCell>{machine.titulo_pt}</TableCell>
                                            <TableCell>{machine.preco_eur} €</TableCell>
                                            <TableCell>{machine.ano}</TableCell>
                                            <TableCell>
                                                <Button size="small" variant="outlined" sx={{ mr: 1 }}>Editar</Button>
                                                <Button size="small" variant="outlined" color="error">Eliminar</Button>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </TableContainer>
                    )}
                </Box>
                
                {/* Debug Token */}
                <Box sx={{ mt: 4, p: 2, bgcolor: '#f0ffdf', borderRadius: 1, border: '1px solid #c9e4c9' }}>
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