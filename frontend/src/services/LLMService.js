import axios from 'axios';

const API_URL = '/api/paciente/triagem';

export const avaliarPrioridade = async (sintomas) => {
  try {
    const response = await axios.post(`${API_URL}/avaliar-prioridade`, {
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
    const response = await axios.post(`${API_URL}/recomendar-especialista`, {
      sintomas,
    });
    return response.data;
  } catch (error) {
    console.error('Erro ao recomendar especialista:', error);
    throw error;
  }
};
