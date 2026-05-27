# Product Baseline — Working Definition of Products A and B

> **What this file is.** A versioned, public-safe baseline spec for Products A and B, broken into named layers (the way MIFAL describes Zeus / Guardian / MNEME / Darwin / Forge). Every weekly brief reads this file before writing its tie-back. Briefs may *refine* a layer — sharpen its definition, identify a missing capability, flag a layer that turned out to be unnecessary — but the brief generator does not silently overwrite it. Refinements happen via the tie-back section, and Yang updates this file when the refinement compounds.
>
> **Versioning.** Update the `Baseline version` line below when this file changes. Each brief is implicitly written against a specific baseline version; the diff between versions is the product evolution.

**Baseline version:** v0.1 — 2026-05-26
**Maintainer:** Yang Tang, Head of AI Products at Clockchain

---

## The two products in one sentence each

- **Product A — On-Chain Agent Identity.** *WHICH agent acted, and under what authority.* A cryptographic birth certificate per agent, anchored on the Clockchain network, that proves issuance, delegation, capabilities, and revocation state.
- **Product B — Clockchain Agent-SDK.** *WHAT the agent did, and can you prove it in a court of law.* A developer SDK that captures every agent action through the host framework, binds each event to the agent's Product A identity, anchors the event to a court-admissible Clockchain timestamp, and emits a Smart Receipt the customer can present to a regulator, auditor, or court.

The two products are co-dependent. Product A without Product B is identity without a record. Product B without Product A is records without provenance. Sold together, they are the agent-trust primitive that the EU AI Act, eIDAS 2.0, SEC 17a-4, MiFID II, HIPAA, and SOC 2 for AI all require but none of the existing observability vendors can ship.

---

## Product A — Six Layers

The agent-identity product, broken into the layers Yang's engineering squad aligns on. Each layer is a separate engineering surface and a separate decision point.

### A1 — Issuance Layer

How an agent's birth certificate is minted, and who is allowed to mint it.

- **Principal**: the human, organization, or upstream agent authorizing the new agent. The principal signs the issuance transaction with their own DID.
- **Issuance evidence**: what proof of authority is required (corporate signing key? Multi-sig from a registered Clockchain deployer? Attestation from an upstream issuer like AgentDash?).
- **Default policy attached at birth**: spending limits, action scope, expiry, environment binding.
- **Birth-certificate fields**: agent name, public key, principal DID, capabilities, policy hash, issuance timestamp, validator quorum signatures.

**Open questions the research must sharpen**: Should issuance require KYC of the principal? Can issuance be batch-minted (e.g., AgentDash mints 100 agents for its enterprise tenant in one transaction)? How does revocation propagate if the principal itself is revoked?

### A2 — Registry Layer

Where DIDs live and how they are resolved.

- **Resolution path**: `did:clockchain:<network>:<agent-id>` resolves to the on-chain registry entry plus the Clockchain subnet of record.
- **Interop**: bidirectional translation with W3C DID Core v1.1, ERC-8004 Identity Registry, RNWY soulbound passport, Kite Agent Passport.
- **Indexing**: searchable by principal, by deployment, by capability, by expiry.
- **Public vs. private discovery**: agents owned by an enterprise tenant resolve only with tenant-scoped credentials; public agents (AgentDash CoS, OpenAI Agents) resolve openly.

**Open questions**: How aggressive should we be on ERC-8004 alias support — do we mint a parallel ERC-8004 NFT for every Clockchain DID, or only on demand? Where do we host the resolver — is it a Clockchain network node, or a CDN-cached public service?

### A3 — Delegation Layer

The scope of authority encoded in the certificate.

- **Capability scopes**: read / write / spend / sign / delegate, each with a target resource and a magnitude cap.
- **Sub-delegation**: an agent can mint a child agent only if its certificate carries the `delegate` capability with the child's scope.
- **Time-boxed delegation**: scope expires unless explicitly renewed by the principal.
- **Conditional delegation**: scope active only when specific Smart Receipt patterns are present (e.g., "this agent can sign only after a human approval Receipt from principal X").

