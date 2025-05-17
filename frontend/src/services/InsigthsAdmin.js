import axiosInstance from "./axiosInstance";

const API_URL = "/admin/insights";

export const getTempoMedioEspera = () => axiosInstance.get(`${API_URL}/tempo-medio-espera`);
export const getTamanhoMedioFila = () => axiosInstance.get(`${API_URL}/tamanho-medio-filas`);
export const getTempoMedioPorEspecialidade = () => axiosInstance.get(`${API_URL}/tempo-medio-por-especialidade`);
export const getPacientesPorEspecialidade = () => axiosInstance.get(`${API_URL}/pacientes-por-especialidade`);