/**
 * Brief data loaders.
 * Uses Node.js fs for server-side data loading in the Next.js App Router.
 */

import * as fs from "fs";
import * as path from "path";
import type { Brief } from "@/types";

const DATA_DIR = path.join(process.cwd(), "src", "data");

function loadJsonDir<T>(subdir: string): T[] {
  const dir = path.join(DATA_DIR, subdir);
  if (!fs.existsSync(dir)) return [];

  return fs
    .readdirSync(dir)
    .filter((f) => f.endsWith(".json"))
    .map((f) => {
      const content = fs.readFileSync(path.join(dir, f), "utf-8");
      return JSON.parse(content) as T;
    });
}

// ─── Briefs (newest first) ──────────────────────────────────────

export function getAllBriefs(): Brief[] {
  return loadJsonDir<Brief>("briefs").sort((a, b) => {
    if (a.date !== b.date) return a.date < b.date ? 1 : -1;
    // Same-day comparison briefs should sort deterministically. Slug-desc puts
    // annotated follow-up briefs ahead of the original so /brief renders the latest.
    return (b.slug ?? "").localeCompare(a.slug ?? "");
  });
}

export function getBriefBySlug(slug: string): Brief | undefined {
  return getAllBriefs().find((b) => b.slug === slug);
}

export function getLatestBrief(): Brief | undefined {
  return getAllBriefs()[0];
}
