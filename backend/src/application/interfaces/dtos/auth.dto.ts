// backend/src/application/interfaces/dtos/auth.dto.ts

export interface RegisterDTO {
  username: string;
  email: string;
  password: string;
  displayName: string;
}

export interface LoginDTO {
  email: string;
  password: string;
}

export interface AuthResponseDTO {
  user: {
    id: number;
    username: string;
    email: string;
    displayName: string;
    avatarUrl: string | null;
    status: string;
    about: string;
  };
  token: string;
}