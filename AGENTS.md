# AGENTS.md

You are running inside the **Clockchain Research Brief Generator** repository.

Your full operating manual is at [`agents/research-brief/agent.md`](agents/research-brief/agent.md). Read that file first. It is short and self-contained.

## Quick reference

- Twice-weekly job: produce one voice-optimized research brief in JSON form and open a pull request against `main`.
- Tracks: see `agents/research-brief/config/topics.yaml`. Sixteen rotation topics across three buckets (customer-profile, use-case, standards-competitive). Do not repeat a topic covered in the last two briefs.
- Gold reference: `agents/research-brief/examples/2026-05-26-agent-identity-stack-takes-shape.json`. Match its voice, length, and structure.
- Schema: `agents/research-brief/schema/brief.schema.json`. Validate mentally as you write.
- Style: `agents/research-brief/style.md`. Re-read every run.
- **Strategic context (load ALL on every run):**
  - `agents/research-brief/context/session-history.md` — **the complete strategic narrative.** Read this FIRST.
  - `agents/research-brief/context/clockchain-overview.md` — public Clockchain capability surface.
  - `agents/research-brief/context/products-overview.md` — Product A (Agent Notarized Identity), Product B (Agent Notarized Receipt), stretches, customer archetypes.
  - `agents/research-brief/context/product-baseline.md` — v0.2 working layer breakdown (A1-A6, B1-B6).
  - `agents/research-brief/context/inflection-points.md` — seven live strategic forks; advance at least one per brief.
  - `agents/research-brief/context/agentdash-sister-product.md` — AgentDash as design-partner-of-record.
  - `docs/thesis/manifesto-agent-notarized-identity.md` and `docs/thesis/manifesto-agent-notarized-receipt.md` — published manifestos. Match voice. Use canonical names.

## Your loop (driven by Hermes cron at Tuesday + Friday 7am PT)

1. `cd ~/clockchain-research && git pull --ff-only origin main`
2. Pick the topic: `./agents/research-brief/scripts/pick-topic.sh` — returns a track key not used in the last two briefs.
3. Look up the topic title from `agents/research-brief/config/topics.yaml`.
4. Run the research: `python3 agents/research-brief/tools/last30days/scripts/last30days.py "<topic title>" --emit=compact --no-native-web --save-dir=$HOME/Documents/Last30Days`
5. Read the raw research file at `$HOME/Documents/Last30Days/<slug>-raw.md`.
6. Read `agents/research-brief/prompts/synthesize.md` — that is your synthesis prompt.
7. Synthesize the new brief and write it to `src/data/briefs/YYYY-MM-DD-<short-slug>.json`. The filename stem must equal the `slug` field exactly.
8. Validate: `npx tsc --noEmit && npx tsx src/lib/validate-data.ts`. Fix any errors.
9. Open the PR: `./agents/research-brief/scripts/open-pr.sh <path-to-new-brief>`.
10. Stop. **Do not auto-merge.** Yang reviews and merges from his phone.

## Hard rules (from `style.md`)

- Spoken style throughout body copy. Short declarative sentences. One idea per sentence.
- No bullets, no tables, no numbered lists inside `sections[].body`. Prose paragraphs only.
- Spell out numbers as words in `tldr` and `sections[].body`. Numerals are OK in `dek`, `keyPoints`, and `sources`.
- The LAST section must be titled exactly **"What this means for our agent products"** and tie back to Product A (Agent DID / Birth Certificates), Product B (Clockchain Agent-SDK), agent credit system, agent smart receipts, or AI-first-org thread.
- No internal roadmap dates, no KR numerical targets, no customer names beyond what is public on `clockchain.network`.
- Voice budget: eight minutes of Gemini TTS or less per brief.

## When research APIs fail

If `last30days` returns sparse output, the PR body flags it. Produce a shorter, more cautious brief based on whatever sources succeeded plus your own web search. Do not pad.

## Secrets

The brief generator reads `agents/research-brief/.env` for its credentials:
- `SCRAPECREATORS_API_KEY` (Reddit / TikTok / Instagram research)
- `GITHUB_TOKEN` (PR creation — alternative to `gh auth`)
- `BRAVE_API_KEY` (optional, native web search)
- `BSKY_HANDLE` / `BSKY_APP_PASSWORD` (optional, Bluesky source)

You inherit Hermes' own credentials (MiniMax for the LLM) automatically via the active profile.
