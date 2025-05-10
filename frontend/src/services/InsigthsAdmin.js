import axiosInstance from "./axiosInstance";

const API_URL = "/admin/insights";

export const getTempoMedioEspera = () => axiosInstance.get(`${API_URL}/tempo-medio-espera`);
export const getTamanhoMedioFila = () => axiosInstance.get(`${API_URL}/tamanho-medio-filas`);
