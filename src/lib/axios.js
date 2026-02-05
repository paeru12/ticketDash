import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  withCredentials: true, // 🔥 WAJIB
  headers: {
    "Content-Type": "application/json",
    "x-api-key": import.meta.env.VITE_API_KEY,
  },
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("authToken");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// 🔁 AUTO REFRESH TOKEN (COOKIE BASED)
api.interceptors.response.use(
  res => res,
  async error => {
    if (error.response?.status === 401 && !error.config._retry) {
      error.config._retry = true;

      try {
        await axios.post(
          `${import.meta.env.VITE_API_URL}/auth/admin/refresh`,
          {},
          { withCredentials: true }
        );
        return api(error.config);
      } catch {
        window.dispatchEvent(new Event("auth:logout"));
      }
    }
    return Promise.reject(error);
  }
);

export default api;
