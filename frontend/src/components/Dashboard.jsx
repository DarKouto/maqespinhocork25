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
    Alert,
    
    // Novas importações para o formulário
    TextField,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    IconButton
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close'; // Ícone para fechar
import AddIcon from '@mui/icons-material/Add'; // Ícone para adicionar
import { useAuth } from '../AuthContext';
import { useState, useEffect, useCallback } from 'react';

function Dashboard() {
    const { logout, token, protectedFetch, error: globalError } = useAuth(); 
    
    const [machines, setMachines] = useState([]);
    const [isLoadingData, setIsLoadingData] = useState(true);
    const [fetchErrorMessage, setFetchErrorMessage] = useState(null); 
    
    // --- ESTADOS PARA O MODAL DE ADIÇÃO ---
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [newMachineData, setNewMachineData] = useState({
        nome: '',
        descricao: ''
    });
    const [isCreating, setIsCreating] = useState(false);
    const [createMessage, setCreateMessage] = useState({ type: null, text: '' });
    // -------------------------------------

    const displayToken = token ? `${token.substring(0, 10)}...${token.substring(token.length - 10)}` : 'Nenhum token';

    // Função de fetch que lista as máquinas (mantida)
    const fetchMachines = useCallback(async () => {
        if (!token) {
            setIsLoadingData(false);
            return;
        }

        setIsLoadingData(true);
        setFetchErrorMessage(null);

        console.log("INÍCIO FETCH: A chamar /admin/maquinas..."); 
        
        const { data, error: fetchError } = await protectedFetch('/admin/maquinas');
        
        if (data && data.maquinas) {
            setMachines(data.maquinas);
            console.log("SUCESSO. Máquinas carregadas:", data.maquinas.length);
        } else if (fetchError) {
            setFetchErrorMessage(`Falha ao carregar máquinas: ${fetchError}`);
        } else if (data && !data.maquinas) {
            setFetchErrorMessage("Resposta do servidor inválida (chave 'maquinas' ausente).");
            setMachines([]); 
        }
        
        setIsLoadingData(false);
    }, [token, protectedFetch]);

    useEffect(() => {
        fetchMachines();
    }, [fetchMachines]); 

    // --- LÓGICA DE CRIAÇÃO ---

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setNewMachineData(prev => ({ ...prev, [name]: value }));
    };

    const handleAddMachine = async () => {
        // Validação mínima
        if (!newMachineData.nome || !newMachineData.descricao) {
            setCreateMessage({ type: 'error', text: 'Nome e Descrição são obrigatórios.' });
            return;
        }

        setIsCreating(true);
        setCreateMessage({ type: null, text: '' });

        // Chama o endpoint POST /admin/maquinas
        const { data, error: createError } = await protectedFetch('/admin/maquinas', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(newMachineData)
        });

        setIsCreating(false);

        if (data && data.message) {
            setCreateMessage({ type: 'success', text: data.message });
            setNewMachineData({ nome: '', descricao: '' }); // Limpar formulário
            fetchMachines(); // Recarregar a lista de máquinas (para que a nova máquina apareça)
            
            // Fechar o modal após um pequeno atraso para o utilizador ver a mensagem de sucesso
            setTimeout(() => {
                setIsAddModalOpen(false);
                setCreateMessage({ type: null, text: '' });
            }, 1500); 

        } else if (createError) {
            setCreateMessage({ type: 'error', text: `Erro ao criar máquina: ${createError}` });
        } else {
            setCreateMessage({ type: 'error', text: 'Erro desconhecido ao criar máquina.' });
        }
    };

    // -------------------------

    return (
        <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
            <Box sx={{ p: 4, bgcolor: 'background.paper', borderRadius: 2, boxShadow: 3 }}>
                <Typography variant="h4" component="h1" gutterBottom sx={{ fontWeight: 'bold' }}>
                    Dashboard de Máquinas
                </Typography>
                <Typography variant="body1" paragraph>
                    Bem-vindo, Daniel. Podes gerir as tuas máquinas aqui.
                </Typography>
                
                {/* Botão Adicionar Máquina */}
                <Button 
                    variant="contained" 
                    color="primary" 
                    startIcon={<AddIcon />} 
                    onClick={() => {
                        setNewMachineData({ nome: '', descricao: '' }); // Reset ao abrir
                        setCreateMessage({ type: null, text: '' }); // Limpar mensagens
                        setIsAddModalOpen(true);
                    }}
                    sx={{ mb: 3 }}
                >
                    Adicionar Nova Máquina
                </Button>

                {/* Visualização de Erro Global */}
                {(globalError || fetchErrorMessage) && (
                    <Alert severity="error" sx={{ mb: 2 }}>
                        {globalError || fetchErrorMessage}
                    </Alert>
                )}

                {/* Tabela de Máquinas */}
                <Box>
                    <Typography variant="h5" component="h2" gutterBottom>
                        Listagem de Máquinas
                    </Typography>
                    
                    {isLoadingData ? (
                        <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
                            <CircularProgress />
                        </Box>
                    ) : machines.length === 0 ? (
                        <Alert severity="info">
                            {fetchErrorMessage ? "Erro na busca. Verifique a consola para mais detalhes." : "Nenhuma máquina encontrada no sistema."}
                        </Alert>
                    ) : (
                        <TableContainer component={Paper}>
                            <Table sx={{ minWidth: 650 }} aria-label="tabela de máquinas">
                                <TableHead>
                                    <TableRow sx={{ bgcolor: 'primary.main', '& .MuiTableCell-root': { color: 'white', fontWeight: 'bold' } }}>
                                        <TableCell>ID</TableCell>
                                        <TableCell>Nome</TableCell>
                                        <TableCell>Descrição</TableCell>
                                        <TableCell>Imagens</TableCell>
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
                                            <TableCell>{machine.nome}</TableCell> 
                                            <TableCell>{machine.descricao.substring(0, 50)}...</TableCell> {/* Limita a descrição */}
                                            <TableCell>
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

            {/* --- MODAL PARA ADICIONAR NOVA MÁQUINA --- */}
            <Dialog 
                open={isAddModalOpen} 
                onClose={() => setIsAddModalOpen(false)}
                fullWidth
                maxWidth="sm"
            >
                <DialogTitle>
                    Adicionar Nova Máquina
                    <IconButton
                        aria-label="fechar"
                        onClick={() => setIsAddModalOpen(false)}
                        sx={{
                            position: 'absolute',
                            right: 8,
                            top: 8,
                            color: (theme) => theme.palette.grey[500],
                        }}
                    >
                        <CloseIcon />
                    </IconButton>
                </DialogTitle>
                <DialogContent dividers>
                    {createMessage.text && (
                        <Alert severity={createMessage.type} sx={{ mb: 2 }}>
                            {createMessage.text}
                        </Alert>
                    )}
                    <TextField
                        autoFocus
                        margin="dense"
                        id="nome"
                        name="nome"
                        label="Nome da Máquina"
                        type="text"
                        fullWidth
                        variant="outlined"
                        value={newMachineData.nome}
                        onChange={handleInputChange}
                        required
                        sx={{ mb: 2 }}
                    />
                    <TextField
                        margin="dense"
                        id="descricao"
                        name="descricao"
                        label="Descrição da Máquina"
                        type="text"
                        fullWidth
                        multiline
                        rows={4}
                        variant="outlined"
                        value={newMachineData.descricao}
                        onChange={handleInputChange}
                        required
                    />
                </DialogContent>
                <DialogActions>
                    <Button 
                        onClick={() => setIsAddModalOpen(false)}
                        color="secondary"
                    >
                        Cancelar
                    </Button>
                    <Button 
                        onClick={handleAddMachine} 
                        color="primary" 
                        variant="contained"
                        disabled={isCreating}
                        startIcon={isCreating ? <CircularProgress size={20} color="inherit" /> : null}
                    >
                        {isCreating ? 'A Criar...' : 'Criar Máquina'}
                    </Button>
                </DialogActions>
            </Dialog>
            {/* ------------------------------------------- */}
        </Container>
    );
}

export default Dashboard;