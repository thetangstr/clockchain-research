---
slug: spec-agent-notarized-identity
title: "Spec: Agent Notarized Identity v0"
dek: RFC-style engineering specification for court-admissible cryptographic identity of autonomous AI agents, covering issuance, registry, delegation, attestation, revocation, and verification across six layers.
date: 2026-05-26
version: v0.1
---

# Spec: Agent Notarized Identity v0.1

> **Status.** This is a v0 draft. It is the first canonical engineering specification for Agent Notarized Identity. It is written to be read by an external engineering team integrating against the Clockchain Agent Notary Layer. It is not frozen. It will evolve through the same brief-propose, Yang-merge process that governs all product artifacts.

## 1. Summary

Agent Notarized Identity is the court-admissible identity primitive for autonomous AI agents. When an agent is born — when a chief of staff routes a task to a worker, when an orchestration platform spawns a sub-agent — that agent receives a notarized identity record issued by a Clockchain validator quorum, anchored to a multi-source Clockchain timestamp, and presentable to any third party without requiring trust in Clockchain as a company. The record proves which agent acted, under whose authority, within what scope, and whether that authority is still valid.

The specification covers six layers: A1 Issuance, A2 Registry, A3 Delegation, A4 Attestation, A5 Revocation, and A6 Verification. Together they form the complete lifecycle of an agent's identity from birth through revocation and verification in court.

Agent Notarized Identity is not a W3C DID implementation, though it is interoperable with W3C Decentralized Identifiers. It is not a service-account token, though it carries a public key. It is a notarized fact — a claim about an agent's existence, authority, and standing that is certified by an independent, financially-incentivized validator quorum rather than issued by a single vendor. Any third party can verify the fact using only the public ledger. No trust in Clockchain is required to verify a notarized identity.

## 2. Terminology

**Agent.** An autonomous AI actor that takes actions — invoking tools, signing outputs, transacting — under the delegated authority of a principal.

**Principal.** The human, organization, or upstream agent that authorizes an agent's existence and defines the scope of its delegated authority. The principal signs the A1 issuance transaction with their own decentralized identifier.

**Notarized Identity Record.** The artifact produced at A1 issuance. A structured document encoding the agent's public key, principal chain, capability scope, economic mandate, issuance timestamp, and validator quorum signatures. Issued once at agent birth; immutable unless revoked.

**Validator Quorum.** A randomly elected subset of Clockchain validators, selected via Verifiable Random Function for each issuance event, who independently certify the issuance and sign the resulting record. A quorum requires two-thirds supermajority consensus.

**Principal Chain.** The chain of delegations from the root principal to the acting agent. For a single-level delegation, the chain is principal-to-agent. For a multi-level delegation — principal to chief of staff to worker — the chain records all three links, each attested by the issuer's own notarized identity.

**Capability Scope.** The encoded set of actions an agent is permitted to take. Defined at issuance by the principal. Encoded as a set of capability tuples: `action type`, `target resource`, `magnitude cap`. The scope is unforgeable from the moment of issuance.

**Economic Mandate.** A subset of capability scope that governs the agent's financial authority: spending limits, rights scope, and treasury governance policy. Recorded at A1 issuance. Required for agents that earn, hold, or spend assets.

**Delegation.** The act of an existing notarized agent issuing a notarized identity to a child agent, with a scope that is a subset of its own. Delegation chains are recorded on-chain and are provably derived from the parent certificate.

**Attestation.** A verifiable claim about an agent that is not a capability — certifications, audit results, model version declarations, safety eval outcomes. Attestations are signed by third parties and stored alongside the agent's notarized identity, but are separate from the issuance record.

**Revocation.** The act of withdrawing an agent's authority. Principal-initiated revocation is signed by the issuing principal. Cascading revocation invalidates all child agents whose delegation chain flows through the revoked parent. Revocation state is queryable on-chain.

**Verification.** The act of a third party confirming an agent's identity without trusting Clockchain. The verifier downloads the relevant ledger segment and reconstructs the evidentiary chain: VRF election, time consensus, validator signatures, issuance record.

