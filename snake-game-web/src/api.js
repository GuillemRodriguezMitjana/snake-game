import axios from "axios";

const apiClient = axios.create({
  baseURL: `http://${import.meta.env.VITE_API_DOMAIN}/api/v1/player`,
  headers: {
    "Content-Type": "application/json",
  },
});

export default apiClient;
