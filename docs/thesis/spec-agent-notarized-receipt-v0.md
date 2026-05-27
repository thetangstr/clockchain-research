---
slug: spec-agent-notarized-receipt
title: "Spec: Agent Notarized Receipt v0"
dek: RFC-style engineering specification for court-admissible records of autonomous AI agent actions, covering capture, identity binding, timestamping, subnet anchoring, receipt minting, and retrieval across six layers.
date: 2026-05-26
version: v0.1
---

# Spec: Agent Notarized Receipt v0.1

> **Status.** This is a v0 draft. It is the first canonical engineering specification for Agent Notarized Receipt. It is written to be read by an external engineering team integrating against the Clockchain Agent Notary Layer. It is not frozen. It will evolve through the same brief-propose, Yang-merge process that governs all product artifacts.

## 1. Summary

Agent Notarized Receipt is the court-admissible record of what an autonomous AI agent did. It is produced by the Clockchain Agent-SDK at the moment of every meaningful agent action, witnessed by a Clockchain validator quorum, anchored to a multi-source Clockchain timestamp, and presentable to a regulator, auditor, or court as evidence of agent behavior. A notarized receipt proves: which agent took the action, under whose delegated authority, at a court-admissible time, with a verifiable input and a verifiable output. No single vendor's logs are required. No trust in Clockchain as a company is required to verify the record.

The specification covers six layers: B1 Capture, B2 Identity Binding, B3 Timestamping, B4 Subnet Anchoring, B5 Receipt Minting, and B6 Retrieval. Together they form the complete pipeline from agent action to permanent, verifiable artifact.

Agent Notarized Receipt is not a log entry. A log entry is owned by whoever captured it. A notarized receipt is owned by no one and verifiable by everyone. It does not replace LangSmith, Helicone, Phoenix, Datadog APM, or OpenLLMetry — those tools capture rich traces for debugging and evaluation. The notarized receipt anchors those traces cryptographically, turning vendor-owned traces into court-admissible evidence.

## 2. Terminology

**Agent Action.** A discrete, meaningful unit of agent work that produces an externally visible effect. Examples: a tool invocation that writes to a database, a signing action that produces a cryptographic signature, a trading decision that generates an order, a clinical recommendation that generates an output presented to a patient. A reasoning step inside the agent's own loop is not an agent action unless it produces an externally visible effect. One logical agent action may involve multiple LLM calls, tool invocations, and reasoning steps.

**Notarized Receipt.** The artifact produced at B5 minting. A structured document encoding: the acting agent's DID, the principal chain, the event hash, the input hash, the output hash, the model and tool version, the Clockchain consensus timestamp, the validator quorum signatures, the subnet anchor reference, and the mainnet block reference.

**Clockchain Agent-SDK.** The developer-facing software library that handles B1 capture, B2 identity binding, and B3 timestamping. Initialized in the host agent's runtime with fewer than five lines of code. Emits signed, timestamped, validator-witnessed receipts to the customer's Clockchain subnet.

**Customer Subnet.** The per-customer execution environment. All receipt events accumulate here. Only a periodic cryptographic fingerprint of the accumulated event history is committed to mainnet. Customer data never appears on mainnet.

**Validator Quorum.** Selected via Verifiable Random Function for each receipt minting event. The quorum signs the receipt, certifying the timestamp and the event content.

**Principal Chain.** The chain of delegations from the root principal to the acting agent at the moment of the action. For an AgentDash deployment: root principal to chief of staff to worker. The principal chain is recorded in every receipt.

**Event Hash.** SHA-256 hash of the complete event record including prompt, completion, tool name, input, output, and metadata. Used for tamper-evident linkage between the captured event and the notarized receipt.

**Subnet Anchor Reference.** The identifier of the subnet ledger entry where the receipt first landed, before periodic mainnet anchoring.

**Mainnet Block Reference.** The mainnet block number and transaction index where the subnet's state-root commitment appears, proving the receipt's inclusion in the public ledger.

