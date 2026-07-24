import axios, { AxiosError } from "axios";

const authApi = axios.create({
  baseURL:
    import.meta.env.VITE_API_URL ||
    "http://127.0.0.1:8000/api",

  headers: {
    Accept: "application/json",
    "Content-Type": "application/json",
  },

  timeout: 15000,
});

authApi.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error: AxiosError) => Promise.reject(error),
);

authApi.interceptors.response.use(
  (response) => response,

  (error: AxiosError) => {
    const status = error.response?.status;
    const token = localStorage.getItem("token");

    const requestUrl = error.config?.url ?? "";

    const isAuthenticationRequest =
      requestUrl.includes("/login") ||
      requestUrl.includes("/register");

    if (
      status === 401 &&
      token &&
      !isAuthenticationRequest
    ) {
      localStorage.removeItem("token");
      localStorage.removeItem("user");

      window.dispatchEvent(
        new CustomEvent("auth:session-expired"),
      );
    }

    return Promise.reject(error);
  },
);

export default authApi;