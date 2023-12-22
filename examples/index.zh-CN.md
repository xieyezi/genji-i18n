<a name="readme-top"></a>

<div align="center">

<img height="120" src="./genji.svg">

<h1>genji i18n</h1>

genji i18n 是一款使用 基于 ChatGPT 的自动翻译 markdown 文档的工具。

[English](./README.md) ・ 简体中文 ・ [更新日志](./CHANGELOG.md) ·

</div>

## 特性

- [x] 利用 ChatGPT 自动翻译 markdown 文档
- [x] 支持大型文件自动分割，不必担心 ChatGPT token 限制
- [x] 支持自定义 OpenAI 模型、API 代理、temperature

## 安装

要安装 genji i18n，请运行以下命令：

```bash
pnpm add @xieyezi/genji-i18n -D
```

建议安装到全局环境中:

```bash
npm install -g @xieyezi/genji-i18n
```

> 请确保环境中 `Node.js` 版本 **>= 18**

## 使用

```bash
genji-i18n translate -c path/to/genji.config.ts
```

## 配置

在你文档的根目录下面，创建一个 `genji.config.ts`。`genji-i18n` 提供了 `defineConfig` 函数。
下面是一个例子:

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

### `genji.confit.ts` 完整类型

```ts
export interface GenjiI18nConfig {
  /**
   * @description 要使用的 ChatGPT 模型
   */
  model?: LanguageModel;
  /**
   * @description 并发的待处理的任务数量
   */
  concurrency?: number;
  /**
   * @description 提供一些上下文以获得更准确的翻译
   */
  reference?: string;
  /**
   * @description 按标记拆分
   */
  splitToken?: number;
  /**
   * @description 要使用的采样温度
   */
  temperature?: number;
  /**
   * @description 入口文件或文件夹，支持 glob模式
   */
  entry: string[];
  /**
   * @description 将用作翻译参考的语言
   */
  entryLocale: string;
  /**
   * @description 将用作翻译参考的语言 Markdown 后缀
   */
  entrySuffix?: string;
  /**
   * @description 将被忽略的 markdown，支持 glob
   */
  exclude?: string[];
  /**
   * @description 需要进行翻译的所有语言
   */
  outputLocales: string[];
  /**
   * @description 是否使用 json 模式
   */
  experimental?: {
    jsonMode?: boolean;
  };
  /**
   * @description 自定义生成函数
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

## 例子

可参考 Examples 文件夹查看详细使用示例。
