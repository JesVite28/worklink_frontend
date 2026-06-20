import authApi from "./axios";
import { ENDPOINTS } from "./endpoints";
import type { AuthResponse } from "../interfaces/AuthResponse";

export const login = async (
  email: string,
  password: string
): Promise<AuthResponse> => {
  const response = await authApi.post<AuthResponse>(
    ENDPOINTS.LOGIN,
    {
      email,
      password,
    }
  );

  return response.data;
};