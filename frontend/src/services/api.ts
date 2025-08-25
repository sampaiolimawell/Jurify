import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:5000/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
}, (error) => {
  return Promise.reject(error);
});

api.interceptors.response.use((response) => {
  return response;
}, (error) => {
  return Promise.reject(error);
});

export const fetchJurisprudencia = async () => {
  const response = await api.get('/jurisprudencia');
  return response.data;
};

export const getProcesses = async () => {
  return await api.get('/processos');
};

// Função para consultar processos por diferentes tipos de filtro
// Aceita o tipo de filtro (cpf, cnpj ou número do processo) e o valor a ser consultado
export const consultarProcessoPorFiltro = async (tipo: 'cpf' | 'cnpj' | 'processo', valor: string) => {
  try {
    // Requisição POST para o endpoint de consulta processual com os parâmetros de filtro
    const response = await api.post('/consulta-processual/consulta', { tipo, valor });
    return response.data; // Retorna apenas os dados da resposta
  } catch (error) {
    console.error('Erro ao consultar processos:', error); // Registra o erro no console
    throw error; // Propaga o erro para ser tratado pelo chamador da função
  }
};

// Exporta a instância da API como uma exportação nomeada
export { api };

// Exporta a instância da API como exportação padrão
// Isso permite importar a API de duas formas diferentes:
// 1. import api from '../services/api';
// 2. import { api } from '../services/api';
export default api;