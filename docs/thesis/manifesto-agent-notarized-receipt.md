---
slug: agent-notarized-receipt
title: Agent Notarized Receipt
dek: The court-admissible record of what an autonomous agent did, witnessed by a validator quorum, anchored to a Clockchain timestamp, and survivable by a courtroom.
date: 2026-05-26
version: v0.1
---

# Agent Notarized Receipt

> The court-admissible record of what an autonomous agent did, witnessed by a validator quorum, anchored to a Clockchain timestamp, and survivable by a courtroom.

## The problem

Every agent action that matters needs to leave a receipt. Not a log entry. Not a trace. Not a vendor's screenshot. A receipt that holds up in court.

When an autonomous agent runs a transaction, signs a document, deploys code, makes a clinical decision, or executes a trade — what proof exists that the action actually happened, that the agent was authorized to take it, that the input was what the agent claimed, and that the output was what the regulator examines? A LangSmith trace. A Splunk log. An entry in the customer's own database. Every single one of those proofs requires trusting the vendor that captured it.

A regulator does not trust the vendor. A court does not trust the vendor. The agent's counterparty in a contract dispute does not trust the vendor. The vendor was paid by the agent's operator. The vendor's logs are not evidence. The vendor's logs are testimony.

## The gap

Existing observability vendors do important work. LangSmith captures every LLM call, tool invocation, and reasoning step. Helicone aggregates request flows across providers. Phoenix and Arize provide evaluation surfaces. Datadog APM extends to agentic workflows. OpenLLMetry standardizes the trace format.

All of them store the trace with themselves. The single point of trust is the vendor. The regulator never reads the trace directly. The court never sees the underlying record. They see a screenshot, a CSV export, a dashboard. Those artifacts are produced by the vendor that captured the trace, controlled by the operator that pays the vendor's bill, and admissible only if the vendor's witness shows up in court.

The European Union's AI Act Article 12 demands "automatic recording of events across the entire lifecycle." It does not say "logs stored with the vendor that captured them." Article 72 demands post-market monitoring with persistent, tamper-evident records. Vendor logs are not tamper-evident. Vendor logs are tamper-resistant in the same way a bank statement is — you trust the bank.

In the agent economy, the bank gets replaced by an unknowable third party that processes millions of events per customer per day, runs proprietary infrastructure, and turns over inside an enterprise relationship every three years. That is not a trust model that survives a regulator's audit.

## The forcing function

The audit clock has already started.

The United States Securities and Exchange Commission's Rule 17a-4, as amended, now treats AI-generated content as in-scope for the write-once-read-many storage requirement. Broker-dealers cannot satisfy the rule with vendor-stored logs. The European Union's AI Act Article 12 takes binding effect on August 2 2026 for high-risk systems and requires tamper-evident automated logging. The European Union's eIDAS 2.0 makes qualified timestamps admissible as legal evidence; ordinary vendor logs are not. The United States Food and Drug Administration's Good Machine Learning Practice framework expects audit trails for clinical decision support. The Markets in Financial Instruments Directive II demands transaction-level records for any AI agent participating in trading.

Regulators have converged. They are not asking whether agent actions need records. They are asking what an acceptable record looks like.

## The category

Agent Notarized Receipt is the answer.

A notarized receipt is not a log entry. Everyone has log entries. A notarized receipt is not a trace. Traces are owned by the observability vendors. A notarized receipt is the structured artifact that proves a specific agent — with a known notarized identity — took a specific action, at a court-admissible time, under a delegated authority, with a verifiable input, producing a verifiable output. It is the receipt a regulator examines, an auditor accepts, a court admits as evidence, and a counterparty cannot contest without disproving the underlying cryptography.

The receipt is not a substitute for the trace. The trace tells you what happened in the moment, in rich detail, for debugging and evaluation. The receipt tells you what happened in a form that survives ten years, three vendor migrations, two regulator examinations, and one lawsuit. They serve different purposes. They are produced by different layers. They compose.

## What's different about the Clockchain version

