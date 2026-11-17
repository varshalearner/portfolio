/**
 * Storage layer for the admin panel.
 *
 * - "github": when GITHUB_TOKEN + GITHUB_REPO are set, every save is a commit to
 *   the repository through the GitHub Contents API. Vercel's GitHub integration
 *   then redeploys the site. This is the mode to use in production because
 *   Vercel's filesystem is read-only.
 * - "local": otherwise, files are written straight to disk (perfect for
 *   `npm run dev` on your laptop; the dev server picks changes up instantly).
 */
import fs from "node:fs/promises";
import path from "node:path";
import { isSupabaseConfigured } from "@/lib/supabase";

export type StorageMode = "github" | "local";

export interface StorageInfo {
  /** Where site content (data/content.json) and file-based posts are saved. */
  mode: StorageMode;
  writable: boolean;
  repo?: string;
  branch?: string;
  reason?: string;
  /** Where blog posts and post images live. */
  posts: "supabase" | "files";
  /** True when posts can be saved: always with Supabase, otherwise same as `writable`. */
  postsWritable: boolean;
}

const ALLOWED_PREFIXES = ["content/blog/", "data/content.json", "public/blog/"];

function normalizePath(rel: string): string {
  const normalized = rel.replace(/\\/g, "/").replace(/^\.\//, "");
  const allowed = ALLOWED_PREFIXES.some((p) => normalized === p || normalized.startsWith(p));
  if (!allowed || normalized.includes("..") || normalized.startsWith("/")) {
    throw new Error(`Refusing to touch a path outside the content folders: ${rel}`);
  }
  return normalized;
}

function getFileStorageInfo(): Omit<StorageInfo, "posts" | "postsWritable"> {
  const token = process.env.GITHUB_TOKEN;
  const repo = process.env.GITHUB_REPO;
  const branch = process.env.GITHUB_BRANCH || "master";
  if (token && repo) return { mode: "github", writable: true, repo, branch };
  if (process.env.VERCEL) {
    return {
      mode: "local",
      writable: false,
      reason:
        "This deployment has no GITHUB_TOKEN / GITHUB_REPO environment variables. Vercel's filesystem is read-only, so files cannot be saved here. Add both variables in Vercel → Project → Settings → Environment Variables, then redeploy.",
    };
  }
  return { mode: "local", writable: true };
}

export function getStorageInfo(): StorageInfo {
  const files = getFileStorageInfo();
  const posts = isSupabaseConfigured() ? "supabase" : "files";
  return { ...files, posts, postsWritable: posts === "supabase" || files.writable };
}

/* ------------------------------------------------------------------ */
/* GitHub implementation                                               */
/* ------------------------------------------------------------------ */

interface GitHubFile {
  type: "file" | "dir" | "symlink" | "submodule";
  name: string;
  path: string;
  sha: string;
  size: number;
  encoding?: string;
  content?: string;
  download_url?: string | null;
}

function ghConfig() {
  const token = process.env.GITHUB_TOKEN as string;
  const repo = process.env.GITHUB_REPO as string;
  const branch = process.env.GITHUB_BRANCH || "master";
  return { token, repo, branch };
}

function ghUrl(rel: string): string {
  const { repo } = ghConfig();
  const encoded = rel.split("/").map(encodeURIComponent).join("/");
  return `https://api.github.com/repos/${repo}/contents/${encoded}`;
}

async function ghFetch(url: string, init: RequestInit = {}): Promise<Response> {
  const { token } = ghConfig();
  return fetch(url, {
    ...init,
    cache: "no-store",
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: "application/vnd.github+json",
      "X-GitHub-Api-Version": "2022-11-28",
      "User-Agent": "portfolio-admin",
      ...(init.headers ?? {}),
    },
  });
}

async function ghError(res: Response, action: string): Promise<Error> {
  let detail = "";
  try {
    const body = (await res.json()) as { message?: string };
    detail = body.message ?? "";
  } catch {
    // ignore
  }
  if (res.status === 401) detail = "GITHUB_TOKEN is invalid or expired.";
  if (res.status === 403 && !detail) detail = "GITHUB_TOKEN lacks write access to the repository contents.";
  if (res.status === 404 && !detail) detail = "Repository or branch not found. Check GITHUB_REPO and GITHUB_BRANCH.";
  return new Error(`GitHub ${action} failed (${res.status}): ${detail}`);
}

async function ghGet(rel: string): Promise<GitHubFile | GitHubFile[] | null> {
  const { branch } = ghConfig();
  const res = await ghFetch(`${ghUrl(rel)}?ref=${encodeURIComponent(branch)}`);
  if (res.status === 404) return null;
  if (!res.ok) throw await ghError(res, "read");
  return (await res.json()) as GitHubFile | GitHubFile[];
}

