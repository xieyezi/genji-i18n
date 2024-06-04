import type { EnvConfig } from "../types/config";
import { config } from "dotenv";
import { resolve } from "path";
import { getCwdPath } from "./getCwdPath";

export function getOpenAIKeyAndURL(configPath: string): EnvConfig {
  const root = getCwdPath(configPath);
  const envs = config({ path: resolve(root, ".env") })?.parsed || {};
  console.log("envs:", envs);
  const openAIKey = process.env.OPENAI_API_KEY || envs?.OPENAI_API_KEY || "";
  const openAIBaseUrl = process.env.OPENAI_PROXY_URL || envs?.OPENAI_PROXY_URL || "https://api.openai.com/v1";

  return {
    openAIKey,
    openAIBaseUrl
  };
}
