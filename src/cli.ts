#!/usr/bin/env node

import fs from "fs";
import path from "path";
import { cac } from "cac";

const packagePath = path.resolve(__dirname, "../package.json");
const packageJson = JSON.parse(fs.readFileSync(packagePath, "utf-8"));
const cliName = packageJson.name;
const cliVersion = packageJson.version;

process.env.GENJI_I18N_VERSION = cliVersion;

const cli = cac(cliName);

cli.version(`${cliName} ${cliVersion}`);

cli
  .command("translate", "translate markdown")
  .option("--config <config>", "markdown config path")
  .action(async () => {
    const { translateMarkdown } = await import("./commands/translate.js");
    return translateMarkdown();
  });

cli.help();
cli.parse();
