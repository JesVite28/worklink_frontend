import authApi from "../../../api/axios";
import { ENDPOINTS } from "../../../api/endpoints";

import type {
  ContractRequestFilters,
  ContractRequestResponse,
  ContractRequestsResponse,
  CreateContractRequestPayload,
  DeleteContractRequestResponse,
  UpdateContractRequestDetailsPayload,
  UpdateContractRequestPayload,
} from "../models/contractRequest";

/*
|--------------------------------------------------------------------------
| Construcción de parámetros
|--------------------------------------------------------------------------
*/

function buildContractRequestParams(
  filters: ContractRequestFilters = {},
): Record<string, string | number> {
  const params: Record<string, string | number> = {};

  if (filters.status) {
    params.status = filters.status;
  }

  if (filters.service_id !== undefined) {
    params.service_id = filters.service_id;
  }

  if (filters.freelancer_id !== undefined) {
    params.freelancer_id =
      filters.freelancer_id;
  }

  if (filters.client_id !== undefined) {
    params.client_id = filters.client_id;
  }

  if (filters.search?.trim()) {
    params.search = filters.search.trim();
  }

  if (filters.per_page !== undefined) {
    params.per_page = filters.per_page;
  }

  if (filters.page !== undefined) {
    params.page = filters.page;
  }

  return params;
}

/*
|--------------------------------------------------------------------------
| Listar solicitudes
|--------------------------------------------------------------------------
*/

export async function getContractRequests(
  filters: ContractRequestFilters = {},
): Promise<ContractRequestsResponse> {
  const response =
    await authApi.get<ContractRequestsResponse>(
      ENDPOINTS.CONTRACT_REQUESTS.BASE,
      {
        params:
          buildContractRequestParams(filters),
      },
    );

  return response.data;
}

/*
|--------------------------------------------------------------------------
| Consultar solicitud
|--------------------------------------------------------------------------
*/

export async function getContractRequestById(
  contractRequestId: number,
): Promise<ContractRequestResponse> {
  const response =
    await authApi.get<ContractRequestResponse>(
      ENDPOINTS.CONTRACT_REQUESTS.SHOW(
        contractRequestId,
      ),
    );

  return response.data;
}

/*
|--------------------------------------------------------------------------
| Crear solicitud
|--------------------------------------------------------------------------
*/

export async function createContractRequest(
  payload: CreateContractRequestPayload,
): Promise<ContractRequestResponse> {
  const response =
    await authApi.post<ContractRequestResponse>(
      ENDPOINTS.CONTRACT_REQUESTS.BASE,
      payload,
    );

  return response.data;
}

/*
|--------------------------------------------------------------------------
| Actualizar solicitud
|--------------------------------------------------------------------------
*/

export async function updateContractRequest(
  contractRequestId: number,
  payload: UpdateContractRequestPayload,
): Promise<ContractRequestResponse> {
  const response =
    await authApi.patch<ContractRequestResponse>(
      ENDPOINTS.CONTRACT_REQUESTS.UPDATE(
        contractRequestId,
      ),
      payload,
    );

  return response.data;
}

/*
|--------------------------------------------------------------------------
| Actualizar descripción y presupuesto
|--------------------------------------------------------------------------
*/

export async function updateContractRequestDetails(
  contractRequestId: number,
  payload: UpdateContractRequestDetailsPayload,
): Promise<ContractRequestResponse> {
  return updateContractRequest(
    contractRequestId,
    payload,
  );
}

/*
|--------------------------------------------------------------------------
| Aceptar solicitud
|--------------------------------------------------------------------------
*/

export async function acceptContractRequest(
  contractRequestId: number,
): Promise<ContractRequestResponse> {
  return updateContractRequest(
    contractRequestId,
    {
      status: "accepted",
    },
  );
}

/*
|--------------------------------------------------------------------------
| Rechazar solicitud
|--------------------------------------------------------------------------
*/

export async function rejectContractRequest(
  contractRequestId: number,
): Promise<ContractRequestResponse> {
  return updateContractRequest(
    contractRequestId,
    {
      status: "rejected",
    },
  );
}

/*
|--------------------------------------------------------------------------
| Cancelar solicitud
|--------------------------------------------------------------------------
*/

export async function cancelContractRequest(
  contractRequestId: number,
): Promise<ContractRequestResponse> {
  return updateContractRequest(
    contractRequestId,
    {
      status: "canceled",
    },
  );
}

/*
|--------------------------------------------------------------------------
| Eliminar solicitud
|--------------------------------------------------------------------------
*/

export async function deleteContractRequest(
  contractRequestId: number,
): Promise<DeleteContractRequestResponse> {
  const response =
    await authApi.delete<DeleteContractRequestResponse>(
      ENDPOINTS.CONTRACT_REQUESTS.DELETE(
        contractRequestId,
      ),
    );

  return response.data;
}