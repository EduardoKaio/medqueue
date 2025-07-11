import axiosInstance from "./axiosInstance";

const API_URL = "/auth";

export const login = (data) => axiosInstance.post(`${API_URL}/login`, data);
export const register = (data) => axiosInstance.post(`${API_URL}/register`, data);
export const logout = () => axiosInstance.get(`${API_URL}/logout`);