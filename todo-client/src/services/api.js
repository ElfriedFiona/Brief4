import axios from "axios";

const api = axios.create({
  baseURL: "https://todo-app-g2av.onrender.com/api", // 🔥 ton backend en ligne
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;
