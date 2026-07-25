import authApi from "../../../api/axios";
import { ENDPOINTS } from "../../../api/endpoints";

import type {
  LogoutResponse,
  MeResponse,
  RefreshResponse,
  UserData,
} from "../models/authResponse";

/*
|--------------------------------------------------------------------------
| Registro
|--------------------------------------------------------------------------
*/

export interface RegisterPayload {
  name: string;
  last_name: string;
  maternal_last_name?: string;
  email: string;
  password: string;
  password_confirmation: string;

  role:
    | "cliente"
    | "freelancer"
    | "empresa";

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

/*
|--------------------------------------------------------------------------
| Respuestas generales
|--------------------------------------------------------------------------
*/

export interface MessageResponse {
  success: boolean;
  message: string;
}

/*
|--------------------------------------------------------------------------
| Inicio de sesión y 2FA
|--------------------------------------------------------------------------
*/

export interface AuthenticatedLoginResponse {
  success: true;
  requires_2fa: false;
  message: string;

  data: {
    token: string;
    user: UserData;
  };
}

export interface TwoFactorChallengeData {
  challenge_token: string;
  expires_in: number;
  expires_at: string;
  email_hint?: string;
}

export interface TwoFactorRequiredLoginResponse {
  success: true;
  requires_2fa: true;
  message: string;
  data: TwoFactorChallengeData;
}

export type LoginResponse =
  | AuthenticatedLoginResponse
  | TwoFactorRequiredLoginResponse;

export interface VerifyTwoFactorPayload {
  challenge_token: string;
  code: string;
}

export interface ResendTwoFactorResponse {
  success: boolean;
  requires_2fa: true;
  message: string;
  data: TwoFactorChallengeData;
}

/*
|--------------------------------------------------------------------------
| Estado y configuración 2FA
|--------------------------------------------------------------------------
*/

export interface TwoFactorStatus {
  enabled: boolean;
  enabled_at: string | null;
  email_hint?: string;
}

export interface TwoFactorStatusResponse {
  success: boolean;
  message: string;
  data: TwoFactorStatus;
}

export interface EnableTwoFactorResponse {
  success: boolean;
  message: string;
  data: TwoFactorChallengeData;
}

/*
|--------------------------------------------------------------------------
| Recuperación de contraseña
|--------------------------------------------------------------------------
*/

export interface ResetPasswordPayload {
  token: string;
  email: string;
  password: string;
  password_confirmation: string;
}

/*
|--------------------------------------------------------------------------
| Cambio seguro de contraseña
|--------------------------------------------------------------------------
*/

export interface RequestPasswordChangeCodeResponse {
  success: boolean;
  message: string;
  data: TwoFactorChallengeData;
}

export interface ChangePasswordPayload {
  challenge_token: string;
  code: string;
  current_password: string;
  password: string;
  password_confirmation: string;
}

export interface ChangePasswordResponse {
  success: boolean;
  message: string;

