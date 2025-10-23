// backend/src/application/use-cases/auth/LoginUser.usecase.ts
import * as bcrypt from 'bcrypt';
import jwt, { Secret, SignOptions } from 'jsonwebtoken';
import { IUserRepository } from '../../../domain/repositories/IUserRepository';
import { AuthResponseDTO } from '../../interfaces/dtos/auth.dto';
import { UserStatus } from '../../../shared/types/user.types';
import { config } from '../../../config/environment';

export class LoginUserUseCase {
  constructor(private userRepository: IUserRepository) {}

  async execute(data: { email: string; password: string }): Promise<AuthResponseDTO> {
    // Buscar usuario por email
    const user = await this.userRepository.findByEmail(data.email);

    if (!user) {
      throw new Error('Invalid email or password');
    }

    // Verificar contraseña
    const isPasswordValid = await bcrypt.compare(data.password, user.passwordHash);

    if (!isPasswordValid) {
      throw new Error('Invalid email or password');
    }

    // Actualizar estado a ONLINE
    await this.userRepository.updateStatus(user.id, UserStatus.ONLINE);

    // Validar clave JWT
    if (!config.jwt.secret) {
      throw new Error('JWT secret is not defined in environment configuration');
    }

    // Payload del token
    const payload = {
      userId: user.id,
      username: user.username,
      email: user.email,
    };

    // Tipado correcto para secret y opciones
    const secretKey: Secret = config.jwt.secret;
    const options: SignOptions = {
      expiresIn: (config.jwt.expiresIn as unknown as number) || (60 * 60), // ✅ 1 hora por defecto
    };

    // Generar token
    const token = jwt.sign(payload, secretKey, options);

    // Retornar respuesta
    return {
      user: user.toPublic(),
      token,
    };
  }
}
