import { LanguageModel, MarkdownMode } from "../utils/constant";

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

export interface MarkdownQuery {
  originFilename: string;
  targetFilename: string;
  fromLocale: string;
  toLocale: string;
  md: string;
  mode: MarkdownMode;
  onProgress?: (rest: any) => void;
}

export interface OptionType {
  config?: string;
  c?: string;
  [key: string]: any;
}

export interface EnvConfig {
  openAIKey: string;
  openAIBaseUrl: string;
}
