# Synthesis Prompt — Research → Brief JSON

You are mid-pipeline in the Clockchain Research Brief generator. The mechanical scripts have already:

1. Picked a topic from `agents/research-brief/config/topics.yaml`.
2. Run the `last30days` skill against that topic.
3. Saved the raw research output to `~/Documents/Last30Days/<topic-slug>-raw.md`.

You now read that raw research file and produce one new brief JSON file. After you write it, the script will validate, branch, push, and open a PR.

## What this brief is FOR

The brief exists to **drive product definition** for Clockchain's two trust-layer products (and two stretch products):

- **Product A — On-Chain Agent Identity & Cryptographic Birth Certificates.** Cryptographic proof of WHICH agent acted.
- **Product B — Clockchain Agent-SDK.** Cryptographic proof of WHAT the agent did, anchored to a court-admissible Clockchain timestamp on the customer's own subnet.
- **Stretch — Agent Credit System** and **Agent Smart Receipts.**

The thesis is: customers in regulated industries (and the agent platforms that serve them) cannot rely on logs stored with the observability vendor — they need cryptographic anchoring that survives EU AI Act audit, eIDAS qualification, and a court of law. Clockchain is the notary layer the observability stacks plug into.

Every brief should sharpen our answer to two questions:

1. **Who pays for this?** Name a specific company, use case, or regulator.
2. **What do we build?** Name a specific feature, integration shape, or SDK affordance.

Briefs that only describe the market without advancing those two answers are not useful. The tie-back section is mandatory and is the most important section.

## Inputs you must read before writing

1. **The raw research output**: `~/Documents/Last30Days/<topic-slug>-raw.md`. The path will be passed to you as an argument.
2. **The picked topic's bucket** in `agents/research-brief/config/topics.yaml`. Three buckets exist: `customer-profile`, `use-case`, `standards-competitive`. The bucket changes how you frame the brief — see below.
3. **The gold reference brief**: the seed brief in `agents/research-brief/examples/`. Match this voice and structure.
4. **The schema**: `agents/research-brief/schema/brief.schema.json`. Validate mentally as you write.
5. **The style rules**: `agents/research-brief/style.md`. Re-read every run.
6. **The product context** (load ALL of these — they are short and load-bearing):
   - `agents/research-brief/context/session-history.md` — **complete strategic narrative of how the system got to its current state.** This is the *why* behind every product decision. Read this FIRST every run.
   - `agents/research-brief/context/clockchain-overview.md` — public Clockchain capability surface.
   - `agents/research-brief/context/products-overview.md` — Product A (Agent Notarized Identity), Product B (Agent Notarized Receipt), stretch products, customer archetypes. Baseline v0.2 naming.
   - `agents/research-brief/context/product-baseline.md` — **current working layer breakdown for Product A (A1-A6) and Product B (B1-B6), version v0.2.** Every tie-back refers to specific layers by their letter+number identifier (e.g., "this sharpens B1 Capture Layer").
   - `agents/research-brief/context/inflection-points.md` — **the seven live strategic forks the research is trying to resolve.** Every brief must advance at least one inflection point with new evidence.
   - `agents/research-brief/context/agentdash-sister-product.md` — AgentDash is the design-partner-of-record. Every relevant brief asks "how would AgentDash absorb this finding?"
   - The two published manifestos at `docs/thesis/manifesto-agent-notarized-identity.md` and `docs/thesis/manifesto-agent-notarized-receipt.md` — match their voice. Use "Agent Notarized Identity" and "Agent Notarized Receipt" as the canonical product names. Use "Agent Notary Layer" as the category name. Do not use the legacy "Birth Certificate" or "Smart Receipt" framing except when explicitly discussing competitive positioning against Identity Digital DNSid or Microsoft's framing.
7. **The two most recent briefs**: list `src/data/briefs/`, sort descending, read the top two. Avoid repeating their topics or framings.

## Your output

A single new file at `src/data/briefs/<DATE>-<short-slug>.json` where:

- `<DATE>` is today's UTC date in `YYYY-MM-DD` format.
- `<short-slug>` is 2-5 lowercase-with-dashes words capturing the core thesis. Examples: `langsmith-anchoring-gap`, `sec-17a-4-agent-audit`, `eu-ai-act-article-12-clock`, `erc-8004-vs-clockchain-receipts`, `crewai-callback-integration`.

