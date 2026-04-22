import axios from "axios";

const API_URL = `${import.meta.env.VITE_API_URL}/api`;

const api = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true,
});

export const authService = {
  async login(credentials) {
    return api.post("/auth/login", credentials);
  },

  async register(userData) {
    return api.post("/auth/register", userData);
  },
};

export default authService;
