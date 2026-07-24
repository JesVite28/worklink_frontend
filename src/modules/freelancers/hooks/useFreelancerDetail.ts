import {
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";

import axios from "axios";
import { useParams } from "react-router-dom";

import type { Freelancer } from "../models/freelancer";
import type { PublicBriefcase } from "../models/publicBriefcase";
import type { FreelancerService } from "../../services/models/service";

import {
  getFreelancerById,
} from "../services/freelancerService";

import {
  getPublicServicesByFreelancer,
} from "../../services/services/serviceService";

import {
  getPublicBriefcaseById,
  getPublicBriefcasesByFreelancer,
} from "../services/publicBriefcaseService";

function getErrorMessage(
  error: unknown,
  fallbackMessage: string,
): string {
  if (axios.isAxiosError(error)) {
    const responseMessage =
      error.response?.data?.message;

    if (
      typeof responseMessage === "string" &&
      responseMessage.trim()
    ) {
      return responseMessage;
    }
  }

  if (error instanceof Error) {
    return error.message;
  }

  return fallbackMessage;
}

export default function useFreelancerDetail() {
  const { profileId } = useParams<{
    profileId: string;
  }>();

  const numericProfileId = Number(profileId);

  const [
    freelancer,
    setFreelancer,
  ] = useState<Freelancer | null>(null);

  const [
    services,
    setServices,
  ] = useState<FreelancerService[]>([]);

  const [
    briefcases,
    setBriefcases,
  ] = useState<PublicBriefcase[]>([]);

  const [
    isLoading,
    setIsLoading,
  ] = useState(true);

  const [
    error,
    setError,
  ] = useState<string | null>(null);

  const [
    notFound,
    setNotFound,
  ] = useState(false);

  /*
  |--------------------------------------------------------------------------
  | Detalle individual del portafolio
  |--------------------------------------------------------------------------
  */

  const [
    selectedBriefcase,
    setSelectedBriefcase,
  ] = useState<PublicBriefcase | null>(
    null,
  );

  const [
    isBriefcaseDetailLoading,
    setIsBriefcaseDetailLoading,
  ] = useState(false);

  const [
    briefcaseDetailError,
    setBriefcaseDetailError,
  ] = useState<string | null>(null);

  /*
  |--------------------------------------------------------------------------
  | Cargar perfil público
  |--------------------------------------------------------------------------
  */

  const loadFreelancerDetail =
    useCallback(async () => {
      if (
        !Number.isInteger(
          numericProfileId,
        ) ||
        numericProfileId <= 0
      ) {
        setNotFound(true);
        setError(
          "El perfil solicitado no es válido.",
        );
        setIsLoading(false);

        return;
      }

      setIsLoading(true);
      setError(null);
      setNotFound(false);

      try {
        const [
          freelancerData,
          servicesData,
          briefcasesData,
        ] = await Promise.all([
          getFreelancerById(
            numericProfileId,
          ),

          getPublicServicesByFreelancer(
            numericProfileId,
          ),

          getPublicBriefcasesByFreelancer(
            numericProfileId,
          ),
        ]);

        setFreelancer(
          freelancerData,
        );

        setServices(
          servicesData,
        );

        setBriefcases(
          briefcasesData,
        );
      } catch (requestError) {
        if (
          axios.isAxiosError(
            requestError,
          ) &&
          requestError.response
            ?.status === 404
        ) {
          setNotFound(true);

          setError(
            "El perfil del freelancer no fue encontrado.",
          );
        } else {
          setError(
            getErrorMessage(
              requestError,
              "No se pudo cargar la información del freelancer.",
            ),
          );
        }

        setFreelancer(null);
        setServices([]);
        setBriefcases([]);
      } finally {
        setIsLoading(false);
      }
    }, [numericProfileId]);

  useEffect(() => {
    void loadFreelancerDetail();
  }, [loadFreelancerDetail]);

  /*
  |--------------------------------------------------------------------------
  | Abrir portafolio individual
  |--------------------------------------------------------------------------
  */

  const openBriefcaseDetail =
    useCallback(
      async (
        briefcase:
          PublicBriefcase,
      ) => {
        setSelectedBriefcase(null);

        setBriefcaseDetailError(
          null,
        );

        setIsBriefcaseDetailLoading(
          true,
        );

        try {
          const briefcaseDetail =
            await getPublicBriefcaseById(
              briefcase.id,
            );

          setSelectedBriefcase(
            briefcaseDetail,
          );
        } catch (requestError) {
          setBriefcaseDetailError(
            getErrorMessage(
              requestError,
              "No se pudo cargar el detalle del proyecto.",
            ),
          );
        } finally {
          setIsBriefcaseDetailLoading(
            false,
          );
        }
      },
      [],
    );

  /*
  |--------------------------------------------------------------------------
  | Cerrar detalle individual
  |--------------------------------------------------------------------------
  */

  const closeBriefcaseDetail =
    useCallback(() => {
      setSelectedBriefcase(null);

      setBriefcaseDetailError(
        null,
      );

      setIsBriefcaseDetailLoading(
        false,
      );
    }, []);

  /*
  |--------------------------------------------------------------------------
  | Información calculada
  |--------------------------------------------------------------------------
  */

  const hasServices =
    services.length > 0;

  const servicesCount =
    services.length;

  const hasBriefcases =
    briefcases.length > 0;

  const briefcasesCount =
    briefcases.length;

  const isAvailable =
    freelancer?.available ??
    false;

  const languages = useMemo(
    () =>
      freelancer?.languages ??
      [],
    [freelancer?.languages],
  );

  const links = useMemo(
    () =>
      freelancer
        ?.professionalLinks ??
      null,
    [
      freelancer
        ?.professionalLinks,
    ],
  );

  return {
    profileId:
      numericProfileId,

    freelancer,
    services,
    briefcases,

    isLoading,
    error,
    notFound,

    hasServices,
    servicesCount,

    hasBriefcases,
    briefcasesCount,

    isAvailable,
    languages,
    links,

    selectedBriefcase,
    isBriefcaseDetailLoading,
    briefcaseDetailError,

    openBriefcaseDetail,
    closeBriefcaseDetail,

    reload:
      loadFreelancerDetail,
  };
}