<a name="readme-top"></a>

<div align="center">

<img height="120" src="./genji.svg">

<h1>genji i18n</h1>

genji i18n openAI に基づいて自動的に Markdown ドキュメントを翻訳するツールです。

[English](./README.md) ・ にほんご ・ [简体中文](./README.zh-CN.md) ·

</div>

## 特徴

- [x] openAI を使用して Markdown ドキュメントを自動翻訳
- [x] 大規模なファイルの自動分割をサポートし、openAI のトークン制限を気にする必要はありません
- [x] カスタム OpenAI モデル、API プロキシ、温度のサポート

## インストール

genji i18n をインストールするには、次のコマンドを実行してください：

```bash
pnpm add @xieyezi/genji-i18n -D
```

グローバル環境にインストールすることをお勧めします：

```bash
npm install -g @xieyezi/genji-i18n
```

> 環境に `Node.js` バージョン **>= 18** があることを確認してください

## 使用法

```bash
genji-i18n translate -c path/to/genji.config.ts
```

## 設定

ドキュメントのルートディレクトリに `genji.config.ts` を作成します。`genji-i18n` は `defineConfig` 関数を提供しています。
以下は例です：

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

### `genji.confit.ts` 完全な型

```ts
export interface GenjiI18nConfig {
  /**
   * @description 使用するChatGPTモデル
   */
  model?: LanguageModel;
  /**
   * @description 並行して処理するタスクの数
   */
  concurrency?: number;
  /**
   * @description より正確な翻訳を得るためのコンテキストを提供
   */
  reference?: string;
  /**
   * @description トークンで分割
   */
  splitToken?: number;
  /**
   * @description 使用するサンプリング温度
   */
  temperature?: number;
  /**
   * @description エントリーファイルまたはフォルダー、グロブパターンをサポート
   */
  entry: string[];
  /**
   * @description 翻訳の参照として使用される言語
   */
  entryLocale: string;
  /**
   * @description 翻訳の参照として使用される言語のMarkdownサフィックス
   */
  entrySuffix?: string;
  /**
   * @description 無視されるMarkdown、グロブをサポート
   */
  exclude?: string[];
  /**
   * @description 翻訳する必要のあるすべての言語
   */
  outputLocales: string[];
  /**
   * @description JSONモードを使用するかどうか
   */
  experimental?: {
    jsonMode?: boolean;
  };
  /**
   * @description カスタム生成関数
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

## 例

詳細な使用例については、Examples フォルダを参照してください。
