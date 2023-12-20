import { join } from "path";

export const matchInputPattern = (filepaths: string[], suffix: string) => {
  return filepaths.map((filepath) => {
    if (filepath.includes("*") || filepath.endsWith(suffix)) {
      return filepath;
    }
    const globPattern = join(filepath, `**/*${suffix}`);
    return globPattern.replace(/\\/g, "/");
  });
};
