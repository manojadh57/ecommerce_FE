import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_BASE_URL,
  withCredentials: true,
});

api.interceptors.request.use((cfg) => {
  const token = localStorage.getItem("accessJWT");
  if (token) cfg.headers.Authorization = `Bearer ${token}`;
  return cfg;
});

api.interceptors.response.use(
  (res) => res,
  async (error) => {
    const original = error.config;
    if (error.response?.status === 401 && !original._retry) {
      original._retry = true;
      try {
        const { data } = await axios.post(
          `${import.meta.env.VITE_BASE_URL}/auth/refresh-token`,
          { refreshToken: localStorage.getItem("refreshJWT") },
          { withCredentials: true }
        );
        localStorage.setItem("accessJWT", data.accessJWT);
        original.headers.Authorization = `Bearer ${data.accessJWT}`;
        return api(original);
      } catch {
        localStorage.clear();
      }
    }
    return Promise.reject(error);
  }
);

export default api;
