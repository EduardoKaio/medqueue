import axiosInstance from "./axiosInstance";

const API_URL = "/user";

export const getCurrentUser = () => axiosInstance.get(`${API_URL}/getProfile`);
export const updateUser = (data) =>
  axiosInstance.put(`${API_URL}/update`, data);
export const enterQueue = (extraInfo, prioridade) =>
  axiosInstance.post(`${API_URL}/enterQueue`, null, {
    params: {
      extraInfo,
      prioridade,
    },
  });
export const getQueueInfo = () => axiosInstance.get(`${API_URL}/fila/info`);
export const getHistoricoFilas = () => axiosInstance.get(`${API_URL}/fila/historico`);
