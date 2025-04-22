import axios from "axios";

const API_URL = "/api/auth";

export const login = () => axios.get(`${API_URL}/login`);
export const register = (data) => axios.post(API_URL, data);