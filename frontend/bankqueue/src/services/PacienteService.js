// Enum para garantir nomes válidos de filas
export const FILAS_ENUM = {
  CAIXA_ELETRONICO: "Caixa Eletrônico",
  GUICHE_ATENDIMENTO: "Guichê de Atendimento",
  GERENTE_CONTA: "Gerente de Conta",
};

import axiosInstance from "./axiosInstance";

const API_URL = "/user";

export const getCurrentUser = () => axiosInstance.get(`${API_URL}/getProfile`);
export const updateUser = (data) =>
  axiosInstance.put(`${API_URL}/update`, data);
export const enterQueue = (extraInfo, prioridade, queueSubject = {}) => {
  // Garantir que prioridade seja sempre um número inteiro válido para BankQueue
  // BankQueue usa: 1 = prioridade alta, 3 = prioridade comum
  let prioridadeInt;
  if (typeof prioridade === "boolean") {
    prioridadeInt = prioridade ? 1 : 3;
  } else if (typeof prioridade === "number") {
    prioridadeInt = Math.floor(prioridade);
    // Garantir que está no range válido (1-3)
    if (prioridadeInt < 1) prioridadeInt = 3;
    if (prioridadeInt > 3) prioridadeInt = 1;
  } else {
    prioridadeInt = 3; // padrão = sem prioridade
  }

  return axiosInstance.post(`${API_URL}/enterQueue`, queueSubject, {
    params: {
      extraInfo: String(extraInfo), // Garantir que seja string
      prioridade: prioridadeInt,
    },
    headers: {
      "Content-Type": "application/json",
    },
  });
};
export const getQueueInfo = () => axiosInstance.get(`${API_URL}/fila/info`);
export const getHistoricoFilas = () =>
  axiosInstance.get(`${API_URL}/fila/historico`);
