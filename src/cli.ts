#!/usr/bin/env node

import { cac } from "cac";
import packageJson from "../package.json";
import type { OptionType } from "./types/config";

const cliName = packageJson.name;
const cliVersion = packageJson.version;
process.env.GENJI_I18N_VERSION = cliVersion;

const cli = cac(cliName);

cli.version(`${cliName} ${cliVersion}`);

cli
  .command("translate", "translate markdown")
  .option("-c, --config <config>", "genji config path")
  .action(async (options: OptionType) => {
    const { translateMarkdown } = await import("./commands/translate");
    return translateMarkdown(options);
  });

cli.help();
cli.parse();
