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
import CloseIcon from '@mui/icons-material/Close'; 
import AddIcon from '@mui/icons-material/Add'; 
import DeleteIcon from '@mui/icons-material/Delete'; 
import EditIcon from '@mui/icons-material/Edit'; // Ícone para editar
import { useAuth } from '../AuthContext';
import { useState, useEffect, useCallback } from 'react';

// Estado inicial para uma máquina vazia
const initialMachineState = {
    id: null,
    nome: '',
    descricao: ''
};

function Dashboard() {
    const { logout, token, protectedFetch, error: globalError } = useAuth(); 
    
    const [machines, setMachines] = useState([]);
    const [isLoadingData, setIsLoadingData] = useState(true);
    const [fetchErrorMessage, setFetchErrorMessage] = useState(null); 
    
    // --- ESTADOS PARA O MODAL DE ADIÇÃO (POST) ---
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [newMachineData, setNewMachineData] = useState(initialMachineState);
    const [isCreating, setIsCreating] = useState(false);
    const [createMessage, setCreateMessage] = useState({ type: null, text: '' });
    
    // --- NOVOS ESTADOS PARA O MODAL DE EDIÇÃO (PUT) ---
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [machineToEditData, setMachineToEditData] = useState(initialMachineState);
    const [isUpdating, setIsUpdating] = useState(false);
    const [editMessage, setEditMessage] = useState({ type: null, text: '' });
    // --------------------------------------------------

    // --- ESTADOS PARA O MODAL DE ELIMINAÇÃO (DELETE) ---
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [machineToDeleteId, setMachineToDeleteId] = useState(null);
    const [isDeleting, setIsDeleting] = useState(false);
    const [deleteMessage, setDeleteMessage] = useState({ type: null, text: '' });
    // ------------------------------------------------

    const displayToken = token ? `${token.substring(0, 10)}...${token.substring(token.length - 10)}` : 'Nenhum token';

    // Função para buscar a lista de máquinas (mantida)
    const fetchMachines = useCallback(async () => {
        if (!token) {
            setIsLoadingData(false);
            return;
        }

        setIsLoadingData(true);
        setFetchErrorMessage(null);

        const { data, error: fetchError } = await protectedFetch('/admin/maquinas');
        
        if (data && data.maquinas) {
            setMachines(data.maquinas);
        } else if (fetchError) {
            setFetchErrorMessage(`Falha ao carregar máquinas: ${fetchError}`);
        } else if (data && !data.maquinas) {
            setFetchErrorMessage("Resposta do servidor inválida (chave 'maquinas' ausente).");
            setMachines([]); 
        }
        
        setIsLoadingData(false);
    }, [token, protectedFetch]);

    useEffect(() => {
        if (token) {
            fetchMachines();
        }
    }, [token, fetchMachines]); 

    // --- LÓGICA DE CRIAÇÃO (MANTIDA) ---

    const handleInputChange = (e, type = 'add') => {
        const { name, value } = e.target;
        if (type === 'add') {
            setNewMachineData(prev => ({ ...prev, [name]: value }));
        } else if (type === 'edit') {
            setMachineToEditData(prev => ({ ...prev, [name]: value }));
        }
    };

    const handleAddMachine = async () => {
        if (!newMachineData.nome || !newMachineData.descricao) {
            setCreateMessage({ type: 'error', text: 'Nome e Descrição são obrigatórios.' });
            return;
        }

        setIsCreating(true);
        setCreateMessage({ type: null, text: '' });

        const { data, error: createError } = await protectedFetch('/admin/maquinas', {
            method: 'POST',
            data: newMachineData
        });

        setIsCreating(false);

        if (data && data.message) {
            setCreateMessage({ type: 'success', text: data.message });
            setNewMachineData(initialMachineState); 
            fetchMachines(); 
            
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

    // --- LÓGICA DE ELIMINAÇÃO (MANTIDA) ---

    const openDeleteDialog = (machineId) => {
        setMachineToDeleteId(machineId);
        setDeleteMessage({ type: null, text: '' });
        setIsDeleteModalOpen(true);
    };

    const closeDeleteDialog = () => {
        setIsDeleteModalOpen(false);
        setMachineToDeleteId(null);
        setDeleteMessage({ type: null, text: '' });
    };

    const handleDeleteMachine = async () => {
        if (!machineToDeleteId) return;

        setIsDeleting(true);
        setDeleteMessage({ type: null, text: '' });

        const endpoint = `/admin/maquinas/${machineToDeleteId}`;

        const { data, error: deleteError } = await protectedFetch(endpoint, {
            method: 'DELETE',
        });

        setIsDeleting(false);

        if (data && data.message) {
            setDeleteMessage({ type: 'success', text: data.message });
            fetchMachines(); 
            
            setTimeout(() => {
                closeDeleteDialog();
            }, 1500); 

        } else if (deleteError) {
            setDeleteMessage({ type: 'error', text: `Erro ao eliminar máquina: ${deleteError}` });
        } else {
            setDeleteMessage({ type: 'error', text: 'Erro desconhecido ao eliminar máquina.' });
        }
    };

    // --- LÓGICA DE EDIÇÃO (NOVA) ---

    const openEditDialog = (machine) => {
        // Pré-preencher o estado de edição com os dados da máquina selecionada
        setMachineToEditData(machine);
        setEditMessage({ type: null, text: '' });
        setIsEditModalOpen(true);
    };

    const closeEditDialog = () => {
        setIsEditModalOpen(false);
        setMachineToEditData(initialMachineState);
        setEditMessage({ type: null, text: '' });
    };

    const handleEditMachine = async () => {
        const { id, nome, descricao } = machineToEditData;
        
        // Validação mínima
        if (!nome || !descricao) {
            setEditMessage({ type: 'error', text: 'Nome e Descrição são obrigatórios.' });
            return;
        }

        setIsUpdating(true);
        setEditMessage({ type: null, text: '' });
        
        // Envia PUT para /admin/maquinas/<id> com os dados atualizados
        const endpoint = `/admin/maquinas/${id}`;
        
        const { data, error: updateError } = await protectedFetch(endpoint, {
            method: 'PUT',
            data: { nome, descricao } // Envia apenas nome e descrição
        });

        setIsUpdating(false);

        if (data && data.message) {
            setEditMessage({ type: 'success', text: data.message });
            fetchMachines(); // Recarregar a lista
            
            setTimeout(() => {
                closeEditDialog();
            }, 1500); 

        } else if (updateError) {
            setEditMessage({ type: 'error', text: `Erro ao atualizar máquina: ${updateError}` });
        } else {
            setEditMessage({ type: 'error', text: 'Erro desconhecido ao atualizar máquina.' });
        }
    };

    // -----------------------------------

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
                        setNewMachineData(initialMachineState);
                        setCreateMessage({ type: null, text: '' });
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
                                            <TableCell>{machine.descricao.substring(0, 50)}...</TableCell> 
                                            <TableCell>
                                                {machine.imagens && machine.imagens.length > 0
                                                    ? `${machine.imagens.length} fotos`
                                                    : 'Nenhuma'
                                                }
                                            </TableCell>
                                            <TableCell>
                                                {/* Botão de Edição (NOVO) */}
                                                <Button 
                                                    size="small" 
                                                    variant="outlined" 
                                                    startIcon={<EditIcon sx={{ fontSize: '1rem' }} />}
                                                    onClick={() => openEditDialog(machine)} 
                                                    sx={{ mr: 1 }}
                                                >
                                                    Editar
                                                </Button>
                                                <Button 
                                                    size="small" 
                                                    variant="contained" 
                                                    color="error"
                                                    startIcon={<DeleteIcon sx={{ fontSize: '1rem' }} />}
                                                    onClick={() => openDeleteDialog(machine.id)} 
                                                >
                                                    Eliminar
                                                </Button>
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

            {/* --- MODAL PARA ADICIONAR NOVA MÁQUINA (POST) --- */}
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
                        onChange={(e) => handleInputChange(e, 'add')} // Tipo 'add'
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
                        onChange={(e) => handleInputChange(e, 'add')} // Tipo 'add'
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

            {/* --- NOVO: MODAL PARA EDITAR MÁQUINA (PUT) --- */}
            <Dialog 
                open={isEditModalOpen} 
                onClose={closeEditDialog}
                fullWidth
                maxWidth="sm"
            >
                <DialogTitle>
                    Editar Máquina ID: {machineToEditData.id}
                    <IconButton
                        aria-label="fechar"
                        onClick={closeEditDialog}
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
                    {editMessage.text && (
                        <Alert severity={editMessage.type} sx={{ mb: 2 }}>
                            {editMessage.text}
                        </Alert>
                    )}
                    <TextField
                        autoFocus
                        margin="dense"
                        id="edit-nome"
                        name="nome"
                        label="Nome da Máquina"
                        type="text"
                        fullWidth
                        variant="outlined"
                        value={machineToEditData.nome}
                        onChange={(e) => handleInputChange(e, 'edit')} // Tipo 'edit'
                        required
                        sx={{ mb: 2 }}
                    />
                    <TextField
                        margin="dense"
                        id="edit-descricao"
                        name="descricao"
                        label="Descrição da Máquina"
                        type="text"
                        fullWidth
                        multiline
                        rows={4}
                        variant="outlined"
                        value={machineToEditData.descricao}
                        onChange={(e) => handleInputChange(e, 'edit')} // Tipo 'edit'
                        required
                    />
                </DialogContent>
                <DialogActions>
                    <Button 
                        onClick={closeEditDialog}
                        color="secondary"
                        disabled={isUpdating}
                    >
                        Cancelar
                    </Button>
                    <Button 
                        onClick={handleEditMachine} 
                        color="primary" 
                        variant="contained"
                        disabled={isUpdating}
                        startIcon={isUpdating ? <CircularProgress size={20} color="inherit" /> : <EditIcon />}
                    >
                        {isUpdating ? 'A Atualizar...' : 'Atualizar Máquina'}
                    </Button>
                </DialogActions>
            </Dialog>
            {/* ------------------------------------------- */}

            {/* --- MODAL DE CONFIRMAÇÃO DE ELIMINAÇÃO (MANTIDO) --- */}
            <Dialog 
                open={isDeleteModalOpen} 
                onClose={closeDeleteDialog}
                maxWidth="xs"
            >
                <DialogTitle sx={{ color: 'error.main' }}>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <DeleteIcon sx={{ mr: 1 }} /> Confirmar Eliminação
                    </Box>
                </DialogTitle>
                <DialogContent>
                    {deleteMessage.text ? (
                        <Alert severity={deleteMessage.type} sx={{ mb: 2 }}>
                            {deleteMessage.text}
                        </Alert>
                    ) : (
                        <Typography variant="body1">
                            Tem a certeza que deseja **eliminar** a máquina com o ID: **{machineToDeleteId}**? Esta ação é irreversível.
                        </Typography>
                    )}
                </DialogContent>
                <DialogActions>
                    <Button 
                        onClick={closeDeleteDialog}
                        color="inherit"
                        disabled={isDeleting}
                    >
                        Cancelar
                    </Button>
                    <Button 
                        onClick={handleDeleteMachine} 
                        color="error" 
                        variant="contained"
                        disabled={isDeleting}
                        startIcon={isDeleting ? <CircularProgress size={20} color="inherit" /> : <DeleteIcon />}
                    >
                        {isDeleting ? 'A Eliminar...' : 'Sim, Eliminar'}
                    </Button>
                </DialogActions>
            </Dialog>
            {/* ---------------------------------------------------- */}
        </Container>
    );
}

export default Dashboard;