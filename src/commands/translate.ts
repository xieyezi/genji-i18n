import chalk from "chalk";
import minimist from "minimist";
//import { globSync } from "glob";
import { consola } from "consola";
import { relative, resolve } from "path";

import { I18n } from "../core/I18n";
//import { MARKDOWN_MODE } from "@/utils/constant";
import { isFileExist } from "../utils/isFileExist";
import { loadI18nConfig } from "../utils/loadI18nConfig";
//import { readMarkdown, writeMarkdown } from "@/utils/fs";
//import { matchInputPattern } from "@/utils/matchInputPattern";
//import { getDefaultSuffix } from "@/utils/getDefaultExtension";
import { getOpenAIKeyAndURL } from "../utils/getOpenAIKeyAndURL";

//import type { GenjiI18nConfig } from "@/types/config";

//const querys: any[] = [];

async function translateMarkdown() {
  consola.start("genji is analyzing your markdown... 🔍");

  const args = minimist(process.argv);
  console.log("args", args);
  const { config: configPath = process.cwd() } = args;

  if (!isFileExist(configPath)) {
    consola.error(`genji config file: ${configPath} does not exist.`);
    return;
  }

  const config = await loadI18nConfig(configPath);

  if (!config) {
    consola.error(`genji config file: ${configPath} does not exist.`);
    return;
  }

  console.log("config", config);

  const { openAIBaseUrl, openAIKey } = getOpenAIKeyAndURL();

  console.log("openAIBaseUrl", openAIBaseUrl);
  console.log("openAIKey", openAIKey);

  const i18n = new I18n({
    config,
    openAIApiKey: openAIKey,
    openAIProxyUrl: openAIBaseUrl
  });

  console.log("i18n", i18n);

  //const { entry, exclude = [], entrySuffix = ".md" } = config;

  //if (!entry || entry.length === 0) consola.error("no markdown entry was found.");

  //let markdownFiles = globSync(matchInputPattern(entry, ".md"), {
  //  ignore: matchInputPattern(exclude, ".md"),
  //  nodir: true
  //}).filter((file) => file.includes(entrySuffix));

  //if (!markdownFiles || markdownFiles.length === 0) {
  //  consola.error("No markdown entry was found.", true);
  //}

  //genMarkdownFilesQuery(config, markdownFiles);

  //if (querys.length > 0) {
  //  await runQuery(i18n, config);
  //} else {
  //  consola.success("no content requiring translation was found.");
  //}
  //consola.success("all i18n translate tasks have been completed!");
}

//async function runQuery(i18n: I18n, config: GenjiI18nConfig) {
//  const { model: modelName, temperature, experimental, entryLocale } = config;

//  consola.info(
//    `Current model setting: ${chalk.cyan(modelName)} (temperature: ${chalk.cyan(temperature)}) ${
//      experimental?.jsonMode ? chalk.red(" [JSON Mode]") : ""
//    }}`
//  );
//  let totalTokenUsage = 0;
//  for (const item of querys) {
//    const props = {
//      filename: item.filename,
//      from: item.from || entryLocale,
//      to: item.to
//    };

//    const data = await i18n.translateMarkdown({
//      ...item,
//      onProgress: (rest) => {}
//    });

//    const outputPath = relative(".", item.filename);
//    if (data?.result && Object.keys(data.result).length > 0) {
//      writeMarkdown(item.filename, data.result);
//      totalTokenUsage += data.tokenUsage;
//      consola.success(chalk.yellow(outputPath), chalk.gray(`[Token usage: ${data.tokenUsage}]`));
//    } else {
//      consola.warn("No translation result was found:", chalk.yellow(outputPath));
//    }
//  }
//  if (totalTokenUsage > 0) consola.info("Total token usage:", chalk.cyan(totalTokenUsage));
//}

//async function genMarkdownFilesQuery(config: GenjiI18nConfig, files: string[]) {
//  for (const file of files) {
//    try {
//      const md = readMarkdown(file);
//      for (const locale of config.outputLocales || []) {
//        const targetSuffix = getTargetSuffix(config, locale, file, md);
//        const targetFilename = getTargetFilename(config, file, targetSuffix);
//        if (isFileExist(targetFilename)) continue;
//        consola.info(`📄 To ${locale}: ${chalk.yellow(file)}`);

//        querys.push({
//          filename: targetFilename,
//          from: config.entryLocale,
//          md,
//          MARKDOWN_MODE,
//          to: locale
//        });
//      }
//    } catch {
//      consola.error(`${file} not found`, true);
//    }
//  }
//}

//function getTargetSuffix(config: GenjiI18nConfig, locale: string, filePath: string, fileContent: string) {
//  const { outputCustom } = config;
//  if (outputCustom) {
//    return outputCustom(locale, {
//      fileContent,
//      filePath,
//      getDefaultSuffix
//    });
//  }
//  return getDefaultSuffix(locale);
//}

//function getTargetFilename(config: GenjiI18nConfig, filePath: string, targetSuffix: string) {
//  const { entrySuffix = ".md" } = config;
//  return resolve(".", filePath.replace(entrySuffix, targetSuffix));
//}

export { translateMarkdown };
