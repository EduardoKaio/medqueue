import axios from 'axios';

const API_URL = '/api/admin/fila';

export const listarTodas = () => axios.get(API_URL);
export const buscarFilaPorId = (id) => axios.get(`${API_URL}/${id}`);
export const criarFila = (data) => axios.post(API_URL, data);
export const atualizarFila = (id, data) => axios.put(`${API_URL}/${id}`, data);
export const deletarFila = (id) => axios.delete(`${API_URL}/${id}`);
