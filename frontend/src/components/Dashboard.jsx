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
import EditIcon from '@mui/icons-material/Edit'; 
import ImageUploader from './ImageUploader';
import { useAuth } from '../AuthContext';
import { useState, useEffect, useCallback } from 'react';

const initialMachineState = {
    id: null,
    nome: '',
    descricao: '',
    imagens: [] 
};

const initialNewMachineState = {
    nome: '',
    descricao: '',
    temp_maquina_id: null, 
    uploaded_image_urls: [] 
};

function Dashboard() {
    const { logout, token, protectedFetch, error: globalError } = useAuth(); 
    
    const [machines, setMachines] = useState([]);
    const [isLoadingData, setIsLoadingData] = useState(true);
    const [fetchErrorMessage, setFetchErrorMessage] = useState(null); 
    
    // --- ESTADOS PARA O MODAL DE ADIÇÃO (POST) ---
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [newMachineData, setNewMachineData] = useState(initialNewMachineState); 
    const [isCreating, setIsCreating] = useState(false);
    const [createMessage, setCreateMessage] = useState({ type: null, text: '' });
    
    // --- ESTADOS PARA O MODAL DE EDIÇÃO (PUT) ---
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [machineToEditData, setMachineToEditData] = useState(initialMachineState);
    const [isUpdating, setIsUpdating] = useState(false);
    const [editMessage, setEditMessage] = useState({ type: null, text: '' });
    
    // --- ESTADOS PARA O MODAL DE ELIMINAÇÃO (DELETE) ---
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [machineToDeleteId, setMachineToDeleteId] = useState(null);
    const [isDeleting, setIsDeleting] = useState(false);
    const [deleteMessage, setDeleteMessage] = useState({ type: null, text: '' });
    // ------------------------------------------------

    const displayToken = token ? `${token.substring(0, 10)}...${token.substring(token.length - 10)}` : 'Nenhum token';

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

    const handleInputChange = (e, type = 'add') => {
        const { name, value } = e.target;
        if (type === 'add') {
            setNewMachineData(prev => ({ ...prev, [name]: value }));
        } else if (type === 'edit') {
            setMachineToEditData(prev => ({ ...prev, [name]: value }));
        }
    };
    
    const handleCreateMachineRecord = async () => {
        const { nome, descricao } = newMachineData;

        if (!nome || !descricao) {
            setCreateMessage({ type: 'error', text: 'Nome e Descrição são obrigatórios.' });
            return;
        }

        setIsCreating(true);
        setCreateMessage({ type: null, text: '' });

        const { data, error: createError } = await protectedFetch('/admin/maquinas', {
            method: 'POST',
            data: { nome, descricao }
        });

        setIsCreating(false);

        if (data && data.maquina_id) {
            setCreateMessage({ type: 'success', text: `Máquina criada (ID: ${data.maquina_id}). Agora, adicione imagens.` });
            setNewMachineData(prev => ({ 
                ...prev, 
                temp_maquina_id: data.maquina_id 
            }));
        } else if (createError) {
            setCreateMessage({ type: 'error', text: `Erro ao criar registo: ${createError}` });
        } else {
            setCreateMessage({ type: 'error', text: 'Erro desconhecido ao criar máquina.' });
        }
    };
    
    const handleImageUploadSuccess = (newUrl) => {
        setNewMachineData(prev => {
            const updatedUrls = [...prev.uploaded_image_urls, newUrl];
            setCreateMessage({ type: 'success', text: `Imagem adicionada! Total: ${updatedUrls.length}` });
            return {
                ...prev,
                uploaded_image_urls: updatedUrls
            };
        });
        fetchMachines();
    };

    const finalizeCreation = () => {
        setIsAddModalOpen(false);
        setNewMachineData(initialNewMachineState);
        setCreateMessage({ type: null, text: '' });
    };

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

    const openEditDialog = (machine) => {
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
        
        if (!nome || !descricao) {
            setEditMessage({ type: 'error', text: 'Nome e Descrição são obrigatórios.' });
            return;
        }
        setIsUpdating(true);
        setEditMessage({ type: null, text: '' });
        const endpoint = `/admin/maquinas/${id}`;
        const { data, error: updateError } = await protectedFetch(endpoint, {
            method: 'PUT',
            data: { nome, descricao } 
        });

        setIsUpdating(false);

        if (data && data.message) {
            setEditMessage({ type: 'success', text: data.message });
            fetchMachines();
            
            setTimeout(() => {
                closeEditDialog();
            }, 1500); 

        } else if (updateError) {
            setEditMessage({ type: 'error', text: `Erro ao atualizar máquina: ${updateError}` });
        } else {
            setEditMessage({ type: 'error', text: 'Erro desconhecido ao atualizar máquina.' });
        }
    };

    return (
        <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
            <Box sx={{ p: 4, bgcolor: 'background.paper', borderRadius: 2, boxShadow: 3 }}>
                <Typography variant="h4" component="h1" gutterBottom sx={{ fontWeight: 'bold' }}>
                    Dashboard de Máquinas
                </Typography>
                <Typography variant="body1" paragraph>
                    Bem-vindo Sr. Engenheiro Jorge. Pode gerir as suas máquinas aqui.
                </Typography>
                
                <Button 
                    variant="contained" 
                    color="primary" 
                    startIcon={<AddIcon />} 
                    onClick={() => {
                        setNewMachineData(initialNewMachineState);
                        setCreateMessage({ type: null, text: '' });
                        setIsAddModalOpen(true);
                    }}
                    sx={{ mb: 3 }}
                >
                    Adicionar Nova Máquina
                </Button>

                {(globalError || fetchErrorMessage) && (
                    <Alert severity="error" sx={{ mb: 2 }}>
                        {globalError || fetchErrorMessage}
                    </Alert>
                )}

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
                                                    ? (
                                                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                                            <img 
                                                                src={machine.imagens[0]} 
                                                                alt={`Imagem de ${machine.nome}`} 
                                                                style={{ width: 50, height: 50, objectFit: 'cover', borderRadius: '4px', marginRight: 8 }}
                                                            />
                                                            {machine.imagens.length > 1 && 
                                                                <Typography variant="caption" color="textSecondary">
                                                                    + {machine.imagens.length - 1}
                                                                </Typography>
                                                            }
                                                        </Box>
                                                    )
                                                    : 'Nenhuma'
                                                }
                                            </TableCell>
                                            <TableCell>
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
                
                <Button 
                    variant="contained" 
                    color="secondary" 
                    onClick={logout} 
                    sx={{ mt: 3 }}
                >
                    Fazer Logout
                </Button>
            </Box>

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
                    
                    {newMachineData.temp_maquina_id === null ? (
                        <Box>
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
                                onChange={(e) => handleInputChange(e, 'add')} 
                                required
                                sx={{ mb: 2 }}
                                disabled={isCreating}
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
                                onChange={(e) => handleInputChange(e, 'add')} 
                                required
                                disabled={isCreating}
                            />
                        </Box>
                    ) : (

                        <Box>
                            <Alert severity="info" sx={{ mb: 2 }}>
                                Máquina criada com sucesso. Adicione agora as imagens.
                                <br/>
                                Imagens carregadas nesta sessão: **{newMachineData.uploaded_image_urls.length}**
                            </Alert>
                            <ImageUploader
                                maquinaId={newMachineData.temp_maquina_id}
                                onUploadSuccess={handleImageUploadSuccess}
                                uploadEndpoint={`/admin/maquinas/${newMachineData.temp_maquina_id}/upload-imagem`}
                            />
                            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mt: 2 }}>
                                {newMachineData.uploaded_image_urls.map((url, index) => (
                                    <img 
                                        key={index} 
                                        src={url} 
                                        alt={`Upload Preview ${index + 1}`} 
                                        style={{ width: 80, height: 80, objectFit: 'cover', borderRadius: '4px' }}
                                    />
                                ))}
                            </Box>
                        </Box>
                    )}

                </DialogContent>
                <DialogActions>
                    <Button 
                        onClick={() => setIsAddModalOpen(false)}
                        color="secondary"
                        disabled={isCreating}
                    >
                        Cancelar
                    </Button>
                    
                    {newMachineData.temp_maquina_id === null ? (
                        <Button 
                            onClick={handleCreateMachineRecord} 
                            color="primary" 
                            variant="contained"
                            disabled={isCreating || !newMachineData.nome || !newMachineData.descricao}
                            startIcon={isCreating ? <CircularProgress size={20} color="inherit" /> : <AddIcon />}
                        >
                            {isCreating ? 'A Criar...' : 'Criar Máquina'}
                        </Button>
                    ) : (
                        <Button 
                            onClick={finalizeCreation} 
                            color="success" 
                            variant="contained"
                        >
                            Finalizar e Fechar
                        </Button>
                    )}
                </DialogActions>
            </Dialog>

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
                        onChange={(e) => handleInputChange(e, 'edit')} 
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
                        onChange={(e) => handleInputChange(e, 'edit')} 
                        required
                    />
                    
                    {machineToEditData.id && (
                        <Box>
                            <Typography variant="h6" component="h3" sx={{ mt: 3, mb: 1 }}>
                                Adicionar Mais Imagens
                            </Typography>
                            <ImageUploader
                                maquinaId={machineToEditData.id}
                                onUploadSuccess={() => {
                                    setEditMessage({ type: 'success', text: 'Imagem adicionada com sucesso! Clique em "Atualizar Máquina" para fechar.' });
                                    fetchMachines();
                                }}
                                uploadEndpoint={`/admin/maquinas/${machineToEditData.id}/upload-imagem`}
                            />
                        </Box>
                    )}
                    
                    <Typography variant="h6" component="h3" sx={{ mt: 3, mb: 1 }}>
                        Imagens Existentes ({machineToEditData.imagens ? machineToEditData.imagens.length : 0})
                    </Typography>
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                        {machineToEditData.imagens && machineToEditData.imagens.map((url, index) => (
                            <img 
                                key={index} 
                                src={url} 
                                alt={`Máquina Imagem ${index + 1}`} 
                                style={{ width: 100, height: 100, objectFit: 'cover', borderRadius: '4px' }}
                            />
                        ))}
                    </Box>

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
                            Tem a certeza que deseja **eliminar** a máquina com o ID: **{machineToDeleteId}**? Esta ação é irreversível. Todas as **imagens associadas serão removidas da Base de Dados**.
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
        </Container>
    );
}

export default Dashboard;