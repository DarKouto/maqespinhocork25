import React, { createContext, useState, useContext, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const navigate = useNavigate();
    
    // 1. ESTADO: Tenta carregar o token do localStorage no arranque
    const initialToken = localStorage.getItem('access_token');
    const [token, setToken] = useState(initialToken);
    const [isAuthenticated, setIsAuthenticated] = useState(!!initialToken);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    // Variável de Ambiente para a API. Usamos o proxy do Vite (/api).
    // Usamos '/api' para ser consistente com o Vite.config.js
    const API_URL = '/api'; 

    // 2. Função de LOGIN
    const login = async (username, password) => {
        setLoading(true);
        setError(null);
        try {
            // A chamada usa o prefixo /api que o Flask espera
            const response = await axios.post(`${API_URL}/admin/login`, {
                nome_utilizador: username,
                palavra_passe: password,
            });

            const newToken = response.data.access_token;
            
            setToken(newToken);
            setIsAuthenticated(true);
            localStorage.setItem('access_token', newToken); 
            
            setLoading(false);
            
            navigate('/admin'); 
            
            return true;
        } catch (err) {
            setLoading(false);
            const errorMessage = err.response?.data?.message || "Erro de rede ou credenciais inválidas.";
            setError(errorMessage);
            console.error("Login falhou:", errorMessage);
            return false;
        }
    };

    // 3. Função de LOGOUT
    const logout = () => {
        setToken(null);
        setIsAuthenticated(false);
        localStorage.removeItem('access_token');
        setError(null);
        navigate('/'); 
    };

    // 4. Hook para atualizar o cabeçalho 'Authorization' sempre que o token muda
    useEffect(() => {
        // Diz ao axios para incluir o token JWT em todas as chamadas futuras.
        if (token) {
            axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
        } else {
            // Remove o cabeçalho se não houver token (para rotas não protegidas)
            delete axios.defaults.headers.common['Authorization'];
        }
    }, [token]);


    // 5. AUXILIAR DE FETCH PROTEGIDA
    const protectedFetch = async (endpoint, options = {}) => {
        // Garantir que o endpoint começa com '/' se não estiver no API_URL
        const finalEndpoint = endpoint.startsWith('/') ? endpoint : `/${endpoint}`;
        
        try {
            const url = `${API_URL}${finalEndpoint}`;
            
            // 🛑 ALTERAÇÃO CRUCIAL 🛑
            // Criar o cabeçalho de autorização explicitamente usando o estado 'token'
            const authHeader = token ? { 'Authorization': `Bearer ${token}` } : {};

            const response = await axios({
                method: options.method || 'GET',
                url: url,
                data: options.data, // Para POST/PUT
                // Combinar o cabeçalho de autenticação com quaisquer outros headers customizados
                headers: { 
                    ...authHeader, 
                    ...options.headers 
                },
            });
            
            // Devolvemos data e error (null) no formato que o Dashboard espera
            return { data: response.data, error: null };
            
        } catch (err) {
            // Lógica de tratamento de erros
            if (err.response) {
                 // Erro 401: Token expirado/inválido
                if (err.response.status === 401) {
                    setError("Sessão expirada. Faça login novamente.");
                    logout(); 
                    return { data: null, error: "Sessão expirada." };
                }
                
                // Outros erros de resposta do servidor (404, 500, etc.)
                const errorMessage = err.response.data?.message || `Erro do Servidor (${err.response.status}).`;
                return { data: null, error: errorMessage };
            }

            // Erro de rede (ex: servidor Flask desligado)
            return { data: null, error: "Erro de rede. O servidor pode estar desligado." };
        }
    };


    return (
        <AuthContext.Provider 
            value={{ 
                token, 
                isAuthenticated, 
                login, 
                logout, 
                loading, 
                error, 
                API_URL,
                protectedFetch 
            }}
        >
            {children}
        </AuthContext.Provider>
    );
};

// 6. Hook Personalizado
export const useAuth = () => {
    return useContext(AuthContext);
};