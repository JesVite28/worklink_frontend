import { isAxiosError } from "axios";
import { FaAndroid } from "react-icons/fa";

import authApi from "../../../api/axios";

import {
  showError,
  showInfo,
} from "../../../shared/services/alertService";

import Container from "../../../shared/components/layout/Container";

import { useProtectedNavigation } from "../hooks/useProtectedNavigation";

interface MobileLatestResponse {
  success: boolean;
  message: string;
  data: {
    available: boolean;
    download_url: string | null;
  };
}

function resolveDownloadUrl(
  downloadUrl: string,
): string {
  if (
    downloadUrl.startsWith("http://") ||
    downloadUrl.startsWith("https://")
  ) {
    return downloadUrl;
  }

  const apiBaseUrl =
    authApi.defaults.baseURL ??
    "http://127.0.0.1:8000/api";

  const backendOrigin = apiBaseUrl
    .replace(/\/api\/?$/, "")
    .replace(/\/$/, "");

  if (downloadUrl.startsWith("/")) {
    return `${backendOrigin}${downloadUrl}`;
  }

  return `${backendOrigin}/${downloadUrl}`;
}

export default function Hero() {
  const { goToPublicRoute } =
    useProtectedNavigation();

  const handleDownloadMobileApp =
    async (): Promise<void> => {
      try {
        const response =
          await authApi.get<MobileLatestResponse>(
            "/public/mobile/android/latest",
          );

        const payload = response.data;

        const isAvailable =
          payload.data?.available;

        const downloadUrl =
          payload.data?.download_url;

        if (
          !isAvailable ||
          !downloadUrl
        ) {
          await showInfo(
            payload.message ||
            "La app Android no está disponible todavía.",
            "App móvil",
          );

          return;
        }

        window.open(
          resolveDownloadUrl(downloadUrl),
          "_blank",
          "noopener,noreferrer",
        );
      } catch (error) {
        if (isAxiosError(error)) {
          const message =
            (
              error.response?.data as {
                message?: string;
              }
            )?.message ||
            "No se pudo verificar la descarga de la app móvil.";

          await showError(
            message,
            "Error",
          );

          return;
        }

        await showError(
          "No se pudo verificar la descarga de la app móvil.",
          "Error",
        );
      }
    };

  return (
    <section className="bg-background py-12 sm:py-16 lg:py-24">
      <Container>
        <div className="grid items-center gap-10 lg:grid-cols-2 lg:gap-14">
          <div className="min-w-0 text-center lg:text-left">
            <span className="mb-5 inline-flex rounded-full bg-primary/10 px-4 py-2 text-sm font-medium text-primary sm:mb-6">
              Plataforma Local de Servicios
            </span>

            <h1 className="mx-auto max-w-4xl text-4xl font-bold leading-tight text-text sm:text-5xl lg:mx-0 lg:text-6xl">
              Conecta con el talento local que
              necesitas
            </h1>

            <p className="mx-auto mt-5 max-w-2xl text-base leading-7 text-text-muted sm:mt-6 sm:text-lg lg:mx-0">
              Encuentra freelancers,
              profesionales y oportunidades
              laborales cerca de ti. Publica
              proyectos, explora servicios y
              crea conexiones profesionales de
              manera rápida y sencilla.
            </p>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center lg:justify-start">
              <button
                type="button"
                onClick={() => {
                  goToPublicRoute(
                    "/freelancers",
                  );
                }}
                className="w-full rounded-xl bg-primary px-7 py-3.5 font-semibold text-white transition hover:opacity-90 sm:w-auto sm:px-8 sm:py-4"
              >
                Explorar Servicios
              </button>

              <button
                type="button"
                onClick={() => {
                  goToPublicRoute(
                    "/vacantes",
                  );
                }}
                className="w-full rounded-xl border border-border px-7 py-3.5 font-semibold text-text transition hover:border-primary hover:text-primary sm:w-auto sm:px-8 sm:py-4"
              >
                Explorar vacantes
              </button>

              <button
                type="button"
                onClick={() => {
                  void handleDownloadMobileApp();
                }}
                className="inline-flex w-full flex-col items-center justify-center gap-1.5 rounded-xl border border-primary/30 bg-primary/10 px-7 py-3.5 font-semibold text-primary transition hover:border-primary hover:bg-primary/15 sm:w-auto sm:px-8 sm:py-4"
              >
                <FaAndroid className="h-6 w-6 shrink-0" />

                <span>App</span>
              </button>
            </div>
          </div>

          <div className="flex min-w-0 justify-center lg:justify-end">
            <div className="w-full max-w-sm rounded-3xl bg-gradient-to-br from-primary to-secondary p-4 shadow-card sm:max-w-xl sm:p-6 lg:max-w-2xl lg:p-8">
              <img
                src="/freelancer.png"
                alt="Freelancer WorkLink"
                className="mx-auto h-auto max-h-[320px] w-full object-contain sm:max-h-[430px] lg:max-h-[520px]"
              />
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}