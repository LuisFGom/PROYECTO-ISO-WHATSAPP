// frontend/src/application/use-cases/auth/LoginUseCase.ts
import { apiClient } from '../../../infrastructure/api/apiClient';
import type { LoginFormData, AuthResponse } from '../../../shared/types/auth.types';

export class LoginUseCase {
  async execute(data: LoginFormData): Promise<AuthResponse> {
    try {
      const response = await apiClient.post<AuthResponse>('/auth/login', {
        email: data.email,
        password: data.password,
      });

      return response.data;
    } catch (error: any) {
      throw new Error(
        error.response?.data?.message || 'Error al iniciar sesión'
      );
    }
  }
}

export const loginUseCase = new LoginUseCase();
