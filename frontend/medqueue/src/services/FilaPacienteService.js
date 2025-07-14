import axiosInstance from "./axiosInstance";

const API_URL = "/admin/fila-user";

export const listarFilaOrdenada = (filaId) =>
  axiosInstance.get(`${API_URL}/ordered-list`, { params: { filaId } });

// Função genérica para alterar o status de um paciente na fila
export const alterarStatusFilaPaciente = (filaId, pacienteId, novoStatus) => {
  return axiosInstance.put(`${API_URL}/${filaId}/user/${pacienteId}/status`, {
    status: novoStatus,
  });
};

// Funções específicas que usam a função genérica
export const realizarCheckIn = (filaId, pacienteId) => {
  return alterarStatusFilaPaciente(filaId, pacienteId, "Em atendimento");
};

export const marcarComoAtendido = (filaId, pacienteId) => {
  return alterarStatusFilaPaciente(filaId, pacienteId, "Atendido");
};

export const marcarComoAtrasado = (filaId, pacienteId) => {
  return alterarStatusFilaPaciente(filaId, pacienteId, "Atrasado");
};

export const realizarCheckInAtrasado = (filaId, pacienteId) => {
  return alterarStatusFilaPaciente(
    filaId,
    pacienteId,
    "Em atendimento - Atrasado"
  );
};

export const marcarComoAtendidoAtrasado = (filaId, pacienteId) => {
  return alterarStatusFilaPaciente(filaId, pacienteId, "Atendido - Atrasado");
};

export const marcarComoRemovido = (filaId, pacienteId) => {
  return alterarStatusFilaPaciente(filaId, pacienteId, "Removido");
};

export const getHistoricoPacienteAdmin = (pacienteId) =>
  axiosInstance.get(`${API_URL}/historico/${pacienteId}`);
