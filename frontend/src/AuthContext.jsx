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

    // Variável de Ambiente para a API (usando a convenção VITE_)
    const API_URL = import.meta.env.VITE_API_URL || "http://127.0.0.1:5000";

    // 2. Função de LOGIN
    const login = async (username, password) => {
        setLoading(true);
        setError(null);
        try {
            // A chamada usa o proxy configurado no vite.config.js
            const response = await axios.post(`${API_URL}/admin/login`, {
                nome_utilizador: username,
                palavra_passe: password,
            });

            const newToken = response.data.access_token;
            
            // a. Guardar no State
            setToken(newToken);
            setIsAuthenticated(true);

            // b. Persistir no Navegador
            localStorage.setItem('access_token', newToken); 
            
            setLoading(false);
            
            // Redireciona para a dashboard
            navigate('/admin'); 
            
            return true;
        } catch (err) {
            setLoading(false);
            // Captura a mensagem de erro do backend ou uma mensagem genérica
            const errorMessage = err.response?.data?.message || "Erro de rede ou credenciais inválidas.";
            setError(errorMessage);
            console.error("Login falhou:", errorMessage);
            return false;
        }
    };

    // 3. Função de LOGOUT
    const logout = () => {
        // Opção: Fazer uma chamada ao backend para revogar o token (como já fizemos no Flask)
        // Por enquanto, apenas limpamos o lado do cliente:
        
        setToken(null);
        setIsAuthenticated(false);
        localStorage.removeItem('access_token');
        setError(null);
        
        // Redireciona para a página principal após logout
        navigate('/'); 
    };

    // 4. Hook para atualizar o cabeçalho 'Authorization' sempre que o token muda
    useEffect(() => {
        // Isto é crucial: diz ao axios para incluir o token JWT em todas as chamadas futuras.
        if (token) {
            axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
        } else {
            // Remove o cabeçalho se não houver token (para rotas não protegidas)
            delete axios.defaults.headers.common['Authorization'];
        }
    }, [token]);


    return (
        <AuthContext.Provider 
            value={{ token, isAuthenticated, login, logout, loading, error, API_URL }}
        >
            {children}
        </AuthContext.Provider>
    );
};

// 5. Hook Personalizado
export const useAuth = () => {
    return useContext(AuthContext);
};