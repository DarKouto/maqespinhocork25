import React, { createContext, useState, useContext, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const AuthContext = createContext();
export const AuthProvider = ({ children }) => {
    const navigate = useNavigate();
    const initialToken = localStorage.getItem('access_token');
    const [token, setToken] = useState(initialToken);
    const [isAuthenticated, setIsAuthenticated] = useState(!!initialToken);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const API_URL = '/api'; 

    const login = async (username, password) => {
        setLoading(true);
        setError(null);
        try {
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

    const logout = () => {
        setToken(null);
        setIsAuthenticated(false);
        localStorage.removeItem('access_token');
        setError(null);
        navigate('/'); 
    };

    useEffect(() => {
        if (token) {
            axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
        } else {
            delete axios.defaults.headers.common['Authorization'];
        }
    }, [token]);

    const protectedFetch = async (endpoint, options = {}) => {
        const finalEndpoint = endpoint.startsWith('/') ? endpoint : `/${endpoint}`;
        
        try {
            const url = `${API_URL}${finalEndpoint}`;
            const method = (options.method || 'GET').toUpperCase();
            let finalHeaders = { ...options.headers };
            const dataPayload = options.data || undefined; 

            if (['POST', 'PUT'].includes(method) && dataPayload) {
                if (!(dataPayload instanceof FormData) && !options.headers?.['Content-Type']) {
                    finalHeaders = {
                        'Content-Type': 'application/json',
                        ...options.headers,
                    };
                }
            }
            
            const response = await axios({
                method: method,
                url: url,
                data: dataPayload, 
                headers: finalHeaders, 
            });
            
            return { data: response.data, error: null };
            
        } catch (err) {
            if (err.response) {
                if (err.response.status === 401) {
                    setError("Sessão expirada. Faça login novamente.");
                    logout(); 
                    return { data: null, error: "Sessão expirada." };
                }
                const errorMessage = err.response.data?.message || err.response.data || `Erro do Servidor (${err.response.status}).`;
                return { data: null, error: errorMessage };
            }
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

export const useAuth = () => {
    return useContext(AuthContext);
};