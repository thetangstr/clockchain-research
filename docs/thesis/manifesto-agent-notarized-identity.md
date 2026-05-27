---
slug: agent-notarized-identity
title: Agent Notarized Identity
dek: A new category of identity, built for autonomous AI agents and certified by a quorum of independent validators, not a single vendor.
date: 2026-05-26
version: v0.1
---

# Agent Notarized Identity

> A new category of identity, built for autonomous AI agents and certified by a quorum of independent validators, not a single vendor.

## The problem

Every agent that does anything important needs to prove who it is. Today there is no way to do that.

Agents make decisions. They sign documents. They move money. They run code. When something goes wrong, who is accountable. When something goes right, who gets credit. When a regulator asks which algorithm produced this output, the room goes quiet.

Today's answer is a service-account token, a vendor's log, a screenshot of a session identifier. None of those survive an audit. None of those survive a courtroom. None of those tell you which version of which agent acted under which principal's authority. The agent economy is being built on identity primitives that were designed for humans, or for stateless services, or for nothing at all.

## The gap

Human identity stacks were designed for entities that have a face, an address, and a passport. They do not extend cleanly to entities that act autonomously, on behalf of multiple principals, across multiple platforms, with no consistent identity that survives a session.

Service identity stacks were designed for stateless workloads with a long-lived TLS certificate and a well-defined API. They do not extend cleanly to entities that exercise discretion, sub-delegate to child agents, hold economic mandate, and accumulate reputation.

Decentralized identifier specifications were designed as building blocks. They define a syntax, a registry, a resolution method. They do not, on their own, answer the questions a CISO, a compliance officer, or a court actually asks. A DID is a noun. The product is a verb.

The gap is the verb. Issuing an identity is not the same as proving one. Storing a token is not the same as certifying it. Recording a delegation is not the same as witnessing it.

## The forcing function

This is no longer a future problem. The clock is on.

The European Union's AI Act, in force in stages through August 2 2026, requires high-risk AI systems to carry a stable identifier across their lifecycle. The United States Securities and Exchange Commission named AI compliance an examination priority for fiscal year 2026, with explicit attention to which algorithm produced which record. The European Union's eIDAS 2.0 framework extends qualified electronic identity to autonomous systems and accepts qualified records as legal evidence. The United States National Institute of Standards and Technology launched its AI Agent Standards Initiative in February 2026 to define identity governance for autonomous AI.

Regulators are converging. They are not asking whether agents need identity. They are asking what an acceptable proof of identity looks like.

## The category

Agent Notarized Identity is the answer.

A notarized identity is not a passport. Identity Digital is already shipping a product called DNSid that uses the passport framing, and the passport word is a single-party metaphor — one issuing authority, one stamped document, one chain of custody. A notarized identity is different. It is an identity that an independent quorum of witnesses certified at the moment of issuance, that records the agent's principal chain, scope, capabilities, and economic mandate, and that any third party can verify without trusting any single institution.

The notary metaphor is two thousand years old and every regulator already understands it. A notary witnesses an act, certifies that the witnessing happened, and anchors the certificate in a public record that survives the death of the notary. The act of notarization is what makes the document admissible. The same is true here. The act of notarization at agent birth is what makes the identity admissible later.

## What's different about the Clockchain version

Five primitives, all present in one stack, none present together in any competing product.

A decentralized Byzantine-fault-tolerant validator network certifies each issuance. There is no certificate authority to subpoena, coerce, or compromise. There is a quorum. To forge a notarized identity, an adversary would need to corrupt two-thirds of a randomly elected validator set drawn from a globally distributed staked pool. That has never been done on any major distributed ledger.

A five-layer court-admissible audit chain backs every issuance event. Verifiable Random Function selects the validators. Multiple physical time sources — GPS satellites, national atomic clocks, NTP networks — independently witness the moment. Each validator computes the agreed time on its own infrastructure. A two-thirds supermajority signs the result. The ledger permanently records it. This stack meets or exceeds the evidentiary requirements of the EU eIDAS Regulation, RFC 3161, ISO/IEC 18014, the United States ESIGN Act, and the UK Electronic Communications Act 2000.

A customer-dedicated subnet hosts the issuance and resolution of identities for one customer at a time. The notarized identities of one customer's agents never appear on a shared chain. Privacy is preserved by construction. Scale is unlimited per customer because the subnet executes alongside the mainnet rather than competing with it.

Multi-source time consensus anchors every issuance to a moment that any independent observer can reconstruct. The time is not set by Clockchain as a company. It is determined by the same independent process that backs the qualified timestamping authority of the European Union.

Token-staked validator slashing ensures economic skin in the game. Validators who collude to issue a false identity lose their stake. Collusion is not just morally wrong. It is financially irrational.

These five primitives together are the moat. Each one individually is not unique. The combination is.

## What you can do with it

Prove which agent took an action, to a regulator, in seconds, without trusting any vendor's log.

Scope an agent's authority at birth, naming its spending limits, capability set, time window, and economic mandate, and have that scope be unforgeable from the moment of issuance.

Sub-delegate authority down a chain of agents, with each child agent's certificate provably derived from a parent's, and have the entire chain revocable in a single act when a parent is compromised.

Interoperate with the emerging ecosystem. The Clockchain Notarized Identity coexists with W3C Decentralized Identifiers, the ERC-8004 Identity Registry, RNWY soulbound passports, and the Kite Agent Passport. We do not replace them. We notarize them.

## The reference deployment

AgentDash is the working reference.

Every Claude Code, Codex, Hermes, Cursor, OpenCode, OpenClaw, Gemini, or Pi worker that the AgentDash chief of staff dispatches receives an Agent Notarized Identity at the moment of dispatch. The certificate records the workspace principal, the chief of staff's delegation, the task scope, the spending limits, and the expiration. When the worker acts, every action it takes carries that identity. When the task completes, the receipt references the identity by its notarized record on Clockchain.

The Agent Notarized Identity is not a feature of AgentDash. It is the substrate AgentDash runs on.

## What we are committing to

A single canonical specification for Agent Notarized Identity. Open, machine-readable, and versioned. Anyone can mint a Clockchain-notarized identity. Anyone can verify one. We are not building a moat through proprietary tooling. We are building a moat through the cryptographic primitive nobody else has assembled in one place.

The agent economy needs the noun *notarized identity* the way the human economy needs the noun *passport*. We are building it.

Read the specification at [`/spec/agent-notarized-identity`](/spec/agent-notarized-identity).
Read the companion product manifesto at [`/manifesto/agent-notarized-receipt`](/manifesto/agent-notarized-receipt).
