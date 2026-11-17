import fs from "node:fs";
import path from "node:path";
import { site } from "@/data/content";

/** True when the owner has added public/resume.pdf, so we never render a dead download link. */
export function hasResume(): boolean {
  const file = site.resume.replace(/^\//, "");
  return fs.existsSync(path.join(process.cwd(), "public", file));
}

/** True when the About photo exists in /public. */
export function hasFile(publicPath: string): boolean {
  if (!publicPath || publicPath.startsWith("[")) return false;
  if (/^https?:\/\//.test(publicPath)) return true;
  return fs.existsSync(path.join(process.cwd(), "public", publicPath.replace(/^\//, "")));
}
