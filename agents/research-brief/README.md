# Clockchain Research Brief Agent

> A self-contained agent package that generates voice-optimized research briefs every Tuesday and Friday and opens a pull request against this repository.
>
> **For the agent picking this up:** read this file end-to-end, then `task.md`, then `style.md`. After that you are ready to run `scripts/run-brief.sh`.

---

## Mission

Produce one new research brief twice a week, formatted so that **Gemini on a phone or Grok in a car can read the URL aloud cleanly**. Each brief is a single JSON file at `src/data/briefs/YYYY-MM-DD-<slug>.json` in this repository. Merging the PR triggers a Vercel auto-deploy; the brief becomes live at the Clockchain Research site within roughly sixty seconds.

## Goals

This package exists to solve five concrete goals, in priority order:

1. **Make agentic-AI + blockchain research listenable on the go.** Yang consumes research in a car and on his phone. The brief is structured as voice-readable prose so Gemini and Grok can read the published URL aloud without choking on tables, bullets, or unreadable numerals.
2. **Eliminate manual research effort.** A human should not need to run Reddit, X, YouTube, TikTok, Hacker News, Polymarket, or web searches by hand. The packaged `last30days` skill plus the synthesis prompt produce publication-ready JSON without intervention.
3. **Compound editorial knowledge across runs.** The synthesis agent gets sharper at Clockchain's voice and Yang's product-tie-back preferences over weeks. Each successful brief teaches the next.
4. **Sharpen product execution.** Every brief includes a "What this means for our agent products" section mapping findings to Product A (on-chain agent identity), Product B (Clockchain Agent-SDK), the stretch products (agent credits, agent smart receipts), and the AI-first-org angle. The brief is direct intel for Yang's OKRs.
5. **Survive operator absence.** Mac Mini is primary; laptop and a Claude Code cloud routine are fallbacks. Vacation, dead Mini, or expired ScrapeCreators credits should each degrade gracefully — never silently.

## Expected outcomes

Twelve weeks after the schedule is live on the Mac Mini, the following should be true:

- **Roughly twenty-four briefs published**, two per week (Tuesday + Friday), each at the production `/brief/<slug>` URL with the latest one expanded at `/brief`.
- **Zero manual research effort from Yang.** Time spent per brief is bounded by phone-merge time — target under ninety seconds.
- **Every brief includes a "What this means for our agent products" section** tying the week's findings back to Product A, Product B, the stretch products, or the AI-first-org thread.
- **Topic rotation never repeats more than once in five briefs**, enforced by `scripts/pick-topic.sh` reading the last two briefs.
- **Voice-readable end-to-end**: each brief plays cleanly through Gemini's TTS in eight minutes or less. No awkward numeral readings (always spelled out as words in body copy). No choppy bullet-list interruptions inside section bodies.
- **Zero proprietary leaks**: no internal roadmap dates, no KR targets, no customer names beyond what is already public on `clockchain.network`. Enforced by hard rules in `agent.md` and `context/clockchain-overview.md`.
- **The archive becomes longitudinal evidence** of how the agent-identity and agent-SDK landscape moves — useful for product strategy and external pitching.

## Strategic context

This is more than a research-distribution tool. It is the smallest possible end-to-end dogfood of the Clockchain Agent-SDK pattern — a self-running, scheduled agent producing public artifacts, with cryptographic provenance via signed git commits and timestamped actions in a versioned artifact.

Clockchain (D4D Sàrl, Neuchâtel) is a verifiable-time blockchain protocol. Yang Tang is Head of AI Products, responsible for the trust layer that connects autonomous agents to the Clockchain network. Two products anchor that work:

- **Product A — On-Chain Agent Identity & Cryptographic Birth Certificates.** DIDs for autonomous agents. Smart contracts that mint, verify, and revoke agent certificates.
- **Product B — Clockchain Agent-SDK.** A packaging layer that abstracts network complexity. External developers integrate in fewer than five lines of code. First-class integrations target LangChain and AutoGPT.

