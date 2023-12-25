import ora from "ora";
import chalk from "chalk";
import { globSync } from "glob";
import { consola } from "consola";
import { resolve } from "path";

import { I18n, type onProgressProps } from "../core/I18n";
import { getCwdPath } from "../utils/getCwdPath";
import { MarkdownMode } from "../utils/constant";
import { isFileExist } from "../utils/isFileExist";
import { loadI18nConfig } from "../utils/loadI18nConfig";
import { readMarkdown, writeMarkdown } from "../utils/fs";
import { matchInputPattern } from "../utils/matchInputPattern";
import { getDefaultSuffix } from "../utils/getDefaultExtension";
import { getOpenAIKeyAndURL } from "../utils/getOpenAIKeyAndURL";
import type { GenjiI18nConfig, MarkdownQuery, OptionType } from "../types/config";

async function translateMarkdown(options: OptionType) {
  consola.start("genji is analyzing your markdown...");
  const configPath = options?.config || process.cwd();

  if (!isFileExist(configPath)) {
    consola.error(`genji config file: ${configPath} does not exist.`);
    return;
  }

  const root = getCwdPath(configPath);
  const config = await loadI18nConfig(configPath);

  if (!config) {
    consola.error(`genji config file: ${configPath} does not exist.`);
    return;
  }

  const { openAIBaseUrl, openAIKey } = getOpenAIKeyAndURL();

  const i18n = new I18n({
    config,
    openAIApiKey: openAIKey,
    openAIProxyUrl: openAIBaseUrl
  });

  //console.log("config:", config);

  const { entry, exclude = [], entrySuffix = ".md" } = config;

  if (!entry || entry.length === 0) {
    consola.error("no markdown entry was found.");
    return;
  }

  //console.log("root:", root);
  //console.log("include:", matchInputPattern(entry, ".md"));
  //console.log("exclude:", matchInputPattern(exclude, ".md"));

  const markdownFiles = globSync(matchInputPattern(entry, ".md"), {
    cwd: root,
    ignore: matchInputPattern(exclude, ".md"),
    nodir: true
  }).filter((file) => file.includes(entrySuffix || ".md"));

  //console.log("markdownFiles:", markdownFiles);

  if (!markdownFiles || markdownFiles.length === 0) {
    consola.error("no markdown files was found.");
    return;
  }

  const querys = genMarkdownFilesQuery(root, config, markdownFiles);

  if (querys.length > 0) {
    await runQuery(i18n, config, querys);
  } else {
    consola.success("no content requiring translation was found.");
  }
  consola.success("genji have been tarnlated all markdown files!");
}

async function runQuery(i18n: I18n, config: GenjiI18nConfig, querys: MarkdownQuery[]) {
  const { model: modelName, temperature, experimental } = config;

  consola.info(
    `current model setting: ${chalk.cyan(modelName)} (temperature: ${chalk.cyan(temperature)}) ${
      experimental?.jsonMode ? chalk.red(" [JSON Mode]") : ""
    }}`
  );
  let totalTokenUsage = 0;
  for (const item of querys) {
    const spinner = ora({
      text: `genji is translating ${chalk.bold.green(item.originFilename)} to ${chalk.bold.cyan(item.toLocale)}...`,
      color: "green"
    }).start();
    const data = await i18n.translateMarkdown({
      ...item,
      onProgress: (rest: onProgressProps) => {
        if (rest.progress === 100) {
          spinner.stop();
        }
      }
    });

    const outputPath = item.targetFilename;
    if (data?.result && Object.keys(data.result).length > 0) {
      writeMarkdown(item.targetFilename, data.result);
      totalTokenUsage += data.tokenUsage;
      consola.success(
        `genji tarnlate ${chalk.bold.green(item.originFilename)} to ${chalk.bold.cyan(item.toLocale)} success.`
      );
    } else {
      consola.warn("no translation result was found:", chalk.yellow(outputPath));
    }
  }
  if (totalTokenUsage > 0) consola.info("total token usage:", chalk.yellow(totalTokenUsage));
}

function genMarkdownFilesQuery(root: string, config: GenjiI18nConfig, files: string[]) {
  const querys: MarkdownQuery[] = [];

  for (const file of files) {
    const filePath = resolve(root, file).replace(/\\/g, "/");
    try {
      const md = readMarkdown(filePath);
      for (const locale of config.outputLocales || []) {
        const targetSuffix = getTargetSuffix(config, locale, filePath, md);
        const targetFilename = getTargetFilename(config, filePath, targetSuffix);

        if (isFileExist(targetFilename)) continue;
        querys.push({
          md,
          targetFilename,
          originFilename: filePath,
          fromLocale: config.entryLocale,
          toLocale: locale,
          mode: MarkdownMode.STRING
        });
      }
    } catch {
      consola.error(`${filePath} not found`);
    }
  }

  return querys;
}

function getTargetSuffix(config: GenjiI18nConfig, locale: string, filePath: string, fileContent: string) {
  const { outputCustom } = config;
  if (outputCustom) {
    return outputCustom(locale, {
      fileContent,
      filePath,
      getDefaultSuffix
    });
  }
  return getDefaultSuffix(locale);
}

function getTargetFilename(config: GenjiI18nConfig, filePath: string, targetSuffix: string) {
  const { entrySuffix = ".md" } = config;
  return filePath.replace(entrySuffix, targetSuffix);
}

export { translateMarkdown };
