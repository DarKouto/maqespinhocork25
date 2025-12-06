import { useState, useRef } from 'react';
import { Button, Alert, Box, CircularProgress, Typography, IconButton } from '@mui/material';
import FileUploadIcon from '@mui/icons-material/FileUpload';
import DeleteIcon from '@mui/icons-material/Delete';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import { useAuth } from '../AuthContext'; 

/**
 * @param {number} maquinaId 
 * @param {function} onUploadSuccess
 * @param {string} uploadEndpoint
 */

function ImageUploader({ maquinaId, onUploadSuccess, uploadEndpoint }) {
    const { protectedFetch } = useAuth();
    
    const [selectedFile, setSelectedFile] = useState(null);
    const [isUploading, setIsUploading] = useState(false);
    const [uploadMessage, setUploadMessage] = useState({ type: null, text: '' });
    const fileInputRef = useRef(null);
    const handleFileChange = (event) => {
        const file = event.target.files[0];
        if (file) {
            if (file.size > 5 * 1024 * 1024) {
                setUploadMessage({ type: 'error', text: 'O ficheiro deve ser inferior a 5MB.' });
                setSelectedFile(null);
                return;
            }
            setSelectedFile(file);
            setUploadMessage({ type: null, text: '' }); // Limpa mensagens anteriores
        }
    };
    
    const handleUpload = async () => {
        if (!selectedFile) {
            setUploadMessage({ type: 'warning', text: 'Por favor, selecione um ficheiro primeiro.' });
            return;
        }
        setIsUploading(true);
        setUploadMessage({ type: null, text: '' });
        const formData = new FormData();
        formData.append('file', selectedFile);
        const { data, error: uploadError } = await protectedFetch(uploadEndpoint, {
            method: 'POST',
            data: formData, 
        });

        setIsUploading(false);

        if (data && data.message) {
            setUploadMessage({ type: 'success', text: data.message || 'Imagem carregada!' });
            onUploadSuccess(data.url);
            setSelectedFile(null);
        } else if (uploadError) {
            setUploadMessage({ type: 'error', text: `Erro no upload: ${uploadError}` });
        } else {
            setUploadMessage({ type: 'error', text: 'Erro desconhecido durante o upload.' });
        }
    };
    
    const handleRemoveFile = () => {
        setSelectedFile(null);
        setUploadMessage({ type: null, text: '' });
        if (fileInputRef.current) {
            fileInputRef.current.value = "";
        }
    };

    return (
        <Box sx={{ p: 2, border: '1px dashed #ccc', borderRadius: 1, mb: 2 }}>
            <Typography variant="subtitle1" gutterBottom>
                Upload de Imagem para Máquina #{maquinaId}
            </Typography>
            
            {uploadMessage.text && (
                <Alert severity={uploadMessage.type} sx={{ mb: 2 }}>
                    {uploadMessage.text}
                </Alert>
            )}

            <input
                type="file"
                accept="image/png, image/jpeg, image/gif"
                onChange={handleFileChange}
                style={{ display: 'none' }}
                ref={fileInputRef}
            />

            {!selectedFile ? (
                <Button
                    variant="outlined"
                    startIcon={<FileUploadIcon />}
                    onClick={() => fileInputRef.current.click()}
                    disabled={isUploading || maquinaId === null}
                    fullWidth
                >
                    Selecionar Imagem
                </Button>
            ) : (
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 1 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', flexGrow: 1 }}>
                        <CheckCircleIcon color="success" sx={{ mr: 1, flexShrink: 0 }} />
                        <Typography variant="body2" sx={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                            {selectedFile.name} ({Math.round(selectedFile.size / 1024)} KB)
                        </Typography>
                    </Box>
                    <IconButton onClick={handleRemoveFile} size="small" color="error" disabled={isUploading}>
                        <DeleteIcon fontSize="small" />
                    </IconButton>
                    <Button
                        variant="contained"
                        color="primary"
                        onClick={handleUpload}
                        disabled={isUploading}
                        startIcon={isUploading ? <CircularProgress size={20} color="inherit" /> : <FileUploadIcon />}
                    >
                        {isUploading ? 'A Carregar...' : 'Carregar'}
                    </Button>
                </Box>
            )}
        </Box>
    );
}

export default ImageUploader;