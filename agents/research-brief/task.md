# Task — Generate a Research Brief

## What this task produces

A single JSON file at `src/data/briefs/YYYY-MM-DD-<short-slug>.json` matching the `Brief` interface in `src/types/index.ts` (also `schema/brief.schema.json`).

That file is rendered into a blog-style page at the Clockchain Research site by Next.js. The latest brief is fully expanded at the top of `/brief`; older briefs become archive entries. Each brief also gets its own deep-link page at `/brief/<slug>`.

## Why this exists

Yang Tang — Head of AI Products at Clockchain (D4D Sàrl) — wants twice-weekly voice-readable research briefs on the intersection of agentic AI and the Clockchain network that he can listen to on the go via Gemini on his phone or Grok in his car. The brief URL is the canonical source his Gemini "Clockchain Research Desk" Gem fetches and reads aloud.

## Cadence

Tuesday and Friday at 7:00am America/Los_Angeles. Scheduled by `schedule/com.clockchain.research-brief.plist` on a Mac Mini.

## Topic rotation

Five tracks. Pick one that was **not** covered in the last two briefs.

1. **agent-identity-and-did** — W3C DID specs, did:web / did:key / agent-specific DID methods, ENS-for-agents, attestation protocols (EAS, Verax), agent passport projects, cryptographic agent provenance research. Feeds Product A.
2. **agent-frameworks-and-sdks** — LangChain, AutoGPT, CrewAI, AutoGen, LlamaIndex, MCP servers, Anthropic Agent SDK, OpenAI Agents SDK; what observability and logging hooks each exposes and what is missing. Feeds Product B's integration surface.
3. **on-chain-agent-economy** — Agent payments (x402, Coinbase agent payments, Skyfire), agent credit systems, smart receipts, autonomous agent treasuries, agent-to-agent commerce. Feeds the stretch products.
4. **blockchain-time-and-attestation** — Verifiable timestamps for AI outputs, on-chain audit trails, Chainlink Functions for AI verification, ZK proofs of agent execution, EAS attestation patterns, AI compliance audit-trail requirements. Feeds the core Clockchain x agent thesis.
5. **agent-security-and-trust** — Agent-to-agent authentication, prompt-injection defenses tied to cryptographic identity, on-chain agent permissions, agent rights frameworks (Story Protocol), MITRE ATLAS, regulatory pressure on AI accountability (EU AI Act, SOC 2 for agents). Feeds Product A's moat narrative.

`scripts/pick-topic.sh` automates the selection. If you pick manually, double-check by reading the two latest filenames in `src/data/briefs/`.

## What "good" looks like

Match the gold reference seed brief in `examples/`:

- **Title** under 90 characters, ends with an em-dash phrase or descriptive clause.
- **Dek** is one sentence framing the brief's argument.
- **TL;DR** is 150-250 words of spoken-style prose. Short sentences. One idea per sentence. No bullets, no tables.
- **4-6 sections**, each with a short noun-phrase heading and 4-8 sentences of prose body. No bullets or tables in body.
- **`keyPoints`**: 3-5 short declarative sentences.
- **`nextUp`**: exactly 3 follow-up questions, each phrased as the user would speak it aloud.
- **`sources`**: 6-10 real URLs with descriptive titles.
- **Always include a "What this means for our agent products" section** as the LAST section. Tie findings to Product A, Product B, the agent credit system, agent smart receipts, or the AI-first-org thread. Two or three of those buckets per brief is typical.

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
