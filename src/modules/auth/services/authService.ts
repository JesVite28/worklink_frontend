import authApi from "../../../api/axios";
import { ENDPOINTS } from "../../../api/endpoints";
import type { AuthResponse } from "../models/authResponse";

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