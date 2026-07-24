import {
    useCallback,
    useEffect,
    useMemo,
    useState,
} from "react";

import { isAxiosError } from "axios";

import { useAuth } from "../../../context/useAuth";

import {
    showError,
    showSuccess,
} from "../../../shared/services/alertService";

import type { FreelancerProfile } from "../../profile/models/profile";

import { getFreelancerProfileByUserId } from "../../profile/services/profileService";

import type {
    FreelancerService,
    ServiceErrorResponse,
} from "../models/service";

import {
    deleteService,
    getServicesByFreelancer,
    updateServiceStatus,
} from "../services/serviceService";

function getErrorMessage(error: unknown): string {
    if (isAxiosError<ServiceErrorResponse>(error)) {
        const data = error.response?.data;

        if (data?.errors) {
            const firstError = Object.values(
                data.errors,
            ).flat()[0];

            if (firstError) {
                return firstError;
            }
        }

        return (
            data?.message ||
            "No fue posible realizar la operación."
        );
    }

    return "No fue posible realizar la operación.";
}

export function useMyServices() {
    const { user } = useAuth();

    const [
        freelancerProfile,
        setFreelancerProfile,
    ] = useState<FreelancerProfile | null>(null);

    const [services, setServices] = useState<
        FreelancerService[]
    >([]);

    const [selectedService, setSelectedService] =
        useState<FreelancerService | null>(null);

    const [isFormOpen, setIsFormOpen] =
        useState(false);

    const [isLoading, setIsLoading] =
        useState(true);

    const [processingServiceId, setProcessingServiceId] =
        useState<number | null>(null);

    const [profileMissing, setProfileMissing] =
        useState(false);

    const [error, setError] =
        useState<string | null>(null);

    /*
    |--------------------------------------------------------------------------
    | Cargar perfil y servicios
    |--------------------------------------------------------------------------
    */

    const loadServices = useCallback(async () => {
        if (!user?.id) {
            setFreelancerProfile(null);
            setServices([]);
            setError(
                "No fue posible identificar al usuario autenticado.",
            );
            setIsLoading(false);

            return;
        }

        try {
            setIsLoading(true);
            setError(null);
            setProfileMissing(false);


            const profile =
                await getFreelancerProfileByUserId(user.id);

            setFreelancerProfile(profile);

            const servicesResponse =
                await getServicesByFreelancer(profile.id);

            setServices(
                servicesResponse.data.services ?? [],
            );
        } catch (requestError) {
            console.error(
                "Error al cargar los servicios:",
                requestError,
            );

            if (
                isAxiosError(requestError) &&
                requestError.response?.status === 404
            ) {
                setFreelancerProfile(null);
                setServices([]);
                setProfileMissing(true);
                setError(null);

                return;
            }

            setFreelancerProfile(null);
            setServices([]);
            setError(getErrorMessage(requestError));
        } finally {
            setIsLoading(false);
        }
    }, [user?.id]);

    useEffect(() => {
        void loadServices();
    }, [loadServices]);

    /*
    |--------------------------------------------------------------------------
    | Control del formulario
    |--------------------------------------------------------------------------
    */

    const openCreateForm = () => {
        setSelectedService(null);
        setIsFormOpen(true);
    };

    const openEditForm = (
        service: FreelancerService,
    ) => {
        setSelectedService(service);
        setIsFormOpen(true);
    };

    const closeForm = () => {
        setSelectedService(null);
        setIsFormOpen(false);
    };

    /*
    |--------------------------------------------------------------------------
    | Actualizar lista después de crear o editar
    |--------------------------------------------------------------------------
    */

    const handleServiceCreated = (
        service: FreelancerService,
    ) => {
        setServices((previousServices) => [
            service,
            ...previousServices,
        ]);

        closeForm();
    };

    const handleServiceUpdated = (
        updatedService: FreelancerService,
    ) => {
        setServices((previousServices) =>
            previousServices.map((service) =>
                service.id === updatedService.id
                    ? updatedService
                    : service,
            ),
        );

        closeForm();
    };

    /*
    |--------------------------------------------------------------------------
    | Activar o desactivar
    |--------------------------------------------------------------------------
    */

    const handleToggleStatus = async (
        service: FreelancerService,
    ) => {
        try {
            setProcessingServiceId(service.id);

            const response =
                await updateServiceStatus(
                    service.id,
                    !service.is_active,
                );

            const updatedService =
                response.data.service;

            setServices((previousServices) =>
                previousServices.map(
                    (currentService) =>
                        currentService.id ===
                            updatedService.id
                            ? updatedService
                            : currentService,
                ),
            );

            await showSuccess(
                updatedService.is_active
                    ? "Servicio activado correctamente."
                    : "Servicio desactivado correctamente.",
            );
        } catch (requestError) {
            console.error(
                "Error al cambiar el estado del servicio:",
                requestError,
            );

            await showError(
                getErrorMessage(requestError),
            );
        } finally {
            setProcessingServiceId(null);
        }
    };

    /*
    |--------------------------------------------------------------------------
    | Eliminar
    |--------------------------------------------------------------------------
    */

    const handleDeleteService = async (
        service: FreelancerService,
    ) => {
        const confirmed = window.confirm(
            `¿Deseas eliminar el servicio "${service.title}"? Esta acción no se puede deshacer.`,
        );

        if (!confirmed) {
            return;
        }

        try {
            setProcessingServiceId(service.id);

            const response =
                await deleteService(service.id);

            setServices((previousServices) =>
                previousServices.filter(
                    (currentService) =>
                        currentService.id !== service.id,
                ),
            );

            if (
                selectedService?.id === service.id
            ) {
                closeForm();
            }

            await showSuccess(
                response.message ||
                "Servicio eliminado correctamente.",
            );
        } catch (requestError) {
            console.error(
                "Error al eliminar el servicio:",
                requestError,
            );

            await showError(
                getErrorMessage(requestError),
            );
        } finally {
            setProcessingServiceId(null);
        }
    };

    /*
    |--------------------------------------------------------------------------
    | Información calculada
    |--------------------------------------------------------------------------
    */

    const activeServicesCount = useMemo(
        () =>
            services.filter(
                (service) => service.is_active,
            ).length,
        [services],
    );

    const inactiveServicesCount =
        services.length - activeServicesCount;

    const isEmpty =
        !isLoading &&
        !error &&
        services.length === 0;

    const isProcessingService = (
        serviceId: number,
    ) => processingServiceId === serviceId;

    return {
        freelancerProfile,
        services,

        selectedService,
        isFormOpen,

        isLoading,
        isEmpty,
        profileMissing,
        error,

        activeServicesCount,
        inactiveServicesCount,

        openCreateForm,
        openEditForm,
        closeForm,

        handleServiceCreated,
        handleServiceUpdated,
        handleToggleStatus,
        handleDeleteService,

        isProcessingService,
        reloadServices: loadServices,
    };
}