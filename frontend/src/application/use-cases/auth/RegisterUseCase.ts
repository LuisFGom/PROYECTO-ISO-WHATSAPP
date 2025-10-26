// frontend/src/application/use-cases/auth/RegisterUseCase.ts
import { apiClient } from '../../../infrastructure/api/apiClient';
import type { RegisterFormData, User } from '../../../shared/types/auth.types';

interface RegisterResponse {
  success: boolean;
  message: string;
  data: User;
}

export class RegisterUseCase {
  async execute(data: RegisterFormData): Promise<User> {  // Cambiado: retorna User en vez de RegisterResponse
    try {
      // Validar que las contraseñas coincidan
      if (data.password !== data.confirmPassword) {
        throw new Error('Las contraseñas no coinciden');
      }

      const response = await apiClient.post<RegisterResponse>('/auth/register', {
        username: data.username,
        email: data.email,
        password: data.password,
      });

      return response.data.data;  // Retornar solo el User
    } catch (error: any) {
      throw new Error(
        error.response?.data?.message || 'Error al registrarse'
      );
    }
  }
}

export const registerUseCase = new RegisterUseCase();