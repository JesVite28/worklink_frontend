import authApi from "../../../api/axios";
import { ENDPOINTS } from "../../../api/endpoints";

import type {
  CancelContractPayload,
  CompleteContractPayload,
  Contract,
  ContractResponse,
  ContractsResponse,
  CreateContractPayload,
  DeleteContractResponse,
  UpdateContractPayload,
} from "../models/contract";

/*
|--------------------------------------------------------------------------
| Listar contratos
|--------------------------------------------------------------------------
*/

export async function getContracts(): Promise<Contract[]> {
  const response =
    await authApi.get<ContractsResponse>(
      ENDPOINTS.CONTRACTS.BASE,
    );

  return response.data.data.contracts;
}

/*
|--------------------------------------------------------------------------
| Consultar contrato individual
|--------------------------------------------------------------------------
*/

export async function getContractById(
  contractId: number,
): Promise<Contract> {
  const response =
    await authApi.get<ContractResponse>(
      ENDPOINTS.CONTRACTS.SHOW(
        contractId,
      ),
    );

  return response.data.data.contract;
}

/*
|--------------------------------------------------------------------------
| Formalizar contrato
|--------------------------------------------------------------------------
*/

/**
 * Solo el freelancer responsable o un administrador
 * pueden formalizar una solicitud aceptada.
 */
export async function createContract(
  payload: CreateContractPayload,
): Promise<Contract> {
  const response =
    await authApi.post<ContractResponse>(
      ENDPOINTS.CONTRACTS.BASE,
      payload,
    );

  return response.data.data.contract;
}

/*
|--------------------------------------------------------------------------
| Actualizar contrato
|--------------------------------------------------------------------------
*/

/**
 * El administrador puede editar fechas, monto y estado.
 * El freelancer únicamente puede completar o cancelar.
 * El cliente o empresa únicamente pueden cancelar.
 */
export async function updateContract(
  contractId: number,
  payload: UpdateContractPayload,
): Promise<Contract> {
  const response =
    await authApi.patch<ContractResponse>(
      ENDPOINTS.CONTRACTS.UPDATE(
        contractId,
      ),
      payload,
    );

  return response.data.data.contract;
}

/*
|--------------------------------------------------------------------------
| Completar contrato
|--------------------------------------------------------------------------
*/

export async function completeContract(
  contractId: number,
): Promise<Contract> {
  const payload: CompleteContractPayload = {
    status: "completed",
  };

  return updateContract(
    contractId,
    payload,
  );
}

/*
|--------------------------------------------------------------------------
| Cancelar contrato
|--------------------------------------------------------------------------
*/

export async function cancelContract(
  contractId: number,
): Promise<Contract> {
  const payload: CancelContractPayload = {
    status: "canceled",
  };

  return updateContract(
    contractId,
    payload,
  );
}

/*
|--------------------------------------------------------------------------
| Eliminar contrato
|--------------------------------------------------------------------------
*/

/**
 * Esta acción solo puede realizarla un administrador.
 */
export async function deleteContract(
  contractId: number,
): Promise<string> {
  const response =
    await authApi.delete<DeleteContractResponse>(
      ENDPOINTS.CONTRACTS.DELETE(
        contractId,
      ),
    );

  return response.data.message;
}