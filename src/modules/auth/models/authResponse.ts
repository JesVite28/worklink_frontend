export interface Role {
  id: number;
  name: string;
  description?: string;
}

export interface UserData {
  id: number;
  name: string;
  last_name: string;
  maternal_last_name?: string | null;
  email: string;
  phone?: string | null;
  profile_photo?: string | null;
  profile_photo_url?: string | null;
  account_type?: string;
  is_active?: boolean;
  role?: Role;
  roles?: Role[];
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