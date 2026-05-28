---
slug: roadmap-clark
title: Roadmap — Clark as the Definitive PM Assistant for AI Agents and Blockchain
dek: A working twelve-month roadmap that turns Clark from a brief generator into a compounding research-and-strategy engine, and helps Yang ship the category-defining products of the Agent Notary Layer.
date: 2026-05-27
version: v0.1
---

# Roadmap — Clark as the Definitive PM Assistant for AI Agents and Blockchain

> A working twelve-month roadmap that turns Clark from a brief generator into a compounding research-and-strategy engine, and helps Yang ship the category-defining products of the Agent Notary Layer.

## The vision in one paragraph

Clark exists to make Yang the most informed, most decisive, most ahead-of-curve product builder at the intersection of agentic AI and blockchain infrastructure. Today Clark is a brief generator with a knowledge base and a Slack interface. By the end of this roadmap, Clark is a compounding research-and-strategy engine that learns daily, discovers weekly, recommends monthly, and ships category-defining product artifacts quarterly — and Clockchain owns the term "Agent Notary Layer" the way Uber owns ride-hail, LangChain owns agent graphs, and Vercel owns frontend deploy.

## The category-defining bar

Three reference points define what "owning a category" looks like:

| Company | What they did | What Clockchain has to do |
|---|---|---|
| **Uber** | Shipped before robotaxi had a name. Owned the vocabulary by default. | Ship Agent Notarized Identity and Agent Notarized Receipt before the language fragments into ten phrases. *(Manifestos and specs v0.1 shipped 2026-05-26.)* |
| **LangChain** | Shipped the canonical primitive (agent graphs). Everyone integrates against it. | Ship the canonical Agent-SDK and Receipt schema. Every observability vendor, every agent framework, every regulated SaaS integrates against it. |
| **Vercel** | Shipped the developer experience for a layer everyone else was running poorly. | Ship the five-lines-to-first-notarized-action developer experience that makes Agent Notarized Identity feel inevitable. |

All three combined the same three pillars: knowledge that compounds, discovery that surprises, output that ships. The roadmap below maps to all three.

## Three pillars

1. **Knowledge that compounds.** Every brief makes Clark sharper at the next one. The corpus is treated as a living memory, not a list of artifacts.
2. **Discovery that surprises.** Clark surfaces patterns, gaps, and counter-positions Yang has not seen yet. It does not just summarize; it proposes.
3. **Output that ships.** Clark turns research into the public artifacts that define the category — manifestos, specs, deep-dive reports, customer playbooks, analyst briefings, conference talks.

## Phase 1 — Compounding learning loop (next 30 days)

**Goal**: every brief is sharper than the last because Clark remembers across briefs.

