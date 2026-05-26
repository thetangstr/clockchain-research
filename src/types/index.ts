// Core types for the Clockchain Research brief platform.
// The synthesis prompt and JSON schema stay aligned with this TS interface.

export interface BriefSection {
  /** Section key — used for rendering logic / targeting */
  key?: string;
  /** Section title — rendered as h2 */
  title?: string;
  /** Section body — rendered as paragraphs (newline-split) */
  content?: string;
  /** Legacy/primary schema — used when title/content are absent. Synthesis writes these. */
  heading?: string;
  body?: string;
  /** Optional glossary entries for this section (term → definition) */
  glossary?: Record<string, string>;
}

export interface BriefSource {
  title: string;
  url: string;
}

export interface Brief {
  slug: string;         // e.g. "2026-05-26-agent-identity-and-did"
  title: string;
  dek: string;
  date: string;         // ISO date YYYY-MM-DD — sort key, newest first
  dayOfWeek: string;    // "Tuesday" | "Friday" (display only)
  readTimeMinutes: number;
  /** Topic track — one of the five keys in agents/research-brief/config/topics.yaml */
  topic?: string;
  /** Findings-first TL;DR. Lead with the key insight, spoken style, numbers as words. */
  tldr: string;
  /** When true, render as a brief-only card (no full article) on the index page. */
  briefAlso?: boolean;
  /** Prose sections. The mandatory "What this means for our agent products" tie-back
   * is the LAST section in this array, not a separate top-level field. */
  sections: BriefSection[];
  /** 3-5 short declarative sentences. UI-rendered; numerals OK. */
  keyPoints?: string[];
  /** Follow-up questions for the voice agent — exactly 3, phrased as spoken. */
  nextUp: string[];
  sources: BriefSource[];
}
