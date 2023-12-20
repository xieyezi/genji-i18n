import { loadConfig } from "unconfig";
import type { GenjiI18nConfig } from "../types/config";
import { LanguageModel } from "../utils/constant";

async function loadI18nConfig(path: string) {
  const configDefault = {
    concurrency: 5,
    temperature: 0,
    model: LanguageModel.GPT3_5
  };
  const { config } = await loadConfig<GenjiI18nConfig>({
    cwd: path,
    sources: [
      {
        files: "genji.config",
        extensions: ["ts", "mts", "cts", "js", "mjs", "cjs", ""]
      }
    ],
    merge: false
  });

  if (config) {
    return {
      ...configDefault,
      ...config
    };
  }

  return configDefault as GenjiI18nConfig;
}

export { loadI18nConfig };
