import axiosInstance from "./axiosInstance";

const API_URL = "/animais";

// Cria um animal
export const createAnimal = (data) => 
  axiosInstance.post(API_URL, data);

// Atualiza um animal pelo id
export const updateAnimal = (id, data) =>
  axiosInstance.put(`${API_URL}/${id}`, data);

// Deleta um animal pelo id
export const deleteAnimal = (id) =>
  axiosInstance.delete(`${API_URL}/${id}`);

// Busca um animal pelo id
export const getAnimalById = (id) =>
  axiosInstance.get(`${API_URL}/${id}`);

// Busca todos os animais de um dono pelo id do dono
export const getAnimalsByDono = (donoId) =>
  axiosInstance.get(`${API_URL}/by-dono/${donoId}`);
