# Clockchain Research

> Voice-optimized research briefs on the intersection of agentic AI and verifiable time, plus a self-running agent that publishes a fresh brief every Tuesday and Friday.

---

## What this repo is

Two things in one Next.js app:

1. **A voice-readable research site** at `/brief` and `/brief/<slug>`. Each brief renders as prose so Gemini on a phone or Grok in a car reads the URL aloud cleanly.
2. **A self-running brief generator** at `agents/research-brief/`. An agent on a Mac Mini (with a laptop and a Claude Code cloud routine as fallbacks) produces one voice-optimized research brief twice a week, opens a PR, and Yang reads and merges from his phone.

Both are public artifacts. Vercel auto-deploys from `main`.

## Mission

Produce competitive and ecosystem intelligence for Clockchain's agent product line — on-chain agent identity (Product A), the Clockchain Agent-SDK (Product B), and the stretch products (agent credits, agent smart receipts, AI-first org) — in a format Yang can listen to on the go.

## Goals (priority order)

1. **Make agentic-AI plus blockchain research listenable on the go.** Briefs render as prose at `/brief/<slug>`, voice-friendly throughout.
2. **Eliminate manual research effort.** The packaged `last30days` skill plus the synthesis prompt produce publication-ready JSON without intervention.
3. **Compound editorial knowledge across runs.** Each successful brief teaches the next.
4. **Sharpen product execution.** Every brief includes a "What this means for our agent products" section.
5. **Survive operator absence.** Mac Mini primary; laptop and cloud routine are fallbacks. Vacation, dead Mini, or expired API credits should degrade gracefully — never silently.

## Expected outcomes (12-week horizon)

- Roughly twenty-four briefs published at `/brief/<slug>`, with the latest expanded at `/brief`.
- Zero manual research time beyond phone-merge of the auto-opened PR.
- Every brief ties back to Product A, Product B, or the stretch products.
- Topic rotation never repeats more than once in five briefs.
- Voice-readable end to end — eight-minute Gemini TTS budget per brief.
- Zero proprietary leaks — no internal roadmap, no KR targets, no non-public customer names.

## Strategic context

Clockchain (D4D Sàrl, Neuchâtel, Switzerland) is a verifiable-time blockchain protocol. Yang Tang is Head of AI Products, responsible for the trust layer that connects autonomous agents to the Clockchain network.

- **Product A — On-Chain Agent Identity & Cryptographic Birth Certificates.** DIDs for autonomous agents; smart contracts that mint, verify, and revoke agent certificates.
- **Product B — Clockchain Agent-SDK.** A packaging layer that abstracts network complexity. External developers integrate in fewer than five lines of code; first-class integrations target LangChain and AutoGPT.

Stretch products: agent credit system (built on Product A's identity infra), agent smart receipts, and the AI-first-org thread. This research system gives Yang weekly market-intelligence signal on every dimension that affects those products.

---

## Routes on the site

| Route | What's there |
|---|---|
| `/` | Minimal home — links to `/brief`. |
| `/brief` | Latest voice-optimized research brief expanded; older briefs linked as archive. |
| `/brief/<slug>` | Individual brief by slug. |

Other routes (`/companies`, `/synthesis`, `/markets`, `/research`) are deferred — addable later without restructuring.

## The brief generator

If you are an agent or a human operator picking up brief-generation duties, **start at [`agents/research-brief/README.md`](./agents/research-brief/README.md)**. That subdirectory is a complete, self-contained handoff package — operator manual, agent system prompt, task spec, voice guardrails, JSON schema, gold-reference brief, vendored research skill, run scripts, and a launchd plist for Tuesday/Friday scheduling on a Mac Mini.

The brief generator only references public Clockchain information — sourced from `clockchain.network` and public press. The agent never touches internal Clockchain repositories, Notion, Linear, or Slack.

## Repo layout

```
.
├── src/
│   ├── app/                         # Next.js routes — / /brief /brief/[slug]
│   ├── components/                  # BriefRenderer, BriefArchive
│   ├── data/briefs/*.json           # twice-weekly brief content
│   ├── lib/                         # brief loaders, validators
│   └── types/index.ts               # Brief interface
├── agents/
│   └── research-brief/              # self-contained brief-generator agent package
│       ├── README.md                #   operator manual + agent quickstart
│       ├── agent.md                 #   system-prompt persona
│       ├── task.md, style.md        #   task spec, voice guardrails
│       ├── context/                 #   public Clockchain + products context
│       ├── prompts/synthesize.md    #   research → JSON synthesis prompt
│       ├── schema/brief.schema.json #   JSON Schema for the Brief type
│       ├── examples/                #   gold-reference brief
│       ├── tools/last30days/        #   vendored research skill
│       ├── scripts/                 #   run-brief.sh, pick-topic.sh, open-pr.sh
│       ├── schedule/                #   launchd plist (Tue + Fri 7am PT)
│       └── config/                  #   env.example, topics.yaml
└── docs/superpowers/specs/          # design spec
```

## Schedule

`agents/research-brief/schedule/com.clockchain.research-brief.plist` runs `scripts/run-brief.sh` every **Tuesday and Friday at 7:00am America/Los_Angeles**. macOS launchd queues missed runs on wake.

## Local dev

```bash
pnpm install
pnpm dev                              # http://localhost:3000
```

Type-check + data validators:

```bash
npx tsc --noEmit
npx tsx src/lib/validate-data.ts
```

Deploy: `git push origin main` triggers Vercel auto-deploy.

## Owner

Built and operated by Kailor "Yang" Tang for Clockchain (D4D Sàrl).