**Rights and Payment Event.** A subclass of agent action where the agent earns income, spends funds, or produces an output that carries an intellectual property claim. B5 receipts for rights and payment events carry additional fields recording the economic outcome.

**WORM Storage.** Write-Once-Read-Many storage, as required by SEC Rule 17a-4. A notarized receipt satisfies WORM requirements because the subnet ledger is append-only and the mainnet anchor makes the record permanently verifiable.

## 3. Architecture Overview

Agent Notarized Receipt operates as a layer of the Clockchain Agent Notary Layer, directly above the Agent Notarized Identity substrate. The two products share the same cryptographic foundation: the validator quorum, the five-layer audit chain, the subnet architecture, the multi-source time consensus, and the token-staked slashing mechanism.

The layer stack from bottom to top:

**Clockchain Mainnet** anchors all subnet state. Each subnet commits a single SHA-256 hash of its accumulated event history to mainnet once per anchoring interval — hourly or daily, per customer configuration. Mainnet does not see individual receipt events. It sees only the cryptographic fingerprint, which is enough to prove that any specific event occurred before or after any other event.

**Customer Subnet** accumulates all receipt events for one customer. It runs BFT consensus internally, timestamps events via the validator quorum, and writes receipts to its own ledger. Subnets never see each other's events. Customer data privacy is preserved by construction. Subnet throughput is sized per customer — one customer can process tens of millions of receipt events per day without affecting any other customer's latency.

**Clockchain Agent-SDK** sits in the host agent's process. It integrates with LangChain callbacks, OpenTelemetry exporters, MCP middleware, and direct API calls. On every meaningful agent action, the SDK computes the event hash, binds the agent's DID and principal chain, submits to the subnet, and returns a receipt. The SDK adds under twenty milliseconds of latency in the online path.

**Five-Layer Court-Admissible Audit Chain** backs every receipt timestamp. Identical to the chain backing Agent Notarized Identity: VRF validator election, multi-source time observation, independent validator computation, two-thirds supermajority signing, mainnet anchor. Every receipt timestamp is a qualified electronic timestamp under eIDAS 2.0, RFC 3161, and ISO/IEC 18014.

The relationship to existing observability vendors is complementary. LangSmith, Helicone, Phoenix, Datadog APM, and OpenLLMetry capture traces with rich debugging detail. The Clockchain Agent-SDK captures the same events but emits a cryptographic anchor — the event hash, the DID, the timestamp — to the customer subnet. The receipt references the observability vendor's trace ID. The two layers compose: customers keep their observability investment and gain the court-admissible proof layer.

## 4. The Six Layers

### B1 — Capture Layer

**Purpose.** Integrate with the host agent framework and capture meaningful agent actions as structured events.

**Integration shapes:**

- **LangChain `BaseCallbackHandler`**: the SDK registers as a callback handler. Every `on_chat_model_start`, `on_tool_start`, `on_tool_end`, `on_chain_start`, `on_chain_end`, and `on_retriever_start` event is intercepted and forwarded to the receipt pipeline. Five-line install, no source changes required.
- **OpenTelemetry Exporter**: for OTel-instrumented stacks (Phoenix, Helicone, OpenLLMetry, Datadog APM), the SDK registers as an OTel exporter and intercepts spans at the agent semantic conventions layer.
- **MCP Middleware**: intercepts Model Context Protocol tool calls and tool responses, capturing the MCP-native event surface.
- **Anthropic Agent SDK Hook**: intercepts agent action events from the Anthropic Agent SDK runtime.
- **OpenAI Agents SDK Trace Processor**: intercepts traces from the OpenAI Agents SDK and Assistants API.
- **AgentDash Plugin Worker**: the SDK ships as an AgentDash plugin that captures events from the adapter bus before they reach the WebSocket bus.

**Captured event types:**

