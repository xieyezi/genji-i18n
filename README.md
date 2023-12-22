<a name="readme-top"></a>

<div align="center">

<img height="120" src="./genji.svg">

<h1>genji i18n</h1>

genji i18n is a tool for automatically translating markdown documents based on ChatGPT.

[简体中文](./README0.zh-CN.md) ・ English ・ [Changelog](./CHANGELOG.md) ·

</div>

## Features

- [x] Automatically translate markdown documents using ChatGPT
- [x] Support automatic segmentation of large files, no need to worry about ChatGPT token limits
- [x] Support custom OpenAI models, API proxies, and temperature

## Installation

To install genji i18n, run the following command:

```bash
pnpm add @xieyezi/genji-i18n -D
```

It is recommended to install globally:

```bash
npm install -g @xieyezi/genji-i18n
```

> Please ensure that the `Node.js` version is **>= 18**

## Usage

```bash
genji-i18n translate -c path/to/genji.config.ts
```

## Configuration

Create a `genji.config.ts` in the root directory of your document. `genji-i18n` provides the `defineConfig` function.
Here is an example:

```ts
// genji.config.ts
import { defineConfig, LanguageModel } from "@xieyezi/genji-i18n";

export default defineConfig({
  model: LanguageModel.GPT3_5,
  entryLocale: "zh-CN",
  entrySuffix: ".zh-CN.md",
  outputLocales: ["en-US", "ja-JP"],
  entry: ["./index.zh-CN.md"],
  outputCustom: (locale, { getDefaultSuffix }) => {
    if (locale === "en-US") return ".md";
    return getDefaultSuffix(locale);
  }
});
```

### Complete Type of `genji.confit.ts`

```ts
export interface GenjiI18nConfig {
  /**
   * @description ChatGPT model to use
   */
  model?: LanguageModel;
  /**
   * @description Number of concurrently pending promises returned
   */
  concurrency?: number;
  /**
   * @description Provide some context for a more accurate translation
   */
  reference?: string;
  /**
   * @description Split locale JSON by token
   */
  splitToken?: number;
  /**
   * @description Sampling temperature to use
   */
  temperature?: number;
  /**
   * @description The entry file or folder, support glob
   */
  entry: string[];
  /**
   * @description The language that will use as translation ref
   */
  entryLocale: string;
  /**
   * @description Markdown Suffix
   */
  entrySuffix?: string;
  /**
   * @description The markdown that will ignore, support glob
   */
  exclude?: string[];
  /**
   * @description All languages that need to be translated
   */
  outputLocales: string[];
  /**
   * @description IS use json mode
   */
  experimental?: {
    jsonMode?: boolean;
  };
  /**
   * @description Markdown extension generator function
   */
  outputCustom?: (
    locale: string,
    config: {
      fileContent: string;
      filePath: string;
      getDefaultSuffix: (locale: string) => string;
    }
  ) => string;
}
```

## Examples

Refer to the Examples folder for detailed usage examples.
