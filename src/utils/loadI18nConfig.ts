import { loadConfig } from "unconfig";
import type { GenjiI18nConfig } from "@/types/config";

async function loadI18nConfig(path: string) {
  let configDefault = {};
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
    return config;
  }

  return configDefault as GenjiI18nConfig;
}

export { loadI18nConfig };