- `llm_call`: prompt hash, completion hash, model ID, latency, token usage
- `tool_invocation`: tool name, input hash, output hash, latency
- `reasoning_step`: step index, thought hash (not full thought content — privacy-sensitive)
- `state_transition`: before-state hash, after-state hash
- `human_intervention`: approving human DID, approval timestamp, scope approved
- `error`: error type, error hash, recovered or fatal

**Inclusion policy:** The customer configures which event classes produce receipts. Default policy: every externally visible action — tool invocation that has side effects, signing action, human intervention, error — gets a receipt. Reasoning steps and state transitions are captured internally but rolled up into the parent action receipt by default. Customers can override inclusion policy to capture everything or only a subset.

**Volume consideration:** A single agent task may produce thousands of reasoning steps and LLM calls. The SDK batches reasoning steps locally and emits one composite hash entry per batch, rather than one receipt per reasoning step. Full per-step receipts are available as an opt-in configuration.

### B2 — Identity Binding Layer

**Purpose.** Stamp every captured event with the acting agent's notarized identity and the full principal chain.

**Single-agent case:** The SDK is initialized with one agent DID. Every captured event is bound to that DID and its principal chain. No per-event configuration required.

**Multi-agent case:** AgentDash's chief of staff dispatches to a specific worker agent. The CoS routing message includes the dispatched worker's DID. The SDK detects the active agent via the host framework's runtime context — LangChain's callback context, the MCP session, or the AgentDash plugin bus — and binds the event to the correct DID without per-call configuration.

**Delegation chain recording:** The receipt records the complete principal chain, not just the leaf agent DID. For an AgentDash CoS dispatch: `workspace_owner_DID → cos_DID → worker_DID`. For a LangChain orchestration: `org_DID → orchestration_agent_DID → sub_agent_DID`. The chain is pulled from the agent's notarized identity record at B1 capture time and embedded in the receipt.

**How the SDK acquires the active DID:** Initialization accepts a DID parameter. For AgentDash, the CoS passes the worker's DID in the routing context and the SDK reads it from there. For standalone SDK use, the developer provides it at initialization. Framework-specific bindings handle the details for each integration shape.

### B3 — Timestamping Layer

**Purpose.** Assign every captured event a court-admissible Clockchain timestamp.

**Online path:** The SDK submits the event to the customer's Clockchain subnet via a single API call. The subnet runs its BFT round — VRF election, time consensus, validator signing — and returns a signed timestamp within tens of milliseconds. The SDK embeds the timestamp in the event record and proceeds.

**Offline / batched path:** For high-volume deployments, or when the subnet is temporarily unreachable, the SDK accumulates events in a local journal — hardware-backed enclave preferred, signed local journal as fallback. The journal is flushed to the subnet on a configurable schedule or when the buffer reaches a configurable size. Events receive their notarized timestamp at flush time, back-dated to their actual occurrence time via the journal's internal sequence.

**Time-source fallback:** If the customer subnet is unreachable and the mainnet is reachable, the SDK falls back to a mainnet direct-anchor path. Latency is higher but evidentiary weight is preserved. The fallback path is logged and the timestamp is flagged as degraded-evidentiary-weight in the receipt.

**Latency budget:** For real-time tool calls — trading agents, signing agents — the online path is required. For long-running reasoning tasks that take minutes or hours, the batched path is acceptable and does not hold up the agent's execution. Customers configure their latency policy per event class.

### B4 — Subnet Anchoring Layer

**Purpose.** Accumulate events in the customer subnet and periodically anchor the accumulated state to mainnet.

**Per-customer subnet:** Standard deployment. Each enterprise customer has a dedicated subnet with three to thirty staked validators. Events never appear on a shared chain. Data residency is satisfied by subnet geography — EU subnets for GDPR scope, US subnets for SEC scope.

**Anchoring cadence:** Configurable. Default is hourly. Enterprise customers with higher evidentiary requirements may configure per-action anchoring — each receipt event is individually committed to mainnet immediately. Hourly anchoring is the balance between mainnet cost and evidentiary immediateness.

