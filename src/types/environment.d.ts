declare namespace NodeJS {
  interface ProcessEnv {
    REACT_APP_API_BASE_URL: string;
    REACT_APP_APP_NAME: string;
    REACT_APP_VERSION: string;
    REACT_APP_ENVIRONMENT: string;
  }
}