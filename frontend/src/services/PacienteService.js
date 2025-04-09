import axios from 'axios';

const API_URL = '/api/admin/paciente';

export const getPacientes = () => axios.get(API_URL);
export const getPacientesCount = () => axios.get(`${API_URL}/count`);
export const getPacienteById = (id) => axios.get(`${API_URL}/${id}`);
export const createPaciente = (data) => axios.post(API_URL, data);
export const updatePaciente = (id, data) => axios.put(`${API_URL}/${id}`, data);
export const deletePaciente = (id) => axios.delete(`${API_URL}/${id}`);