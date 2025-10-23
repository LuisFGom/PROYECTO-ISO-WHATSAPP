// backend/src/domain/entities/User.entity.ts
import { UserStatus } from '../../shared/types/user.types';

export class User {
  constructor(
    public id: number,
    public username: string,
    public email: string,
    public passwordHash: string,
    public displayName: string,
    public avatarUrl: string | null = null,
    public status: UserStatus = UserStatus.OFFLINE,
    public about: string = 'Hey there! I am using WhatsApp Clone',
    public createdAt: Date = new Date(),
    public updatedAt: Date = new Date(),
    public lastSeen: Date | null = null
  ) {}

  // Método para obtener datos públicos del usuario (sin password)
  public toPublic() {
    return {
      id: this.id,
      username: this.username,
      email: this.email,
      displayName: this.displayName,
      avatarUrl: this.avatarUrl,
      status: this.status,
      about: this.about,
      lastSeen: this.lastSeen,
    };
  }

  // Validar que el email sea válido
  public static isValidEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  // Validar que el username sea válido
  public static isValidUsername(username: string): boolean {
    const usernameRegex = /^[a-zA-Z0-9_]{3,50}$/;
    return usernameRegex.test(username);
  }
}