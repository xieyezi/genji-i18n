import type { EnvConfig } from "../types/config";

export function getOpenAIKeyAndURL(): EnvConfig {
  const openAIKey = process.env.OPENAI_API_KEY || "";
  const openAIBaseUrl = process.env.OPENAI_PROXY_URL || "https://api.openai.com/v1";

  return {
    openAIKey,
    openAIBaseUrl
  };
}