**Subnet.** A customer-dedicated execution environment operated by a subset of staked Clockchain validators. Issuance events are recorded in the customer's subnet. Only a periodic cryptographic fingerprint of accumulated issuance events is committed to mainnet. Customer data is private by construction.

## 3. Architecture Overview

Agent Notarized Identity operates as a layer of the Clockchain Agent Notary Layer. The stack from bottom to top:

**Clockchain Mainnet** is the globally replicated, Byzantine-fault-tolerant ledger. It does not store agent identities. It stores periodic cryptographic fingerprints — single SHA-256 hashes — of accumulated issuance events from each customer subnet. This keeps mainnet capacity available for epoch finalization and governance while anchoring subnet state to a public, independently verifiable record.

**Customer Subnet** is the per-customer execution environment. Each enterprise customer operates a dedicated subnet with three to thirty staked validators. All issuance events, delegation chains, attestations, and revocation transactions are recorded in the subnet. No customer data appears on mainnet except the periodic state-root commitment. Subnets run BFT consensus internally; they do not compete with mainnet for throughput.

**Validator Quorum** is selected via Verifiable Random Function for each issuance event. The VRF output is recorded on the relevant subnet ledger, provably unbiased. No single validator, operator, or Clockchain as a company chooses who certifies a given issuance.

**Five-Layer Court-Admissible Audit Chain** backs every issuance event. Layer one: VRF validator election. Layer two: multiple physical time sources — GPS satellites, national atomic clocks, NTP servers operated by independent institutions — independently observe the moment. Layer three: each validator computes the agreed time on its own infrastructure in its own geographic location. Layer four: two-thirds supermajority signs. Layer five: result permanently recorded on the subnet ledger and later anchored to mainnet. This stack satisfies eIDAS qualified timestamps, RFC 3161, ISO/IEC 18014, the US ESIGN Act, and the UK Electronic Communications Act 2000.

**Token-Staked Slashing** ensures economic alignment. Validators bond $CCTT to participate. Collusion to issue a false identity triggers stake slashing. Economic incentive runs opposite to fraud.

The Agent Notarized Identity specification defines the six layers that sit above this substrate. The substrate — the validator quorum, the five-layer audit chain, the subnet architecture, the time consensus, and the slashing mechanism — is the same for Agent Notarized Identity and Agent Notarized Receipt. The two products share the same cryptographic foundation.

## 4. The Six Layers

### A1 — Issuance Layer

**Purpose.** Mint the agent's notarized identity record. Determines what gets recorded at the moment of birth.

**Fields recorded at issuance:**

- `agentDID` — the Clockchain DID for this agent, format `did:clockchain:<network>:<agent-id>`
- `publicKey` — the agent's Ed25519 or secp256k1 public key
- `principalDID` — the DID of the issuing principal
- `principalChain` — array of DIDs forming the full delegation chain from root principal to this agent
- `capabilityScope` — encoded scope as a set of `(actionType, targetResource, magnitudeCap)` tuples
- `economicMandate` — spending limits, rights scope, treasury governance policy, encoded as a structured object
- `issuanceTimestamp` — Clockchain multi-source UTC consensus timestamp
- `validatorQuorumSignatures` — threshold signature from the BFT quorum that certified this issuance
- `policyHash` — SHA-256 hash of the full policy document, for tamper-evident reference
- `expiryTimestamp` — optional time-boxed expiry, after which the identity is not valid without renewal

**Issuance policy defaults:** At birth, the principal may attach a default policy. If no explicit policy is provided, the issuance layer applies the customer's default policy from their subnet configuration.

**Who can issue:** Any principal with a valid Clockchain DID. Issuance transactions must be signed by the principal's key. Batch issuance is supported — one transaction minting multiple child-agent identities — where the principal's certificate carries the `delegate` capability.

**AgentDash integration shape:** The AgentDash chief of staff mints a worker DID when it dispatches a task to a plugin-backed agent. The workspace principal is the issuing principal. The CoS holds the delegation capability. The task scope encodes the worker's permitted actions for the duration of the task.

### A2 — Registry Layer

**Purpose.** Store DIDs and resolve them to on-chain registry entries. Determines how identity is looked up.

