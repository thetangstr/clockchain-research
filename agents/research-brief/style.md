# Style Guardrails — Voice + TTS Readability

These rules are not negotiable. Every brief is read aloud by Gemini on a phone or Grok in a car. Violations break the user's listening experience.

## Spoken style

- Short declarative sentences. One idea per sentence.
- Use natural spoken transitions: "first", "second", "and", "but", "the result is", "what changed".
- Avoid passive voice unless it reads naturally aloud.
- Avoid parenthetical asides and nested clauses. Prefer separate sentences.
- Em-dashes are fine — TTS pauses on them naturally.

## No lists in body copy

- **No bullet points** inside `sections[].body`.
- **No numbered lists** inside `sections[].body`.
- **No tables** inside `sections[].body`.
- Prose paragraphs only.
- Lists are allowed in `keyPoints`, `nextUp`, and `sources` because those render as UI elements, not TTS.

## Numbers as words

In `tldr` and `sections[].body`, spell out numbers as words:

- "thirty percent" not "30%"
- "five hundred million" not "$500M"
- "twenty twenty seven" not "2027"
- "ten thousand stars" not "10K stars"
- "one thousand percent" not "1000%"
- "two point eight five billion" not "$2.85B"

Numerals are OK in `dek`, `keyPoints`, `sources` (those are UI text, not TTS).

Exception: well-known acronyms and product names with numbers are fine ("GPT-4o", "MCP", "A2A protocol", "x402", "$CCTT").

## Quote handling

When citing a quote inside body copy, frame it with the word "quote" before and "end quote" after, so TTS can read it naturally:

> "Cloud 2.0 — the agentic cloud."

becomes:

> Cloudflare framed it as, quote, Cloud 2.0, the agentic cloud, end quote.

## Headings

- Short noun phrases or natural spoken cues.
- Examples: "What the last thirty days said", "Who owns which primitive right now", "What this means for our agent products", "What changed this week".
- Avoid generic headings like "Background" or "Conclusion".

## URLs and code

- Never put bare URLs inside body copy. URLs go in `sources` only.
- Never put code blocks or backticks inside body copy. Spell out commands as prose if needed: "the agent calls `gh pr create` to open the pull request" should become "the agent calls the GitHub pull request command to open the pull request."

## Mandatory section

Always include a section titled exactly **"What this means for our agent products"** as the LAST section. It must:

- Map the week's findings to one or more of:
  - **Product A** (Agent DID / Birth Certificates) — what new identity standards, threats, or interop opportunities appeared.
  - **Product B** (Clockchain Agent-SDK) — what integration surfaces, framework hooks, or DX expectations emerged.
  - **Agent Credit System** (stretch) — what payment, credit, or reputation patterns are converging.
  - **Agent Smart Receipts** (stretch) — what receipt, attestation, or audit patterns are maturing.
  - **AI-First Org** (stretch) — when relevant, what internal-agent patterns from the broader market apply.
- Two or three of those buckets per brief is typical — not all five every time.
- Reference the core thesis when natural: Clockchain is verifiable time meeting autonomous agents. The agent identity layer is the trust layer. The agent SDK turns that trust into developer-grade dependencies.

## Length targets

- `tldr`: 150-250 words.
- Sections: 4-6 total (including the mandatory tie-back).
- Each section body: 4-8 sentences.
- `keyPoints`: 3-5 items.
- `nextUp`: exactly 3 items.
- `sources`: 6-10 items.
- `readTimeMinutes`: realistic integer, 6-10 typical.

## "Ask me next" follow-ups

The 3 `nextUp` questions must be phrased exactly as the user would speak them aloud to a Gemini voice agent. Examples:

- "Tell me more about how cryptographic agent identity changes the Product A roadmap."
- "Which agent framework should the Clockchain Agent-SDK target next and why."
- "What did this week's findings imply for the agent credit system."

Bad examples (do not use):

- "Agent identity roadmap analysis" — not a spoken question.
- "Agent SDK targeting" — not a spoken question.
- "Detailed competitive landscape review" — too generic, no spoken cadence.
