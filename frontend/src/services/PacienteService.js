import axios from "./axiosInstance";

const API_URL = "/api/paciente";

export const getCurrentUser = () => axios.get(`${API_URL}/getProfile`);
export const updateUser = (data) => axios.put(`${API_URL}/update`, data);
export const enterQueue = () => axios.post(`${API_URL}/enterQueue`)