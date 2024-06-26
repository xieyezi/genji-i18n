export const PRIMITIVE_EXTRA_TOKENS = 3;
export const KEY_EXTRA_TOKENS = 2; // For `"key":`
export const OBJECT_EXTRA_TOKENS = 2; // For `{}`

export enum MarkdownMode {
  MDAST = "mdast",
  STRING = "string"
}

export enum LanguageModel {
  GPT3_5 = "gpt-3.5-turbo",
  GPT3_5_1106 = "gpt-3.5-turbo-1106",
  GPT3_5_16K = "gpt-3.5-turbo-16k",
  GPT4 = "gpt-4",
  GPT4_32K = "gpt-4-32k",
  GPT4_PREVIEW = "gpt-4-1106-preview",
  GPT4_VISION_PREVIEW = "gpt-4-vision-preview",
  GPT4_O = "gpt-4o"
}

export const ModelTokens: Record<LanguageModel, number> = {
  [LanguageModel.GPT3_5]: 4096,
  [LanguageModel.GPT3_5_1106]: 16_385,
  [LanguageModel.GPT3_5_16K]: 16_385,
  [LanguageModel.GPT4]: 8196,
  [LanguageModel.GPT4_PREVIEW]: 128_000,
  [LanguageModel.GPT4_VISION_PREVIEW]: 128_000,
  [LanguageModel.GPT4_32K]: 32_768,
  [LanguageModel.GPT4_O]: 128_000
};
