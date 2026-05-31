# Task — Generate a Research Brief

## What this task produces

A single JSON file at `src/data/briefs/YYYY-MM-DD-<short-slug>.json` matching the `Brief` interface in `src/types/index.ts` (also `schema/brief.schema.json`).

That file is rendered into a blog-style page at the Clockchain Research site by Next.js. The latest brief is fully expanded at the top of `/brief`; older briefs become archive entries. Each brief also gets its own deep-link page at `/brief/<slug>`.

## Why this exists

Yang Tang — Head of AI Products at Clockchain (D4D Sàrl) — wants twice-weekly voice-readable research briefs on the intersection of agentic AI and the Clockchain network that he can listen to on the go via Gemini on his phone or Grok in his car. The brief URL is the canonical source his Gemini "Clockchain Research Desk" Gem fetches and reads aloud.

## Cadence

Tuesday and Friday at 7:00am America/Los_Angeles. Scheduled by `schedule/com.clockchain.research-brief.plist` on a Mac Mini.

## Topic rotation

**`config/topics.yaml` is the source of truth.** The current rotation is sixteen topics across three buckets (it superseded the original five generic tracks). Pick one not covered in the last two briefs; `scripts/pick-topic.sh` automates this. If you pick manually, cross-check the two latest filenames in `src/data/briefs/`.

The three buckets, and how `synthesize.md` frames each:

1. **customer-profile** (~45%) — one specific company per brief (LangChain/LangSmith, Anthropic Agent SDK, OpenAI Agents SDK, OSS frameworks, observability vendors, embedded-agent products, AgentDash). Frame: what they do today → the compliance gap → where Clockchain plugs in → the buyer.
2. **use-case** (~30%) — one regulated vertical per brief (financial audit, healthcare, cybersecurity SOC, legal eDiscovery, regulated-SaaS internal agents). Frame: the evidentiary standard → state of the art → the gap an agent creates → the Clockchain product spec. The ranked priority across verticals lives in `context/industry-evaluation-framework.md`.
3. **standards-competitive** (~25%) — one law or competing product per brief (EU AI Act, eIDAS 2.0 / RFC 3161 / ISO-IEC 18014 / ESIGN, agent identity passports, agent economy, competitive landscape scans). Frame: the clock → the technical requirement → Clockchain's position → the forcing function.

## What "good" looks like

Match the gold reference seed brief in `examples/`:

- **Title** under 90 characters, ends with an em-dash phrase or descriptive clause.
- **Dek** is one sentence framing the brief's argument.
- **TL;DR** is 150-250 words of spoken-style prose. Short sentences. One idea per sentence. No bullets, no tables.
- **4-6 sections**, each with a short noun-phrase heading and 4-8 sentences of prose body. No bullets or tables in body.
- **`keyPoints`**: 3-5 short declarative sentences.
- **`nextUp`**: exactly 3 follow-up questions, each phrased as the user would speak it aloud.
- **`sources`**: 6-10 real URLs with descriptive titles.
- **Always include a "What this means for our agent products" section** as the LAST section. Per `synthesize.md` it must cite a Product A/B layer (A1–A6 / B1–B6), advance one inflection point, map to AgentDash when relevant, and end with a concrete "The right next move is…" action. Tie findings to Agent Notarized Identity (Product A), Agent Notarized Receipt (Product B), the agent credit system, agent smart receipts, or the AI-first-org thread.

## Voice rules

See `style.md`. Summary: spoken style, no bullets in body, spell out numbers in TL;DR and body.

## What success looks like operationally

- The PR validates clean (`npx tsc --noEmit` and `npx tsx src/lib/validate-data.ts`).
- The PR opens automatically with a populated body (topic, TL;DR, three follow-up questions, deploy note).
- Yang reads the PR notification on his phone, taps merge, and Vercel auto-deploys within sixty seconds.
- The next morning's commute is spent listening to the brief via the Gemini Gem.

## What success does NOT look like

- A brief that reads like marketing copy or a press release.
- A brief that repeats last week's topic.
- A brief whose body sections contain bullet points, numbered lists, or tables.
- A brief whose TL;DR uses numerals like "30%" or "$500M" — those read poorly in TTS.
- A brief that misses the "What this means for our agent products" section.
- A brief that references internal Clockchain roadmap, KRs, or non-public customer names.
- A PR that touches files outside `src/data/briefs/`.