The `slug` field in the JSON must equal `<DATE>-<short-slug>` exactly.

## Bucket-aware framing

Read the picked topic's `bucket` field in `topics.yaml`. Frame the brief accordingly.

### Bucket: `customer-profile`

Pick one specific company or product. Walk through:

1. **What they do today.** Their current observability/audit approach — drawn from public docs, engineering blogs, SDK source, marketing pages.
2. **The gap.** What does EU AI Act Article 12 (automatic logging), Article 13 (transparency), Article 72 (post-market monitoring), and court-admissibility (eIDAS qualified timestamp) require that they cannot ship alone?
3. **Where Clockchain plugs in.** Callback handler? OpenTelemetry exporter? MCP middleware? Webhook receiver? Native SDK integration? Be specific about the surface.
4. **Buyer + pricing motion.** Who at the company would champion this — developer relations, compliance lead, CISO, head of platform? What would make them say yes?

The tie-back lands on a **concrete product action** — e.g., "Ship a LangChain callback handler v1 that emits signed timestamped events to a Clockchain subnet; target LangSmith BYOC customers as the first design partner."

### Bucket: `use-case`

Pick one regulated use case (financial audit, healthcare clinical decision, cybersecurity SOC, legal eDiscovery, regulated SaaS internal agents). Walk through:

1. **The evidentiary standard.** Cite the specific rule (SOX 404, SEC 17a-4, HIPAA audit log, MiFID II RTS 6, etc.) and what it requires of an automated-action record.
2. **The current state of the art.** How do incumbents solve it today — trust-based vendor logs, paper trails, manual review, none of the above?
3. **The gap an agent creates.** When the actor is a non-human agent, what part of the standard breaks or becomes ambiguous?
4. **The Clockchain product spec.** What would Product A + Product B need to look like to satisfy this standard end-to-end — fields on the receipt, retention period, subnet residency, integration with the customer's existing system of record?

The tie-back lands on a **product spec for this vertical** — e.g., "Smart Receipt v1 for SEC 17a-4 needs WORM-equivalent retention, broker-dealer DID registry integration, and a subnet anchored to a US-jurisdiction validator quorum."

### Bucket: `standards-competitive`

Pick one law, spec, or competing product. Walk through:

1. **The clock.** What is the enforcement or adoption window? Concrete dates and obligations.
2. **The technical requirement.** What does the standard or competitor implement, in cryptographic and operational terms?
3. **Clockchain's position.** Where does Clockchain meet, exceed, or differ from the requirement?
4. **The forcing function.** What is the specific moment when customers will be obligated to choose — and how does that translate to a sales motion for Product A or B?

The tie-back lands on a **positioning move** — e.g., "Publish a Clockchain-as-qualified-trust-service-provider whitepaper before the eIDAS 2.0 conformity assessment window opens in Q3 2026, and target two design-partner QTSPs to co-author it."

## Required structure

```json
{
  "slug": "YYYY-MM-DD-short-slug",
  "title": "Voice-readable title under 90 chars — usually ends with em-dash clause",
  "dek": "One-sentence subhead framing the argument. UI text. Numerals OK.",
  "date": "YYYY-MM-DD",
  "dayOfWeek": "Tuesday" or "Friday",
  "readTimeMinutes": 7,
  "topic": "<the topic key from topics.yaml>",
  "tldr": "150-250 words of spoken-style prose. Short sentences. ONE IDEA PER SENTENCE. No bullets. No tables. Spell out numbers as words.",
  "sections": [
    { "heading": "...", "body": "Prose paragraphs only. 4-8 sentences. No bullets, tables, or numbered lists. Numbers spelled out as words." },
    ...
    { "heading": "What this means for our agent products", "body": "Mandatory LAST section. End with one concrete next product action — a feature, an integration, a partnership, a positioning move. Specific, not generic." }
  ],
  "keyPoints": ["...", "...", "..."],
  "nextUp": [
    "Tell me more about ...",
    "Which of ... is ...",
    "What should change in ..."
  ],
  "sources": [
    { "title": "...", "url": "https://..." }
  ]
}
```

## Step-by-step synthesis

