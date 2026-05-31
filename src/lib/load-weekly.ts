import * as fs from "fs";
import * as path from "path";
import matter from "gray-matter";

export interface WeeklyDigest {
  slug: string; // e.g. "2026-05-29"
  date: string; // "2026-05-29"
  title: string; // from the H1
  dek: string; // the "one thing that changed" lead, cleaned
  content: string;
}

const WEEKLY_DIR = path.join(process.cwd(), "src/data/weekly");

function parse(file: string): WeeklyDigest | null {
  const full = path.join(WEEKLY_DIR, file);
  if (!fs.existsSync(full)) return null;
  const { content } = matter(fs.readFileSync(full, "utf-8"));
  const slug = file.replace(/-weekly\.md$/, "");

  const h1 = content.match(/^#\s+(.+)$/m);
  const title = h1 ? h1[1].trim() : `Clockchain Weekly — ${slug}`;

  // Lead line is like: *The one thing that changed our thinking this week:* <the real sentence>
  const lead = content.match(/^\*[^*]+\*\s*(.+)$/m);
  let dek = lead ? lead[1].trim() : "";
  if (!dek) {
    const para = content
      .split("\n")
      .map((l) => l.trim())
      .find((l) => l && !l.startsWith("#"));
    dek = para ? para.replace(/^\*+|\*+$/g, "").trim() : "";
  }

  return { slug, date: slug, title, dek, content };
}

export function getAllWeekly(): WeeklyDigest[] {
  if (!fs.existsSync(WEEKLY_DIR)) return [];
  return fs
    .readdirSync(WEEKLY_DIR)
    .filter((f) => f.endsWith("-weekly.md"))
    .map(parse)
    .filter((d): d is WeeklyDigest => d !== null)
    .sort((a, b) => (a.date < b.date ? 1 : -1)); // newest first
}

export function getWeeklyDigest(slug: string): WeeklyDigest | null {
  return parse(`${slug}-weekly.md`);
}
