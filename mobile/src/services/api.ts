import axios from "axios";
import { AppError } from "@utils/AppError";
import {
  storageAuthTokenGet,
  storageAuthTokenRemove,
} from "@storage/storageAuthToken";
import { storageUserRemove } from "@storage/storageUser";
import { Platform } from 'react-native';

const api = axios.create({
  baseURL: Platform.OS === 'android' ? 'http://10.0.0.127:3333' : 'http://localhost:3333',
});

// Interceptor para adicionar o token automaticamente
api.interceptors.request.use(
  async (config) => {
    const token = await storageAuthTokenGet();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    // Se for erro 401 (token expirado), limpar dados e redirecionar para login
    if (error.response?.status === 401) {
      await storageAuthTokenRemove();
      await storageUserRemove();
      // Força refresh da aplicação para voltar ao login
      window.location.reload();
      return Promise.reject(
        new AppError("Sessão expirada. Faça login novamente.")
      );
    }

    if (error.response && error.response.data) {
      return Promise.reject(new AppError(error.response.data.message));
    } else {
      return Promise.reject(error);
    }
  }
);

export { api };
