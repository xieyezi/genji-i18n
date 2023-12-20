declare global {
  namespace NodeJS {
    interface ProcessEnv {
      [key: string]: string | undefined;
      OPENAI_API_KEY: string;
      OPENAI_PROXY_URL: string;
    }
  }
}
