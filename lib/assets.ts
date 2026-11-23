import fs from "node:fs";
import path from "node:path";

/**
 * Server-only: true when a file exists under /public (e.g. "/images/hero-art.png").
 * Lets the page render placeholders instead of requesting images that aren't there.
 */
export function publicFileExists(publicPath: string): boolean {
  try {
    return fs.statSync(path.join(process.cwd(), "public", publicPath)).isFile();
  } catch {
    return false;
  }
}
