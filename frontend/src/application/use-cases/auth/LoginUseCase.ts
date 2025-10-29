// frontend/src/application/use-cases/auth/LoginUseCase.ts
import { apiClient } from '../../../infrastructure/api/apiClient';
import type { LoginFormData, AuthResponse } from '../../../shared/types/auth.types';

export class LoginUseCase {
  async execute(data: LoginFormData): Promise<AuthResponse> {
    try {
      const response = await apiClient.post<AuthResponse>('/auth/login', {
<<<<<<< HEAD
        email: data.email.trim(),
=======
        email: data.email,
>>>>>>> 776a32e346feca63bdf0d9016af6e18c556c766b
        password: data.password,
      });

      return response.data;
    } catch (error: any) {
<<<<<<< HEAD
      // ✅ En lugar de lanzar un Error (que puede romper React y forzar reload),
      // devolvemos un objeto con estado de error controlado
      console.error('🚨 Error en LoginUseCase:', error);

      const message =
        error?.response?.data?.message ||
        (error?.message === 'Network Error'
          ? 'No se puede conectar con el servidor'
          : 'Error al iniciar sesión');

      return Promise.reject({ type: 'LOGIN_ERROR', message });
=======
      throw new Error(
        error.response?.data?.message || 'Error al iniciar sesión'
      );
>>>>>>> 776a32e346feca63bdf0d9016af6e18c556c766b
    }
  }
}

export const loginUseCase = new LoginUseCase();
