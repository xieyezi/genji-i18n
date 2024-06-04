import { RecursiveCharacterTextSplitter } from "@langchain/textsplitters";

import { calcToken } from "../utils/calcToken";
import { getSplitToken } from "../utils/splitJsonToChunks";
import {
  convertMarkdownToMdast,
  convertMdastToMarkdown,
  convertMdastToMdastObj,
  mergeMdastObj,
  pickMdastObj
} from "../utils/convertMarkdown";

import type { LocaleObj } from "../types";
import type { GenjiI18nConfig } from "../types/config";

export class TranslateMarkdown {
  mdast: any;
  entry: LocaleObj = {};
  config: GenjiI18nConfig;
  check: string[];
  private definition?: string;

  constructor(config: GenjiI18nConfig) {
    this.config = config;
    this.check = ["text", "yaml"].filter(Boolean) as string[];
  }
  async genTarget(md: string) {
    this.mdast = await convertMarkdownToMdast(md);
    this.entry = convertMdastToMdastObj(this.mdast, this.check);
    return pickMdastObj(this.entry);
  }
  async genMarkdownByMdast(target?: LocaleObj): Promise<string | undefined> {
    if (!target) return;
    const translatedMdast = mergeMdastObj({ entry: this.entry, mdast: this.mdast, target }, this.check);
    return convertMdastToMarkdown(translatedMdast);
  }

  async clearMarkdownString(md: string) {
    const definition: any[] = [];
    const mdast = (await convertMarkdownToMdast(md)) as any;
    mdast.children = mdast.children
      .map((node: any) => {
        if (node.type === "definition") {
          definition.push(node);
          return false;
        }
        return node;
      })
      .filter(Boolean);

    return {
      content: await convertMdastToMarkdown(mdast),
      definition: await convertMdastToMarkdown({
        children: definition,
        type: "root"
      })
    };
  }

  async genSplitMarkdown(md: string, prompt: string) {
    this.definition = "";
    const { content, definition } = await this.clearMarkdownString(md);
    this.definition = definition;
    const textSplitter = RecursiveCharacterTextSplitter.fromLanguage("markdown", {
      chunkOverlap: 0,
      chunkSize: getSplitToken(this.config, prompt),
      lengthFunction: (text) => calcToken(text)
    });
    return await textSplitter.splitText(content);
  }

  async genMarkdownByString(translatedMarkdown: string[]) {
    return [...translatedMarkdown, this.definition].join("\n\n");
  }
}
