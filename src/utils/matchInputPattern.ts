import { join } from "path";

export const matchInputPattern = (filepaths: string[], suffix: string) => {
  return filepaths.map((filepath) => {
    if (filepath.includes("*") || filepath.includes(suffix)) return filepath;
    return join(filepath, `**/*${suffix}`).replaceAll("\\", "/");
  });
};
