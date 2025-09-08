import axios from 'axios';

const API_URL = 'http://localhost:3333'; // URL do seu backend

export const api = axios.create({
  baseURL: API_URL,
  withCredentials: true, // Importante para o refresh token se usar cookies
});

// Função para obter o accessToken do Zustand (vamos criá-la)
import { useAuthStore } from '../stores/authStore';

api.interceptors.request.use(
  (config) => {
    const token = useAuthStore.getState().accessToken;
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Interceptor para o fluxo de refresh token
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    const { status } = error.response;
    const { logout, setAccessToken, refreshToken } = useAuthStore.getState();

    if (status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      if (!refreshToken) {
        logout();
        return Promise.reject(error);
      }

      try {
        const { data } = await axios.post(`${API_URL}/auth/refresh`, {
          refreshToken,
        });
        const newAccessToken = data.accessToken;
        setAccessToken(newAccessToken, refreshToken); // Atualiza o token na loja
        api.defaults.headers.common['Authorization'] = `Bearer ${newAccessToken}`;
        originalRequest.headers['Authorization'] = `Bearer ${newAccessToken}`;

        return api(originalRequest);
      } catch (refreshError) {
        logout();
        return Promise.reject(refreshError);
      }
    }
    return Promise.reject(error);
  }
);

