# Clockchain — public overview

> Reference document for any agent generating Clockchain research briefs. Public information only — sourced from `clockchain.network` and public press. Designed to give the brief generator enough context to tie weekly research back to Clockchain's positioning without ever needing to read any internal repository, Notion page, Linear ticket, or Slack thread.
>
> **Hard rule for the brief agent**: never reference anything beyond what is published on `clockchain.network` or in public press. If a fact is not in this document or visible on the public site, do not include it. Operate only inside this `clockchain-research` repository.

---

## What Clockchain is

Clockchain is a **verifiable-time blockchain protocol** operated by **D4D Sàrl**, a Swiss company headquartered in **Neuchâtel, Switzerland**. The protocol provides cryptographically verifiable timestamps and time-anchored attestations for digital actions, with first-class support for autonomous agent workflows.

Strategic positioning visible on the public site:

- **Verifiable time as a primitive.** Clockchain treats time itself as a blockchain-native resource. The network anchors actions, contracts, and attestations to cryptographically verifiable timestamps.
- **DePIN with Proof-of-Time.** The network uses a Decentralized Physical Infrastructure (DePIN) model paired with a Proof-of-Time consensus mechanism. Real-world clocks and time sources contribute to the network and are economically incentivized.
- **Native token: `$CCTT`.** The Clockchain Time Token coordinates network participation and rewards.

## Three publicly listed products

These are the three products visible on `clockchain.network`. Brief copy should reference these by name when relevant, and should never claim Clockchain ships anything beyond these three publicly.

1. **Logging, Auth, and Timestamps.** A logging primitive that produces tamper-evident timestamped records of digital actions. Designed for compliance, audit, and agent-action provenance.
2. **Smart Contract Scheduling.** Native primitives for time-anchored smart contract execution — contracts that fire at verifiable wall-clock moments, not just block heights.
3. **TimeStamp API.** A developer-facing API for producing verifiable timestamps that can be consumed by applications outside the Clockchain network.

## Ecosystem direction

The public site indicates the protocol's ecosystem ambitions, which the brief generator can reference at a high level:

- **Solana** is the initial deployment surface.
- **Chainlink** and **Canton** are referenced as interoperability targets.
- **Avalanche** is a planned ecosystem expansion.
- **HyperLedger** is referenced as an enterprise integration direction.
- **Safran atomic clocks** are publicly referenced as a hardware-anchor partner for time-source integrity.
- The **testnet launched in February 2026** and is publicly active.

The brief generator should reference these by name only when the ecosystem context calls for it, and should avoid claiming any timeline or status not already on the public site.

---

## How Clockchain meets agentic AI

The "Clockchain meets agents" thesis is the editorial center of every brief. Distilled:

- **Autonomous agents need verifiable provenance.** Without a cryptographic record of who did what and when, AI agents cannot be audited, governed, or trusted in regulated workflows. Clockchain's timestamping and attestation primitives plug directly into that need.
- **Agent identity is the trust layer.** A DID for an autonomous agent — a cryptographic "birth certificate" minted on chain — is the missing piece between an AI model and a network of accountable economic actors.
- **The SDK is the on-ramp.** Most developers will never touch the chain directly. They will integrate via an SDK that lets them log timestamped actions, mint and verify agent credentials, and produce verifiable receipts in fewer than five lines of code.
- **The dogfood loop is the proof point.** The Clockchain Research brief generator itself is an autonomous agent on a recurring schedule, producing public artifacts, signing them cryptographically through git, with timestamped provenance. Every brief is itself an example of the pattern Clockchain is enabling for the broader market.

---

## What the brief generator should reference

Every brief must include a "What this means for our agent products" section. The standard moves:

- Map the week's findings to one or more product buckets:
  - **Product A — Agent DID / Birth Certificates.** Identity standards, agent passports, attestation protocols, prompt-injection defenses tied to cryptographic identity, on-chain agent rights frameworks.
  - **Product B — Clockchain Agent-SDK.** Agent framework integrations (LangChain, AutoGPT, CrewAI, AutoGen, LlamaIndex, MCP, Anthropic Agent SDK, OpenAI Agents SDK), observability hooks, instant-ledger logging patterns.
  - **Agent Credit System (stretch).** Agent payments, credits, reputation, x402, Coinbase agent payments, Skyfire, autonomous agent treasuries.
  - **Agent Smart Receipts (stretch).** EAS attestations, on-chain audit trails, ZK proofs of execution, smart receipt patterns.
  - **AI-First Org (stretch).** Internal-agent patterns, AI-native workflows inside companies.
- Use the core thesis as a natural rhetorical move: **"verifiable time is the trust primitive for autonomous agents."** Vary the phrasing across briefs — don't repeat the same line every week.
- Tie back to the three public Clockchain products by name (Logging/Auth/Timestamps, Smart Contract Scheduling, TimeStamp API) when relevant, but only by name and only when the topic naturally maps.

## What the brief generator should NEVER do

- **Never** reference internal roadmap dates, KR numerical targets, sprint status, audit findings, internal codenames, or anything not visible on `clockchain.network`.
- **Never** disclose customers, partners, or pilot programs beyond what is already public.
- **Never** quote anything from Notion, Linear, internal Slack, or any internal tool.
- **Never** invent product features, pricing tiers, partnership rumors, or timelines beyond what the public site shows.
- **Never** name internal team members or org structure beyond what is already public.
- **Never** speculate about unannounced products, M&A activity, or fundraising status.

If a brief topic forces you near any of those lines, write less. A short, public-defensible brief beats a leaky one.

---

## TL;DR for the agent

You are writing for a public audience. The three public products (Logging/Auth/Timestamps, Smart Contract Scheduling, TimeStamp API), the core thesis (verifiable time as the trust primitive for autonomous agents), the network basics (D4D Sàrl, Neuchâtel, DePIN with Proof-of-Time, `$CCTT`, testnet active), and the five agent-product tie-back buckets (Product A, Product B, agent credits, agent smart receipts, AI-first org) are the entire toolkit. Use them naturally, tie back every brief, and stay strictly on the public side of every line.