**State-root commitment:** Each anchoring interval, the subnet computes a single SHA-256 hash of all events accumulated since the last anchor. This hash is submitted as one transaction to mainnet. The hash proves that the accumulated event history existed at the anchored time. Any individual event can be proven to have occurred by demonstrating it contributed to the anchored hash.

**Subnet scaling:** If a customer's event volume exceeds a subnet's throughput, the subnet adds validator nodes. Scaling is automatic based on volume signals. The customer does not manage capacity planning.

### B5 — Receipt Minting Layer

**Purpose.** Produce the notarized receipt as the deliverable artifact.

**Receipt fields:**

- `receiptId` — globally unique identifier for this receipt
- `agentDID` — DID of the agent that performed the action
- `principalChain` — array of DIDs forming the full delegation chain
- `eventHash` — SHA-256 of the complete event record
- `inputHash` — SHA-256 of the input that triggered the action
- `outputHash` — SHA-256 of the output the action produced
- `modelId` — model identifier used for the primary LLM call
- `toolVersions` — map of tool name to version string for each tool invoked
- `consensusTimestamp` — Clockchain multi-source UTC consensus timestamp
- `validatorQuorumSignatures` — threshold signature from the BFT quorum
- `subnetAnchorReference` — identifier of the subnet ledger entry
- `mainnetBlockReference` — mainnet block number and transaction index of the state-root commitment
- `rightsAndPayments` — optional object recording economic outcome: amount earned, amount spent, IP output hash, x402 payment reference, Story Protocol attribution ID

**Atomicity:** One receipt per logical agent action. A logical action that involves multiple LLM calls, tool invocations, and reasoning steps produces one receipt with a composite `eventHash` that covers all component events. The atomicity rule prevents receipt fragmentation and keeps regulator-facing artifacts manageable.

**Receipt format:** Machine-readable JSON for programmatic consumption. The SDK provides a verifier that parses and validates receipts. Court-admissible verification packets are generated on demand from the JSON representation.

**Rights and payment recording:** When an agent action results in an economic outcome — an x402 payment, a Story Protocol IP registration, a spend against the agent's treasury — the B5 minting layer records it in the `rightsAndPayments` field. This field extends the receipt for economically active agents (see `inflection-points.md` IP6 / IP7 interaction with Product A economic mandate fields).

### B6 — Retrieval and Verification Layer

**Purpose.** Enable customers to retrieve receipts and present them to regulators, auditors, or courts.

**Customer-side query API:** Filter receipts by agent DID, time window, action type, principal DID, and rights/payment status. Returns a paginated list of receipts with metadata. Full receipt content is retrieved by receipt ID.

**Bulk export:** Export receipts to CSV, JSON, or regulator-specific format. Supported formats: SEC 17a-4 WORM-compatible export (append-only, immutable, with cryptographic integrity proof), EU AI Act Article 12 format, FDA GMLP traceability format, ISO 27001 evidence package. The export includes the full cryptographic verification chain — a regulator who receives the export can verify every receipt without Clockchain's cooperation.

**Dispute resolution flow:** Customer presents a receipt to a counterparty. Counterparty runs `verify_receipt(receiptId)` — the Clockchain Agent-SDK function that checks the subnet ledger entry, the mainnet anchor, the validator signatures, and the revocation registry. If the receipt verifies, the counterparty cannot contest the action without attacking the underlying cryptography. If verification fails, the receipt is invalid.

**Long-term retention:** Receipts are permanent on mainnet — anchored by the state-root commitment that cannot be altered without invalidating all subsequent blocks. However, the customer's subnet may be dissolved when the customer contract ends. Before subnet dissolution, all receipts are exported and custody is transferred to a long-term retention service specified by the customer. SEC 17a-4 requires six years. HIPAA requires six years. Some legal contexts require ten. The retention period is a customer configuration parameter at subscription time.

