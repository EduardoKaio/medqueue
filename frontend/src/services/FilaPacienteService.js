import axiosInstance from "./axiosInstance";

const API_URL = "/admin/fila-paciente";

export const listarFilaOrdenada = (filaId) =>
  axiosInstance.get(`${API_URL}/ordered-list`, { params: { filaId } });

export const realizarCheckIn = async (filaId, pacienteId) => {
  return axiosInstance.put(
    `${API_URL}/${filaId}/paciente/${pacienteId}/check-in`
  );
};
