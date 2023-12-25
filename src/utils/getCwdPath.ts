const CONFIG_REGX = /genji\.config\.(js|ts|cts|mts|cjs|mjs)$/;

export function getCwdPath(path: string) {
  if (path.includes("genji.config")) {
    return path.replace(CONFIG_REGX, "");
  }

  return path;
}
