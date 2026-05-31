import * as fs from "fs";
import * as path from "path";
import matter from "gray-matter";

export interface ResearchDoc {
  slug: string;
  title: string;
  dek: string;
  category: string;
  date: string;
  content: string;
}

// Curated manifest — controls exactly what appears in /research and how it's grouped.
// Title + dek here keep the index clean regardless of each doc's internal format.
interface Entry {
  slug: string;
  file: string; // path relative to repo root
  category: string;
  title: string;
  dek: string;
}

const ENTRIES: Entry[] = [
  {
    slug: "thesis-and-decisions",
    file: "docs/thesis/thesis-and-decisions.md",
    category: "Strategy & Decisions",
    title: "Thesis, Product Definition & Decisions",
    dek: "The cross-checked decision doc: the core bet, what the product is, and the decisions we can make now.",
  },
  {
    slug: "roadmap",
    file: "docs/thesis/roadmap-clark-v0.md",
    category: "Strategy & Decisions",
    title: "Roadmap — Defining the Agent Notary Layer",
    dek: "The twelve-month plan to turn the research into a category-defining product.",
  },
  {
    slug: "industry-rubric",
    file: "agents/research-brief/context/industry-evaluation-framework.md",
    category: "Frameworks & Rubrics",
    title: "Industry Evaluation Framework (the scoring rubric)",
    dek: "A six-axis rubric scoring fourteen verticals on need and winnability, with a recommended sequence.",
  },
  {
    slug: "inflection-points",
    file: "agents/research-brief/context/inflection-points.md",
    category: "Frameworks & Rubrics",
    title: "Inflection Points (the strategic forks)",
    dek: "The seven live strategic forks the research is trying to resolve — tracked and watched over time.",
  },
  {
    slug: "technical-foundations",
    file: "docs/thesis/technical-foundations-agent-registration.md",
    category: "Deep Research",
    title: "Technical Foundations — why time is the binding piece",
    dek: "How agent identity, receipts, and the blockchain marry — and why court-grade time is the differentiator.",
  },
  {
    slug: "orchestration-lifecycle-tokenflow",
    file: "docs/thesis/agent-orchestration-lifecycle-tokenflow.md",
    category: "Deep Research",
    title: "Orchestration, Lifecycle & Token Flow",
    dek: "The dynamic-system thesis: receipts as a stream, with token flow as the wedge.",
  },
  {
    slug: "vertical-cybersecurity-soc",
    file: "docs/thesis/deep-dive-cybersecurity-soc.md",
    category: "Vertical Deep-Dives",
    title: "Vertical — Cybersecurity & SOC Agents",
    dek: "The recommended beachhead: forcing functions, competitors, buyers, and the first move.",
  },
  {
    slug: "vertical-regulatory-reporting",
    file: "docs/thesis/deep-dive-regulatory-reporting.md",
    category: "Vertical Deep-Dives",
    title: "Vertical — Regulatory Reporting (Financial)",
    dek: "Biggest budget, sharpest rules, most crowded — the SEC 17a-4 wedge in detail.",
  },
  {
    slug: "vertical-legal-ediscovery",
    file: "docs/thesis/deep-dive-legal-ediscovery.md",
    category: "Vertical Deep-Dives",
    title: "Vertical — Legal & eDiscovery",
    dek: "Open whitespace and a literal Federal-Rules-of-Evidence fit.",
  },
  {
    slug: "spec-did-clockchain",
    file: "docs/thesis/spec-did-clockchain-v0.md",
    category: "Specs",
    title: "did:clockchain Method Specification v0.1",
    dek: "The signing-identity blueprint that closes the “which agent signed it” gap.",
  },
  {
    slug: "spec-agent-notarized-identity",
    file: "docs/thesis/spec-agent-notarized-identity-v0.md",
    category: "Specs",
    title: "Agent Notarized Identity — Spec v0",
    dek: "Product A: the six-layer identity model, end to end.",
  },
  {
    slug: "spec-agent-notarized-receipt",
    file: "docs/thesis/spec-agent-notarized-receipt-v0.md",
    category: "Specs",
    title: "Agent Notarized Receipt — Spec v0",
    dek: "Product B: the six-layer receipt model, end to end.",
  },
];

export const RESEARCH_CATEGORIES = [
  "Strategy & Decisions",
  "Frameworks & Rubrics",
  "Deep Research",
  "Vertical Deep-Dives",
  "Specs",
];

function deriveDate(content: string, fmDate: unknown): string {
  if (fmDate) return String(fmDate);
  const m = content.match(/\*\*Date:\*\*\s*([0-9]{4}-[0-9]{2}-[0-9]{2})/);
  return m ? m[1] : "";
}

function loadEntry(e: Entry): ResearchDoc | null {
  const full = path.join(process.cwd(), e.file);
  if (!fs.existsSync(full)) return null;
  const parsed = matter(fs.readFileSync(full, "utf-8"));
  return {
    slug: e.slug,
    title: e.title,
    dek: e.dek,
    category: e.category,
    date: deriveDate(parsed.content, parsed.data.date),
    content: parsed.content,
  };
}

export function getAllResearch(): ResearchDoc[] {
  return ENTRIES.map(loadEntry).filter((d): d is ResearchDoc => d !== null);
}

export function getResearchDoc(slug: string): ResearchDoc | null {
  const e = ENTRIES.find((x) => x.slug === slug);
  return e ? loadEntry(e) : null;
}
