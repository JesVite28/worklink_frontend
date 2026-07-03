import authApi from "../../../api/axios";
import { ENDPOINTS } from "../../../api/endpoints";
import type { AuthResponse, UserData } from "../models/authResponse";

export interface RegisterPayload {
  name: string;
  last_name: string;
  maternal_last_name?: string;
  email: string;
  password: string;
  password_confirmation: string;
  role: string;
  phone?: string;
  profile_photo?: File;
}

export interface RegisterResponse {
  success: boolean;
  message: string;
  data: {
    user: UserData;
  };
}

export async function login(
  email: string,
  password: string
): Promise<AuthResponse> {
  const response = await authApi.post<AuthResponse>(ENDPOINTS.LOGIN, {
    email,
    password,
  });

  return response.data;
}

export async function register(
  payload: RegisterPayload
): Promise<RegisterResponse> {
  const formData = new FormData();

  formData.append("name", payload.name);
  formData.append("last_name", payload.last_name);
  formData.append("email", payload.email);
  formData.append("password", payload.password);
  formData.append("password_confirmation", payload.password_confirmation);
  formData.append("role", payload.role);

  if (payload.maternal_last_name) {
    formData.append("maternal_last_name", payload.maternal_last_name);
  }

  if (payload.phone) {
    formData.append("phone", payload.phone);
  }

  if (payload.profile_photo) {
    formData.append("profile_photo", payload.profile_photo);
  }

  const response = await authApi.post<RegisterResponse>(
    ENDPOINTS.REGISTER,
    formData,
    {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    }
  );

  return response.data;
}

export async function me(): Promise<UserData> {
  const response = await authApi.get<AuthResponse>(ENDPOINTS.ME);

  return response.data.data.user;
}

export async function logout(): Promise<void> {
  await authApi.post(ENDPOINTS.LOGOUT);
}