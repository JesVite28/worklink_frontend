export type ContractRequestStatus =
  | "pending"
  | "accepted"
  | "rejected"
  | "canceled";

export type ContractRequestFinalStatus = Exclude<
  ContractRequestStatus,
  "pending"
>;

export interface ContractRequestRole {
  id: number;
  name: string;
  description: string | null;
}

export interface ContractRequestUser {
  id: number;
  name: string;
  last_name: string;
  maternal_last_name: string | null;
  email: string;
  phone: string | null;
  profile_photo: string | null;
  profile_photo_url: string | null;
  is_active: boolean;
  role: ContractRequestRole | null;
}

export interface ContractRequestFreelancerProfile {
  id: number;
  user_id: number;
  user: ContractRequestUser | null;
  description: string | null;
  specialty: string | null;
  location: string | null;
  service_area: string | null;
  work_mode: string | null;
  experience: string | number | null;
  rate_type: string | null;
  rate: string | number | null;
  languages: string[];

  professional_links: {
    website: string | null;
    facebook: string | null;
    instagram: string | null;
    linkedin: string | null;
    github: string | null;
    portfolio_url: string | null;
  };

  available: boolean;
  average_rate: string | number | null;
}

export interface ContractRequestService {
  id: number;
  freelancer_id: number;
  title: string;
  description: string | null;
  price: string | number | null;
  category: string | null;
  location: string | null;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface ContractRequest {
  id: number;

  client_id: number;
  client: ContractRequestUser | null;

  freelancer_id: number;
  freelancer_profile:
    | ContractRequestFreelancerProfile
    | null;

  service_id: number;
  service: ContractRequestService | null;

  description: string;
  budget: string | number | null;
  status: ContractRequestStatus;

  created_at: string;
  updated_at: string;
}

export interface CreateContractRequestPayload {
  service_id: number;
  description: string;
  budget: number | null;
}

export interface UpdateContractRequestPayload {
  description?: string;
  budget?: number | null;
  status?: ContractRequestStatus;
}

export interface UpdateContractRequestDetailsPayload {
  description: string;
  budget: number | null;
}

export interface UpdateContractRequestStatusPayload {
  status: ContractRequestFinalStatus;
}

export interface ContractRequestFilters {
  status?: ContractRequestStatus;
  service_id?: number;
  freelancer_id?: number;
  client_id?: number;
  search?: string;
  per_page?: number;
  page?: number;
}

export interface ContractRequestPagination {
  current_page: number;
  last_page: number;
  per_page: number;
  total: number;
  from: number | null;
  to: number | null;
}

export interface ContractRequestsResponse {
  success: boolean;
  message: string;

  data: {
    contract_requests: ContractRequest[];
    pagination: ContractRequestPagination;
  };
}

export interface ContractRequestResponse {
  success: boolean;
  message: string;

  data: {
    contract_request: ContractRequest;
  };
}

export interface DeleteContractRequestResponse {
  success: boolean;
  message: string;
}

export interface ContractRequestErrorResponse {
  success?: boolean;
  message?: string;
  error?: string;

  errors?: Record<
    string,
    string[]
  >;

  data?: {
    current_status?: ContractRequestStatus;
  };
}