export interface Role {
  id: number;
  nombre: string;
}

export interface UserData {
  token: string;
  id: number;
  nombre: string;
  apellido: string;
  email: string;
  tipo_cuenta: string;
  roles: Role[];
}

export interface AuthResponse {
  success: boolean;
  message: string;
  data: UserData;
}