**Subnet dissolution flow:** When a customer contract ends, Clockchain provides a ninety-day window to export all receipts. After ninety days, the subnet is decommissioned. The mainnet anchors remain verifiable forever. Customers must specify their desired retention service — Clockchain-managed cold storage, customer-managed HSM, or third-party WORM-compliant custodian — before subnet decommissioning.

## 5. Issuance Flow

The complete flow from agent action to notarized receipt:

1. **Agent takes action.** The host agent — LangChain chain, MCP tool call, AgentDash worker — executes a meaningful action and produces an output.

2. **SDK intercepts at B1.** The Clockchain Agent-SDK captures the event via the integration surface (LangChain callback, OTel exporter, MCP middleware, AgentDash plugin). The event is assembled with prompt hash, completion hash, tool name, input hash, output hash, model ID, and latency.

3. **SDK binds identity at B2.** The SDK reads the active agent's DID and principal chain from the framework context (LangChain callback context, MCP session, AgentDash routing message). The identity is embedded in the event record.

4. **SDK timestamps at B3.** The SDK submits the event to the customer subnet. The subnet's VRF elects a validator quorum. Validators independently observe time from GPS, atomic clocks, and NTP sources. Two-thirds supermajority reaches consensus on the timestamp. Validators sign. The signed timestamp is returned to the SDK.

5. **Event accumulates in subnet at B4.** The event is written to the customer subnet ledger with the consensus timestamp. The subnet accumulates events for the anchoring interval.

6. **Subnet anchors to mainnet at B4.** At the anchoring interval, the subnet computes a single SHA-256 hash of all accumulated events since the last anchor. This hash is committed to mainnet as one transaction. The mainnet block number and transaction index are returned to the subnet.

7. **SDK mints receipt at B5.** The SDK assembles the complete receipt: event hash, DID, principal chain, timestamps, validator signatures, subnet anchor reference, mainnet block reference. The receipt is returned to the host application as a structured object.

8. **Customer retrieves at B6.** The receipt is stored in the customer's audit log. The customer can query by DID, time, or action type. The customer can export for regulatory submission.

```
Agent Action (LangChain / MCP / AgentDash)
  |
  | B1: SDK intercepts event
  v
Event record assembled (prompt_hash, tool, input_hash, output_hash)
  |
  | B2: SDK binds agent DID + principal chain
  v
Event submitted to Customer Subnet
  |
  |-- VRF elects validator quorum
  |
  |  Validator 1: observe time [GPS + atomic + NTP]
  |  Validator 2: observe time [GPS + atomic + NTP]
  |  Validator 3: observe time [GPS + atomic + NTP]
  |
  |-- 2/3 supermajority on timestamp + content
  |
  |  Each validator signs: { event_hash, timestamp, quorum_sig }
  v
Signed timestamp returned to SDK
  |
  | B4: Event written to Subnet Ledger
  |
  | (periodic anchoring)
  |
  | SHA-256(all_events_since_last_anchor) → mainnet
  v
SDK mints Receipt (B5)
  |
  | receiptId, agentDID, principalChain, eventHash,
  | inputHash, outputHash, modelId, toolVersions,
  | consensusTimestamp, validatorSignatures,
  | subnetAnchorRef, mainnetBlockRef
  v
Receipt delivered to host application
  |
  | B6: Stored in customer audit log
  v
Customer retrieves, exports, or presents
```

## 6. Verification Flow

A third party — regulator, auditor, counterparty in a dispute — verifies a receipt without running Clockchain software or trusting Clockchain as a company.

1. **Third party acquires the receipt.** The receipt is presented as a JSON object or as a regulator-specific export package.

2. **Third party downloads verification inputs.** Using the `mainnetBlockReference`, the third party queries the public Clockchain ledger for the anchored state-root hash that covers the receipt's timestamp window. Using the `subnetAnchorReference`, the third party retrieves the subnet ledger entry from the customer's public verification endpoint.

