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
import { useState, useEffect, useCallback } from 'react';

function Dashboard() {
    // Assumimos que o AuthContext só expõe: logout, token, protectedFetch, isAuthenticated, error (global)
    const { logout, token, protectedFetch, error: globalError } = useAuth(); 
    
    const [machines, setMachines] = useState([]);
    const [isLoadingData, setIsLoadingData] = useState(true);
    const [fetchErrorMessage, setFetchErrorMessage] = useState(null); // Para erros específicos do fetch

    const displayToken = token ? `${token.substring(0, 10)}...${token.substring(token.length - 10)}` : 'Nenhum token';

    const fetchMachines = useCallback(async () => {
        if (!token) {
            setIsLoadingData(false);
            return;
        }

        setIsLoadingData(true);
        setFetchErrorMessage(null);

        console.log("INÍCIO FETCH: A chamar /admin/maquinas..."); 
        
        // Chamada à rota Flask protegida
        // Usamos o endpoint /admin/maquinas, que o AuthContext converte para /api/admin/maquinas
        const { data, error: fetchError } = await protectedFetch('/admin/maquinas');
        
        console.log("DEBUG 1: fetchError (Se falhou):", fetchError); 
        console.log("DEBUG 2: Dados recebidos (data):", data); 
        console.log("DEBUG 3: Chave 'maquinas':", data?.maquinas); 

        if (data && data.maquinas) {
            setMachines(data.maquinas);
            console.log("DEBUG 4: SUCESSO. Máquinas carregadas:", data.maquinas.length);
        } else if (fetchError) {
            // Este é o log para o 404 persistente
            setFetchErrorMessage(`Falha ao carregar máquinas: ${fetchError}`);
            console.error("DEBUG X: ERRO fatal ao carregar máquinas:", fetchError);
        } else if (data && !data.maquinas) {
            setFetchErrorMessage("Resposta do servidor inválida (chave 'maquinas' ausente).");
            setMachines([]); 
        }
        
        setIsLoadingData(false);
        console.log("DEBUG 5: Estado de Loading desligado. (O círculo deve desaparecer).");
    }, [token, protectedFetch]);

    useEffect(() => {
        fetchMachines();
    }, [fetchMachines]); 

    return (
        <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
            <Box sx={{ p: 4, bgcolor: 'background.paper', borderRadius: 2, boxShadow: 3 }}>
                <Typography variant="h4" component="h1" gutterBottom sx={{ fontWeight: 'bold' }}>
                    Dashboard de Máquinas
                </Typography>
                <Typography variant="body1" paragraph>
                    Bem-vindo, Daniel. Podes gerir as tuas máquinas aqui.
                </Typography>
                
                {/* Visualização de Erro (Erro Global do AuthContext OU erro local de fetch) */}
                {(globalError || fetchErrorMessage) && (
                    <Alert severity="error" sx={{ mb: 2 }}>
                        {globalError || fetchErrorMessage}
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
                        <Alert severity="info">
                            {/* Mostra mensagem de erro de fetch OU a mensagem de que não há máquinas */}
                            {fetchErrorMessage ? "Erro na busca. Verifique a consola para mais detalhes." : "Nenhuma máquina encontrada no sistema."}
                        </Alert>
                    ) : (
                        <TableContainer component={Paper}>
                            <Table sx={{ minWidth: 650 }} aria-label="tabela de máquinas">
                                <TableHead>
                                    <TableRow sx={{ bgcolor: 'primary.main', '& .MuiTableCell-root': { color: 'white', fontWeight: 'bold' } }}>
                                        <TableCell>ID</TableCell>
                                        <TableCell>Nome</TableCell>       {/* 🛑 CORRIGIDO */}
                                        <TableCell>Descrição</TableCell>  {/* 🛑 CORRIGIDO */}
                                        <TableCell>Imagens</TableCell>    {/* 🛑 CORRIGIDO */}
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
                                            <TableCell>{machine.nome}</TableCell>        {/* 🛑 USAMOS 'nome' */}
                                            <TableCell>{machine.descricao}</TableCell>   {/* 🛑 USAMOS 'descricao' */}
                                            <TableCell>
                                                {/* Visualiza o número de imagens (agora a chave é 'imagens' e é um array) */}
                                                {machine.imagens && machine.imagens.length > 0
                                                    ? `${machine.imagens.length} fotos`
                                                    : 'Nenhuma'
                                                }
                                            </TableCell>
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