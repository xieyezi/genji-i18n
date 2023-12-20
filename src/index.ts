import type { GenjiI18nConfig } from "./types/config";

export { LanguageModel } from "./utils/constant";
export type { GenjiI18nConfig };
export const defineConfig = (config: Partial<GenjiI18nConfig>): GenjiI18nConfig => {
  return config as GenjiI18nConfig;
};
