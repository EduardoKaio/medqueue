import axiosInstance from "./axiosInstance";

const API_URL = '/admin/fila';

export const listarTodas = () => axiosInstance.get(API_URL);
export const buscarFilaPorId = (id) => axiosInstance.get(`${API_URL}/${id}`);
export const criarFila = (data) => axiosInstance.post(API_URL, data);
export const atualizarFila = (id, data) => axiosInstance.patch(`${API_URL}/${id}`, data);
export const deletarFila = (id) => axiosInstance.delete(`${API_URL}/${id}`);
export const getFilasAtivasCount = () => axiosInstance.get(`${API_URL}/count`);
