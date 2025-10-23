// backend/src/domain/repositories/IUserRepository.ts
import { User } from '../entities/User.entity';
import { UserStatus } from '../../shared/types/user.types';

export interface IUserRepository {
  // Crear usuario
  create(user: Omit<User, 'id' | 'createdAt' | 'updatedAt'>): Promise<User>;
  
  // Buscar usuario por ID
  findById(id: number): Promise<User | null>;
  
  // Buscar usuario por email
  findByEmail(email: string): Promise<User | null>;
  
  // Buscar usuario por username
  findByUsername(username: string): Promise<User | null>;
  
  // Actualizar usuario
  update(id: number, userData: Partial<User>): Promise<User | null>;
  
  // Actualizar estado del usuario
  updateStatus(id: number, status: UserStatus): Promise<void>;
  
  // Actualizar último visto
  updateLastSeen(id: number): Promise<void>;
  
  // Eliminar usuario
  delete(id: number): Promise<boolean>;
  
  // Buscar todos los usuarios (para búsqueda de contactos)
  findAll(searchTerm?: string, limit?: number): Promise<User[]>;
}