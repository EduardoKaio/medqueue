import axios from "axios";

const API_URL = "/api/admin/fila-paciente";

export const listarFilaOrdenada = (filaId) =>
  axios.get(`${API_URL}/ordered-list`, { params: { filaId } });