3. **Third party verifies the subnet anchor.** The third party confirms the `subnetAnchorReference` hash is included in the mainnet-anchored state-root hash. This proves the event occurred no later than the anchor time.

4. **Third party verifies the event hash.** The third party recomputes the `eventHash` from the raw event data and confirms it matches the `eventHash` field in the receipt. Tampering with the event content breaks this link.

5. **Third party verifies the validator signatures.** Using the public keys of the validators identified in the `validatorQuorumSignatures`, the third party confirms two-thirds of the quorum signed the receipt's content and timestamp.

6. **Third party verifies the DID chain.** The third party retrieves the agent's notarized identity record (from the Agent Notarized Identity specification) and confirms the agent DID was valid at the receipt's timestamp. If the agent was revoked before the action, the receipt is invalid.

7. **Verification result produced.** The third party holds a cryptographically proven statement that: agent X performed action Y at time Z, the action's inputs and outputs match the hashes recorded, the timestamp was set by an independent validator quorum, and the event is anchored to a public ledger that cannot be altered retroactively. No trust in Clockchain was required.

## 7. Interoperability

Agent Notarized Receipt is designed to enhance rather than replace the existing observability ecosystem.

**LangSmith.** The Clockchain Agent-SDK for LangChain intercepts LangChain callback events and emits receipts. The LangSmith trace ID is embedded in the receipt's metadata as a cross-reference. A regulator examining a Clockchain receipt can follow the trace ID to LangSmith for the full debugging trace. The two layers compose.

**Helicone.** Same pattern as LangSmith. The Helicone request ID is embedded in the receipt. Helicone's logging infrastructure is preserved; Clockchain provides the cryptographic anchor.

**Phoenix (Arize), OpenLLMetry, Datadog APM.** These stacks are OTel-native. The Clockchain Agent-SDK registers as an OTel exporter and intercepts spans at the agent semantic conventions layer. The receipt references the OTel trace ID. Observability data stays in the customer's chosen platform; Clockchain provides the proof layer.

**Model Context Protocol (MCP).** MCP tool calls and tool responses are intercepted at the middleware layer. The receipt captures the MCP-native event surface including tool name, input, output, and session context. MCP's growing server ecosystem becomes Clockchain-compatible without modification to MCP servers.

**Anthropic Agent SDK and OpenAI Agents SDK.** Direct SDK bindings intercept agent action events. The receipt captures the framework-native event surface.

**EAS / Verax.** B5 minting can optionally emit an Ethereum Attestation Service record alongside the Clockchain receipt. This allows Clockchain-native receipts to travel into Ethereum-based applications. The EAS record references the Clockchain receipt ID as its evidence.

**x402.** When an agent action results in an x402 payment, the receipt's `rightsAndPayments` field records the x402 payment reference. This makes the Clockchain receipt the authoritative record of both the action and its economic outcome.

**Story Protocol.** When an agent action produces an output registered on Story Protocol, the receipt's `rightsAndPayments` field records the Story Protocol attribution ID. This links the notarized action to the on-chain IP record.

**OTel semantic conventions.** The Clockchain Agent-SDK maps its internal fields to the OpenTelemetry semantic conventions for generative AI and agents. This ensures Clockchain receipts flow through OTel-native infrastructure without modification.

## 8. Regulatory Mapping

Agent Notarized Receipt satisfies specific regulatory requirements for agent action records. This section maps each layer to the specific requirement it serves.

**SEC Rule 17a-4.** The broker-dealer records preservation rule requires write-once-read-many storage and specific record format requirements. B4 subnet anchoring produces an append-only ledger. B6 bulk export provides SEC 17a-4 WORM-compatible format. B2 identity binding provides the algorithm identification requirement — every receipt identifies which agent produced the record. The combination satisfies the rule.

**EU AI Act Article 12.** Automatic recording of events across the entire lifecycle of high-risk AI systems. B1 capture records every meaningful action. B3 timestamping provides the tamper-evident timestamp. B5 minting produces the permanent artifact. B4 subnet anchoring provides the tamper-evident accumulation. The combination satisfies Article 12.

