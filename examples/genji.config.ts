import { defineConfig, LanguageModel } from "../src";

export default defineConfig({
  model: LanguageModel.GPT3_5,
  entry: ["./index.zh-CN.md"],
  entryLocale: "zh-CN",
  entrySuffix: ".zh-CN.md",
  outputLocales: ["en-US", "ja-JP"],
  outputCustom: (locale, { getDefaultSuffix }) => {
    if (locale === "en-US") return ".md";
    return getDefaultSuffix(locale);
  }
});
