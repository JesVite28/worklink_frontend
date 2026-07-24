export interface Role {
  id: number;
  name: "admin" | "cliente" | "freelancer" | "empresa";
  description: string | null;
}

export interface UserData {
  id: number;
  name: string;
  last_name: string;
  maternal_last_name: string | null;
  email: string;
  phone: string | null;

  /**
   * Ruta interna almacenada por Laravel.
   * Ejemplo: profile_photos/imagen.jpg
   */
  profile_photo: string | null;

  /**
   * URL completa lista para mostrar en el frontend.
   */
  profile_photo_url: string | null;

  is_active: boolean;
  role: Role | null;
}

export interface AuthData {
  token: string;
  user: UserData;
}

export interface AuthResponse {
  success: boolean;
  message: string;
  data: AuthData;
}

export interface MeResponse {
  success: boolean;
  message: string;
  data: {
    user: UserData;
  };
}

export interface LogoutResponse {
  success: boolean;
  message: string;
}

export interface RefreshResponse {
  success: boolean;
  message: string;
  data: {
    token: string;
  };
}