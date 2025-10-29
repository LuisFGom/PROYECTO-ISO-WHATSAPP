<<<<<<< HEAD
=======
// backend/src/application/use-cases/auth/LoginUser.usecase.ts
>>>>>>> 776a32e346feca63bdf0d9016af6e18c556c766b
import * as bcrypt from 'bcrypt';
import * as jwt from 'jsonwebtoken';
import type { IUserRepository } from '../../../domain/repositories/IUserRepository';
import type { AuthResponseDTO } from '../../interfaces/dtos/auth.dto';
import { UserStatus } from '../../../shared/types/user.types';
import { config } from '../../../config/environment';

export class LoginUserUseCase {
<<<<<<< HEAD
  constructor(private userRepository: IUserRepository) { }

  async execute(data: { email: string; password: string }): Promise<AuthResponseDTO> {
    const user = await this.userRepository.findByEmail(data.email);

    // ❌ Antes: throw new Error('Invalid email or password')
    // ✅ Ahora: lanzar un error con nombre y status
    if (!user || !(await bcrypt.compare(data.password, user.passwordHash))) {
      const error: any = new Error('Correo o contraseña incorrectos');
      error.status = 401;
      throw error;
    }


    const isPasswordValid = await bcrypt.compare(data.password, user.passwordHash);
    if (!isPasswordValid) {
      const error: any = new Error('Correo o contraseña incorrectos');
      error.status = 401;
      throw error;
=======
  constructor(private userRepository: IUserRepository) {}

  async execute(data: { email: string; password: string }): Promise<AuthResponseDTO> {
    const user = await this.userRepository.findByEmail(data.email);
    
    if (!user) {
      throw new Error('Invalid email or password');
    }

    const isPasswordValid = await bcrypt.compare(data.password, user.passwordHash);
    
    if (!isPasswordValid) {
      throw new Error('Invalid email or password');
>>>>>>> 776a32e346feca63bdf0d9016af6e18c556c766b
    }

    // Actualizar estado a online
    await this.userRepository.updateStatus(user.id, UserStatus.ONLINE);

<<<<<<< HEAD
    // Obtener usuario actualizado
    const updatedUser = await this.userRepository.findById(user.id);
    if (!updatedUser) {
      const error: any = new Error('Error al obtener datos del usuario');
      error.status = 500;
      throw error;
    }

    // Generar token JWT
    const token = jwt.sign(
      {
        userId: updatedUser.id,
        username: updatedUser.username,
        email: updatedUser.email
=======
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
>>>>>>> 776a32e346feca63bdf0d9016af6e18c556c766b
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
<<<<<<< HEAD
}
=======
}
>>>>>>> 776a32e346feca63bdf0d9016af6e18c556c766b