**Open questions**: How do delegation chains compose across multiple agent platforms — e.g., AgentDash CoS delegates to Claude Code, Claude Code delegates to a sub-agent? Is there a max chain depth? How does revocation cascade?

### A4 — Attestation Layer

Verifiable claims about the agent that are NOT capabilities — credentials, certifications, audit results, reputation.

- **Self-attestation**: agent declares its own model, framework, prompt version.
- **Third-party attestation**: a Clockchain-registered auditor signs an attestation that the agent passed a specific safety eval, completed a specific training run, or holds a specific certification.
- **EAS / Verax compatibility**: every Clockchain attestation also mints an EAS / Verax record for cross-ecosystem portability.
- **Attestation lifecycle**: attestations can expire, be revoked, or be challenged.

**Open questions**: Are attestations on Product A (the identity) or on Product B (the per-action receipt)? Probably both — the identity carries "this agent is certified to do X"; the receipt carries "this action used certified-model-version-Y."

### A5 — Revocation Layer

How an agent's authority is taken away.

- **Principal-initiated revocation**: the issuing principal signs a revocation transaction; effect propagates to all Clockchain subnets within one settlement cycle.
- **Auto-revocation triggers**: stake-loss (validator-side), expiry, policy violation detected by an attached safety attestation.
- **Cascading revocation**: revoking a parent agent's `delegate` capability automatically invalidates downstream child agents.
- **Revocation registry**: queryable list of revoked DIDs, used by any verifier before accepting an agent's signature.

**Open questions**: How fast is "fast enough" for revocation propagation — same block? Same epoch? Within an hour? Regulatory standards for fraud agents may demand sub-minute propagation; current Clockchain epoch cadence may not meet that yet.

### A6 — Verification Layer

How third parties confirm an agent's identity without trusting Clockchain.

- **On-chain verification**: any verifier downloads the relevant ledger segment and reconstructs the chain of evidence from VRF election → time consensus → validator signatures.
- **Court-admissible export**: a "verification packet" includes the birth certificate, the relevant ledger blocks, the validator-election proof, and a plain-English explanation suitable for a non-technical judge or jury.
- **SDK helper**: Product B ships a `verify_agent_identity()` function so any developer can confirm a counterparty agent's certificate in one call.

**Open questions**: Should the verification packet be a standard format (X.509-style? PDF + JSON?) so a regulator's tooling can consume it? Who packages it — the SDK, a Clockchain web service, or the customer's own subnet?

---

## Product B — Six Layers

The Agent-SDK, broken into layers. Each is a separate integration surface and a separate decision point.

### B1 — Capture Layer

How the SDK plugs into the host agent framework and what it captures.

- **Integration shapes**: LangChain `BaseCallbackHandler`, OpenTelemetry exporter (for OTel-instrumented stacks like Phoenix, Helicone, OpenLLMetry), MCP middleware (intercepting MCP tool calls), Anthropic Agent SDK hook, OpenAI Agents SDK trace processor, AgentDash plugin worker.
- **Captured events**: LLM call (prompt hash, completion hash, model ID, latency), tool invocation (name, input hash, output hash), reasoning step, state transition, human intervention, error.
- **Inclusion policy**: customer configures which event classes get receipts. Default is "every irreversible or externally-visible action gets a receipt."

**Open questions**: Do we capture every reasoning step, or just terminal actions? Reasoning steps are huge in volume — do they need full receipts, or batched periodic hashes?

### B2 — Identity Binding Layer

Every captured event is stamped with the acting agent's Product A DID.

- **Single-agent case**: SDK initialized with one agent DID; every event is bound to it.
- **Multi-agent case**: AgentDash CoS dispatches work to a specific worker agent; the SDK detects the active agent via the host framework's context and binds the event to the right DID.
- **Delegation chain**: the receipt records the full delegation chain (`principal → CoS → worker`), not just the leaf agent.

**Open questions**: How does the SDK get the active agent's DID — environment variable, runtime context, framework-specific hook? Standardize this across frameworks or accept N integration patterns?

### B3 — Timestamping Layer

