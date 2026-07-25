export const ENDPOINTS = {
  /*
  |--------------------------------------------------------------------------
  | Autenticación
  |--------------------------------------------------------------------------
  */

  LOGIN: "/login",
  REGISTER: "/register",
  ME: "/me",
  LOGOUT: "/logout",
  REFRESH: "/refresh",

  /*
  |--------------------------------------------------------------------------
  | Recuperación de contraseña
  |--------------------------------------------------------------------------
  */

  FORGOT_PASSWORD:
    "/forgot-password",

  RESET_PASSWORD:
    "/reset-password",

  /*
  |--------------------------------------------------------------------------
  | Verificación en dos pasos
  |--------------------------------------------------------------------------
  */

  TWO_FACTOR: {
    VERIFY:
      "/2fa/verify",

    RESEND:
      "/2fa/resend",

    STATUS:
      "/2fa/status",

    ENABLE:
      "/2fa/enable",

    VERIFY_ENABLE:
      "/2fa/enable/verify",

    DISABLE:
      "/2fa/disable",
  },

  /*
  |--------------------------------------------------------------------------
  | Seguridad de la cuenta
  |--------------------------------------------------------------------------
  */

  SECURITY: {
    PASSWORD: {
      SEND_CHANGE_CODE:
        "/security/password/code",

      CHANGE:
        "/security/password/change",
    },
  },

  /*
  |--------------------------------------------------------------------------
  | Cuenta personal
  |--------------------------------------------------------------------------
  */

  MY_ACCOUNT:
    "/users/me",

  MY_PROFILE_PHOTO:
    "/users/me/profile-photo",

  /*
  |--------------------------------------------------------------------------
  | Perfiles freelancer
  |--------------------------------------------------------------------------
  */

  PROFILES:
    "/public/profiles",

  PUBLIC_PROFILE: (
    profileId: number,
  ) =>
    `/public/profiles/${profileId}`,

  FREELANCER_PROFILES:
    "/profiles",

  FREELANCER_PROFILE: (
    profileId: number,
  ) =>
    `/profiles/${profileId}`,

  FREELANCER_PROFILE_BY_USER: (
    userId: number,
  ) =>
    `/profiles/user/${userId}`,

  /*
  |--------------------------------------------------------------------------
  | Perfiles empresariales
  |--------------------------------------------------------------------------
  */

  COMPANY_PROFILES:
    "/company-profiles",

  MY_COMPANY_PROFILE:
    "/company-profiles/me",

  COMPANY_PROFILE: (
    profileId: number,
  ) =>
    `/company-profiles/${profileId}`,

  /*
  |--------------------------------------------------------------------------
  | Servicios públicos
  |--------------------------------------------------------------------------
  */

  PUBLIC_SERVICES:
    "/public/services",

  PUBLIC_SERVICE: (
    serviceId: number,
  ) =>
    `/public/services/${serviceId}`,

  PUBLIC_SERVICES_BY_FREELANCER: (
    freelancerProfileId: number,
  ) =>
    `/public/services/freelancer/${freelancerProfileId}`,

  /*
  |--------------------------------------------------------------------------
  | Servicios privados
  |--------------------------------------------------------------------------
  */

  SERVICES:
    "/services",

  SERVICE: (
    serviceId: number,
  ) =>
    `/services/${serviceId}`,

  SERVICES_BY_FREELANCER: (
    freelancerProfileId: number,
  ) =>
    `/services/freelancer/${freelancerProfileId}`,

  /*
  |--------------------------------------------------------------------------
  | Portafolios públicos
  |--------------------------------------------------------------------------
  */

  PUBLIC_BRIEFCASES:
    "/public/briefcases",

  PUBLIC_BRIEFCASE: (
    briefcaseId: number,
  ) =>
    `/public/briefcases/${briefcaseId}`,

  PUBLIC_BRIEFCASES_BY_FREELANCER: (
    freelancerProfileId: number,
  ) =>
    `/public/briefcases/freelancer/${freelancerProfileId}`,

  /*
  |--------------------------------------------------------------------------
  | Portafolios privados
  |--------------------------------------------------------------------------
  */

  BRIEFCASES:
    "/briefcases",

  MY_BRIEFCASES:
    "/briefcases/me",

  BRIEFCASE: (
    briefcaseId: number,
  ) =>
    `/briefcases/${briefcaseId}`,

  BRIEFCASES_BY_FREELANCER: (
    freelancerProfileId: number,
  ) =>
    `/briefcases/freelancer/${freelancerProfileId}`,

  BRIEFCASE_IMAGE: (
    briefcaseId: number,
  ) =>
    `/briefcases/${briefcaseId}/image`,

  /*
  |--------------------------------------------------------------------------
  | Chatbot
  |--------------------------------------------------------------------------
  */

  CHATBOT_PUBLIC_MESSAGE:
    "/chatbot/message",

  CHATBOT_AUTH_MESSAGE:
    "/chatbot/auth-message",

  /*
  |--------------------------------------------------------------------------
  | Disponibilidad
  |--------------------------------------------------------------------------
  */

  AVAILABILITIES:
    "/availabilities",

  MY_AVAILABILITIES:
    "/availabilities/me",

  AVAILABILITY: (
    availabilityId: number,
  ) =>
    `/availabilities/${availabilityId}`,

  /*
  |--------------------------------------------------------------------------
  | Vacantes públicas
  |--------------------------------------------------------------------------
  */

  PUBLIC_VACANCIES:
    "/public/vacancies",

  PUBLIC_VACANCY: (
    vacancyId: number,
  ) =>
    `/public/vacancies/${vacancyId}`,

  PUBLIC_VACANCIES_BY_COMPANY: (
    companyProfileId: number,
  ) =>
    `/public/vacancies/company/${companyProfileId}`,

  /*
  |--------------------------------------------------------------------------
  | Vacantes privadas
  |--------------------------------------------------------------------------
  */

  VACANCIES:
    "/vacancies",

  MY_VACANCIES:
    "/vacancies/me",

  VACANCY: (
    vacancyId: number,
  ) =>
    `/vacancies/${vacancyId}`,

  /*
  |--------------------------------------------------------------------------
  | Postulaciones
  |--------------------------------------------------------------------------
  */

  APPLICATIONS:
    "/applications",

  MY_APPLICATIONS:
    "/applications/me",

  APPLICATIONS_BY_VACANCY: (
    vacancyId: number,
  ) =>
    `/applications/vacancy/${vacancyId}`,

  APPLICATION: (
    applicationId: number,
  ) =>
    `/applications/${applicationId}`,

  /*
  |--------------------------------------------------------------------------
  | Solicitudes de contratación
  |--------------------------------------------------------------------------
  */

  CONTRACT_REQUESTS: {
    BASE:
      "/contract-requests",

    SHOW: (
      requestId: number,
    ) =>
      `/contract-requests/${requestId}`,

    UPDATE: (
      requestId: number,
    ) =>
      `/contract-requests/${requestId}`,

    DELETE: (
      requestId: number,
    ) =>
      `/contract-requests/${requestId}`,
  },

  /*
  |--------------------------------------------------------------------------
  | Contratos
  |--------------------------------------------------------------------------
  */

  CONTRACTS: {
    BASE:
      "/contracts",

    SHOW: (
      contractId: number,
    ) =>
      `/contracts/${contractId}`,

    UPDATE: (
      contractId: number,
    ) =>
      `/contracts/${contractId}`,

    DELETE: (
      contractId: number,
    ) =>
      `/contracts/${contractId}`,
  },

  /*
  |--------------------------------------------------------------------------
  | Mensajes
  |--------------------------------------------------------------------------
  */

  MESSAGES: {
    CONVERSATIONS:
      "/messages/conversations",

    CONVERSATION: (
      userId: number,
    ) =>
      `/messages/conversation/${userId}`,

    SEND:
      "/messages",

    MARK_CONVERSATION_AS_READ: (
      userId: number,
    ) =>
      `/messages/read-all/${userId}`,

    MARK_AS_READ: (
      messageId: number,
    ) =>
      `/messages/${messageId}/read`,

    DELETE: (
      messageId: number,
    ) =>
      `/messages/${messageId}`,
  },

  /*
  |--------------------------------------------------------------------------
  | Notificaciones
  |--------------------------------------------------------------------------
  */

  NOTIFICATIONS: {
    BASE:
      "/notifications",

    UNREAD_COUNT:
      "/notifications/unread-count",

    MARK_AS_READ: (
      notificationId: number,
    ) =>
      `/notifications/${notificationId}/read`,

    MARK_ALL_AS_READ:
      "/notifications/read-all",

    DELETE: (
      notificationId: number,
    ) =>
      `/notifications/${notificationId}`,
  },

  /*
  |--------------------------------------------------------------------------
  | Reseñas
  |--------------------------------------------------------------------------
  */

  REVIEWS: {
    BASE:
      "/reviews",

    SHOW: (
      reviewId: number,
    ) =>
      `/reviews/${reviewId}`,

    UPDATE: (
      reviewId: number,
    ) =>
      `/reviews/${reviewId}`,

    DELETE: (
      reviewId: number,
    ) =>
      `/reviews/${reviewId}`,

    PUBLIC_BY_USER: (
      userId: number,
    ) =>
      `/public/reviews/user/${userId}`,

    PUBLIC_BY_FREELANCER: (
      freelancerId: number,
    ) =>
      `/public/reviews/freelancer/${freelancerId}`,

    PUBLIC_BY_COMPANY: (
      companyId: number,
    ) =>
      `/public/reviews/company/${companyId}`,
  },
} as const;