  data: {
    session_terminated: boolean;
  };
}

/*
|--------------------------------------------------------------------------
| Login
|--------------------------------------------------------------------------
*/

export async function login(
  email: string,
  password: string,
): Promise<LoginResponse> {
  const response =
    await authApi.post<LoginResponse>(
      ENDPOINTS.LOGIN,
      {
        email,
        password,
      },
    );

  return response.data;
}

/*
|--------------------------------------------------------------------------
| Registro
|--------------------------------------------------------------------------
*/

export async function register(
  payload: RegisterPayload,
): Promise<RegisterResponse> {
  const formData = new FormData();

  formData.append(
    "name",
    payload.name,
  );

  formData.append(
    "last_name",
    payload.last_name,
  );

  formData.append(
    "email",
    payload.email,
  );

  formData.append(
    "password",
    payload.password,
  );

  formData.append(
    "password_confirmation",
    payload.password_confirmation,
  );

  formData.append(
    "role",
    payload.role,
  );

  if (
    payload.maternal_last_name?.trim()
  ) {
    formData.append(
      "maternal_last_name",
      payload.maternal_last_name,
    );
  }

  if (payload.phone?.trim()) {
    formData.append(
      "phone",
      payload.phone,
    );
  }

  if (payload.profile_photo) {
    formData.append(
      "profile_photo",
      payload.profile_photo,
    );
  }

  const response =
    await authApi.post<RegisterResponse>(
      ENDPOINTS.REGISTER,
      formData,
      {
        headers: {
          "Content-Type":
            "multipart/form-data",
        },
      },
    );

  return response.data;
}

/*
|--------------------------------------------------------------------------
| Recuperación de contraseña
|--------------------------------------------------------------------------
*/

export async function forgotPassword(
  email: string,
): Promise<MessageResponse> {
  const response =
    await authApi.post<MessageResponse>(
      ENDPOINTS.FORGOT_PASSWORD,
      {
        email,
      },
    );

  return response.data;
}

export async function resetPassword(
  payload: ResetPasswordPayload,
): Promise<MessageResponse> {
  const response =
    await authApi.post<MessageResponse>(
      ENDPOINTS.RESET_PASSWORD,
      payload,
    );

  return response.data;
}

/*
|--------------------------------------------------------------------------
| Verificación 2FA durante el login
|--------------------------------------------------------------------------
*/

export async function verifyTwoFactorLogin(
  payload: VerifyTwoFactorPayload,
): Promise<AuthenticatedLoginResponse> {
  const response =
    await authApi.post<AuthenticatedLoginResponse>(
      ENDPOINTS.TWO_FACTOR.VERIFY,
      payload,
    );

  return response.data;
}

export async function resendTwoFactorLogin(
  challengeToken: string,
): Promise<ResendTwoFactorResponse> {
  const response =
    await authApi.post<ResendTwoFactorResponse>(
      ENDPOINTS.TWO_FACTOR.RESEND,
      {
        challenge_token:
          challengeToken,
      },
    );

  return response.data;
}

/*
|--------------------------------------------------------------------------
| Configuración 2FA del usuario
|--------------------------------------------------------------------------
*/

export async function getTwoFactorStatus(): Promise<TwoFactorStatus> {
  const response =
    await authApi.get<TwoFactorStatusResponse>(
      ENDPOINTS.TWO_FACTOR.STATUS,
    );

  return response.data.data;
}

export async function requestTwoFactorEnable(
  currentPassword: string,
): Promise<EnableTwoFactorResponse> {
  const response =
    await authApi.post<EnableTwoFactorResponse>(
      ENDPOINTS.TWO_FACTOR.ENABLE,
      {
        current_password:
          currentPassword,
      },
    );

  return response.data;
}

export async function verifyTwoFactorEnable(
  payload: VerifyTwoFactorPayload,
): Promise<TwoFactorStatusResponse> {
  const response =
    await authApi.post<TwoFactorStatusResponse>(
      ENDPOINTS.TWO_FACTOR
        .VERIFY_ENABLE,
      payload,
    );

  return response.data;
}

export async function disableTwoFactor(
  currentPassword: string,
): Promise<TwoFactorStatusResponse> {
  const response =
    await authApi.patch<TwoFactorStatusResponse>(
      ENDPOINTS.TWO_FACTOR.DISABLE,
      {
        current_password:
          currentPassword,
      },
    );

  return response.data;
}

/*
|--------------------------------------------------------------------------
| Cambio seguro de contraseña
|--------------------------------------------------------------------------
*/

/**
 * Comprueba la contraseña actual y envía
 * un código de seis dígitos al correo.
 */
export async function requestPasswordChangeCode(
  currentPassword: string,
): Promise<RequestPasswordChangeCodeResponse> {
  const response =
    await authApi.post<RequestPasswordChangeCodeResponse>(
      ENDPOINTS.SECURITY.PASSWORD
        .SEND_CHANGE_CODE,
      {
        current_password:
          currentPassword,
      },
    );

  return response.data;
}

/**
 * Verifica el código recibido y cambia
 * la contraseña del usuario.
 */
export async function changePasswordWithEmailVerification(
  payload: ChangePasswordPayload,
): Promise<ChangePasswordResponse> {
  const response =
    await authApi.post<ChangePasswordResponse>(
      ENDPOINTS.SECURITY.PASSWORD.CHANGE,
      payload,
    );

  return response.data;
}

/*
|--------------------------------------------------------------------------
| Sesión
|--------------------------------------------------------------------------
*/

export async function me(): Promise<UserData> {
  const response =
    await authApi.get<MeResponse>(
      ENDPOINTS.ME,
    );

  return response.data.data.user;
}

export async function logout(): Promise<LogoutResponse> {
  const response =
    await authApi.post<LogoutResponse>(
      ENDPOINTS.LOGOUT,
    );

  return response.data;
}

export async function refreshToken(): Promise<string> {
  const response =
    await authApi.post<RefreshResponse>(
      ENDPOINTS.REFRESH,
    );

  return response.data.data.token;
}