**Resolution path:** `did:clockchain:<network>:<agent-id>` resolves to the on-chain registry entry in the customer's subnet. The resolver returns the full notarized identity record including current revocation state.

**Resolution scoping:** Agents owned by an enterprise tenant resolve only with tenant-scoped credentials. Public agents — those belonging to shared platforms like AgentDash CoS personas — resolve openly without credentials.

**Interoperability:**

- W3C DID Core v1.1 compatibility via DID method specification (`did:clockchain`)
- ERC-8004 Identity Registry alias: every Clockchain DID may optionally mint a parallel ERC-8004 NFT representation on Ethereum mainnet for cross-chain proof of identity
- RNWY soulbound passport compatibility: Clockchain notarized identity can be registered as an attestation on the RNWY protocol
- Kite Agent Passport: Clockchain identity can serve as the issuing authority for a Kite passport

**Indexing:** The registry supports search by principal DID, by deployment tenant, by capability type, and by expiry window.

**Resolver hosting:** The resolver is a Clockchain network node function. Customers may run their own resolver pointing at their subnet. A public CDN-cached resolver serves open-resolution for public agents. Private-agent resolution requires subnet-scoped authentication.

### A3 — Delegation Layer

**Purpose.** Govern the scope of authority encoded in the certificate and the rules for sub-delegation.

**Capability scopes:**

- `read` — permitted to read specified resources
- `write` — permitted to write to specified resources
- `spend` — permitted to spend up to a specified magnitude cap from the agent's treasury
- `sign` — permitted to produce cryptographic signatures binding the principal
- `delegate` — permitted to issue notarized identities to child agents within a constrained scope

**Sub-delegation rules:**

- An agent can delegate only capabilities it holds, and only within the magnitude cap it was issued
- Each child agent's certificate cryptographically references the parent's DID
- Delegation chains are recorded on-chain and are provably reconstructible
- Maximum chain depth is eight levels; deeper chains require explicit principal re-authorization

**Time-boxed delegation:** All delegated scope expires by default at the parent certificate's expiry unless explicitly renewed by the principal. Renewal requires a new A1 issuance transaction signed by the principal.

**Conditional delegation:** Scope may be activated only when specific conditions are met — for example, an agent may hold a `sign` capability that activates only when a human-approval receipt from principal X is present in the receipt chain. Conditional scope is encoded in the policy document referenced by the `policyHash`.

### A4 — Attestation Layer

**Purpose.** Record verifiable claims about an agent that are not part of the issuance record — credentials, certifications, audit results, model version declarations.

**Attestation types:**

- **Self-attestation:** the agent declares its own model version, framework version, and prompt version. Self-attestations are signed by the agent's key and counter-signed by the agent's notarized identity.
- **Third-party attestation:** a Clockchain-registered auditor signs an attestation that the agent passed a safety eval, completed a training run, or holds a specific certification.
- **Platform attestation:** the host platform (AgentDash, LangChain, Anthropic Agent SDK) attests to the runtime context — which adapter version is running, which model is selected, which tool set is available.

**EAS/Verax compatibility:** Every Clockchain attestation also mints a record on the Ethereum Attestation Service and Verax protocols for cross-ecosystem portability.

**Attestation lifecycle:** Attestations carry their own expiry. They may be revoked independently of the agent's identity. Attestations may be challenged by any party and resolved via the subnet's dispute process.

**Relationship to Product B:** Attestations attach to the agent's Product A identity. A B5 receipt that references a specific model version or safety eval outcome links to the corresponding A4 attestation record.

### A5 — Revocation Layer

**Purpose.** Withdraw an agent's authority. Determines how identity is invalidated.

**Principal-initiated revocation:** The issuing principal signs a revocation transaction. Effect propagates to all Clockchain subnets within one settlement cycle. The revocation is recorded on-chain with timestamp and reason.

**Auto-revocation triggers:** Stake-loss on the validator side triggers automatic revocation of any agent whose issuance quorum included the slashed validator. Expiry timestamp expiration triggers automatic revocation. Policy violation detected by an attached safety attestation triggers revocation.

