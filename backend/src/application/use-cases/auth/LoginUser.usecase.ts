// backend/src/application/use-cases/auth/LoginUser.usecase.ts
import * as bcrypt from 'bcrypt';
import * as jwt from 'jsonwebtoken';
import type { IUserRepository } from '../../../domain/repositories/IUserRepository';
import type { AuthResponseDTO } from '../../interfaces/dtos/auth.dto';
import { UserStatus } from '../../../shared/types/user.types';
import { config } from '../../../config/environment';

export class LoginUserUseCase {
  constructor(private userRepository: IUserRepository) {}

  async execute(data: { email: string; password: string }): Promise<AuthResponseDTO> {
    const user = await this.userRepository.findByEmail(data.email);
    
    if (!user) {
      throw new Error('Invalid email or password');
    }

    const isPasswordValid = await bcrypt.compare(data.password, user.passwordHash);
    
    if (!isPasswordValid) {
      throw new Error('Invalid email or password');
    }

    // Actualizar estado a online
    await this.userRepository.updateStatus(user.id, UserStatus.ONLINE);

    // IMPORTANTE: Obtener el usuario actualizado con el nuevo status
    const updatedUser = await this.userRepository.findById(user.id);
    
    if (!updatedUser) {
      throw new Error('Error getting user data');
    }

    // Generar token con el tipo correcto
    const token = jwt.sign(
      { 
        userId: updatedUser.id,
        username: updatedUser.username,
        email: updatedUser.email 
      },
      config.jwt.secret,
      { expiresIn: config.jwt.expiresIn } as jwt.SignOptions
    );

    // Retornar el usuario ACTUALIZADO (con status online)
    return {
      user: updatedUser.toPublic(),
      token,
    };
  }
}