import { defineConfig } from "../src";

export default defineConfig({
  entry: ["./index.zh-CN.md"],
  entryLocale: "zh-CN",
  entrySuffix: ".zh-CN.md",
  outputLocales: ["en-US", "ja-JP"],
  outputCustom: (locale, { getDefaultSuffix }) => {
    if (locale === "en-US") return ".md";
    return getDefaultSuffix(locale);
  }
});
