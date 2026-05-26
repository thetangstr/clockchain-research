# Clockchain Research — Brief Generator Design

> A self-running research brief system modeled on `thetangstr/mifal-research`, retargeted to the intersection of agentic AI and Clockchain's blockchain infrastructure.

**Status**: design approved, awaiting implementation plan
**Date**: 2026-05-26
**Owner**: Kailor Tang (Head of AI Products, Clockchain / D4D Sàrl)
**Source pattern**: [thetangstr/mifal-research](https://github.com/thetangstr/mifal-research) — method, depth, and brief format reused; content domain replaced.

---

## Mission

Produce one voice-optimized research brief twice a week, structured so Gemini on a phone or Grok in a car reads the URL aloud cleanly. Each brief is competitive and ecosystem intelligence for Yang Tang's two trust-layer products at Clockchain: **on-chain agent identity (Product A)** and the **Clockchain Agent-SDK (Product B)**, with stretch-goal coverage of agent credits and smart receipts.

The brief is the deliverable. The agent producing the brief is also a working dogfood of the Clockchain Agent-SDK pattern — autonomous agent logging timestamped actions to a versioned artifact (git), with cryptographic provenance via signed commits.

## Goals (priority order)

1. **Make agentic-AI + blockchain research listenable on the go.** Kailor consumes research in a car and on his phone. Briefs render as prose at `/brief/<slug>`, voice-friendly throughout.
2. **Eliminate manual research effort.** The packaged `last30days` skill (Reddit, X, YouTube, TikTok, Hacker News, Polymarket, Web) plus the synthesis prompt produce publication-ready JSON without intervention.
3. **Compound editorial knowledge across runs.** The synthesis agent learns Clockchain's voice and Yang's product-tie-back preferences over weeks; each successful brief teaches the next.
4. **Sharpen product execution.** Every brief includes a "What this means for our agent products" section mapping findings to Product A, Product B, the stretch products (agent credits, smart receipts), and the AI-first-org angle. The brief is direct intel for Yang's OKRs.
5. **Survive operator absence.** Mac Mini is primary; laptop and a Claude Code cloud routine are fallbacks. Vacation, dead Mini, or expired API credits should each degrade gracefully — never silently.

## Expected outcomes (12-week horizon after schedule goes live)

- **~24 briefs published** at `/brief/<slug>`, latest expanded at `/brief`.
- **Zero manual research time** beyond phone-merge of the auto-opened PR (target under 90 seconds per brief).
- **Every brief ties back** to Product A, Product B, or the stretch products. Tie-back is mandatory, not optional.
- **Topic rotation never repeats** more than once in five briefs, enforced by `scripts/pick-topic.sh`.
- **Voice-readable end-to-end** — eight-minute Gemini TTS budget, no awkward numerals in `tldr` / `sections[].body`.
- **Zero proprietary leaks** — no internal roadmap dates, no KR targets, no customer names beyond what's public on `clockchain.network`.
- **Archive is longitudinal evidence** of how the agent-identity / agent-SDK landscape is moving — useful for product strategy and external pitching.

## Strategic context

Clockchain (D4D Sàrl, Neuchâtel) is a verifiable-time blockchain protocol. Yang Tang is Head of AI Products, responsible for two trust-layer products at the intersection of agentic AI and the Clockchain network:

- **Product A — On-Chain Agent Identity & Cryptographic "Birth Certificates"**: DIDs for autonomous agents. Smart contracts for minting, verifying, and revoking agent certificates.
- **Product B — Clockchain Agent-SDK**: a packaging layer that abstracts network complexity. External developers initialize the SDK and log their first agent action in fewer than five lines of code. Integrations target LangChain and AutoGPT first.

Stretch products: **agent credit system** (built on Product A's identity infra) and **agent smart receipts**. Stretch operational goal: turn Clockchain itself into an AI-first startup by embedding autonomous agents into internal workflows.

This research system gives Yang weekly market-intelligence signal on every dimension that affects those products.

## Hard rules

- **No internal leaks.** Never reference unannounced product details, KR numerical targets, target dates beyond what's on `clockchain.network`, customer names beyond public ones, or internal team structure.
- **Never auto-merge PRs.** The agent opens the PR; Yang reviews and merges from phone or laptop.
- **Voice-readable body copy is non-negotiable.** Violation makes a brief unacceptable. Rules in `style.md`:
  - Prose only inside `sections[].body`. No bullets, no tables, no numbered lists.
  - Spell out numbers as words in `tldr` and `sections[].body` ("thirty percent", not "30%").
  - Em-dashes for natural pauses. Avoid parentheses and nested clauses.
  - Eight-minute Gemini TTS budget per brief.
- **Numerals are OK** in `keyPoints`, `sources`, and `dek` because those render as UI text, not TTS.
- **Every brief includes "What this means for our agent products."** No exceptions.

## Architecture

```
   ┌──────────────────────────────────────────────────────────────┐
   │ launchd  (Tue + Fri 7:00am PT,                               │
   │          schedule/com.clockchain.research-brief.plist)       │
   └─────────────────────────────┬────────────────────────────────┘
                                 │ executes
                                 ▼
   ┌──────────────────────────────────────────────────────────────┐
   │ scripts/run-brief.sh                                         │
   │   1. git pull origin main                                    │
   │   2. scripts/pick-topic.sh    (rotates across topics.yaml,   │
   │                                skipping last 2 briefs)       │
   │   3. tools/last30days/scripts/last30days.py "<topic>"        │
   │      (Reddit + X + YouTube + TikTok + HN + Polymarket + Web) │
   │   4. AGENT synthesis reads raw research +                    │
   │      prompts/synthesize.md + schema/brief.schema.json,       │
   │      writes src/data/briefs/<DATE>-<slug>.json               │
   │   5. npx tsc --noEmit && npx tsx src/lib/validate-data.ts    │
   │   6. scripts/open-pr.sh    (branch, commit, push, gh pr open)│
   └──────────────────────────────────────────────────────────────┘
```

Steps 1, 2, 3, 5, 6 are deterministic scripts. **Step 4 is the agent's job** — the synthesis prompt lives at `prompts/synthesize.md`.

## Repo layout (Approach B — brief-only Next.js shell)

```
clockchain-research/
├── README.md                                  # Project overview + links
├── package.json
├── next.config.ts
├── tsconfig.json
├── docs/superpowers/specs/                    # This file lives here
├── src/
│   ├── app/
│   │   ├── layout.tsx
│   │   ├── page.tsx                           # Minimal home — links to /brief
│   │   ├── brief/page.tsx                     # Latest brief + archive list
│   │   └── brief/[slug]/page.tsx              # Individual brief by slug
│   ├── components/
│   │   ├── BriefRenderer.tsx                  # Voice-friendly prose rendering
│   │   └── BriefArchive.tsx
│   ├── lib/
│   │   ├── load-briefs.ts                     # Read JSON files from data/briefs
│   │   └── validate-data.ts                   # Schema + type validation
│   ├── types/
│   │   └── index.ts                           # Brief interface
│   └── data/briefs/                           # Generated JSON briefs land here
└── agents/research-brief/
    ├── README.md                              # Agent + operator manual
    ├── agent.md                               # System prompt for the runtime agent
    ├── task.md                                # Task spec
    ├── style.md                               # Voice / TTS guardrails
    ├── context/
    │   ├── clockchain-overview.md             # Public Clockchain context only
    │   └── products-overview.md               # Product A + B + stretch (public-safe)
    ├── prompts/
    │   └── synthesize.md                      # Research → JSON synthesis prompt
    ├── schema/
    │   └── brief.schema.json                  # JSON Schema for Brief
    ├── examples/
    │   └── 2026-05-26-<seed-slug>.json        # Gold-reference brief
    ├── config/
    │   ├── topics.yaml                        # The five rotation tracks
    │   └── env.example                        # Required env vars
    ├── scripts/
    │   ├── run-brief.sh
    │   ├── pick-topic.sh
    │   └── open-pr.sh
    ├── schedule/
    │   └── com.clockchain.research-brief.plist
    └── tools/
        └── last30days/                        # Vendored from mifal-research
```

Routes scoped intentionally to `/` and `/brief*`. `/companies`, `/synthesis`, `/markets`, `/research` are deferred — addable later without restructuring.

## Five rotation tracks

Designed so each track directly feeds Product A, Product B, the stretch products, or the AI-first-org thread.

1. **agent-identity-and-did** — W3C DID specs, `did:web` / `did:key` / agent-specific DID methods, ENS-for-agents, attestation protocols (EAS, Verax), agent passport projects, cryptographic agent provenance research. *Feeds Product A.*
2. **agent-frameworks-and-sdks** — LangChain, AutoGPT, CrewAI, AutoGen, LlamaIndex, MCP servers, Anthropic Agent SDK, OpenAI Agents SDK; what observability/logging hooks each exposes and what's missing. *Feeds Product B integration surface.*
3. **on-chain-agent-economy** — Agent payments (x402, Coinbase agent payments, Skyfire), agent credit systems, smart receipts, autonomous agent treasuries, agent-to-agent commerce. *Feeds Objective 3 (stretch products).*
4. **blockchain-time-and-attestation** — Verifiable timestamps for AI outputs, on-chain audit trails, Chainlink Functions for AI verification, ZK proofs of agent execution, EAS attestation patterns, AI compliance audit-trail requirements. *Feeds the core thesis — where Clockchain time meets agentic AI.*
5. **agent-security-and-trust** — Agent-to-agent authentication, prompt-injection defenses tied to cryptographic identity, on-chain agent permissions, agent rights frameworks (Story Protocol), MITRE ATLAS, regulatory pressure on AI accountability (EU AI Act, SOC 2 for agents). *Feeds Product A's moat narrative.*

`scripts/pick-topic.sh` enforces "no repeat in the last two briefs" — same logic and config shape as mifal-research.

## Editorial tie-back (mandatory section)

Every brief ends with **"What this means for our agent products"**. The synthesis prompt instructs the agent to map each week's findings to one or more of:

- **Product A** (Agent DID / Birth Certificates) — what new identity standards, threats, or interop opportunities appeared.
- **Product B** (Clockchain Agent-SDK) — what integration surfaces, framework hooks, or DX expectations emerged.
- **Agent Credit System** (Obj 3.1 stretch) — what payment, credit, or reputation patterns are converging.
- **Agent Smart Receipts** (Obj 3.2 stretch) — what receipt, attestation, or audit patterns are maturing.
- **AI-First Org** (Obj 4 stretch) — when relevant, what internal-agent patterns from the broader market apply.

The tie-back is voice-friendly prose, not a checklist. Two or three of the five buckets per brief is typical — not all five every time.

## Voice / TTS guardrails (identical to mifal)

Codified in `style.md`. Highlights:

- Spoken style throughout body copy. Short declarative sentences. One idea per sentence.
- No bullets, no tables, no numbered lists inside `sections[].body`. Prose paragraphs only.
- Spell out numbers as words in `tldr` and `sections[].body`.
- Em-dashes are fine for natural pauses. Avoid parentheses and nested clauses.
- Always include "What this means for our agent products."
- Eight-minute Gemini TTS budget per brief.

If any of these are violated the brief is not acceptable. The whole point is voice readability.

## Schedule

`schedule/com.clockchain.research-brief.plist` runs `scripts/run-brief.sh` every **Tuesday and Friday at 7:00am America/Los_Angeles**. Identical pattern to mifal-research's plist, renamed and re-pathed. macOS launchd queues missed runs on wake.

## Execution paths

Three viable runtimes, in priority order:

1. **Mac Mini** (primary) — launchd schedule fires every Tue/Fri.
2. **Laptop** (manual fallback) — same package, `./agents/research-brief/scripts/run-brief.sh` on demand.
3. **Claude Code cloud routine** (passive fallback) — armed but disabled; re-enable from phone if Mini is unreachable for more than one missed run.

## Brief schema

Reuse mifal-research's `Brief` interface and JSON Schema exactly. Indicative shape (final field names mirror mifal's `src/types/index.ts`):

- `slug`, `date`, `title`, `dek`, `tldr`
- `topic` (one of the five track keys defined in `config/topics.yaml`)
- `keyPoints[]` (numerals OK; renders as UI text, not TTS)
- `sections[]` with `heading` + `body` (prose only — no bullets, tables, or lists inside body)
- `sources[]` with `title`, `url`, `publisher`, `date`

The mandatory "What this means for our agent products" tie-back is the **last section** in `sections[]`, not a separate top-level field — matches mifal's "What this means for MIFAL" pattern exactly.

`src/types/index.ts` and `agents/research-brief/schema/brief.schema.json` stay synchronized via `validate-data.ts`. The seed brief in `examples/` is the canonical instance.

## What "setup" means in concrete steps

1. **Scaffold the repo** at `/Volumes/home/Projects_Hosted/clockchain-research/` with all files in the layout above.
2. **Vendor the `last30days` skill** from mifal-research into `agents/research-brief/tools/last30days/`.
3. **Write `context/clockchain-overview.md`** from public sources (clockchain.network, public News articles).
4. **Write `context/products-overview.md`** with the public-safe version of Product A, Product B, and the stretch products. Yang reviews this file before any brief runs to confirm the redaction boundary.
5. **Write one seed brief** as the gold reference. Run the pipeline against the `agent-identity-and-did` track to produce `examples/2026-05-26-<slug>.json`. This brief is what every subsequent brief's voice and structure should match.
6. **Smoke-test** with `./agents/research-brief/scripts/run-brief.sh --dry-run`.
7. **Install the launchd plist**.
8. **First real run** opens a PR for Yang to review and merge.
9. **Vercel project setup** for auto-deploy on merge to `main`.

## Out of scope (deferred)

- `/companies` catalog page (deferred; can add later if research site needs to be richer).
- `/synthesis` cross-brief pattern page.
- `/markets` vertical breakdown.
- Auto-merging PRs.
- Cross-language briefs (English only for v1).
- Audio file generation (rely on Gemini/Grok URL reading; not generating MP3s).

## Open questions for implementation plan

- Vercel project naming and DNS — does Yang want a subdomain like `research.clockchain.network`, a separate domain, or a `*.vercel.app` only?
- Should the brief generator's git commit be signed with a Clockchain-owned signing key as a dogfood of cryptographic provenance? (Likely yes; defer to implementation plan.)
- Does the `agent-identity-and-did` seed brief topic need approval before generation, or pick any track from the five?
- Does Yang want a separate Vercel project, or reuse an existing Clockchain Vercel team?

---

**Next step**: invoke `superpowers:writing-plans` to turn this design into a step-by-step implementation plan.