async function ghReadFile(rel: string): Promise<string | null> {
  const data = await ghGet(rel);
  if (!data || Array.isArray(data)) return null;
  if (data.encoding === "base64" && typeof data.content === "string") {
    return Buffer.from(data.content.replace(/\n/g, ""), "base64").toString("utf8");
  }
  if (data.download_url) {
    const res = await fetch(data.download_url, { cache: "no-store" });
    if (!res.ok) throw new Error(`GitHub raw download failed (${res.status})`);
    return res.text();
  }
  return null;
}

async function ghSha(rel: string): Promise<string | null> {
  const data = await ghGet(rel);
  if (!data || Array.isArray(data)) return null;
  return data.sha;
}

async function ghWriteFile(rel: string, content: string | Uint8Array, message: string): Promise<void> {
  const { branch } = ghConfig();
  const sha = await ghSha(rel);
  const base64 = Buffer.from(content).toString("base64");
  const res = await ghFetch(ghUrl(rel), {
    method: "PUT",
    body: JSON.stringify({ message, content: base64, branch, ...(sha ? { sha } : {}) }),
  });
  if (!res.ok) throw await ghError(res, "write");
}

async function ghDeleteFile(rel: string, message: string): Promise<void> {
  const { branch } = ghConfig();
  const sha = await ghSha(rel);
  if (!sha) return;
  const res = await ghFetch(ghUrl(rel), {
    method: "DELETE",
    body: JSON.stringify({ message, sha, branch }),
  });
  if (!res.ok) throw await ghError(res, "delete");
}

async function ghListDir(rel: string): Promise<string[]> {
  const data = await ghGet(rel);
  if (!data || !Array.isArray(data)) return [];
  return data.filter((f) => f.type === "file").map((f) => f.name);
}

/* ------------------------------------------------------------------ */
/* Local filesystem implementation                                     */
/* ------------------------------------------------------------------ */

function abs(rel: string): string {
  return path.join(process.cwd(), rel);
}

async function fsReadFile(rel: string): Promise<string | null> {
  try {
    return await fs.readFile(abs(rel), "utf8");
  } catch (err) {
    if ((err as NodeJS.ErrnoException).code === "ENOENT") return null;
    throw err;
  }
}

async function fsWriteFile(rel: string, content: string | Uint8Array): Promise<void> {
  const target = abs(rel);
  await fs.mkdir(path.dirname(target), { recursive: true });
  await fs.writeFile(target, content);
}

async function fsDeleteFile(rel: string): Promise<void> {
  try {
    await fs.unlink(abs(rel));
  } catch (err) {
    if ((err as NodeJS.ErrnoException).code !== "ENOENT") throw err;
  }
}

async function fsListDir(rel: string): Promise<string[]> {
  try {
    const entries = await fs.readdir(abs(rel), { withFileTypes: true });
    return entries.filter((e) => e.isFile()).map((e) => e.name);
  } catch (err) {
    if ((err as NodeJS.ErrnoException).code === "ENOENT") return [];
    throw err;
  }
}

/* ------------------------------------------------------------------ */
/* Public API                                                          */
/* ------------------------------------------------------------------ */

function assertWritable(): void {
  const info = getFileStorageInfo();
  if (!info.writable) throw new Error(info.reason ?? "Storage is read-only.");
}

export async function readFile(rel: string): Promise<string | null> {
  const p = normalizePath(rel);
  return getFileStorageInfo().mode === "github" ? ghReadFile(p) : fsReadFile(p);
}

export async function writeFile(rel: string, content: string | Uint8Array, message: string): Promise<void> {
  const p = normalizePath(rel);
  assertWritable();
  if (getFileStorageInfo().mode === "github") await ghWriteFile(p, content, message);
  else await fsWriteFile(p, content);
}

export async function deleteFile(rel: string, message: string): Promise<void> {
  const p = normalizePath(rel);
  assertWritable();
  if (getFileStorageInfo().mode === "github") await ghDeleteFile(p, message);
  else await fsDeleteFile(p);
}

export async function listDir(rel: string): Promise<string[]> {
  const p = normalizePath(rel.endsWith("/") ? rel : `${rel}/`);
  const dir = p.replace(/\/$/, "");
  return getFileStorageInfo().mode === "github" ? ghListDir(dir) : fsListDir(dir);
}

export async function fileExists(rel: string): Promise<boolean> {
  return (await readFile(rel)) !== null;
}
