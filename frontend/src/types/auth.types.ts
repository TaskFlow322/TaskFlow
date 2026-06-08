export interface User {
  id: number;
  email: string;
  name: string;
  avatar?: string;
}
export interface UpdateProfileRequest {
  name: string;
  avatar?: string;
}

export interface AuthResponse {
  user: User;
  token: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  email: string;
  password: string;
  name: string;
}