declare namespace NodeJS {
  interface ProcessEnv {
    VITE_BACKEND_DEVELOPMENT_URL: string;
    VITE_APP_NAME: string;
    VITE_APP_VERSION: string;
    VITE_ENVIRONMENT: string;
    VITE_BACKEND_PRODUCTION_URL: string;
  }
}