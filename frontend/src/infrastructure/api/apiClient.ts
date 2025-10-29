import axios from 'axios';
import type { AxiosInstance } from 'axios';
import { useAuthStore } from '../../presentation/store/authStore'; // 🛑 NECESARIO para usar logout

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';

class ApiClient {
  private static instance: ApiClient;
  public axios: AxiosInstance;

  private constructor() {
    this.axios = axios.create({
      baseURL: API_URL,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    // Interceptor para agregar token a todas las peticiones
    this.axios.interceptors.request.use(
      (config) => {
        const token = localStorage.getItem('token');
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
      },
      (error) => {
        return Promise.reject(error);
      }
    );

    // 🛑 Interceptor para manejar errores de respuesta (CORRECCIÓN FINAL)
    this.axios.interceptors.response.use(
      (response) => response,
      (error) => {
        const status = error.response?.status;
        
        // 💡 CLAVE: Solo actuar si hay un 401 Y si existe un token en localStorage.
        const token = localStorage.getItem('token');
        
        if (status === 401 && token) {
          // 1. Limpieza y logout con Zustand
          useAuthStore.getState().logout(); 
          
          // 2. Redirección forzada (es correcto forzar aquí)
          window.location.href = '/login'; 
        }
        
        // Devolvemos la promesa de error para que LoginUseCase la capture.
        return Promise.reject(error);
      }
    );
  }

  public static getInstance(): ApiClient {
    if (!ApiClient.instance) {
      ApiClient.instance = new ApiClient();
    }
    return ApiClient.instance;
  }
}

export const apiClient = ApiClient.getInstance().axios;