Stretch products: agent credit systems (built on Product A's identity infrastructure), agent smart receipts, and the AI-first-org thread (Clockchain itself running as an agent-native company internally).

## Hard rules for the brief agent

- **Public information only.** Never reference internal roadmap dates, KR numerical targets, sprint status, internal customer names, or anything not already published on `clockchain.network`.
- **Never auto-merge PRs.** Open them; Yang reviews and merges from phone or laptop.
- **Voice-readable body copy is non-negotiable.** See `style.md`. Prose only in `sections[].body`, numbers spelled out as words, em-dashes for natural pauses, eight-minute Gemini TTS budget.
- **Every brief includes "What this means for our agent products."** Mandatory last section. No exceptions.

If a brief topic naturally pulls toward proprietary territory, write less. A short public-defensible brief is always better than a leaky one.

## What you produce

A single file matching `Brief` in `src/types/index.ts` (also in `schema/brief.schema.json`). The seed brief in `examples/` is the gold reference for voice, length, and structure. Match it.

## Owner context

- **Operator**: Kailor "Yang" Tang.
- **Title**: Head of AI Products, Clockchain.
- **Company**: D4D Sàrl, Neuchâtel, Switzerland — the entity behind the Clockchain protocol.
- **Public surface**: `clockchain.network` (verifiable-time blockchain protocol, three products listed publicly: Logging/Auth/Timestamps, Smart Contract Scheduling, TimeStamp API; uses DePIN with Proof-of-Time; token `$CCTT`).

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

Steps 1, 2, 3, 5, 6 are deterministic scripts. **Step 4 is the agent's job** — the synthesis prompt is at `prompts/synthesize.md`.

---

## Quickstart for the human operator on the Mac Mini

```bash
# 0. Prereqs
brew install node pnpm python@3.12 yt-dlp gh jq
gh auth login                                       # paste GitHub PAT or browser flow

# 1. Clone the repo
git clone <repo-url> ~/clockchain-research
cd ~/clockchain-research

# 2. Install Next.js deps (so validators work)
pnpm install

# 3. Configure secrets
cp agents/research-brief/config/env.example agents/research-brief/.env
$EDITOR agents/research-brief/.env
chmod 600 agents/research-brief/.env

# 4. Smoke test (no push, no PR)
./agents/research-brief/scripts/run-brief.sh --dry-run

# 5. Real run (pushes branch + opens PR)
./agents/research-brief/scripts/run-brief.sh

# 6. Schedule
cp agents/research-brief/schedule/com.clockchain.research-brief.plist ~/Library/LaunchAgents/
launchctl load ~/Library/LaunchAgents/com.clockchain.research-brief.plist
launchctl list | grep clockchain                    # should show com.clockchain.research-brief
```

To unschedule: `launchctl unload ~/Library/LaunchAgents/com.clockchain.research-brief.plist`.

---

## Quickstart for the agent (Hermes, Claude Code, Codex, OpenClaw, etc.)

You are taking over operation of this package. Your job, summarized:

1. **Read these four files in order** before doing anything: this README, `task.md`, `style.md`, `context/clockchain-overview.md`, `context/products-overview.md`.
2. **Read the gold reference**: the seed brief in `examples/`.
3. **Read the schema**: `schema/brief.schema.json` (or the `Brief` interface in `src/types/index.ts`).
4. **Run `scripts/run-brief.sh`** when invoked by the schedule, or `./scripts/run-brief.sh --dry-run` for testing.
5. **When the script reaches the synthesis step**, read `prompts/synthesize.md` — that is your synthesis prompt. Read `~/Documents/Last30Days/<topic-slug>-raw.md` for the research output. Write the new brief JSON to `src/data/briefs/`. Do not touch anything outside that directory. Match the voice and structure of the gold reference exactly.
6. **DO NOT auto-merge PRs.** Open them; Yang reviews and merges from phone or laptop.

Voice/style guardrails (from `style.md`, listed here so you cannot miss them):

- Spoken style throughout body copy. Short declarative sentences. One idea per sentence.
- **No bullets, no tables, no numbered lists** inside `sections[].body`. Prose paragraphs only.
- Spell out numbers as words in `tldr` and `sections[].body`: "thirty percent" not "30%", "five hundred million" not "$500M". Numerals are OK in `keyPoints`, `sources`, and `dek` because those render as UI text, not TTS.
- Em-dashes are fine for natural pauses. Avoid parentheses and nested clauses.
- Always include a section titled **"What this means for our agent products"** as the LAST section. Tie research back to Product A, Product B, the agent credit system, agent smart receipts, or the AI-first-org thread. Two or three of those buckets per brief is typical; not all five every time.

If any of those are violated, the brief is **not acceptable**. The whole point is voice readability.

---

## Files in this package

| File | Purpose |
|------|---------|
| `README.md` | This file. Operator + agent manual. |
| `agent.md` | System-prompt-style framing for the runtime agent. |
| `task.md` | Detailed task spec — what the brief is, what the rotation looks like, success criteria. |
| `style.md` | Voice / TTS guardrails as a standalone rules document. |
| `context/clockchain-overview.md` | Public Clockchain context reference. Agent reads this; never reads internal repos. |
| `context/products-overview.md` | Public-safe overview of Product A, Product B, and the stretch products. |
| `schema/brief.schema.json` | JSON Schema for the `Brief` interface. |
| `examples/` | Gold-reference seed brief (written by the orchestrator on first run). |
| `prompts/synthesize.md` | Research → Brief JSON synthesis prompt. |
| `tools/last30days/` | Vendored research skill — Reddit, X, YouTube, TikTok, HN, Polymarket, Web. |
| `scripts/run-brief.sh` | Entry point. Orchestrates the full pipeline. Use `--dry-run` to skip push/PR. |
| `scripts/pick-topic.sh` | Reads last 2 briefs, picks an unused rotation track from `config/topics.yaml`. |
| `scripts/open-pr.sh` | Branches, commits the new JSON, pushes, opens a PR via `gh`. |
| `schedule/com.clockchain.research-brief.plist` | macOS launchd plist — Tue + Fri at 7am PT. |
| `config/env.example` | Required environment variables. Copy to `.env` and fill in. |
| `config/topics.yaml` | The five rotation tracks. Edit freely. |

---

## Topic rotation

Five tracks, defined in `config/topics.yaml`. The brief generator must pick a track that was **not** covered in the last two briefs.

1. **agent-identity-and-did** — W3C DID specs, did:web / did:key / agent DID methods, ENS-for-agents, attestation protocols (EAS, Verax), agent passport projects, cryptographic agent provenance. *Feeds Product A.*
2. **agent-frameworks-and-sdks** — LangChain, AutoGPT, CrewAI, AutoGen, LlamaIndex, MCP servers, Anthropic Agent SDK, OpenAI Agents SDK; what observability/logging hooks each exposes. *Feeds Product B integration surface.*
3. **on-chain-agent-economy** — Agent payments (x402, Coinbase agent payments, Skyfire), agent credit systems, smart receipts, autonomous agent treasuries, agent-to-agent commerce. *Feeds the stretch products.*
4. **blockchain-time-and-attestation** — Verifiable timestamps for AI outputs, on-chain audit trails, Chainlink Functions for AI verification, ZK proofs of agent execution, EAS attestation patterns, AI compliance audit-trail requirements. *Feeds the core Clockchain x agent thesis.*
5. **agent-security-and-trust** — Agent-to-agent authentication, prompt-injection defenses tied to cryptographic identity, on-chain agent permissions, Story Protocol agent rights, MITRE ATLAS, EU AI Act, SOC 2 for agents. *Feeds Product A's moat narrative.*

`scripts/pick-topic.sh` enforces the don't-repeat rule.

---

## Schedule

`schedule/com.clockchain.research-brief.plist` runs `scripts/run-brief.sh` every **Tuesday and Friday at 7:00am America/Los_Angeles**. macOS launchd queues missed runs by default — if the Mini is asleep at 7am, the run fires when it wakes. To verify after install:

```bash
launchctl list | grep clockchain
# expect: -    0    com.clockchain.research-brief
```

To trigger a manual run for testing without waiting for the schedule:

```bash
launchctl start com.clockchain.research-brief
# OR directly:
./agents/research-brief/scripts/run-brief.sh
```

---

## Auth setup

The Mac Mini needs:

1. **GitHub** — for `git push` and `gh pr create`. Recommended: SSH key.
2. **ScrapeCreators** — Reddit + TikTok + Instagram research.
3. **(Optional) X cookies** — better X coverage via `AUTH_TOKEN`/`CT0`.
4. **(Optional) Brave Search** — native web search instead of WebSearch tool.
5. **(Optional) Bluesky** — adds Bluesky as a source.
6. **(Optional) Anthropic API key** — only if your synthesis path calls Claude directly.

See `config/env.example` for the full variable list.

---

## Failure modes and what to do

- **`SCRAPECREATORS_API_KEY` returns 402**: credits exhausted. Top up. The generator will still produce a brief from WebSearch + YouTube + Polymarket; flag reduced sources in the PR body under `## Notes`.
- **X returns 404 from ScrapeCreators**: use cookie auth (`AUTH_TOKEN`/`CT0`) instead.
- **YouTube transcripts empty**: `brew upgrade yt-dlp`. Briefs are still publishable without transcripts.
- **`gh pr create` fails on auth**: the script still pushes the branch and prints the manual `gh pr create` command.
- **`npx tsc --noEmit` fails on the new JSON**: malformed brief. Fix the JSON, do not push. Cross-check against `schema/brief.schema.json`.
- **Topic rotation locked**: if the last 4 briefs cover all 5 tracks except one, the unused track is forced.
- **Mac Mini was off all week**: launchd fires on next wake. Only the next scheduled run fires — to backfill, run `./scripts/run-brief.sh` manually.

---

## Versioning

The `Brief` schema lives in `src/types/index.ts`. If you change it, keep `agents/research-brief/schema/brief.schema.json` in sync.

Old briefs do not need to be backfilled — Next.js still renders them as long as required fields exist.
