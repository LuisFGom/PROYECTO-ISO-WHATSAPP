// backend/src/presentation/controllers/auth.controller.ts
import { Request, Response, NextFunction } from 'express';
import { RegisterUserUseCase } from '../../application/use-cases/auth/RegisterUser.usecase';
import { LoginUserUseCase } from '../../application/use-cases/auth/LoginUser.usecase';
import { MySQLUserRepository } from '../../infrastructure/database/repositories/MySQLUserRepository';
import { AuthRequest } from '../middlewares/auth.middleware';
import { LogoutUserUseCase } from '../../application/use-cases/auth/LogoutUser.usecase';

// Instanciar repositorio
const userRepository = new MySQLUserRepository();

// Instanciar casos de uso
const registerUserUseCase = new RegisterUserUseCase(userRepository);
const loginUserUseCase = new LoginUserUseCase(userRepository);

export class AuthController {

  async register(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { username, email, password } = req.body;  // Quita displayName

      const user = await registerUserUseCase.execute({
        username,
        email,
        password,  // Solo estos 3 campos
      });

      res.status(201).json({
        success: true,
        message: 'User registered successfully',
        data: user.toPublic(),
      });
    } catch (error) {
      if (error instanceof Error) {
        res.status(400).json({
          success: false,
          message: error.message,
        });
      } else {
        next(error);
      }
    }
  }


  async login(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { email, password } = req.body;

      const authResponse = await loginUserUseCase.execute({ email, password });

      res.status(200).json({
        success: true,
        message: 'Login successful',
        data: authResponse,
      });
    } catch (error) {
      if (error instanceof Error) {
        res.status(401).json({
          success: false,
          message: error.message,
        });
      } else {
        next(error);
      }
    }
  }

  // Agrega esto al final de la clase AuthController

async logout(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
  try {
    if (!req.userId) {
      res.status(401).json({
        success: false,
        message: 'No authenticated',
      });
      return;
    }

    const logoutUserUseCase = new LogoutUserUseCase(userRepository);
    await logoutUserUseCase.execute(req.userId);

    res.status(200).json({
      success: true,
      message: 'Logout successful',
    });
  } catch (error) {
    next(error);
  }
}
}

export const authController = new AuthController();