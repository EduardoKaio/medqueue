import axiosInstance from "./axiosInstance";

const SMS_BASE_URL = "/api/sms";

export const notificarProximoAtendimento = async (filaId, userId) => {
  try {
    const response = await axiosInstance.post(
      `${SMS_BASE_URL}/notificar-proximo/${filaId}/${userId}`
    );
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

export const getHistoricoSms = async () => {
  try {
    const response = await axiosInstance.get(`${SMS_BASE_URL}/historico`);
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

export const getSmsPorTelefone = async (telefone) => {
  try {
    const response = await axiosInstance.get(
      `${SMS_BASE_URL}/historico/${telefone}`
    );
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

export const getContadorSms = async () => {
  try {
    const response = await axiosInstance.get(`${SMS_BASE_URL}/contador`);
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

export const enviarSmsTeste = async (telefone, nome = "Cliente Teste") => {
  try {
    const response = await axiosInstance.post(
      `${SMS_BASE_URL}/teste/${telefone}`,
      null,
      {
        params: { nome },
      }
    );
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};
