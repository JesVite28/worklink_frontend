import {
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";

import { isAxiosError } from "axios";

import { useAuth } from "../../../context/useAuth";

import type {
  CompanyProfile,
  FreelancerProfile,
  ProfileErrorResponse,
} from "../models/profile";

import {
  getFreelancerProfileByUserId,
  getMyCompanyProfile,
} from "../services/profileService";

export function useProfilePage() {
  const {
    user,
    primaryRole,
    updateUser,
    isClient,
    isFreelancer,
    isCompany,
  } = useAuth();

  const [freelancerProfile, setFreelancerProfile] =
    useState<FreelancerProfile | null>(null);

  const [companyProfile, setCompanyProfile] =
    useState<CompanyProfile | null>(null);

  const [isLoadingProfile, setIsLoadingProfile] =
    useState(true);

  const [profileError, setProfileError] =
    useState("");

  const fullName = useMemo(() => {
    return (
      [
        user?.name,
        user?.last_name,
        user?.maternal_last_name,
      ]
        .filter(Boolean)
        .join(" ") || "Usuario"
    );
  }, [user]);

  const profilePhoto =
    user?.profile_photo_url ||
    user?.profile_photo ||
    null;

  const loadProfile = useCallback(async () => {
    if (!user) {
      setFreelancerProfile(null);
      setCompanyProfile(null);
      setIsLoadingProfile(false);
      return;
    }

    try {
      setIsLoadingProfile(true);
      setProfileError("");

      if (isFreelancer) {
        try {
          const profile =
            await getFreelancerProfileByUserId(user.id);

          setFreelancerProfile(profile);
        } catch (error) {
          if (
            isAxiosError<ProfileErrorResponse>(error) &&
            error.response?.status === 404
          ) {
            /*
             * El usuario freelancer todavía no ha creado
             * su perfil profesional.
             */
            setFreelancerProfile(null);
          } else {
            throw error;
          }
        }

        setCompanyProfile(null);
        return;
      }

      if (isCompany) {
        try {
          const profile = await getMyCompanyProfile();

          setCompanyProfile(profile);
        } catch (error) {
          if (
            isAxiosError<ProfileErrorResponse>(error) &&
            error.response?.status === 404
          ) {
            /*
             * La empresa todavía no ha creado
             * su perfil empresarial.
             */
            setCompanyProfile(null);
          } else {
            throw error;
          }
        }

        setFreelancerProfile(null);
        return;
      }

      /*
       * El cliente solamente administra sus datos personales,
       * por lo que no necesita cargar otro perfil.
       */
      setFreelancerProfile(null);
      setCompanyProfile(null);
    } catch (error) {
      console.error(
        "Error al cargar la información del perfil:",
        error,
      );

      if (isAxiosError<ProfileErrorResponse>(error)) {
        setProfileError(
          error.response?.data?.message ||
            "No fue posible cargar la información del perfil.",
        );
      } else {
        setProfileError(
          "No fue posible cargar la información del perfil.",
        );
      }
    } finally {
      setIsLoadingProfile(false);
    }
  }, [
    user,
    isFreelancer,
    isCompany,
  ]);

  useEffect(() => {
    loadProfile();
  }, [loadProfile]);

  const hasRoleProfile = useMemo(() => {
    if (isFreelancer) {
      return freelancerProfile !== null;
    }

    if (isCompany) {
      return companyProfile !== null;
    }

    return true;
  }, [
    isFreelancer,
    isCompany,
    freelancerProfile,
    companyProfile,
  ]);

  return {
    user,
    primaryRole,

    fullName,
    profilePhoto,

    isClient,
    isFreelancer,
    isCompany,

    freelancerProfile,
    setFreelancerProfile,

    companyProfile,
    setCompanyProfile,

    hasRoleProfile,

    isLoadingProfile,
    profileError,

    reloadProfile: loadProfile,
    updateUser,
  };
}