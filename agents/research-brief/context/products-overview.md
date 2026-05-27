# Agent Products — public overview

> Reference document describing the agent product line at Clockchain. **Public-safe wording only** — no internal KR targets, no internal dates, no unannounced features, no internal codenames. The brief generator uses this file to tie weekly research back to product direction without leaking anything beyond what is appropriate to discuss in public.
>
> **Yang reviews this file before any brief runs to confirm the redaction boundary.** If a future brief is heading somewhere that requires sharper detail than this file allows, write less rather than push past the boundary.

---

## The thesis in one sentence

Autonomous agents are entering production faster than the trust infrastructure to govern them. Clockchain is the cryptographic notary layer that turns agent action logs from "trust the observability vendor" into **court-admissible, regulator-grade evidence** anchored to a court-proof timestamp.

The agent product line is the developer surface for that thesis.

---

## What Clockchain actually ships beneath the agent products

The agent products sit on two underlying capabilities of the Clockchain network. Briefs should never describe these in proprietary detail, but the synthesis should know they exist so the tie-back is technically grounded.

### Customer-dedicated subnets

Each enterprise customer gets a dedicated execution environment operated by a subset of staked nodes — a subnet. Their logs never touch mainnet; only a periodic cryptographic fingerprint (a single hash) of the customer's accumulated log history is committed to mainnet. The subnet runs Byzantine-fault-tolerant consensus within itself. The architecture lets one customer push tens of millions of timestamped log events per day without congesting the public ledger or exposing their data.

The implication for the product line: every Product B receipt the customer generates lands in their own subnet. The subnet handles execution; mainnet handles proof. Customer data privacy is preserved by construction.

### Five-layer court-admissible audit chain

Every Clockchain timestamp is the product of an independent, verifiable five-layer chain of evidence:

1. **Random validator election** via a Verifiable Random Function — nobody chooses who validates a given event.
2. **Multiple physical time sources** — GPS satellites, national atomic clocks, NTP servers operated by independent institutions.
3. **Independent time computation** by each validator on its own infrastructure.
4. **Two-thirds-supermajority validator consensus** before any timestamp is finalised.
5. **Permanent ledger record**, cryptographically linked to every prior block.

This architecture meets or exceeds the evidentiary requirements of eIDAS qualified timestamps, RFC 3161 trusted timestamping, ISO/IEC 18014 timestamping services, the US ESIGN Act / UETA, and the UK Electronic Communications Act 2000. A court-appointed expert can verify any receipt by downloading the public ledger and recomputing the hashes — no trust in Clockchain as a company is required.

This is the differentiator vs. every existing agent observability stack: LangSmith, Helicone, Phoenix, Datadog APM-for-agents, OpenLLMetry, and Arize all **capture** agent traces, but the logs remain stored with the vendor and trusted by inference. Clockchain replaces that vendor trust with cryptographic proof.

---

## Product A — Agent Notarized Identity

> **Branding note:** As of baseline v0.2 (2026-05-26), this product is called **Agent Notarized Identity**, not "Birth Certificate." Identity Digital's DNSid (April 2026) already claims "birth certificate for AI agents" as their category language; the [competitive landscape brief](../../../src/data/briefs/2026-05-26-competitive-landscape-scan.json) lays out the full reasoning for the pivot.

**What it is.** A protocol for issuing, verifying, and revoking court-admissible cryptographic identity for autonomous agents. Each agent receives a Decentralized Identifier (DID) on chain — a *notarized* identity certified by an independent Clockchain validator quorum at the moment of birth, recording the agent's principal chain, delegated scope, capabilities, economic mandate, and revocation state. Smart contracts mint the certificate, attest to capabilities, and enable revocation when an agent goes rogue or is retired.

**The product question Product A answers.** *WHICH agent did this?*

**Why it matters.**

- Regulated industries cannot adopt agents without a tamper-evident record of which agent did what. Product A is the identity primitive that every audit record hangs off.
- Agent-to-agent commerce requires identity. Without it, agents cannot transact, sign, or be held accountable.
- Prompt-injection and impersonation attacks against agents become harder when every action is signed by a cryptographic identity, not a service-account token.
- The EU AI Act's transparency requirements (Article 13) and post-market monitoring (Article 72) need a stable identifier per deployed AI system. Product A is the natural binding for that identifier.

**Public surface to map weekly research against.**

- W3C DID specifications and method drafts (`did:web`, `did:key`, agent-specific DID methods).
- Attestation protocols — EAS (Ethereum Attestation Service), Verax, agent passport projects.
- ERC-8004 trustless agents, RNWY soulbound passports, Kite Agent Passport — direct competitors and reference designs.
- Agent rights frameworks (Story Protocol, on-chain agent permissions).
- World ID AgentKit and other human-attested agent provenance.
- Regulatory pressure on AI accountability — EU AI Act, MITRE ATLAS, SOC 2 for AI, NIST AI RMF.