Each event acquires a court-admissible Clockchain timestamp.

- **Online path**: SDK calls the customer's Clockchain subnet; subnet runs its BFT round; returns a signed timestamp within tens of milliseconds.
- **Offline / batched path**: SDK accumulates events locally (in a hardware-backed enclave or signed local journal), batches to the subnet on a schedule.
- **Time-source fallback**: if the customer's subnet is unreachable, SDK falls back to a mainnet anchor with degraded latency but preserved evidentiary weight.

**Open questions**: What latency budget is acceptable for in-the-loop timestamping vs. asynchronous? Real-time tool calls (e.g., trading agents) may need synchronous; long-running reasoning may tolerate async.

### B4 — Subnet Anchoring Layer

Events accumulate in the customer's dedicated subnet; periodically rolled up to mainnet.

- **Per-customer subnet**: the standard deployment shape — every customer has 3-30 staked nodes serving only their events.
- **Anchoring cadence**: hourly, daily, or epoch-aligned, configurable.
- **State-root commitment**: each cycle, a single SHA-256 of all accumulated events lands on mainnet as one transaction.
- **Subnet residency**: the subnet's node geography satisfies the customer's data-residency requirements (EU subnet for GDPR scope, US subnet for SEC scope, etc.).

**Open questions**: Do we offer a shared-subnet tier for SMB customers, or is dedicated-subnet always the only deployment shape? Shared cuts cost but breaks the privacy story.

### B5 — Receipt Minting Layer

Each completed action produces a Smart Receipt — the deliverable.

- **Receipt fields**: agent DID, principal chain, event hash, input hash, output hash, model/tool version, agreed timestamp, validator-quorum signature, subnet anchor reference, mainnet block reference.
- **Receipt format**: machine-readable JSON + court-admissible verification packet on demand.
- **Atomicity**: one receipt per logical agent action — not per LLM call. A multi-step tool invocation rolls up into one receipt.
- **Receipt index**: customer-side searchable index keyed by agent, time range, action type, principal.

**Open questions**: What is the minimum-viable Receipt that a regulator (SEC, FDA, EBA) will accept as evidence? Need to test against real regulatory templates, not theoretical.

### B6 — Retrieval & Verification Layer

How customers pull receipts and present them.

- **Customer-side query API**: filter by agent DID, time window, action type, principal.
- **Audit export**: bulk export to CSV / JSON / regulator-specific format (e.g., SEC 17a-4 WORM-compatible).
- **Dispute resolution flow**: customer presents the Receipt; counterparty runs `verify_receipt()` against the public ledger; either accepts the proof or contests it (which triggers the five-layer audit chain).
- **Long-term retention**: Receipt is permanent on mainnet (anchored), but the customer's subnet may dissolve when the contract ends. Need explicit handoff for long-tail evidentiary retention.

**Open questions**: How long after the customer's contract ends must Receipts remain retrievable? SEC 17a-4 demands six years; HIPAA demands six years; some legal contexts demand longer. Subnet dissolution flow needs explicit retention policy.

---

## How weekly briefs evolve this baseline

Every brief's tie-back section refines this baseline in one of three ways:

1. **Sharpens a layer.** A brief on LangChain might conclude: "B1 Capture Layer needs a LangChain callback handler that ships timestamped events on every tool invocation — five-line install, no source changes." That's a sharpening of B1.
2. **Identifies a missing layer or capability.** A brief on SEC 17a-4 might conclude: "B6 Retrieval Layer is missing a WORM-compatible export format. Add B6.1 — Regulator-Format Export — to the baseline." That's a new sub-layer.
3. **Surfaces an inflection point.** A brief on Kite vs. ERC-8004 might conclude: "A2 Registry Layer must choose: maintain bidirectional ERC-8004 compatibility, or build a Clockchain-native DID method and bridge later." That's not a baseline change yet — it goes into `inflection-points.md` for Yang to decide.

The brief generator never silently overwrites this file. The tie-back section calls out the implied refinement; Yang decides whether to update the baseline. The next baseline version increments when Yang merges the changes.
