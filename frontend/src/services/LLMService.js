import axiosInstance from "./axiosInstance";

const API_URL = '/paciente/triagem';

export const avaliarPrioridade = async (sintomas) => {
  try {
    const response = await axiosInstance.post(`${API_URL}/avaliar-prioridade`, {
      sintomas,
    });
    return response.data;
  } catch (error) {
    console.error('Erro ao avaliar prioridade:', error);
    throw error;
  }
};

export const recomendarEspecialista = async (sintomas) => {
  try {
    const response = await axiosInstance.post(`${API_URL}/recomendar-especialista`, {
      sintomas,
    });
    return response.data;
  } catch (error) {
    console.error('Erro ao recomendar especialista:', error);
    throw error;
  }
};
