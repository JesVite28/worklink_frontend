export type ContractStatus =
  | "in_process"
  | "completed"
  | "canceled";

export type ContractRequestStatus =
  | "pending"
  | "accepted"
  | "rejected"
  | "canceled";

export type ContractUserRole =
  | "admin"
  | "cliente"
  | "freelancer"
  | "empresa";

/*
|--------------------------------------------------------------------------
| Roles y usuarios
|--------------------------------------------------------------------------
*/

export interface ContractRole {
  id: number;
  name: ContractUserRole;
  description: string | null;
}

export interface ContractUser {
  id: number;

  name: string;
  last_name: string;
  maternal_last_name: string | null;

  email: string;
  phone: string | null;

  profile_photo: string | null;
  profile_photo_url: string | null;

  is_active: boolean;

  role: ContractRole | null;
}

/*
|--------------------------------------------------------------------------
| Perfil del freelancer
|--------------------------------------------------------------------------
*/

export interface ContractFreelancerProfile {
  id: number;
  user_id: number;

  user: ContractUser | null;

  description: string | null;
  specialty: string | null;
  location: string | null;
  service_area: string | null;

  work_mode:
    | "remote"
    | "on_site"
    | "hybrid"
    | "home_service"
    | null;

  experience: string | null;

  rate_type:
    | "hourly"
    | "daily"
    | "project"
    | "negotiable"
    | null;

  rate: string | number | null;

  languages: string[];

  available: boolean;

  average_rate:
    | string
    | number
    | null;
}

/*
|--------------------------------------------------------------------------
| Servicio contratado
|--------------------------------------------------------------------------
*/

export interface ContractService {
  id: number;
  freelancer_id: number;

  title: string;
  description: string | null;

  price: string | number | null;

  category: string | null;
  location: string | null;

  is_active: boolean;
}

/*
|--------------------------------------------------------------------------
| Solicitud que originó el contrato
|--------------------------------------------------------------------------
*/

export interface ContractRequestSummary {
  id: number;

  client_id: number;
  client: ContractUser | null;

  freelancer_id: number;
  freelancer_profile:
    | ContractFreelancerProfile
    | null;

  service_id: number;
  service: ContractService | null;

  description: string;

  budget: string | number | null;

  status: ContractRequestStatus;

  created_at: string;
  updated_at: string;
}

/*
|--------------------------------------------------------------------------
| Contrato
|--------------------------------------------------------------------------
*/

export interface Contract {
  id: number;

  request_id: number;

  contract_request:
    | ContractRequestSummary
    | null;

  start_date: string | null;
  end_date: string | null;

  total_amount:
    | string
    | number;

  status: ContractStatus;

  has_reviewed: boolean;
  created_at: string;
  updated_at: string;
}

/*
|--------------------------------------------------------------------------
| Respuestas del backend
|--------------------------------------------------------------------------
*/

export interface ContractsResponse {
  success: boolean;
  message: string;

  data: {
    contracts: Contract[];
  };
}

export interface ContractResponse {
  success: boolean;
  message: string;

  data: {
    contract: Contract;
  };
}

export interface DeleteContractResponse {
  success: boolean;
  message: string;
}

/*
|--------------------------------------------------------------------------
| Crear contrato
|--------------------------------------------------------------------------
*/

export interface CreateContractPayload {
  request_id: number;

  /**
   * Formato: YYYY-MM-DD
   */
  start_date: string;

  /**
   * Formato: YYYY-MM-DD
   */
  end_date?: string | null;

  /**
   * Es opcional cuando la solicitud ya tiene presupuesto.
   */
  total_amount?:
    | string
    | number
    | null;
}

/*
|--------------------------------------------------------------------------
| Actualizar contrato
|--------------------------------------------------------------------------
*/

export interface UpdateContractPayload {
  start_date?: string;
  end_date?: string | null;

  total_amount?:
    | string
    | number;

  status?: ContractStatus;
}

export interface CompleteContractPayload {
  status: "completed";
}

export interface CancelContractPayload {
  status: "canceled";
}

/*
|--------------------------------------------------------------------------
| Filtros del frontend
|--------------------------------------------------------------------------
*/

export type ContractStatusFilter =
  | "all"
  | ContractStatus;

export interface ContractFilters {
  status: ContractStatusFilter;
  search: string;
}

/*
|--------------------------------------------------------------------------
| Errores
|--------------------------------------------------------------------------
*/

export interface ContractErrorResponse {
  success?: boolean;
  message?: string;

  data?: {
    current_status?: string;
  };

  errors?: Record<
    string,
    string[]
  >;
}