When a brief topic intersects any of those, the tie-back lands on Product A.

---

## Product B — Agent Notarized Receipt (delivered via the Clockchain Agent-SDK)

> **Branding note:** As of baseline v0.2 (2026-05-26), the product Clockchain sells is **Agent Notarized Receipt**, not "Smart Receipt." Microsoft's official AI agent documentation already uses "Cryptographic Receipts" as canonical vocabulary; the [competitive landscape brief](../../../src/data/briefs/2026-05-26-competitive-landscape-scan.json) lays out the full reasoning. The SDK is the **mechanism**; the Receipt is the **artifact** customers buy.

**What it is.** A court-admissible record of every meaningful agent action, witnessed by a Clockchain validator quorum, anchored to a multi-source Clockchain timestamp, and produced via the Clockchain Agent-SDK. External developers install the SDK, initialize it, and log their first notarized agent action in fewer than five lines of code. The SDK plugs into the host agent framework's existing callback/tracing surface and emits **signed, timestamped, validator-witnessed** receipts to the customer's Clockchain subnet for every LLM call, tool invocation, MCP call, and reasoning step.

**The product question Product B answers.** *WHAT did the agent do, and can you prove it stands up in a court of law?*

**Why it matters.**

- The SDK is the on-ramp. Most developers building agents will never touch the chain directly — they install a library, drop a few lines of code, and get verifiable provenance for free.
- The integration surface is where the agent-framework wars play out. Whichever SDK reaches first-class status inside LangChain (callback handler), AutoGPT, CrewAI, AutoGen, LlamaIndex, MCP, the Anthropic Agent SDK, and the OpenAI Agents SDK earns the default-position advantage.
- The SDK is the natural **anchor layer beneath existing observability vendors.** LangSmith, Helicone, Phoenix, Datadog APM, OpenLLMetry, and Arize already capture traces; the Clockchain SDK turns those captures into court-admissible records by emitting cryptographic anchors that reference the vendor's trace IDs. The two layers are complementary, not competitive.
- EU AI Act Article 12 (automatic logging) and Article 72 (post-market monitoring) require persistent, tamper-evident logs. The SDK is the cleanest way for any AI builder to satisfy those obligations without standing up a custom evidence pipeline.

**Public surface to map weekly research against.**

- Agent frameworks — LangChain (callback handlers), AutoGPT, CrewAI, AutoGen, LlamaIndex, Letta.
- Model Context Protocol (MCP) servers and the broader MCP ecosystem.
- Anthropic Agent SDK, Claude Code managed agents, OpenAI Agents SDK and Assistants API.
- Observability and tracing standards — OpenTelemetry semantic conventions for GenAI/agents, OpenLLMetry.
- Existing observability vendors — LangSmith, Helicone, Phoenix (Arize), Datadog APM-for-agents.
- Developer experience patterns — "five lines to first log" is the gold standard.

When a brief topic intersects any of those, the tie-back lands on Product B.

---

## Stretch product — Agent Credit System

**What it is.** A credit and reputation system for autonomous agents, built on top of Product A's identity infrastructure. Agents accumulate credit history through their on-chain action log; counterparties (humans, other agents, services) consult that history before transacting.

**Why it matters.** Agent-to-agent commerce is real and growing. The economic surface includes agent payments (x402, Coinbase agent payments, Skyfire), autonomous agent treasuries, agent-funded service consumption, and reputation-gated access. Without a credit primitive, agents either default to centralized custodial wallets or get stuck behind human approval for every transaction.

**Public surface to map weekly research against.**

- x402 payment standard and Foundation adoption.
- Coinbase agent payment products, Skyfire, agent-payment rails.
- Autonomous agent treasury patterns.
- Agent reputation systems and reputation-gated commerce.
- DAO-style governance applied to agent permissions.
- a16z's KYA (Know Your Agent) framing.

When a brief topic intersects any of those, the tie-back lands on Agent Credit System.

---

## Stretch product — Agent Smart Receipts

**What it is.** Verifiable, time-anchored receipts for individual agent-executed actions, packaged as standalone artifacts that can be presented to a regulator, auditor, or court. Each receipt cryptographically proves what an agent did, when it did it, under whose authority, and against which Product A identity — usable as compliance evidence, dispute resolution material, or input into automated audit systems.

**Why it matters.** Compliance regimes demand provable execution trails:

