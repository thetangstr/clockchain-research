import * as fs from "fs";
import * as path from "path";
import matter from "gray-matter";

export interface Manifesto {
  slug: string;
  title: string;
  dek: string;
  date: string;
  version: string;
  content: string;
}

const MANIFESTO_DIR = path.join(process.cwd(), "docs", "thesis");

export function loadManifestos(): Manifesto[] {
  if (!fs.existsSync(MANIFESTO_DIR)) return [];
  return fs
    .readdirSync(MANIFESTO_DIR)
    .filter((f) => f.startsWith("manifesto-") && f.endsWith(".md"))
    .map((f) => loadOneByFile(f))
    .filter((m): m is Manifesto => m !== null)
    .sort((a, b) => a.title.localeCompare(b.title));
}

export function loadManifesto(slug: string): Manifesto | null {
  const file = `manifesto-${slug}.md`;
  return loadOneByFile(file);
}

function loadOneByFile(file: string): Manifesto | null {
  const fullPath = path.join(MANIFESTO_DIR, file);
  if (!fs.existsSync(fullPath)) return null;
  const raw = fs.readFileSync(fullPath, "utf-8");
  const parsed = matter(raw);
  return {
    slug: String(parsed.data.slug ?? file.replace(/^manifesto-|\.md$/g, "")),
    title: String(parsed.data.title ?? "Untitled"),
    dek: String(parsed.data.dek ?? ""),
    date: String(parsed.data.date ?? ""),
    version: String(parsed.data.version ?? "v0.1"),
    content: parsed.content,
  };
}
