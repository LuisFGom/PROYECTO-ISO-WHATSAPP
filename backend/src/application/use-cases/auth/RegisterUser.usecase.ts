// backend/src/application/use-cases/auth/RegisterUser.usecase.ts
import bcrypt from 'bcrypt';
import { IUserRepository } from '../../../domain/repositories/IUserRepository';
import { User } from '../../../domain/entities/User.entity';
import { RegisterDTO } from '../../interfaces/dtos/auth.dto';
import { UserStatus } from '../../../shared/types/user.types';

export class RegisterUserUseCase {
  constructor(private userRepository: IUserRepository) {}

  async execute(data: RegisterDTO): Promise<User> {
    // Validar email
    if (!User.isValidEmail(data.email)) {
      throw new Error('Invalid email format');
    }

    // Validar username
    if (!User.isValidUsername(data.username)) {
      throw new Error('Username must be 3-50 characters and contain only letters, numbers, and underscores');
    }

    // Validar longitud de password
    if (data.password.length < 6) {
      throw new Error('Password must be at least 6 characters long');
    }

    // Verificar si el email ya existe
    const existingEmail = await this.userRepository.findByEmail(data.email);
    if (existingEmail) {
      throw new Error('Email already exists');
    }

    // Verificar si el username ya existe
    const existingUsername = await this.userRepository.findByUsername(data.username);
    if (existingUsername) {
      throw new Error('Username already exists');
    }

    // Hash de la contraseña
    const saltRounds = 10;
    const passwordHash = await bcrypt.hash(data.password, saltRounds);

    // Crear usuario
    const userData = {
      username: data.username,
      email: data.email,
      passwordHash: passwordHash,
      displayName: data.displayName,
      avatarUrl: null,
      status: UserStatus.OFFLINE,
      about: 'Hey there! I am using WhatsApp Clone',
      lastSeen: null,
    };

    const user = await this.userRepository.create(userData);
    return user;
  }
}d