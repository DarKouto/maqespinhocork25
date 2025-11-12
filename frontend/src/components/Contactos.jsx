import { useState } from 'react';
import { Box, Typography, Container, Paper, TextField, Button } from '@mui/material';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import PhoneIcon from '@mui/icons-material/Phone';
import EmailIcon from '@mui/icons-material/Email';

// Regex simples para validação de email
const EMAIL_REGEX = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

function Contactos() {
  const [formData, setFormData] = useState({
    nome: '', // Corrigido para 'nome' (igual ao backend)
    email: '',
    mensagem: '', // Corrigido para 'mensagem' (igual ao backend)
  });
  
  // ESTADO para guardar mensagens de erro de validação
  const [errors, setErrors] = useState({}); 

  const handleChange = (e) => {
    const { id, value } = e.target;
    // Limpa o erro do campo
    setErrors(prevErrors => ({
      ...prevErrors,
      [id]: ''
    }));
    setFormData((prevData) => ({
      ...prevData,
      [id]: value,
    }));
  };

  // FUNÇÃO DE VALIDAÇÃO DO FRONTEND
  const validate = () => {
    const newErrors = {};
    if (!formData.nome.trim()) {
      newErrors.nome = 'O nome é obrigatório.';
    }
    if (!formData.email.trim()) {
      newErrors.email = 'O email é obrigatório.';
    } else if (!EMAIL_REGEX.test(formData.email.trim())) {
      newErrors.email = 'Insira um email válido.';
    }
    if (!formData.mensagem.trim()) {
      newErrors.mensagem = 'A mensagem é obrigatória.';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0; // Retorna true se não houver erros
  };
  

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // 1. Validação do Frontend (UX)
    if (!validate()) {
      return; // Se houver erros, pára aqui.
    }
    
    // ... dentro de handleSubmit ...

    try {
      // CORREÇÃO AQUI: Usa o URL relativo!
      const API_URL = '/contactos'; 
        
      const response = await fetch(API_URL, { 
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const result = await response.json();

      if (response.ok) {
        alert(result.message);
        setFormData({
          nome: '',
          email: '',
          mensagem: '',
        });
        setErrors({}); // Limpa erros
      } else {
        // Erro do backend (ex: erro de validação de segurança ou falha de envio)
        alert(`Erro do Servidor: ${result.error}`);
      }
    } catch (error) {
      alert("Erro Desconhecido. Por favor contacte manualmente: jorgejimramos@gmail.com");
      console.error('Erro:', error);
    }
  };

  return (
    <Container maxWidth="md" sx={{ mt: 4, mb: 4 }}>
      <Typography variant="h4" component="h1" gutterBottom align="center">
        Contactos e Localização
      </Typography>

      {/* SEÇÃO DE INFORMAÇÕES E MAPA (RESTAURO) */}
      <Paper elevation={3} sx={{ p: 4, mt: 4, display: 'flex', flexDirection: { xs: 'column', md: 'row' }, gap: 4 }}>
        <Box sx={{ flex: 1 }}>
          <Typography variant="h6" gutterBottom mb={4}>
            Informações de Contacto
          </Typography>
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
            <LocationOnIcon sx={{ mr: 1 }} />
            <Typography variant="body1">
              Rua do Vergão 190<br />
              4520-614 São João de Ver
            </Typography>
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
            <PhoneIcon sx={{ mr: 1 }} />
            <Typography variant="body1">962 335 430 (rede móvel nacional)</Typography>
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
            <EmailIcon sx={{ mr: 1 }} />
            <Typography variant="body1">jorgejimramos@gmail.com</Typography>
          </Box>
        </Box>

        <Box sx={{ flex: 1, minHeight: 300, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <iframe
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3013.568064435228!2d-8.555371516123818!3d40.94713279751086!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0xd23813bb6d038fb%3A0xdd821c6ce57e03d9!2sMaqespinhocork%20Lda!5e0!3m2!1spt-PT!2spt!4v1753367785535!5m2!1spt-PT!2spt"
            width="100%"
            height="100%"
            style={{ border: 0 }}
            allowFullScreen=""
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            title="Localização da MaqEspinhoCork"
          ></iframe>
        </Box>
      </Paper>
      {/* FIM DA SEÇÃO DE INFORMAÇÕES E MAPA */}

      <Paper elevation={3} sx={{ p: 4, mt: 4 }}>
        <Typography 
          variant="h5" 
          gutterBottom 
          align="left"
          sx={{ mb: 4 }}
        >
          Envie-nos uma mensagem
        </Typography>
        <Box
          component="form"
          noValidate
          autoComplete="off"
          sx={{ display: 'flex', flexDirection: 'column' }} 
          onSubmit={handleSubmit}
        >
          <TextField
            label="Nome"
            variant="outlined"
            fullWidth
            sx={{ mb: 2 }} 
            id="nome"
            value={formData.nome} 
            onChange={handleChange} 
            // PROPS DE ERRO
            error={!!errors.nome}
            helperText={errors.nome}
          />
          <TextField
            label="Email"
            variant="outlined"
            fullWidth
            sx={{ mb: 2 }} 
            type="email"
            id="email"
            value={formData.email} 
            onChange={handleChange}
            // PROPS DE ERRO
            error={!!errors.email}
            helperText={errors.email}
          />
          <TextField
            label="Mensagem"
            variant="outlined"
            fullWidth
            multiline
            rows={4}
            id="mensagem" 
            value={formData.mensagem} 
            onChange={handleChange}
            // PROPS DE ERRO
            error={!!errors.mensagem}
            helperText={errors.mensagem}
            sx={{ 
              mb: 3,
              '& .MuiInputBase-input': { 
                resize: 'vertical',
              },
            }} 
          />
          <Button
            type="submit"
            variant="contained"
            color="primary"
            sx={{ mt: 1, py: 1.5 }}
          >
            Enviar Mensagem
          </Button>
        </Box>
      </Paper>
    </Container>
  );
}

export default Contactos;