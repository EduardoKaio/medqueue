import axiosInstance from "./axiosInstance";

const API_URL = "/paciente";

export const getCurrentUser = () => axiosInstance.get(`${API_URL}/getProfile`);
export const updateUser = (data) => axiosInstance.put(`${API_URL}/update`, data);
export const enterQueue = () => axiosInstance.post(`${API_URL}/enterQueue`);
export const getQueueInfo = () => axiosInstance.get(`${API_URL}/fila/info`);