**Cascading revocation:** Revoking an agent's `delegate` capability invalidates all child agents whose delegation chain flows through the revoked parent. The subnet automatically computes and records the full revocation cascade.

**Revocation registry:** A queryable on-chain list of revoked DIDs, updated at each settlement cycle. Any verifier must check the revocation registry before accepting an agent's signature or action.

**Latency commitment:** Revocation propagation within a subnet is sub-block. Cross-subnet propagation completes within one settlement cycle. This is the v0 target; regulatory requirements for specific verticals (fraud detection, trading) may require faster propagation, which is an open design choice.

### A6 — Verification Layer

**Purpose.** Enable third parties to confirm an agent's identity without trusting Clockchain as a company or any other single vendor.

**On-chain verification process:**

1. Acquire the agent's DID and the relevant ledger segment from the public Clockchain ledger
2. Reconstruct the VRF election proof that selected the issuance quorum
3. Verify the validator quorum signatures against the recorded public keys
4. Confirm the multi-source time consensus for the issuance timestamp
5. Verify the issuance record hash against the subnet's state-root commitment on mainnet
6. Check the revocation registry for the agent's current status

**Court-admissible verification packet:** A packaged export containing: the notarized identity record, the relevant ledger blocks, the VRF election proof, the validator quorum signatures, and a plain-English explanation of the evidentiary chain suitable for a non-technical judge or jury. The packet is self-contained — a court-appointed expert can verify it without running Clockchain software.

**SDK helper:** The Clockchain Agent-SDK exposes a `verify_agent_identity(did)` function that performs all six steps and returns a verification result object with the agent's current status, issuance timestamp, capability scope summary, and revocation state. This is the one-call integration point for any developer verifying a counterparty agent.

**Verification packet formats:** The packet is exportable as JSON for machine consumption and as a PDF-plus-JSON bundle for legal proceedings. The format is defined in the companion `ClockchainVerificationPacket` schema.

## 5. Issuance Flow

The issuance flow produces a notarized identity record. Sequence:

1. **Principal prepares issuance transaction.** The principal — a human, an organization, or an upstream agent — constructs an A1 issuance transaction containing: the candidate agent's public key, the intended capability scope, the economic mandate (if applicable), the expiry, and the principal's own DID signature.

2. **Transaction submitted to subnet.** The issuance transaction is submitted to the customer's Clockchain subnet. The subnet's mempool accepts it and assigns it a sequence number.

3. **VRF validator election.** The subnet's VRF selects the validator quorum for this issuance round. The VRF output is deterministic, recorded on the subnet ledger, and independently reproducible by any observer.

4. **Validator independent time observation.** Each validator in the quorum independently queries its configured time sources — GPS, atomic clock, NTP — and records the observed time. No validator sees another validator's observation before committing its own.

5. **Consensus on time and issuance.** Validators exchange observed times and issuance data. Once two-thirds supermajority is reached on both the timestamp and the issuance content, each validator signs the result.

6. **Notarized identity record assembled.** The threshold signature, the VRF proof, the consensus timestamp, and the issuance fields are assembled into the notarized identity record.

7. **Subnet ledger write.** The record is written to the subnet ledger with the consensus timestamp. The record is now immutable unless revoked.

8. **State-root commitment to mainnet.** At the next anchoring interval — hourly or daily, per customer configuration — the subnet computes a single SHA-256 hash of all accumulated issuance events and commits it as one transaction to mainnet.

```
Principal
  |
  | A1 issuance tx (signed)
  v
Customer Subnet
  |
  |-- VRF selects validator quorum
  |
  |  Validator 1: observe time [GPS + atomic + NTP]
  |  Validator 2: observe time [GPS + atomic + NTP]
  |  Validator 3: observe time [GPS + atomic + NTP]
  |
  |-- 2/3 supermajority reached on timestamp + content
  |
  |  Each validator signs: { issuance_record, timestamp, quorum_sig }
  v
Notarized Identity Record written to Subnet Ledger
  |
  | (periodic state-root commitment)
  v
Mainnet: SHA-256(subnet_state) committed as one tx
```

## 6. Verification Flow

A third party — regulator, counterparty, court — verifies an agent's notarized identity without running Clockchain software or trusting the Clockchain network as an institution.