The same five primitives that back the Agent Notarized Identity also back the Agent Notarized Receipt. The receipt inherits the validator quorum, the five-layer audit chain, the customer-dedicated subnet, the multi-source time consensus, and the staked validator slashing. Anything that proves an identity is admissible can prove a receipt is admissible.

Beyond the shared primitives, the receipt has its own structural commitments.

A single receipt covers a single logical agent action — not a single LLM call. A receipt aggregates the entire chain of LLM calls, tool invocations, human approvals, and state transitions that the worker traversed while completing one logical task. The receipt is the agent's tax form, not the agent's keystroke log.

Every receipt carries the agent's Agent Notarized Identity as its first field. The identity and the receipt are not stored together because they share a database. They are joined cryptographically. Tampering with one breaks the link to the other.

Every receipt carries its principal chain. If a chief of staff agent delegated the task to a worker, the receipt records both. If a workspace owner delegated to the chief of staff, the receipt records that too. The full chain of custody, signed and witnessed, lives in every artifact.

Every receipt is exportable in regulator-specific formats. SEC 17a-4 write-once-read-many. EU AI Act Article 12 logging format. FDA Good Machine Learning Practice traceability. ISO 27001 evidence package. The receipt is rendered into the format the regulator expects, without losing the underlying cryptographic anchor.

## What you can do with it

Pass an SEC examination by handing the examiner a folder of receipts instead of a screenshot of a vendor dashboard.

Pass an EU AI Act Article 12 audit by exporting the entire receipt chain for the audited time window with a single command, anchored to a public ledger the examiner can independently verify.

Settle a contract dispute by presenting the receipt that proves your agent did or did not take the action in question. The receipt is admissible. The counterparty's denial is not.

Defend against a liability claim by showing cryptographic proof rather than vendor testimony. A vendor witness can be impeached. A receipt cannot.

Build an enterprise tier feature around compliance with a single integration. The receipt is the product. The customer's regulator sees the receipt. The customer's lawyers reference the receipt. The customer's insurance underwriter prices against the receipt.

## The anchor relationship to existing observability

The Agent Notarized Receipt does not compete with LangSmith, Helicone, Phoenix, Arize, Datadog APM, or OpenLLMetry. It anchors them.

Keep using the observability vendor for what it is good at — capturing rich traces, evaluating model behavior, alerting on production anomalies. Add Clockchain underneath for the proof. The observability vendor's trace is referenced in the receipt by its identifier. The receipt is anchored on Clockchain. The two layers compose. The customer keeps the observability investment. The customer gains the court-admissible artifact the observability layer cannot produce alone.

This is the right relationship to have with a category that is already crowded. We are not the eleventh agent observability vendor. We are the notary that every agent observability vendor's customers eventually need.

## The reference deployment

AgentDash, again, is the working reference.

Every chief-of-staff-dispatched task in an AgentDash workspace produces a single Agent Notarized Receipt at completion. The receipt rolls up every LLM call, tool invocation, and human approval the worker traversed. The receipt references the worker's Agent Notarized Identity. The receipt is signed by the validator quorum on the workspace's dedicated Clockchain subnet. The receipt lives inline with the task in the workspace's audit log. The receipt is exportable. The receipt is presentable.

A regulator who walks into an AgentDash deployment can be handed every receipt for the audited time window. The regulator can verify each receipt independently using the public Clockchain ledger. The customer's compliance team does not have to vouch for the vendor's logs. The vendor is Clockchain. The proof is mathematical. The trust is not placed in a vendor at all.

## What we are committing to

A single canonical specification for Agent Notarized Receipt. Open, machine-readable, and versioned. Any agent framework can mint a Clockchain-notarized receipt. Any third party can verify one. We are not building a moat through proprietary tooling. We are building a moat through the cryptographic primitive nobody else has assembled in one place.

The agent economy needs the noun *notarized receipt* the way the financial economy needs the noun *tax form*. We are building it.

Read the specification at [`/spec/agent-notarized-receipt`](/spec/agent-notarized-receipt).
Read the companion product manifesto at [`/manifesto/agent-notarized-identity`](/manifesto/agent-notarized-identity).
