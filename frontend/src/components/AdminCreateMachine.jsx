import { useState } from 'react';
import { Box, Typography, Container, Paper, TextField, Button, Alert } from '@mui/material';

function AdminCreateMachine() {
  const [formData, setFormData] = useState({
    nome: '',
    descricao: '',
    // Nota: O campo 'imagem' será adicionado mais tarde.
  });
  const [status, setStatus] = useState(null); // 'success', 'error', 'loading'
  const [message, setMessage] = useState('');
  const [errors, setErrors] = useState({});

  // 1. Lógica de Validação (Obrigatório)
  const validate = () => {
    const newErrors = {};
    if (!formData.nome.trim()) {
      newErrors.nome = 'O nome da máquina é obrigatório.';
    }
    if (!formData.descricao.trim()) {
      newErrors.descricao = 'A descrição é obrigatória.';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { id, value } = e.target;
    // Limpa o erro ao digitar
    setErrors(prevErrors => ({ ...prevErrors, [id]: '' }));
    setFormData((prevData) => ({
      ...prevData,
      [id]: value,
    }));
  };
  
  // 2. Lógica de Submissão com JWT
  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus('loading');
    setMessage('');
    
    if (!validate()) {
      setStatus('error');
      setMessage('Por favor, preencha todos os campos obrigatórios.');
      return;
    }
    
    // Obter o token JWT do localStorage (assumindo que o login foi feito)
    const token = localStorage.getItem('access_token');
    
    if (!token) {
      setStatus('error');
      setMessage('Erro: Não está autenticado. Faça login novamente.');
      return;
    }

    try {
      const response = await fetch('http://127.0.0.1:5000/admin/maquinas', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          // Incluir o token de autorização
          'Authorization': `Bearer ${token}`, 
        },
        body: JSON.stringify(formData),
      });

      const result = await response.json();

      if (response.ok) {
        setStatus('success');
        setMessage(result.message || 'Máquina adicionada com sucesso!');
        // Limpar o formulário
        setFormData({ nome: '', descricao: '' }); 
        setErrors({});
      } else {
        setStatus('error');
        // Usar a mensagem de erro que o Flask possa ter devolvido
        setMessage(result.error || 'Falha ao adicionar a máquina.');
      }
    } catch (error) {
      console.error('Erro na submissão:', error);
      setStatus('error');
      setMessage('Erro de rede ou servidor. Verifique a consola.');
    }
  };

  return (
    <Container maxWidth="sm" sx={{ mt: 4, mb: 4 }}>
      <Typography variant="h4" component="h1" gutterBottom align="center">
        Adicionar Nova Máquina
      </Typography>

      <Paper elevation={3} sx={{ p: 4, mt: 4 }}>
        <Typography variant="h6" gutterBottom>
          Detalhes da Máquina
        </Typography>

        {status && (
          <Alert severity={status === 'loading' ? 'info' : status} sx={{ mb: 2 }}>
            {status === 'loading' ? 'A enviar...' : message}
          </Alert>
        )}

        <Box
          component="form"
          noValidate
          autoComplete="off"
          sx={{ display: 'flex', flexDirection: 'column', gap: 2 }} 
          onSubmit={handleSubmit}
        >
          <TextField
            label="Nome da Máquina"
            variant="outlined"
            fullWidth
            id="nome"
            value={formData.nome} 
            onChange={handleChange} 
            error={!!errors.nome}
            helperText={errors.nome}
          />
          <TextField
            label="Descrição (Breve)"
            variant="outlined"
            fullWidth
            multiline
            rows={3}
            id="descricao" 
            value={formData.descricao} 
            onChange={handleChange}
            error={!!errors.descricao}
            helperText={errors.descricao}
          />

          {/* O campo de IMAGEM será adicionado NESTE local mais tarde */}
          {/* <input type="file" ... /> */}

          <Button
            type="submit"
            variant="contained"
            color="primary"
            disabled={status === 'loading'}
            sx={{ mt: 1, py: 1.5 }}
          >
            Adicionar Máquina
          </Button>
        </Box>
      </Paper>
    </Container>
  );
}

export default AdminCreateMachine;