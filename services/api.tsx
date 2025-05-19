import axios, { Axios } from 'axios';

export const api = axios.create({
    baseURL: 'https://backend-2gls.onrender.com/',
    timeout: 10000,
    headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
    }
});

// Interceptor para requisições
api.interceptors.request.use(
    (config) => {
        console.log('Requisição sendo enviada:', config);
        return config;
    },
    (error) => {
        console.error('Erro na requisição:', error);
        return Promise.reject(error);
    }
);

// Interceptor para respostas
api.interceptors.response.use(
    (response) => {
        console.log('Resposta recebida:', response);
        return response;
    },
    (error) => {
        console.error('Erro na resposta:', error);
        if (error.response) {
            console.error('Dados do erro:', error.response.data);
            console.error('Status do erro:', error.response.status);
        }
        return Promise.reject(error);
    }
);