1. **Third party acquires the agent's DID.** Typically via the counterparty presenting it in a transaction, a contract clause, or a Product B receipt that references it.

2. **Third party downloads the verification packet.** The Clockchain Agent-SDK, or any public ledger query tool, retrieves: the notarized identity record, the VRF election proof, the validator quorum signature set, and the mainnet anchor hash.

3. **Third party independently recomputes the VRF proof.** Using the public VRF parameters and the recorded election output, the third party confirms the correct quorum was selected. No party selected the validators — the VRF did.

4. **Third party verifies the quorum signatures.** Using the public keys of the elected validators, the third party confirms that two-thirds of the quorum signed the issuance record.

5. **Third party confirms the time consensus.** Using the recorded multi-source time observations and the ledger timestamp, the third party confirms the issuance was assigned a time that satisfies the five-layer audit chain requirements.

6. **Third party checks mainnet anchor.** The third party confirms the subnet's state-root commitment appears on mainnet and that the issuance record hash is included in the committed state.

7. **Third party checks revocation registry.** The third party queries the revocation registry for the agent's DID and confirms the identity is not revoked.

8. **Verification result produced.** The third party holds a cryptographically verified statement of: the agent's identity, the principal that authorized it, the scope it held at issuance, the time of issuance, and whether that authority is still active. The verification required no trust in Clockchain.

## 7. Interoperability

Agent Notarized Identity is designed to coexist with and enhance the broader agent identity ecosystem.

**W3C Decentralized Identifiers.** Clockchain operates a DID method (`did:clockchain`). The Clockchain DID method specification is published at the W3C DID Specification Registries. Resolution returns the on-chain registry entry. Clockchain DIDs are interoperable with any W3C DID-compatible verifier.

**ERC-8004.** The Ethereum ERC-8004 Identity Registry standard defines an on-chain identity contract. Clockchain supports optional minting of a parallel ERC-8004 representation for each Clockchain DID, enabling cross-chain identity proof for agents operating across Ethereum and Clockchain. The ERC-8004 representation references the Clockchain notarized identity as its authoritative source.

**RNWY.** The RNWY soulbound passport protocol treats identity as a non-transferable attestation record. A Clockchain notarized identity can be registered as the issuing authority for an RNWY passport. The RNWY passport enriches a Clockchain identity with social graph attestations.

**Kite Agent Passport.** The Kite Agent Passport standard defines a structured passport for autonomous agents. Clockchain serves as the issuing notary for Kite passports, replacing the Kite network's native signing with a Clockchain validator quorum signature.

**EAS / Verax.** Every Clockchain attestation (A4 layer) also mints an Ethereum Attestation Service record and a Verax record. This allows Clockchain-native attestations to travel with an agent's identity into Ethereum-based applications, DeFi protocols, and other EAS-compatible systems.

**OTel.** The OpenTelemetry semantic conventions for GenAI define standard attribute names for agent identity. The Clockchain Agent-SDK maps its internal identity fields to OTel span attributes, enabling Clockchain identity to flow through OTel-instrumented stacks (Phoenix, Helicone, OpenLLMetry, Datadog APM) without modification.

**LangChain.** LangChain's `BaseCallbackHandler` receives agent identity as a context object on every handler call. The Clockchain Agent-SDK for LangChain sets the active agent's DID in the LangChain callback context automatically.

**RFC 3161.** Clockchain timestamps satisfy RFC 3161 trusted timestamping requirements. The five-layer audit chain exceeds the single-source requirement of RFC 3161. Clockchain receipts are admissible as RFC 3161 trusted timestamps.

## 8. Regulatory Mapping

Agent Notarized Identity satisfies specific regulatory requirements for AI system identification across multiple frameworks. This section maps each layer to the specific requirement it serves.

**EU AI Act Article 13 — Transparency.** Article 13 requires high-risk AI systems to be identifiable throughout their lifecycle. A1 issuance records the agent's identity at birth. A5 revocation records when identity ends. A6 verification provides the artifact for regulatory inspection. Compliant deployment requires a notarized identity record for each deployed high-risk AI system.

