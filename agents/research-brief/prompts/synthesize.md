# Synthesis Prompt — Research → Brief JSON

You are mid-pipeline in the Clockchain Research Brief generator. The mechanical scripts have already:

1. Picked a topic from `agents/research-brief/config/topics.yaml`.
2. Run the `last30days` skill against that topic.
3. Saved the raw research output to `~/Documents/Last30Days/<topic-slug>-raw.md`.

You now read that raw research file and produce one new brief JSON file. After you write it, the script will validate, branch, push, and open a PR.

## Inputs you must read before writing

1. **The raw research output**: `~/Documents/Last30Days/<topic-slug>-raw.md`. The path will be passed to you as an argument.
2. **The gold reference brief**: the seed brief in `agents/research-brief/examples/`. Match this voice and structure.
3. **The schema**: `agents/research-brief/schema/brief.schema.json`. Validate mentally as you write.
4. **The style rules**: `agents/research-brief/style.md`. Re-read every run.
5. **The Clockchain context**: `agents/research-brief/context/clockchain-overview.md` and `agents/research-brief/context/products-overview.md`. Public-safe wording only.
6. **The two most recent briefs**: list `src/data/briefs/`, sort descending, read the top two. Avoid repeating their topics or framings.

## Your output

A single new file at `src/data/briefs/<DATE>-<short-slug>.json` where:

- `<DATE>` is today's UTC date in `YYYY-MM-DD` format.
- `<short-slug>` is 2-5 lowercase-with-dashes words capturing the core thesis. Examples: `did-web-agent-passports`, `mcp-server-observability`, `x402-agent-payments-mainnet`, `eu-ai-act-agent-attestations`, `chainlink-functions-zkml`.

The `slug` field in the JSON must equal `<DATE>-<short-slug>` exactly.

## Required structure

```json
{
  "slug": "YYYY-MM-DD-short-slug",
  "title": "Voice-readable title under 90 chars — usually ends with em-dash clause",
  "dek": "One-sentence subhead framing the argument. UI text. Numerals OK.",
  "date": "YYYY-MM-DD",
  "dayOfWeek": "Tuesday" or "Friday",
  "readTimeMinutes": 7,
  "topic": "agent-identity-and-did",
  "tldr": "150-250 words of spoken-style prose. Short sentences. ONE IDEA PER SENTENCE. No bullets. No tables. Spell out numbers as words.",
  "sections": [
    { "heading": "...", "body": "Prose paragraphs only. 4-8 sentences. No bullets, tables, or numbered lists. Numbers spelled out as words." },
    ...
    { "heading": "What this means for our agent products", "body": "Mandatory LAST section. Tie findings back to Product A, Product B, the agent credit system, agent smart receipts, or AI-first org. Two or three buckets typical." }
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

1. **Identify the headline finding.** What is the single most important development across the research output? It usually leads the TL;DR.
2. **Group the supporting evidence into 3-4 themes.** Each theme becomes a section.
3. **Write the TL;DR first.** 150-250 words, spoken style. Numbers as words. Lead with the headline finding.
4. **Write each section in order.** Each opens with a topic sentence, then 4-8 prose sentences of evidence and reasoning. No bullets, no tables, no numbered lists in body copy.
5. **Write the mandatory "What this means for our agent products" section as the LAST section.** Tie the week's findings to Product A (Agent DID / Birth Certificates), Product B (Clockchain Agent-SDK), the agent credit system, agent smart receipts, or the AI-first-org thread. Use the core thesis ("verifiable time is the trust primitive for autonomous agents") naturally — vary the phrasing across briefs. Two or three of the five buckets is typical.
6. **Write `keyPoints`**: 3-5 declarative sentences. UI text — numerals OK.
7. **Write `nextUp`**: exactly 3 follow-up questions, each phrased as the user would speak them aloud.
8. **Pick `sources`**: 6-10 real URLs from the raw research that you actually drew from. Drop low-quality or marketing-heavy sources. Prefer protocol specs, vendor engineering blogs, a16z, analyst coverage, regulatory text, and primary research.
9. **Self-check before writing the file:**
    - TL;DR is 150-250 words.
    - All numbers in TL;DR and section bodies are spelled out as words.
    - No bullets, tables, or numbered lists in any `sections[].body`.
    - "What this means for our agent products" is the LAST section.
    - No internal Clockchain roadmap dates, KR targets, or non-public customer names anywhere in the brief.
    - 3 follow-up questions in `nextUp`, each phrased as a spoken question.
    - All 6-10 source URLs are real (not hallucinated).

## Common mistakes to avoid

- **Numerals in body text.** "30%" reads as "three zero percent" in TTS. Always "thirty percent".
- **Bullets in body.** Even when the source material is a list, convert to prose. "First… Second… Third…" reads naturally.
- **Generic conclusion.** Never write a "conclusion" or "summary" section that just restates the TL;DR. The "What this means for our agent products" section is the conclusion — make it specific and operational.
- **Repeating last week's framing.** Read the last two briefs first. If you find yourself reaching for "verifiable time is the trust primitive" because last week's brief used the exact same phrase, force yourself to find a fresh angle.
- **Leaking internal Clockchain detail.** No KR targets, no internal dates, no unannounced features, no non-public customer names. Public-safe content only.
- **Hallucinating URLs.** If a source URL is not in the raw research file, do not include it. The PR will be checked.

## When research is sparse

If the raw research file is short because of API failures (logged at the bottom of the file as `❌` markers), you can still produce a brief — just shorter:

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
