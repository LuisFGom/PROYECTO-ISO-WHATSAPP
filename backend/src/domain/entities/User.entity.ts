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

  // Factory para crear un User desde un objeto (sin necesidad de pasar id/fechas)
  public static create(props: {
    username: string;
    email: string;
    passwordHash: string;
    displayName: string;
    avatarUrl?: string | null;
    status?: UserStatus;
    about?: string;
    lastSeen?: Date | null;
  }): User {
    return new User(
      0, // id provisional; el repositorio / BD deberá asignar el id real
      props.username,
      props.email,
      props.passwordHash,
      props.displayName,
      props.avatarUrl ?? null,
      props.status ?? UserStatus.OFFLINE,
      props.about ?? 'Hey there! I am using WhatsApp Clone',
      new Date(), // createdAt
      new Date(), // updatedAt
      props.lastSeen ?? null
    );
  }

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

  public static isValidEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  public static isValidUsername(username: string): boolean {
    const usernameRegex = /^[a-zA-Z0-9_]{3,50}$/;
    return usernameRegex.test(username);
  }
}