**EU AI Act Article 72.** Post-market monitoring with persistent, tamper-evident records. The five-layer audit chain backing every B3 timestamp meets the tamper-evidence requirement. The mainnet anchor meets the persistence requirement.

**eIDAS 2.0 — Qualified Electronic Timestamps.** The five-layer Clockchain audit chain — VRF election, multi-source time observation, independent computation, supermajority signing, mainnet anchor — meets the eIDAS qualified timestamp standard. Every B3 timestamp is a qualified electronic timestamp.

**MiFID II RTS 6 and RTS 22.** Transaction reporting requires order-level records identifying the system that generated the order. B5 receipts identify the agent (B2), the action (B1), and the time (B3). B5 rights and payment events record the financial outcome. The combination satisfies RTS 6 and RTS 22 order identification requirements.

**FDA Good Machine Learning Practice.** GMLP expects audit trails for clinical decision support. B5 receipts identify the agent system, the model version, the input, and the output for every clinical decision. B6 export provides the FDA-preferred format. HIPAA requirements on the agent identity side (A4 attestation) are satisfied by the companion Agent Notarized Identity specification.

**HIPAA Security Rule.** Electronic protected health information access logging. B1 capture records access events. B2 identity binding identifies the accessing agent. B5 receipts are permanent and tamper-evident. B4 subnet anchoring satisfies the audit trail integrity requirement.

**ISO/IEC 27001.** Information security management system evidence requirements. B5 receipts provide the cryptographic evidence of who did what when. B6 export produces the evidence package in ISO 27001 format.

**RFC 3161 / ISO/IEC 18014.** Trusted electronic timestamps. The Clockchain five-layer audit chain exceeds both standards. B3 timestamps are admissible as RFC 3161 trusted timestamps.

## 9. AgentDash Reference Deployment

AgentDash is the design partner of record and the first deployment target for Agent Notarized Receipt. The following describes how AgentDash uses this specification.

**B1 capture in AgentDash.** The Clockchain Agent-SDK ships as an AgentDash plugin worker. Every adapter event — Claude Code tool call, Hermes chat turn, Cursor edit, Codex build, OpenCode task — flows through the plugin bus and is captured by the SDK before it reaches the WebSocket bus. The capture is transparent to the adapter; the adapter does not need to be modified.

**B2 identity binding in AgentDash.** The CoS routing message includes the dispatched worker's DID. The SDK reads the DID from the AgentDash routing context and binds every captured event to the correct worker, automatically, without per-call configuration. When the CoS dispatches to a different worker mid-task, the SDK switches binding context.

**B3 timestamping in AgentDash.** Each AgentDash workspace has a dedicated Clockchain subnet. Events are timestamped by that subnet's validator quorum. For high-volume workspaces, the subnet's BFT quorum scales up to handle the load without affecting other workspaces.

**B4 subnet anchoring in AgentDash.** Each AgentDash workspace gets its own subnet. The default anchoring cadence is hourly. Enterprise tenants can configure per-action anchoring for higher evidentiary weight — every task completion receipt is immediately committed to mainnet.

**B5 receipt minting in AgentDash.** One receipt per CoS-dispatched task, not one per LLM call. The receipt rolls up every event the worker produced while completing the task: tool invocations, file edits, API calls, human approvals. The receipt references the worker's notarized identity. The receipt is stored inline with the task in the workspace audit log.

**B6 retrieval in AgentDash.** AgentDash's Pro-tier workspace audit log lists receipts alongside the chat thread. Workspace owners can filter by agent, time range, and action type. Bulk export to SEC, FDA, and EBA formats is a Pro-tier feature. Retention policy is configurable per workspace — default is six years to cover SEC 17a-4 and HIPAA.

## 10. Open Questions and Inflection Points

This section documents design choices that v0 does not resolve. Each item maps to an active inflection point from `inflection-points.md`.

