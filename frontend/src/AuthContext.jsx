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
        const finalEndpoint = endpoint.startsWith('/') ? endpoint : `/${endpoint}`;
        
        try {
            const url = `${API_URL}${finalEndpoint}`;
            
            const method = (options.method || 'GET').toUpperCase();
            let finalHeaders = { ...options.headers };
            
            const dataPayload = options.data || undefined; 

            // 🛑 CORREÇÃO IMPLEMENTADA AQUI:
            // 1. Só verifica POST/PUT se houver payload.
            if (['POST', 'PUT'].includes(method) && dataPayload) {
                // 2. CRÍTICO: Se o payload NÃO for FormData E não tiver um Content-Type definido,
                // assume que é JSON. Se for FormData, permite que o Axios/Browser defina o 'multipart'.
                if (!(dataPayload instanceof FormData) && !options.headers?.['Content-Type']) {
                    finalHeaders = {
                        'Content-Type': 'application/json',
                        ...options.headers, // Mantém outros headers customizados
                    };
                }
            }

            // Nota: O cabeçalho Authorization já está em axios.defaults.headers.common
            
            const response = await axios({
                method: method,
                url: url,
                data: dataPayload, 
                // Passar headers (agora contém 'Content-Type: application/json' ou está vazio/personalizado)
                headers: finalHeaders, 
            });
            
            return { data: response.data, error: null };
            
        } catch (err) {
            if (err.response) {
                 // Erro 401: Token expirado/inválido
                if (err.response.status === 401) {
                    setError("Sessão expirada. Faça login novamente.");
                    logout(); 
                    return { data: null, error: "Sessão expirada." };
                }
                
                // Outros erros de resposta do servidor (incluindo o 400 do Flask)
                // Usar err.response.data diretamente se for string, ou a message.
                const errorMessage = err.response.data?.message || err.response.data || `Erro do Servidor (${err.response.status}).`;
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