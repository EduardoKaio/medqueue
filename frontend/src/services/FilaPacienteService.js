import axiosInstance from "./axiosInstance";

const API_URL = "/admin/fila-paciente";

export const listarFilaOrdenada = (filaId) =>
  axiosInstance.get(`${API_URL}/ordered-list`, { params: { filaId } });