1. **Read the topic's `bucket` in topics.yaml.** Frame the brief per the bucket guidance above.
2. **Identify the headline finding.** What is the single most important development across the research output for this bucket's framing? It usually leads the TL;DR.
3. **Group the supporting evidence into 3-4 themes.** Each theme becomes a section.
4. **Write the TL;DR first.** 150-250 words, spoken style. Numbers as words. Lead with the headline finding.
5. **Write each section in order.** Each opens with a topic sentence, then 4-8 prose sentences of evidence and reasoning. No bullets, no tables, no numbered lists in body copy.
6. **Write the mandatory "What this means for our agent products" section as the LAST section.** This is where the brief earns its keep. The section MUST do three things:
    1. **Refine the baseline.** Cite at least one Product A or Product B layer by its identifier (A1-A6, B1-B6) and explain how this brief's evidence sharpens, extends, or challenges that layer's current definition in `product-baseline.md`.
    2. **Advance an inflection point.** Name one of the seven live inflection points from `inflection-points.md` and explain which side gained evidence in this brief and why. Phrase it explicitly: *"This advances Inflection Point N — <title> — toward the <side> side because…"*
    3. **Map to AgentDash.** When the topic plausibly applies, ask "how would AgentDash absorb this?" and answer in one or two sentences using the layer table in `agentdash-sister-product.md`. If the topic is clearly outside AgentDash's scope (e.g., a brief on FDA clinical-decision logs), state that explicitly in one sentence and move on.
    
    End with one sentence that begins **"The right next move is…"** and names a concrete action — a feature, integration shape, design-partner target, or positioning move.
7. **Write `keyPoints`**: 3-5 declarative sentences. UI text — numerals OK.
8. **Write `nextUp`**: exactly 3 follow-up questions, each phrased as the user would speak them aloud.
9. **Pick `sources`**: 6-10 real URLs from the raw research that you actually drew from. Drop low-quality or marketing-heavy sources. Prefer protocol specs, vendor engineering blogs, regulatory text, analyst coverage, and primary research.
10. **Self-check before writing the file:**
    - TL;DR is 150-250 words.
    - All numbers in TL;DR and section bodies are spelled out as words.
    - No bullets, tables, or numbered lists in any `sections[].body`.
    - "What this means for our agent products" is the LAST section AND ends with a concrete next-action sentence.
    - No internal Clockchain roadmap dates, KR targets, or non-public customer names.
    - 3 follow-up questions in `nextUp`, each phrased as a spoken question.
    - All 6-10 source URLs are real (not hallucinated).

## Common mistakes to avoid

- **Generic tie-back.** "This validates the Clockchain thesis" is not useful. Be specific: "Ship a LangChain callback handler" or "Target broker-dealers under SEC 17a-4 first." If you can't name a feature, integration, or buyer, the tie-back is too vague.
- **Numerals in body text.** "30%" reads as "three zero percent" in TTS. Always "thirty percent".
- **Bullets in body.** Even when the source material is a list, convert to prose. "First… Second… Third…" reads naturally.
- **Surveying the market when the bucket calls for a deep-dive.** Customer-profile briefs are about ONE company, not five. Use-case briefs are about ONE standard, not the whole regulated landscape.
- **Repeating last week's framing.** Read the last two briefs first. Force a fresh angle.
- **Leaking internal Clockchain detail.** No KR targets, no internal dates, no unannounced features, no non-public customer names.
- **Hallucinating URLs.** If a source URL is not in the raw research file, do not include it.

## When research is sparse

If the raw research file is short because of API failures (logged at the bottom of the file as `❌` markers), produce a shorter brief — but the tie-back still must name a concrete product action:

- 3 sections instead of 4-6 (still including the mandatory tie-back).
- 3 keyPoints.
- 4-6 sources.
- TL;DR can be 100-150 words.

Add a `## Notes` paragraph in the PR body listing which sources failed. Do not pad with speculation or generic content.

## After writing

Save the file. The script will then:

1. `python3 -c json.load` to confirm the JSON is well-formed.
2. `npx tsc --noEmit` to confirm TypeScript types are happy.
3. `npx tsx src/lib/validate-data.ts` to confirm existing entries still validate.
4. Branch, commit (single file only — `src/data/briefs/<DATE>-<slug>.json`), push, and open a PR via `gh pr create`.

If validation fails, the script will surface the error. Fix the JSON and re-run.

You are done when the PR URL prints. Do not auto-merge.