**EU AI Act Article 72 — Post-Market Monitoring.** Article 72 requires persistent, tamper-evident records for post-market monitoring. The five-layer audit chain backing A1 issuance satisfies the tamper-evidence requirement. The subnet architecture satisfies the persistence requirement without exposing customer data to mainnet.

**SEC Rule 17a-4.** Broker-dealer records must identify the specific algorithm and version that produced a given record. A4 self-attestation records model version and prompt version against the agent's notarized identity. A6 verification produces the artifact a SEC examiner reviews. The combination of identity plus attestation satisfies the identification requirement.

**MiFID II RTS 6 and RTS 22.** Transaction reporting requires identification of the system that generated the order. A1 identity plus B5 receipts together identify the agent and the specific action. The notarized identity binds the agent's DID to the regulatory identifier.

**eIDAS 2.0 — Qualified Electronic Identity for Autonomous Systems.** eIDAS 2.0 extends qualified electronic identity to autonomous systems. The five-layer Clockchain audit chain satisfies eIDAS qualified timestamp and attestation requirements. A1 issuance is designed to meet the eIDAS qualified electronic attestation standard for autonomous system identity.

**RFC 3161 / ISO/IEC 18014.** Both standards define requirements for trusted electronic timestamps. Clockchain's five-layer audit chain — multi-source time, VRF election, validator quorum, supermajority signing, mainnet anchoring — meets or exceeds both standards. The A1 issuance timestamp satisfies RFC 3161 and ISO/IEC 18014 requirements.

**US ESIGN Act / UETA.** Electronic signatures require a tamper-evident record of signing intent. A3 delegation with `sign` scope encodes the agent's signing authority. A1 issuance binds the signing key to the notarized identity. The five-layer audit chain satisfies ESIGN's evidentiary requirements.

**HIPAA Security Rule.** HIPAA requires unique identification of electronic protected health information access. A1 issuance provides unique agent identity. A4 attestation records the system context (model, version) for each access event. B5 receipts (see spec-agent-notarized-receipt) record the specific access event.

**FDA GMLP.** The FDA's Good Machine Learning Practice framework expects audit trails for clinical decision support systems. A1 identity plus A4 attestations identify the specific deployed system. B5 receipts (see spec-agent-notarized-receipt) record the specific clinical decision with full chain of custody.

## 9. AgentDash Reference Deployment

AgentDash is the design partner of record and the first deployment target for Agent Notarized Identity. The following describes how AgentDash uses this specification.

**AgentDash workspace principal.** Every AgentDash workspace has a principal DID registered during the setup wizard. The principal DID is owned by the workspace creator and represents the human or organization accountable for the workspace's agents.

**CoS birth certificate issuance.** When the AgentDash chief of staff dispatches a task to a worker agent — Claude Code, Codex, Hermes, Cursor, OpenCode, OpenClaw, Gemini, or Pi — the CoS issues an A1 issuance transaction on the workspace's dedicated Clockchain subnet. The issuance records: the worker's adapter-generated key pair, the CoS as issuing principal, the task scope as the `capabilityScope`, and the task's economic mandate if applicable.

**A2 resolution.** Each AgentDash workspace exposes a DID resolution endpoint at `did:clockchain:agentdash:<workspace-id>:<agent-id>`. Resolution is scoped to workspace members for private workers and open for shared CoS personas.

**A3 delegation.** The CoS holds the full `delegate` scope for the workspace. Sub-delegation to worker agents encodes the task's permitted actions. The delegation is time-boxed to the task's expected duration and expires automatically when the task completes or times out.

**A4 attestation.** AgentDash's `/assess` agent-readiness flow runs a capability evaluation against each adapter. The evaluation results are recorded as third-party attestations against the worker DIDs. Adapter version, model version, and runtime context are recorded as self-attestations.

**A5 revocation.** The workspace owner can revoke any worker agent via the AgentDash admin UI. Revocation propagates to the running adapters within one CoS heartbeat cycle. Cascading revocation fires if the CoS itself is revoked.

