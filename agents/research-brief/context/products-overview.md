# Agent Products — public overview

> Reference document describing the agent product line at Clockchain. **Public-safe wording only** — no internal KR targets, no internal dates, no unannounced features, no internal codenames. The brief generator uses this file to tie weekly research back to product direction without leaking anything beyond what is appropriate to discuss in public.
>
> **Yang reviews this file before any brief runs to confirm the redaction boundary.** If a future brief is heading somewhere that requires sharper detail than this file allows, write less rather than push past the boundary.

---

## Why this product line exists

Clockchain is a verifiable-time blockchain protocol. The agent product line is the layer that connects autonomous AI agents to that network. Two products anchor the line; two stretch products extend it; a stretch organizational thread closes the loop.

The thesis is structural. Autonomous agents are entering production environments faster than the trust infrastructure to govern them. Without cryptographic identity, verifiable action logs, and time-anchored receipts, agents cannot be audited, paid, or held accountable. Clockchain ships the verifiable-time primitive; the agent products turn that primitive into developer-grade tools that any AI team can adopt.

---

## Product A — On-Chain Agent Identity & Cryptographic "Birth Certificates"

**What it is.** A protocol for issuing, verifying, and revoking cryptographic identity for autonomous agents. Each agent receives a Decentralized Identifier (DID) on chain — a "birth certificate" that proves provenance, ownership, and policy scope. Smart contracts mint the certificate, attest to capabilities, and enable revocation when an agent goes rogue or is retired.

**Why it matters.**

- Regulated industries cannot adopt agents without a tamper-evident record of which agent did what. Product A is that record.
- Agent-to-agent commerce requires identity. Without it, agents cannot transact, sign, or be held accountable.
- Prompt-injection and impersonation attacks against agents become harder when every action is signed by a cryptographic identity, not a service-account token.

**Public surface to map weekly research against.**

- W3C DID specifications and method drafts (`did:web`, `did:key`, agent-specific DID methods).
- Attestation protocols — EAS (Ethereum Attestation Service), Verax, agent passport projects.
- Agent rights frameworks (Story Protocol, on-chain agent permissions).
- Regulatory pressure on AI accountability — EU AI Act, MITRE ATLAS, SOC 2 for agents.
- ENS-style human-readable naming for agent identities.

When a brief topic intersects any of those, the tie-back lands on Product A.

---

## Product B — Clockchain Agent-SDK

**What it is.** A developer SDK that abstracts the Clockchain network behind a small, ergonomic API. External developers install the SDK, initialize it, and log their first timestamped agent action in fewer than five lines of code. First-class integrations target the major agent frameworks.

**Why it matters.**

- The SDK is the on-ramp. Most developers building agents will never touch the chain directly — they will install a library, drop a few lines of code, and get verifiable provenance for free.
- The integration surface is where the agent-framework wars play out. Whichever SDK reaches first-class status inside LangChain, AutoGPT, CrewAI, AutoGen, LlamaIndex, MCP, the Anthropic Agent SDK, and the OpenAI Agents SDK earns the default-position advantage.
- Observability hooks matter. Every modern agent framework exposes a tracing or callback surface. The SDK's job is to plug into those surfaces and emit timestamped, signed logs to the Clockchain network without changing the developer's flow.

**Public surface to map weekly research against.**

- Agent frameworks — LangChain, AutoGPT, CrewAI, AutoGen, LlamaIndex.
- Model Context Protocol (MCP) servers and the broader MCP ecosystem.
- Anthropic Agent SDK, OpenAI Agents SDK, agent-runtime libraries.
- Observability and tracing standards — OpenTelemetry hooks, callback APIs, instrumentation patterns.
- Developer experience patterns — "five lines to first log" is the gold standard.

When a brief topic intersects any of those, the tie-back lands on Product B.

---

## Stretch product — Agent Credit System

**What it is.** A credit and reputation system for autonomous agents, built on top of Product A's identity infrastructure. Agents accumulate credit history through their on-chain action log; counterparties (humans, other agents, services) consult that history before transacting.

**Why it matters.** Agent-to-agent commerce is real and growing. The economic surface includes agent payments (x402, Coinbase agent payments, Skyfire), autonomous agent treasuries, agent-funded service consumption, and reputation-gated access. Without a credit primitive, agents either default to centralized custodial wallets or get stuck behind human approval for every transaction.

**Public surface to map weekly research against.**

- x402 payment standard and adoption.
- Coinbase agent payment products, Skyfire, agent-payment rails.
- Autonomous agent treasury patterns.
- Agent reputation systems and reputation-gated commerce.
- DAO-style governance applied to agent permissions.

When a brief topic intersects any of those, the tie-back lands on Agent Credit System.

---

## Stretch product — Agent Smart Receipts

**What it is.** Verifiable, time-anchored receipts for agent-executed actions. Each receipt cryptographically proves what an agent did, when it did it, and under whose authority — usable as compliance evidence, dispute resolution material, or input into automated audit systems.

**Why it matters.** Compliance regimes (EU AI Act, SOC 2 for agents, regulated-industry audit requirements) increasingly demand provable execution trails. Agent Smart Receipts turn a normally-ephemeral agent action into a permanent, verifiable record that satisfies those regimes without bespoke instrumentation.

**Public surface to map weekly research against.**

- EAS attestation patterns and adoption.
- On-chain audit trails for AI outputs.
- Chainlink Functions for AI verification.
- ZK proofs of agent execution (zkML, verifiable inference).
- AI compliance and audit-trail requirements across regulated industries.

When a brief topic intersects any of those, the tie-back lands on Agent Smart Receipts.

---

## Stretch organizational thread — AI-First Org

**What it is.** An internal commitment to turn Clockchain itself into an AI-first company by embedding autonomous agents into core internal workflows. The same patterns Clockchain ships externally (cryptographic identity, timestamped action logs, verifiable receipts) get used internally for engineering, ops, and research — Clockchain agents running Clockchain workflows on the Clockchain network.

**Why it matters in briefs.** Some weekly research topics surface broad-market patterns about how companies are absorbing agents into their internal stack. When those patterns are strong enough to inform the AI-first-org thread, the tie-back goes here. This is the smallest and most situational bucket — many briefs will skip it entirely.

**Public surface to map weekly research against.**

- Internal-agent adoption patterns at AI-native companies.
- Agent-driven engineering workflows (Claude Code, OpenHands, OpenClaw at scale).
- AI-first operating models and the org-design discourse around them.

When a brief topic intersects any of those, the tie-back can land on AI-First Org.

---

## How to use this file in a brief

- Two or three of the five buckets is the typical tie-back footprint per brief. You do not have to hit all five.
- Lead with the bucket that is most natural for the week's topic. If the brief is about MCP servers, Product B is the lead; Product A may follow as a "and here is the identity question MCP doesn't answer."
- Avoid mechanical "this maps to X" framing. Weave the tie-back into the natural argument of the section.
- Never reference timing, KR targets, internal milestones, or anything not on `clockchain.network` or in this file. If you find yourself wanting to say "Product A ships in Q3" — stop. Write something public-defensible instead.