| Milestone | Description | Mechanism |
|---|---|---|
| M1 | **Monthly thesis-update brief.** Last Friday of each month, the brief generator runs a special pass that reads the last eight briefs and proposes specific edits to the manifestos, baseline, and inflection points. | New rotation track `thesis-update` in `topics.yaml`. New synthesis prompt variant in `prompts/synthesize-thesis-update.md`. |
| M2 | **Cross-brief pattern detection.** Clark maintains a `cross-brief-patterns.md` file with named patterns (e.g., "regulated buyers want compliance checkbox before crypto") and updates it as evidence accumulates across briefs. | New context file. Synthesis prompt instructed to update it. |
| M3 | **Weekly Yang feedback loop.** Saturday morning, Clark sends one structured question in Slack DM asking Yang to validate or correct the past week's tie-back recommendations. Yang's answers go to memory. | Hermes cron job, Saturday 9am PT. Stores Yang's answers in MEMORY.md. |
| M4 | **Source diversification.** Clark research expands beyond last30days to include arxiv papers, podcast transcripts (Latent Space, Lenny's, Acquired), curated X / Twitter threads, Hugging Face papers. | Extend `tools/last30days/` skill with new source adapters. Or add a parallel `tools/deeper-research/` for paper-grade sources. |
| M5 | **Deep-dive cycle.** Every two weeks, one brief is a 2x-length deep dive on a single subject — picked from the inflection points or the patterns file. Replaces a regular rotation slot. | Add `deep-dive` boolean field to topic config. Synthesis prompt allows extended length when true. |

**Success criteria for Phase 1**: 8+ briefs explicitly reference 2+ prior briefs by slug. 1+ inflection point resolved with cited evidence. Yang reports "Clark surfaced something I did not already know" at least weekly.

## Phase 2 — Active discovery and synthesis (30 to 90 days)

**Goal**: Clark generates novel framings, not just summaries.

| Milestone | Description | Mechanism |
|---|---|---|
| M6 | **Vertical deep dive — five-brief series.** One regulated vertical (finance, healthcare, legal, cyber, regulated SaaS) gets a five-brief sequence: use-case + customer-profile + competitor + standards + synthesis. | New rotation pattern `vertical-deep-dive-<n>` where N is the brief number in the sequence. Replaces normal rotation for five briefs. |
| M7 | **Quarterly state-of-the-category report.** Comprehensive document, NOT a brief, that maps the entire Agent Notary Layer landscape end-to-end. Becomes the public reference. | New artifact type `state-of-category-<YYYY-QQ>.md` in `docs/thesis/`. Clark drafts as a long-running task, Yang reviews and edits. |
| M8 | **Counter-positioning briefs.** For each direct competitor (DNSid, Microsoft, asqav, AgentMint, Traceprompt, Kiteworks, Truescreen, Luthor, Indicio, OpenAgents, DigiCert, SPIFFE), one brief on "how to win against this competitor." | New rotation track `counter-position-<competitor>`. Synthesis prompt variant focused on positioning, not market mapping. |
| M9 | **Customer persona deep dives.** Clark builds named personas from public content: "the CISO of a Tier-1 broker-dealer," "the head of platform at a Series-B agent observability startup," "the compliance lead at a Top-10 hospital network." Each persona has a what-they-buy framework. | New context file `customer-personas.md`. Updated quarterly. Briefs reference the relevant persona by name. |
| M10 | **Pattern-recognition memory.** Clark maintains `cross-brief-patterns.md` with named patterns. Each pattern lists supporting brief slugs as evidence. Patterns graduate to "validated" once cited in 3+ briefs. | Extension of M2. Synthesis prompt explicitly proposes pattern additions or graduations every brief. |

**Success criteria for Phase 2**: 1+ named industry pattern that Clark identified before any external publication. Yang quotes Clark in 3+ external conversations. 1+ customer persona Yang acts on (calls, emails, builds for).

## Phase 3 — Product-defining outputs (90 to 180 days)

**Goal**: Clark generates artifacts that define the category in the market.

| Milestone | Description | Mechanism |
|---|---|---|
| M11 | **Manifesto v1.0 published.** Both manifestos refined from v0.1 to v1.0 with six months of evidence. Voice-readable, regulator-grade, locked vocabulary. | Quarterly thesis-update process proposes diffs. Yang reviews and merges. |
| M12 | **Spec v1.0 RFC-grade.** Reference implementation guide engineering teams integrate against. Open enough that any team can read it and ship a compatible implementation. | Iterate from v0 specs based on AgentDash integration learnings + external feedback. |
| M13 | **AgentDash production integration.** Product A + Product B fully wired into AgentDash. Every CoS task dispatch mints an A1 birth certificate; every task completion emits a B5 receipt. Public case study. | Joint roadmap between clockchain-research and AgentDash. New section in agentdash-sister-product.md tracks integration milestones. |
| M14 | **First external design partner.** One named customer outside AgentDash deploys Products A and B in production. Reference customer for marketing. | Customer pipeline tracked in `docs/thesis/customer-pipeline.md`. Updated monthly. |
| M15 | **Industry analyst briefings.** Clark prepares the pitch decks for Gartner, Forrester, IDC. Yang takes the meetings. | Briefing templates in `docs/thesis/analyst-briefings/`. Clark drafts; Yang refines. |
| M16 | **Category map published.** Visual landscape with Agent Notary Layer named and positioned, surrounded by 12+ competitors, mapped to forcing functions and customer archetypes. Lives on the public site. | New page at `/category-map` on `clockchain-research.vercel.app`. Generated from `docs/thesis/category-map.md`. Refreshed quarterly. |
| M17 | **Reference customer playbook.** End-to-end documentation of what a SEC 17a-4 + EU AI Act + HIPAA customer deployment looks like — including subnet residency, Receipt format, retention, audit-export flow, regulator-readable evidence packet. | New artifact type in `docs/thesis/playbooks/`. One per regulatory regime. |

**Success criteria for Phase 3**: AgentDash + Clockchain integration live in production. 1+ paying customer outside AgentDash. 1+ analyst engagement on the calendar. Spec v1.0 has 3+ external implementations (or signed intent letters).

## Phase 4 — Category-defining presence (180 to 365 days)

**Goal**: "Agent Notary Layer" is the term the industry uses without being asked.

| Milestone | Description | Mechanism |
|---|---|---|
| M18 | **Conference and event presence.** At least one major Web3 + AI conference talk by Yang on the Agent Notary Layer. Slides, recording, follow-up artifacts public. | Conference pipeline tracked in `docs/thesis/speaking-pipeline.md`. Clark drafts talk outlines, Yang delivers. |
| M19 | **Press inflection.** At least 5 named industry publications use "Agent Notary Layer" without prompting in their coverage. | Press tracking via quarterly web search audit. Logged in `docs/thesis/press-mentions.md`. |
| M20 | **Standards influence.** Clockchain mentioned in NIST AI Agent Standards Initiative output, ISO/IEC working drafts, eIDAS 2.0 references, or W3C DID method registry as a reference implementation. | Standards body monitoring. Clark tracks proceedings and proposes engagement opportunities. |
| M21 | **Customer roster.** 10 named customers across 3 verticals (finance, healthcare, cyber as default first three). | Customer pipeline graduates to roster. Logos on the public site. |
| M22 | **Open-source the spec.** Spec v1.0 published as an open IETF-style document or W3C draft. Implementations from 3+ organizations. | Standards process kicked off in Phase 3. Goes public in Phase 4. |
| M23 | **Annual state-of-Agent-Notary-Layer report.** Published publicly. Becomes the industry reference. | Quarterly reports compound into annual. Published in 2027-Q1. |

**Success criteria for Phase 4**: "Agent Notary Layer" appears in 5+ unprompted external pieces. 1+ standards-body engagement. Yang stops having to explain the category — people already know.

## The mechanisms that make it work

These are the system changes the roadmap depends on. They are not the goal; they are the plumbing.

### New context files
- `docs/thesis/roadmap-clark-v0.md` (this file)
- `agents/research-brief/context/cross-brief-patterns.md` (Phase 1 M2)
- `agents/research-brief/context/customer-personas.md` (Phase 2 M9)
- `docs/thesis/state-of-category-<YYYY-QQ>.md` (Phase 2 M7, repeating)
- `docs/thesis/category-map.md` (Phase 3 M16)
- `docs/thesis/playbooks/<regulation>.md` (Phase 3 M17, one per regime)
- `docs/thesis/customer-pipeline.md` (Phase 3 M14)
- `docs/thesis/analyst-briefings/<analyst>.md` (Phase 3 M15)
- `docs/thesis/speaking-pipeline.md` (Phase 4 M18)
- `docs/thesis/press-mentions.md` (Phase 4 M19)

### New rotation tracks
- `thesis-update` (monthly Friday)
- `vertical-deep-dive-<vertical>-<n>` (one vertical at a time, 5 briefs)
- `counter-position-<competitor>` (12 competitors)
- `deep-dive-<topic>` (bi-weekly long briefs)

### New synthesis prompts
- `prompts/synthesize-thesis-update.md` (reads last 8 briefs)
- `prompts/synthesize-deep-dive.md` (extended length)
- `prompts/synthesize-counter-position.md` (positioning frame)
- `prompts/synthesize-state-of-category.md` (quarterly long-form)

### New cron jobs
- Saturday 9am PT — Yang weekly feedback question
- Last Friday of month — thesis-update brief
- First Friday of quarter — state-of-category report kickoff

### New sources
- arxiv API (paper-grade research)
- Podcast transcript fetch (Latent Space, Lenny's, Acquired, others)
- Curated X/Twitter Tier-1 list (industry analysts, researchers, founders)
- Hugging Face papers (filtered for relevant categories)
- GitHub releases watch (key competitors + standards bodies)

### Skill expansions
- `clockchain-product` skill stays — add references to each new context file as they ship
- New skill: `clockchain-pattern-detector` (Phase 1 M2)
- New skill: `clockchain-customer-personas` (Phase 2 M9)
- New skill: `clockchain-analyst-briefings` (Phase 3 M15)

## What Yang does this week

The roadmap above lives or dies on whether you greenlight specific moves now. Five concrete decisions for this week:

1. **Approve this roadmap as v0.1.** Merge the PR or surface specific edits. Without commit, none of the downstream Phase 1 mechanisms get built.
2. **Pick the first vertical for the Phase 2 deep dive.** Default recommendation: **financial audit trails** because SEC 17a-4 has the sharpest enforcement clock and the SEC brief (PR #2) already establishes the wedge. Other defensible picks: cybersecurity (Zyberpol angle) or regulated SaaS internal agents (Salesforce / ServiceNow buyer).
3. **Greenlight the AgentDash integration alpha kickoff.** This is M13 in Phase 3, but its design needs to start now because every Phase 2 brief should be able to ask "how does this land in AgentDash."
4. **Pick the manifesto/spec v0.2 refinement target.** What is the single layer in A1-A6 or B1-B6 where Phase 1's research is most likely to refine the spec first? Default recommendation: **A1 Issuance Layer + B5 Receipt Minting Layer**, since Brief #4 already proposed economic-mandate and rights/payment fields and the AgentDash integration story depends on both.
5. **Confirm Saturday morning is the right slot for the weekly feedback loop.** Or pick a different time. Default 9am PT Saturdays.

## What Clark does next

Once the roadmap is approved, Clark executes Phase 1 milestones in order. The first artifact Clark ships under this roadmap will be the M2 `cross-brief-patterns.md` initial draft — analyzing the existing five briefs for repeated themes — followed by the M1 monthly thesis-update prompt and cron.

## Versioning

This roadmap is v0.1. It updates as the system learns. Material changes get a new version (v0.2, v0.3) with a changelog at the top. Minor edits get committed in place. Quarterly retrospectives bump the version.

## Maintainer

Yang Tang, Head of AI Products at Clockchain. Clark assists by drafting updates from research evidence and surfacing them as PRs against this file.
