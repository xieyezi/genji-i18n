import { defineConfig, LanguageModel } from "../src";

export default defineConfig({
  model: LanguageModel.GPT3_5,
  entryLocale: "zh-CN",
  entrySuffix: ".zh-CN.md",
  outputLocales: ["en-US", "ja-JP"],
  entry: ["./index.zh-CN.md"],
  //entry: ["./index.zh-CN.md", "./docs/**/*.zh-CN.md"],
  //exclude: ["./docs/subfolder/*.zh-CN.md"],
  outputCustom: (locale, { getDefaultSuffix }) => {
    if (locale === "en-US") return ".md";
    return getDefaultSuffix(locale);
  }
});