**A6 verification.** AgentDash exposes a per-workspace public verification endpoint. Any external counterparty — a code review tool, a deployed customer system, a regulator — can verify that a specific agent DID acted on behalf of a specific workspace at a specific time, by querying the verification endpoint with the DID.

## 10. Open Questions and Inflection Points

This section documents design choices that v0 does not resolve. Each item maps to an active inflection point from `inflection-points.md`.

**IP1 — Identity-first vs. SDK-first sequencing.** This spec covers Product A only. The question of whether Agent Notarized Identity ships as a standalone v1 product or ships first as a dependency of Product B is not resolved here. The spec is written to support either sequencing. The A6 SDK helper function (`verify_agent_identity`) is designed to ship regardless of sequencing order.

**IP4 — Subnet-native vs. shared-subnet entry tier.** The spec assumes dedicated subnets per enterprise customer. The question of whether a shared-subnet entry tier is offered for smaller customers is open. The issuance and verification flows are identical regardless of subnet type; only the deployment configuration changes.

**IP5 — Cryptographic-first vs. compliance-checkbox-first messaging.** The spec is written for an engineering audience and leads with the cryptographic primitives. The regulatory mapping in section 8 serves the compliance-checkbox audience. The tension between these two framings is present throughout and will be resolved as the GTM motion clarifies.

**A1 open question — KYC of principals.** Should the issuance layer require Know Your Customer verification of the human principal before a notarized identity can be issued for their agent? Current spec does not impose KYC. A future version may distinguish verified-human principals from organizational principals, with different trust levels.

**A1 open question — batch issuance limits.** AgentDash and similar orchestration platforms may need to mint hundreds of agent identities per minute. The spec supports batch issuance but does not yet specify throughput limits, batch size limits, or fee structures for batch transactions. These are v0 implementation decisions.

**A2 open question — ERC-8004 alias policy.** The spec supports optional ERC-8004 alias minting but does not specify the default policy. Should every Clockchain DID automatically mint an ERC-8004 representation, or only on-demand? Automatic provides broader cross-chain compatibility. On-demand reduces mainnet footprint.

**A3 open question — maximum delegation chain depth.** The spec sets maximum chain depth at eight levels. This is an implementation parameter, not a cryptographic constraint. Evidence from multi-hop delegation patterns in AgentDash and other orchestration platforms will drive the final number.

**A5 open question — revocation propagation latency.** The spec targets sub-block propagation within a subnet and one settlement cycle across subnets. Regulated verticals — trading agents, fraud detection, clinical AI — may require sub-minute propagation. This is a product decision that affects validator infrastructure and is not resolved here.

**A6 open question — verification packet format.** The spec defines the verification packet contents but not the canonical format for legal proceedings. A PDF-plus-JSON bundle is the working assumption. Final format should be validated against actual SEC examination templates and EU regulatory inspection practices.

## 11. Versioning and Change Process

This specification is versioned semantically: `major.minor`. The current version is `v0.1`.

**v0.x range.** During the v0 period, the specification is unstable. Minor version bumps occur when a layer gains a new field, a new capability, or a clarified design choice that does not break the existing integration interface. Briefs may propose v0 refinements; Yang merges.

**v1.0.** The specification reaches v1.0 when all six layers have no open implementation questions, all regulatory mappings have been validated against actual regulatory templates, and at least one external integration has been built against it. v1.0 signals API stability.

**Change process.** A brief identifies a refinement to a specific layer (A1 through A6). The brief proposes the change with rationale and a version bump recommendation. Yang reviews. If accepted, Yang updates the relevant layer section and bumps the minor version. Breaking changes to v1.0+ require a major version bump and a migration guide.

**Canonical location.** This specification lives at `docs/thesis/spec-agent-notarized-identity-v0.md` in the Clockchain Research repository. The associated Product B specification lives at `docs/thesis/spec-agent-notarized-receipt-v0.md`. Both are rendered at `/spec/agent-notarized-identity` and `/spec/agent-notarized-receipt` on the Clockchain Research public site.

Read the companion specification at [`/spec/agent-notarized-receipt`](/spec/agent-notarized-receipt).
Read the manifesto at [`/manifesto/agent-notarized-identity`](/manifesto/agent-notarized-identity).
