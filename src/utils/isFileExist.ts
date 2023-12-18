import fs from "fs";

export function isFileExist(path: string) {
  return fs.existsSync(path);
}
