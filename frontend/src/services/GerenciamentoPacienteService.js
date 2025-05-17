import axiosInstance from "./axiosInstance";

const API_URL = '/admin/paciente';

export const getPacientes = () => axiosInstance.get(API_URL);
export const getPacientesCount = () => axiosInstance.get(`${API_URL}/count`);
export const getPacienteById = (id) => axiosInstance.get(`${API_URL}/${id}`);
export const createPaciente = (data) => axiosInstance.post(API_URL, data);
export const updatePaciente = (id, data) => axiosInstance.put(`${API_URL}/${id}`, data);
export const deletePaciente = (id) => axiosInstance.delete(`${API_URL}/${id}`);
