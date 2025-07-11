import axiosInstance from "./axiosInstance";

const API_URL = "/user/triagem";

export const avaliarPrioridade = async (sintomas) => {
  try {
    const response = await axiosInstance.post(`${API_URL}/avaliar-prioridade`, {
      sintomas,
    });
    return response.data;
  } catch (error) {
    console.error("Erro ao avaliar prioridade:", error);
    throw error;
  }
};