- EU AI Act high-risk systems (Article 12 + Article 72).
- SEC 17a-4 broker-dealer records.
- MiFID II transaction reporting (RTS 6 + RTS 22).
- HIPAA audit logs for healthcare AI.
- FDA Good Machine Learning Practice for clinical decision support.
- Sarbanes-Oxley Section 404 internal controls.
- SOC 2 Type II for AI processing.

Agent Smart Receipts turn a normally-ephemeral agent action into a permanent, regulator-grade artifact without bespoke instrumentation. The Receipt is the deliverable; Product B's SDK is what produces it; the customer's subnet is where it lives; mainnet is the anchor.

**Public surface to map weekly research against.**

- EAS attestation patterns and adoption.
- On-chain audit trails for AI outputs.
- Chainlink Functions for AI verification.
- ZK proofs of agent execution (zkML, verifiable inference).
- AI compliance and audit-trail requirements across regulated industries.
- eIDAS 2.0 qualified electronic signatures and qualified electronic seals for AI outputs.

When a brief topic intersects any of those, the tie-back lands on Agent Smart Receipts.

---

## Stretch organizational thread — AI-First Org

**What it is.** An internal commitment to turn Clockchain itself into an AI-first company by embedding autonomous agents into core internal workflows. The same patterns Clockchain ships externally (cryptographic identity, timestamped action logs, verifiable receipts) get used internally for engineering, ops, and research — Clockchain agents running Clockchain workflows on the Clockchain network.

**Why it matters in briefs.** Some weekly research topics surface broad-market patterns about how companies are absorbing agents into their internal stack. When those patterns are strong enough to inform the AI-first-org thread, the tie-back goes here. This is the smallest and most situational bucket — many briefs will skip it entirely.

**Public surface to map weekly research against.**

- Internal-agent adoption patterns at AI-native companies.
- Agent-driven engineering workflows (Claude Code, OpenHands, Cursor at scale).
- AI-first operating models and the org-design discourse around them.

When a brief topic intersects any of those, the tie-back can land on AI-First Org.

---

## How customers actually adopt this product line

The brief generator should keep three concrete customer archetypes in mind. The tie-back should name which archetype is most exposed to the week's findings.

### Archetype 1 — Agent orchestration platforms

LangChain (LangSmith), Anthropic (Agent SDK + Claude Code managed agents), OpenAI (Agents SDK + Assistants API), Microsoft (Agent 365), Salesforce (Agentforce), ServiceNow.

**The pitch:** "Your customers' compliance officers need court-admissible logs. Ship our Agent-SDK as a first-class integration and your enterprise tier can claim eIDAS-qualified evidentiary status overnight." The platform integrates the SDK; their customers' agents emit receipts; the platform charges a premium tier for the compliance feature.

### Archetype 2 — Products embedding agent SDKs

Notion (using Claude Code SDK to trigger Claude inside Notion), Linear AI, Slack AI, Cursor, Warp, productivity SaaS broadly.

**The pitch:** "When your product invokes an LLM or runs an agent, you assume liability for the agent's actions. The Clockchain SDK gives you a tamper-evident, court-admissible audit trail per invocation, automatically, without changing your product surface." The product embeds the SDK; the SDK emits receipts on the customer's subnet; the product's enterprise customers get audit-grade evidence without writing any compliance code.

### Archetype 3 — Cybersecurity and regulated verticals

Zyberpol-style SOCs, CrowdStrike Falcon Agent users, banks running internal agents, healthcare AI deployers, legal-tech automation buyers.

**The pitch:** "When your agent triages a security incident, prescribes a clinical decision, executes a trade, or drafts a legal action, you need cryptographic chain of custody — not vendor logs. Clockchain Smart Receipts are the artifact your compliance team and your lawyers actually need." The buyer is compliance, security, or legal — not engineering. The product is the Receipt format and the subnet residency story.

---

## How to use this file in a brief

- Two or three of the five buckets is the typical tie-back footprint per brief. You do not have to hit all five.
- The tie-back's **last sentence must propose a concrete next action** — a feature, an integration, a design-partner target, or a positioning move. Generic restatements of the thesis ("this validates Clockchain") are insufficient.
- Lead with the bucket that is most natural for the week's topic. If the brief is about LangSmith, Product B is the lead, with the anchor-layer framing. If the brief is about ERC-8004, Product A is the lead.
- Avoid mechanical "this maps to X" framing. Weave the tie-back into the natural argument of the section.
- Never reference timing, KR targets, internal milestones, or anything not on `clockchain.network` or in this file. If you find yourself wanting to say "Product A ships in Q3" — stop. Write something public-defensible instead.
