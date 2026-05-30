# Clockchain Weekly Digest — Clark's Monday Job

**What this is.** Every Monday morning, Clark sweeps the whole agent + blockchain space and writes ONE plain-English digest that answers two questions — *what is the product* and *how do we go to market* — and names the one thing that changed our thinking this week. Clark posts it to Yang in Slack and saves it to the repo. This is separate from the twice-weekly voice briefs; this is the weekly product+GTM digest.

**Audience: Yang.** He reads it on his phone or listens in the car. **Plain English. No jargon. No acronym walls.** If you must name a technical thing, explain it in a few plain words right there. Research Yang can't understand has failed, no matter how thorough it is.

## The format (match the gold reference)

The gold reference is `examples/weekly-digest-gold-reference.md`. Match it:

- **Title:** `Clockchain Weekly — <Month Day>`
- **One headline line:** `The one thing that changed our thinking this week: ...`
- **Section — What we learned about the product** (3-5 plain points: what this week's news says about what we should build)
- **Section — What we learned about go-to-market** (3-5 plain points: who buys, why, how we reach them)
- **Section — What to watch next week** (2-3 points)
- About 250-400 words. Plain. Listenable.

## How to produce it

1. `cd ~/clockchain-research && git pull --ff-only origin main`.
2. **Sweep the whole space.** Run `last30days` and/or web search across these areas, looking for what actually moved this week:
   - Agent payments and money movement (x402, Skyfire, Kite, agent wallets, agent treasuries).
   - Agent identity and "which agent did it" (DIDs, agent passports, ERC-8004 and similar).
   - Agent orchestration (how agents are coordinated and hand off work — LangGraph, CrewAI, AutoGen, AgentDash-style chief-of-staff patterns).
   - AI regulation, especially around money (EU AI Act, FATF / anti-money-laundering, SEC, MiCA, the GENIUS Act).
   - Competitors — anyone building agent audit trails, agent identity, or "agent receipts."
3. **Read last week's digest** (newest file in `src/data/weekly/`) so this one BUILDS on it. Note what's new or what changed. Don't repeat last week.
4. **Stay grounded in what we've concluded.** Skim `context/session-history.md`, `context/products-overview.md`, and the latest reports in `docs/thesis/` (especially the orchestration/lifecycle/token-flow and technical-foundations reports). The standing thesis: the product is a stream of court-proof receipts for what agents do; the wedge is agent payments; the edge is trustworthy time.
5. **Write the digest** in the gold-reference format. Translate everything into plain language. Lead with the one thing that changed our thinking.
6. **Save** to `src/data/weekly/<YYYY-MM-DD>-weekly.md`.
7. **Post it to Yang in Slack** (the home channel) as the plain text.

## Hard rules

- Plain English. Always. If you wrote an acronym, explain it in the same sentence or cut it.
- Answer the two questions every week: what is the product, how do we go to market.
- Build on last week — the picture should sharpen over time, not restart.
- Be honest. If a finding is shaky, say "early signal" or "worth verifying." Never overstate.
- Use the canonical product names (Agent Notarized Identity, Agent Notarized Receipt, Agent Notary Layer) but always explained simply — "the ID badge," "the court-proof receipt," "the notary layer."
- Short. If it can't be read in ninety seconds, it's too long.
