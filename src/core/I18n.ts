import pMap from "p-map";
import { merge } from "lodash-es";

import { TranslateLocale } from "./TranslateLocale";
import { TranslateMarkdown } from "./TranslateMarkdown";

import { calcToken } from "../utils/calcToken";
import { MarkdownMode } from "../utils/constant";
import { splitJsonToChunks } from "../utils/splitJsonToChunks";
import { mergeJsonFromChunks } from "../utils/mergeJsonFromChunks";

import type { LocaleObj } from "../types";
import { type GenjiI18nConfig } from "../types/config";

export interface I18nOptions {
  config: GenjiI18nConfig;
  openAIApiKey: string;
  openAIProxyUrl: string;
}

export interface onProgressProps {
  isLoading: boolean;
  maxStep: number;
  needToken?: number;
  progress: number;
  step: number;
}
export interface I18nTranslateOptions {
  filename?: string;
  entry: LocaleObj;
  from?: string;
  onProgress?: (props: onProgressProps) => void;
  target: LocaleObj;
  to: string;
}

export interface I18nMarkdownTranslateOptions
  extends Pick<I18nTranslateOptions, "filename" | "from" | "to" | "onProgress"> {
  md: string;
  mode: MarkdownMode;
}

export interface I18nWriteOptions extends I18nTranslateOptions {
  filename: string;
}

export interface I18nMarkdownWriteOptions extends I18nMarkdownTranslateOptions {
  filename: string;
}

export type TranslateResult =
  | {
      result: LocaleObj;
      tokenUsage: number;
    }
  | undefined;

export type TranslateMarkdownResult =
  | {
      result: string;
      tokenUsage: number;
    }
  | undefined;

export class I18n {
  private config: GenjiI18nConfig;
  private step: number = 0;
  private maxStep: number = 1;
  private translateLocaleService: TranslateLocale;
  private translateMarkdownService: TranslateMarkdown;
  constructor({ openAIApiKey, openAIProxyUrl, config }: I18nOptions) {
    this.config = config;
    this.translateLocaleService = new TranslateLocale(config, openAIApiKey, openAIProxyUrl);
    this.translateMarkdownService = new TranslateMarkdown(config);
  }

  async translateMarkdown(options: I18nMarkdownTranslateOptions): Promise<TranslateMarkdownResult> {
    return options.mode === MarkdownMode.STRING
      ? this.translateMarkdownByString(options)
      : this.translateMarkdownByMdast(options);
  }

  async translateMarkdownByString({
    md,
    to,
    onProgress,
    from
  }: I18nMarkdownTranslateOptions): Promise<TranslateMarkdownResult> {
    const prompt = await this.translateLocaleService.promptString.formatMessages({
      from,
      text: "",
      to
    });

    const splitString = await this.translateMarkdownService.genSplitMarkdown(md, JSON.stringify(prompt));

    this.maxStep = splitString.length;
    this.step = 0;

    if (splitString.length === 0) return;

    const needToken = splitString.length * calcToken(JSON.stringify(prompt)) + calcToken(JSON.stringify(splitString));

    onProgress?.({
      isLoading: true,
      maxStep: this.maxStep,
      needToken,
      progress: 0,
      step: 0
    });

    const translatedSplitString: string[] = await pMap(
      splitString,
      async (text) => {
        onProgress?.({
          isLoading: this.step < this.maxStep,
          maxStep: this.maxStep,
          needToken,
          progress: this.step < this.maxStep ? Math.floor((this.step / this.maxStep) * 100) : 100,
          step: this.step
        });
        const result = await this.translateLocaleService.runByString({
          from,
          text,
          to
        });
        if (this.step < this.maxStep) this.step++;
        return result;
      },
      { concurrency: this.config?.concurrency }
    );

    onProgress?.({
      isLoading: false,
      maxStep: this.maxStep,
      needToken,
      progress: 100,
      step: this.maxStep
    });

    const result = await this.translateMarkdownService.genMarkdownByString(translatedSplitString);

    return {
      result,
      tokenUsage: needToken + calcToken(JSON.stringify(translatedSplitString))
    };
  }

  async translateMarkdownByMdast({ md, ...rest }: I18nMarkdownTranslateOptions): Promise<TranslateMarkdownResult> {
    const target = await this.translateMarkdownService.genTarget(md);

    const translatedTarget = await this.translate({
      ...rest,
      entry: target,
      target: {}
    });

    if (!translatedTarget?.result) return;

    const result = await this.translateMarkdownService.genMarkdownByMdast(translatedTarget);

    if (!result) return;

    return {
      result,
      tokenUsage: translatedTarget.tokenUsage
    };
  }

  async translate({ entry, target, to, onProgress, from }: I18nTranslateOptions): Promise<TranslateResult> {
    const prompt = await this.translateLocaleService.promptJson.formatMessages({
      from,
      json: {},
      to
    });
    const splitJson = splitJsonToChunks(this.config, entry, target, JSON.stringify(prompt));

    this.maxStep = splitJson.length;
    this.step = 0;

    if (splitJson.length === 0) return;

    const needToken = splitJson.length * calcToken(JSON.stringify(prompt)) + calcToken(JSON.stringify(splitJson));

    onProgress?.({
      isLoading: true,
      maxStep: this.maxStep,
      needToken,
      progress: 0,
      step: 0
    });

    const translatedSplitJson: LocaleObj[] = await pMap(
      splitJson,
      async (json) => {
        onProgress?.({
          isLoading: this.step < this.maxStep,
          maxStep: this.maxStep,
          needToken,
          progress: this.step < this.maxStep ? Math.floor((this.step / this.maxStep) * 100) : 100,
          step: this.step
        });
        const result = await this.translateLocaleService.runByJson({
          from,
          json,
          to
        });
        if (this.step < this.maxStep) this.step++;
        return result;
      },
      { concurrency: this.config?.concurrency }
    );

    onProgress?.({
      isLoading: false,
      maxStep: this.maxStep,
      needToken,
      progress: 100,
      step: this.maxStep
    });

    const result = await merge(target, mergeJsonFromChunks(translatedSplitJson));

    return {
      result,
      tokenUsage: needToken + calcToken(JSON.stringify(translatedSplitJson))
    };
  }
}
