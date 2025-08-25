import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';

interface User {
    id: number;
    email: string;
    username: string;
}

export const useAuth = () => {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const navigate = useNavigate();

    const login = async (email: string, password: string) => {
        try {
            const response = await api.post('/auth/login', { username: 'sampaiolimawell', password });
            setUser(response.data.user);
            localStorage.setItem('token', response.data.token);
            setIsAuthenticated(true);
            navigate('/', { replace: true });
            return response.data;
        } catch (error) {
            console.error('Login failed:', error);
            throw error;
        }
    };
    
    const register = async (username: string, email: string, password: string) => {
        try {
            const response = await api.post('/auth/register', { username, email, password });
            setUser(response.data.user);
            if (response.data.token) {
                localStorage.setItem('token', response.data.token);
                setIsAuthenticated(true);
                navigate('/');
            } else {
                // Se o registro for bem-sucedido mas não retornar um token, redireciona para o login
                navigate('/login');  // Redireciona para a página de login
            }
            return response.data;
        } catch (error) {
            console.error('Registration failed:', error);
            throw error;
        }
    };

    // Função para deslogar o usuário
    // Remove dados de autenticação e redireciona para a página de login
    const logout = () => {
        setUser(null);  // Remove os dados do usuário do estado
        setIsAuthenticated(false);  // Atualiza o estado de autenticação
        localStorage.removeItem('token');  // Remove o token JWT do localStorage
        navigate('/login');  // Redireciona para a página de login após o logout
    };

    // Função para verificar se o usuário está autenticado
    // Verifica o token no localStorage e busca os dados do usuário no backend
    const checkAuth = async () => {
        const token = localStorage.getItem('token');  // Obtém o token do localStorage
        if (token) {
            try {
                // Busca os dados do perfil do usuário no backend
                const response = await api.get('/users/profile');
                setUser(response.data.user);  // Armazena os dados do usuário no estado
                setIsAuthenticated(true);  // Atualiza o estado de autenticação
            } catch (error) {
                console.error('Failed to fetch user:', error);
                // Não desloga o usuário em caso de erro, apenas mantém o estado de autenticação
                // O token ainda é válido, mesmo que a requisição para obter o perfil falhe
            }
        } else {
            setIsAuthenticated(false); // Se não houver token, define como não autenticado
        }
        setLoading(false);  // Finaliza o estado de carregamento
    };

    // Hook de efeito que verifica a autenticação ao montar o componente
    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token) {
            setIsAuthenticated(true); // Define como autenticado se o token existir
        }
        checkAuth();  // Verifica se o usuário está autenticado
    }, []);  // Array de dependências vazio indica que o efeito só executa uma vez
    
    // Retorna os estados e funções do hook para uso nos componentes
    return {
        user,            // Dados do usuário autenticado
        loading,         // Estado de carregamento
        isAuthenticated, // Estado de autenticação
        login,           // Função para autenticar o usuário
        logout,          // Função para deslogar o usuário
        register,        // Função para registrar um novo usuário
        checkAuth        // Função para verificar a autenticação
    };
};

export default useAuth;