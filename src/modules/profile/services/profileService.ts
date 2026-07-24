import authApi from "../../../api/axios";
import { ENDPOINTS } from "../../../api/endpoints";

import type {
  AccountResponse,
  CompanyProfile,
  CompanyProfileResponse,
  CreateCompanyProfilePayload,
  CreateFreelancerProfilePayload,
  FreelancerProfile,
  FreelancerProfileResponse,
  ProfilePhotoResponse,
  UpdateAccountPayload,
  UpdateCompanyProfilePayload,
  UpdateFreelancerProfilePayload,
} from "../models/profile";

interface DeleteProfileResponse {
  success: boolean;
  message: string;
}

/*
|--------------------------------------------------------------------------
| Cuenta personal
|--------------------------------------------------------------------------
*/

export async function updateMyAccount(
  payload: UpdateAccountPayload,
): Promise<AccountResponse> {
  const response = await authApi.patch<AccountResponse>(
    ENDPOINTS.MY_ACCOUNT,
    payload,
  );

  return response.data;
}

export async function updateMyProfilePhoto(
  profilePhoto: File,
): Promise<ProfilePhotoResponse> {
  const formData = new FormData();

  formData.append("profile_photo", profilePhoto);

  const response = await authApi.post<ProfilePhotoResponse>(
    ENDPOINTS.MY_PROFILE_PHOTO,
    formData,
    {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    },
  );

  return response.data;
}

export async function deleteMyProfilePhoto(): Promise<ProfilePhotoResponse> {
  const response = await authApi.delete<ProfilePhotoResponse>(
    ENDPOINTS.MY_PROFILE_PHOTO,
  );

  return response.data;
}

/*
|--------------------------------------------------------------------------
| Perfil freelancer
|--------------------------------------------------------------------------
*/

export async function getFreelancerProfileByUserId(
  userId: number,
): Promise<FreelancerProfile> {
  const response =
    await authApi.get<FreelancerProfileResponse>(
      ENDPOINTS.FREELANCER_PROFILE_BY_USER(userId),
    );

  return response.data.data.profile;
}

export async function createFreelancerProfile(
  payload: CreateFreelancerProfilePayload,
): Promise<FreelancerProfileResponse> {
  const response =
    await authApi.post<FreelancerProfileResponse>(
      ENDPOINTS.FREELANCER_PROFILES,
      payload,
    );

  return response.data;
}

export async function updateFreelancerProfile(
  profileId: number,
  payload: UpdateFreelancerProfilePayload,
): Promise<FreelancerProfileResponse> {
  const response =
    await authApi.put<FreelancerProfileResponse>(
      ENDPOINTS.FREELANCER_PROFILE(profileId),
      payload,
    );

  return response.data;
}

export async function deleteFreelancerProfile(
  profileId: number,
): Promise<DeleteProfileResponse> {
  const response =
    await authApi.delete<DeleteProfileResponse>(
      ENDPOINTS.FREELANCER_PROFILE(profileId),
    );

  return response.data;
}

/*
|--------------------------------------------------------------------------
| Perfil empresarial
|--------------------------------------------------------------------------
*/

export async function getMyCompanyProfile(): Promise<CompanyProfile> {
  const response =
    await authApi.get<CompanyProfileResponse>(
      ENDPOINTS.MY_COMPANY_PROFILE,
    );

  return response.data.data.company_profile;
}

export async function createCompanyProfile(
  payload: CreateCompanyProfilePayload,
): Promise<CompanyProfileResponse> {
  const response =
    await authApi.post<CompanyProfileResponse>(
      ENDPOINTS.COMPANY_PROFILES,
      payload,
    );

  return response.data;
}

export async function updateCompanyProfile(
  profileId: number,
  payload: UpdateCompanyProfilePayload,
): Promise<CompanyProfileResponse> {
  const response =
    await authApi.patch<CompanyProfileResponse>(
      ENDPOINTS.COMPANY_PROFILE(profileId),
      payload,
    );

  return response.data;
}

export async function deleteCompanyProfile(
  profileId: number,
): Promise<DeleteProfileResponse> {
  const response =
    await authApi.delete<DeleteProfileResponse>(
      ENDPOINTS.COMPANY_PROFILE(profileId),
    );

  return response.data;
}