**IP2 — Anchor-the-stack vs. compete-the-stack.** The spec assumes the anchor posture — Clockchain receipts reference LangSmith/Helicone/Phoenix trace IDs rather than replacing those platforms. The question of whether a full-stack Clockchain observability product competes directly with those vendors is not resolved here. The anchor posture is the working assumption.

**IP3 — Vertical-first vs. horizontal-first GTM.** The spec is written to serve any vertical. The question of whether to lead with a vertical-specific receipt format — SEC 17a-4 first, then others — is not resolved here. The B6 export formats are designed to support any vertical.

**IP4 — Subnet-native vs. shared-subnet entry tier.** The spec assumes dedicated subnets per enterprise customer. The question of whether AgentDash's individual workspace owners need their own dedicated subnet or can share an AgentDash-managed platform subnet is open. The AgentDash platform subnet question is the first test of this inflection point.

**IP6 — Receipt-as-product vs. SDK-as-product.** The spec defines the receipt artifact in detail and the SDK as its production mechanism. The question of pricing — per-seat SDK pricing vs. per-receipt volume pricing — is not a spec concern but will drive implementation priorities.

**B1 open question — reasoning step granularity.** The spec defaults to batching reasoning steps and emitting one composite hash per batch. Full per-step receipts are opt-in. The correct default is not resolved; evidence from AgentDash's production usage will inform this.

**B1 open question — PII in captured events.** The spec captures hashes of inputs and outputs, not the raw content. This protects privacy but limits what a B6 auditor can inspect. A future version may add an encrypted PII field accessible only to authorized auditors.

**B3 open question — latency budget for real-time agents.** The online path returns timestamps within tens of milliseconds. For trading agents that require sub-millisecond latency, the current online path may be too slow. A dedicated high-performance subnet tier for real-time agents is a potential future design.

**B5 open question — minimum viable receipt for regulators.** The spec defines a rich receipt format. Regulators — SEC, FDA, EBA — may require fewer fields. The minimum viable receipt format that satisfies each regulator's template is not yet validated against actual regulatory submissions.

**B6 open question — subnet dissolution retention.** The spec defines the dissolution flow and the customer obligation to specify retention. The Clockchain-managed cold storage product for long-term retention is not yet designed. This is a future product decision.

**B6 open question — counterparty verification endpoint.** The spec defines `verify_receipt()` as an SDK function. A public HTTPS endpoint that allows any counterparty to verify a receipt without installing the SDK is a potential future addition.

## 11. Versioning and Change Process

This specification is versioned semantically: `major.minor`. The current version is `v0.1`.

**v0.x range.** During the v0 period, the specification is unstable. Minor version bumps occur when a layer gains a new field, a new integration shape, a new export format, or a clarified design choice that does not break the existing integration interface. Briefs may propose v0 refinements; Yang merges.

**v1.0.** The specification reaches v1.0 when all six layers have been validated against at least one production deployment (AgentDash), when the B6 export formats have been validated against at least one actual regulatory submission, and when the receipt schema has been stable for one full quarter without a breaking change. v1.0 signals API stability.

**Change process.** A brief identifies a refinement to a specific layer (B1 through B6). The brief proposes the change with rationale and a version bump recommendation. Yang reviews. If accepted, Yang updates the relevant layer section and bumps the minor version. Breaking changes to v1.0+ require a major version bump and a migration guide.

**Canonical location.** This specification lives at `docs/thesis/spec-agent-notarized-receipt-v0.md` in the Clockchain Research repository. The associated Product A specification lives at `docs/thesis/spec-agent-notarized-identity-v0.md`. Both are rendered at `/spec/agent-notarized-receipt` and `/spec/agent-notarized-identity` on the Clockchain Research public site.

Read the companion specification at [`/spec/agent-notarized-identity`](/spec/agent-notarized-identity).
Read the manifesto at [`/manifesto/agent-notarized-receipt`](/manifesto/agent-notarized-receipt).
