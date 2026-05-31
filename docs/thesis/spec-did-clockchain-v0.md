# did:clockchain Method Specification v0.1

> A W3C DID method that gives every AI agent a registered identity carrying a dedicated **receipt-signing key**, separate from any payment address, so an Agent Notarized Receipt proves not just *what* was signed and *when*, but *which* agent signed it — anchored to Clockchain's court-grade time.

**Status:** Draft — research-stage. Not a registered DID method. Targets **public testnet** only (Clockchain testnet, live Feb 2026). No production mainnet exists; nothing here should be read as describing a live mainnet system.
**Date:** 2026-05-28
**Editors:** Clockchain Protocol Architecture (D4D Sàrl)
**Confidence tags used throughout:** **(C)** confirmed against a primary specification · **(P)** projected / Clockchain design choice · **(G)** open gap requiring further specification.

---

## 0. Plain summary

Every AI agent that does something on your behalf should be able to hand you a receipt, and you should be able to check who really signed it. Today you cannot. The popular agent standard (ERC-8004) gives an agent a wallet *address*, but that address is only where the agent gets **paid** — it is not a signing identity, so it cannot prove the agent put its name on a document. That is the missing link this specification fixes.

**did:clockchain** is a way of writing down an agent's identity as a `did:` string (a Decentralized Identifier) backed by an on-chain registry. The agent's identity record carries a special key whose *only* job is to sign receipts — kept deliberately separate from the agent's payment address and from the key that administers the identity. When an agent signs an **Agent Notarized Receipt**, the receipt points at that exact signing key. Anyone can then look up the agent's identity, confirm the key is the agent's official receipt-signing key, and check the signature.

The part no other system gives you is **independent time**. Clockchain's validators agree on a UTC timestamp that nobody who benefits from the receipt controls. So when a key is added, rotated, or revoked, the *moment* it happened is witnessed by neutral parties. That means a verifier can prove an ordering that holds up in court: "this receipt was signed *before* the key was revoked," or "this agent's identity existed *as of* this certified instant." The result closes the who-signed-it gap and stamps it with a time no party can fake. The rest of this document is the engineering blueprint.

---

## 1. The gap and the goal

### 1.1 The gap (G, confirmed against primary specs)

Clockchain ships two products:

- **Product A — Agent Notarized Identity:** proof of *which* agent acted, under *what* authority.
- **Product B — Agent Notarized Receipt:** a signed, independently-timestamped record of *what* an agent did.

Both depend on a link that does not exist in current agent standards: a cryptographic binding from a *receipt* to a *specific, registered agent identity*.

> **(C)** ERC-8004's `agentWallet` "is reserved and cannot be set via `setMetadata()`… It represents the address where the agent receives payments." ERC-8004 defines **no** separate signing key, `assertionMethod`, or receipt-signing verification method. [ERC-8004 §Identity Registry, https://eips.ethereum.org/EIPS/eip-8004]

Consequently a receipt today can prove *something* was signed and *when* (if timestamped), but **not which agent signed it**. The agent's only on-chain handle is a payment-receiving address with no signing semantics.

### 1.2 The goal

Specify an implementable, **W3C DID Core 1.1-conformant** method, `did:clockchain`, whose DID document carries a **dedicated receipt-signing verification method** in `assertionMethod`, structurally and cryptographically distinct from any payment address or controller key, and whose every lifecycle event (create, rotate, revoke, delegate, deactivate) is anchored to Clockchain's validator-consensus UTC time. This closes the WHO↔WHAT gap and adds an independently-verifiable WHEN.

### 1.3 Design model (P)

did:clockchain adopts the **did:ethr / ERC-1056 on-chain event-log pattern** as its base architecture, because it is the only mature peer method that simultaneously provides (a) an on-chain registry with event-log history enabling point-in-time resolution, (b) typed key purposes that enforce purpose-separation at protocol level (`veriKey`→`assertionMethod`, `sigAuth`→`authentication`), (c) explicit validity periods, and (d) a deterministic deactivation tombstone. **(C)** [ethr-did-resolver method spec, https://github.com/decentralized-identity/ethr-did-resolver/blob/master/doc/did-method-spec.md]

Methods considered and ruled out: `did:key` and `did:pkh` are deterministic-only with no update/deactivation; `did:web` relies on DNS/TLS with no key-rotation history; `did:webvh` adds verifiable history but without on-chain time anchoring. **(C)** [did:key v0.9, https://w3c-ccg.github.io/did-key-spec/ ; did:pkh, https://github.com/w3c-ccg/did-pkh/blob/main/did-pkh-method-draft.md]

**Three deliberate divergences from did:ethr (P):**

1. **Clockchain time on every event.** Replace reliance on `block.timestamp` with an explicit `clockchainTimestampProof` field sourced from a validator-consensus time oracle — independently verifiable and court-grade rather than miner-influenced.
2. **Receipt-signing key is a first-class field**, not a free-form attribute string — removing ambiguity about which key is canonical and making purpose-separation explicit in the contract ABI.
3. **Explicit registration required.** Unlike did:ethr (where any address is implicitly a DID), did:clockchain requires a Create transaction, so the genesis event carries a court-grade creation timestamp — itself the evidence Product A sells.

---

## 2. Method name & identifier syntax

### 2.1 Method name (C)

The method name is **`clockchain`**.

> **(C)** DID Core 1.1 ABNF: `method-name = 1*method-char`, `method-char = %x61-7A / DIGIT` — lowercase ASCII letters and digits only; no hyphens, underscores, or uppercase. [DID Core 1.1 §3.1, https://www.w3.org/TR/did-1.1/]

`clockchain` is all lowercase letters and is therefore valid. **The spelling `clockchain` is final.** Any variant spelling — e.g. `did:clock-chain` (hyphen) or `did:Clockchain` (uppercase) — would be **invalid per the ABNF and non-registerable** in the W3C DID Methods extension registry.

### 2.2 Identifier ABNF (P)

```abnf
did-clockchain        = "did:clockchain:" clockchain-specific-id
clockchain-specific-id = [ network-id ":" ] agent-id
network-id            = "testnet" / "mainnet"
agent-id             = 64HEXDIGLC          ; exactly 64 lowercase hex chars
HEXDIGLC             = DIGIT / %x61-66      ; 0-9 / a-f  (lowercase only)
```

- `network-id` is **OPTIONAL**; when absent, resolvers MUST default to `mainnet`. For v0.1 (testnet-only) the `testnet` label SHOULD always be present.
- `agent-id` is exactly **64 lowercase hex characters** (a 32-byte digest), no `0x` prefix.

> Conforms to DID Core 1.1 `method-specific-id = *( *idchar ":" ) 1*idchar`, further restricting `idchar` to lowercase hex plus the single `network-id` colon segment — a method MUST tighten, not merely restate, the generic ABNF. **(C)** [DID Core 1.1 §3.1]

### 2.3 agent-id derivation (P) — single normative definition

> **Review fix (resolves the dossier's two-definition inconsistency).** Earlier drafts gave two incompatible derivations (`SHA-256(pubkey)` vs. `base58btc(hash(chainId‖registry‖index))`). This section is the **single normative rule**; all other derivations are removed.

```
agent-id = lowercase_hex( SHA-256( chainId || registryAddress || receiptSigningPublicKeyBytes ) )
```

where:
- `chainId` — the Clockchain network chain identifier (canonical big-endian `uint64`),
- `registryAddress` — the 20-byte `ClockchainIdentityRegistry` contract address,
- `receiptSigningPublicKeyBytes` — the **raw 32-byte Ed25519 receipt-signing public key** (the key that lands in `assertionMethod`),
- `||` denotes byte concatenation, output rendered as 64 lowercase hex chars.

Rationale (P): binding `chainId || registryAddress` namespaces the identifier to a specific network + registry deployment (preventing cross-deployment collision), while binding the **receipt-signing public key** ties the very name of the identity to the key that closes the gap. The base58btc variant is **removed entirely**.

**Example:** `did:clockchain:testnet:a3f7c2d1b8e94f06a3f7c2d1b8e94f06a3f7c2d1b8e94f06a3f7c2d1b8e94f06`

---

## 3. The DID document

### 3.1 Required / recommended top-level properties (C)

| Property | Req. | did:clockchain rule |
|---|---|---|
| `@context` | MUST | First element MUST be `https://www.w3.org/ns/did/v1.1`; followed by `https://w3id.org/security/multikey/v1` and the Clockchain context `https://w3id.org/clockchain/did/v1` (P). |
| `id` | MUST | The DID string; MUST exactly equal the resolved DID. |
| `controller` | SHOULD | DID(s) whose controller key(s) may update this document. |
| `verificationMethod` | SHOULD | Array of verification method objects (§3.3). |
| `authentication` | SHOULD | References the controller/auth key (§3.4). |
| `assertionMethod` | SHOULD (MUST for Product B) | References the **receipt-signing key** (§3.4). |
| `capabilityInvocation` | SHOULD | References the controller key (authorizes registry calls). |
| `capabilityDelegation` | OPTIONAL | References a dedicated delegation key (§6). |
| `keyAgreement` | OPTIONAL | Optional X25519 key for encrypted agent comms. |
| `service` | OPTIONAL | Service endpoints (§3.5). |

> **(C)** `@context` serialized value MUST be `https://www.w3.org/ns/did/v1.1` or an array beginning with it. [DID Core 1.1 §6.2.3]. `id` is required; `controller` optional. [DID Core 1.1 §5]

### 3.2 The two mandatory verification methods (P)

Every did:clockchain DID document MUST contain **at least two structurally distinct verification methods**:

| # | Fragment | Type | Relationship(s) | Purpose |
|---|---|---|---|---|
| i | `#receipt-signing-key-1` | `Multikey` (Ed25519) | **`assertionMethod` only** | Signs Agent Notarized Receipts (Product B). |
| ii | `#controller-key-1` | `EcdsaSecp256k1VerificationKey2019` *or* `Multikey` | `authentication` + `capabilityInvocation` | Authorizes DID document updates / registry calls. |

**Normative separation rule (P).** The receipt-signing key and the controller key **MUST NOT share key material**, and the receipt-signing key **MUST NOT** be any ERC-8004 payment address. A compliant registry **MUST reject** a registration where `keccak256(receiptSigningPublicKey) == keccak256(controllerPublicKey)` (see §4.1, with test vector in §8.5). This prevents a stolen signing key from enabling document takeover, and a stolen controller key from forging receipts.

> **(C)** `assertionMethod` "is used to specify verification methods that a controller authorizes for use when expressing assertions or claims, such as in verifiable credentials." `authentication` is for challenge-response / login. A key placed only in `assertionMethod` cannot be used to satisfy an authentication proof purpose. [W3C CID 1.0 §2.3.x, https://www.w3.org/TR/cid-1.0/ ; DID Core 1.1 §5.3]

### 3.3 Verification method object shape (C)

Each verification method MUST contain `id`, `type`, `controller`, and **exactly one** verification-material property (`publicKeyMultibase` **or** `publicKeyJwk`, never both).

> **(C)** [W3C CID 1.0 §2.x; DID Core 1.1 §5.2]

The receipt-signing key uses `Multikey` with `publicKeyMultibase`:

> **(C)** Multikey Ed25519 encoding: 2-byte multicodec prefix `0xed01` + 32-byte raw public key → base-58-btc with multibase header `z`. [W3C CID 1.0 §Multikey; vc-di-eddsa v1.0 §2.1.1, https://www.w3.org/TR/vc-di-eddsa/]

**Verification-method type registry note (P/G).**
> **Review fix.** `Multikey` (and `Ed25519VerificationKey2020`) are **not yet listed** in the DID Spec Registries *DID Extensions Properties* document; `Multikey` is defined normatively in **W3C Controlled Identifiers v1.0** (Recommendation, May 2025) and is the type the `eddsa-rdfc-2022` cryptosuite requires. DID Core says types **SHOULD** be registered (not MUST), so using `Multikey` is **not a conformance violation**, but for maximal interop, implementations that require a registered type **SHOULD additionally** express the same key as a parallel `Ed25519VerificationKey2018` (confirmed registered) verification method until `Multikey` registration is confirmed. **(C/G)** [DID Extensions Properties, https://www.w3.org/TR/did-extensions-properties/ ; W3C CID 1.0]

### 3.4 Verification relationships (C)

- `authentication`: `["did:clockchain:testnet:<id>#controller-key-1"]`
- `assertionMethod`: `["did:clockchain:testnet:<id>#receipt-signing-key-1"]` — **the only permitted member at registration** unless a delegate is added (§6). No payment address and no authentication-only key may appear here.
- `capabilityInvocation`: `["…#controller-key-1"]`
- `capabilityDelegation` (optional): `["…#delegation-key-1"]` (§6).

### 3.5 Controller binding (C)

The receipt-signing method's `controller` MUST equal the agent's own DID, a self-referential binding. Binding is *enforced at write time*: only the on-chain controller address recorded for that `agent-id` may publish or update the document, so any verification method present in the document was authorized by whoever controls the on-chain identity record.

> **(C)** "To ensure that a verification method is bound to a particular controller, one must go from the expression of the verification method to its controlled identifier document, and then verify that the latter contains references to both the verification method and its controller." [W3C CID 1.0 §2.2]

### 3.6 Service endpoints (P)

A `ClockchainTimestampService` endpoint SHOULD be present, pointing at the validator timestamp API, so verifiers can resolve and re-check the court-grade time of any lifecycle event:

```json
{ "id": "did:clockchain:testnet:<id>#clockchain-time",
  "type": "ClockchainTimestampService",
  "serviceEndpoint": "https://time.clockchain.io/v1/proofs" }
```

---

## 4. CRUD operations

All four operations are defined (DID Core requires Create, Read/Resolve, Update, Deactivate). **(C)** [DID Core 1.1 §7.2]. For each, the table makes explicit **what is on-chain vs. off-chain** and **where Clockchain time anchors**.

### 4.1 CREATE / register (P)

| Aspect | Detail |
|---|---|
| Off-chain | Generate Ed25519 receipt-signing keypair (in TEE/MPC, §9.2). Generate controller keypair. Compute `agent-id` (§2.3). |
| On-chain call | `registerAgent(bytes32 agentId, bytes receiptSigningPubKey, bytes controllerPubKey, address paymentAddress)` |
| **Guard (P)** | Contract **MUST `require(keccak256(receiptSigningPubKey) != keccak256(controllerPubKey))`** and revert otherwise. Passing identical material is a conformance violation. |
| Event | `AgentRegistered(bytes32 indexed agentId, address indexed controller, bytes receiptSigningPubKey, uint64 clockchainTimestampProof, bytes32 previousChange)` |
| **Time anchor** | `clockchainTimestampProof` = validator-consensus UTC at tx time (§4.6). Becomes `didDocumentMetadata.created`. This certified genesis time **is** the Product A evidence. |

### 4.2 READ / resolve (C/P)

Resolver implements `resolve(did, resolutionOptions) → (didResolutionMetadata, didDocument, didDocumentMetadata)`. **(C)** [DID Resolution v0.3 §4]

**Algorithm:**
1. Validate `did:clockchain:` prefix and `agent-id` = 64 lowercase hex. On failure set `didResolutionMetadata.error = "INVALID_DID"`. **(C)**
2. Parse `network-id` (default `mainnet`) → select Clockchain RPC.
3. Query `ClockchainIdentityRegistry.getAgentDocument(agentId)`. If no record → `error = "NOT_FOUND"`. **(C)**
4. **If an `AgentDeactivated` event exists → return `didDocument: null`, `didDocumentMetadata.deactivated = true` (see §4.4). Do not proceed to reconstruction.**
5. Reconstruct the document by replaying events in `previousChange` linked-list order: `AgentRegistered` (initial keys) → `AgentAttributeChanged` (add/rotate keys, services) → `AgentDelegateChanged` (delegates).
6. **Time-filter:** include a verification method only if it has no `validTo`, *or* `validTo >= T`, where **`T` is the Clockchain block timestamp of the `versionId`/`versionTime` block — never the resolver's local clock** (§4.6). **(C)** [ethr-did-resolver: "Any timestamp comparisons of `validTo` fields … MUST be performed against the timestamp of the block appearing as `versionId`."]
7. Populate `didDocumentMetadata`: `created` (from `AgentRegistered.clockchainTimestampProof`), `updated` (latest relevant event's proof), `versionId` (block hash of last relevant event). **(C)** [DID Resolution v0.3 §2/§4.3]
8. Return the three-tuple.

**Resolution metadata error codes (C, corrected):** `INVALID_DID`, `NOT_FOUND`, `METHOD_NOT_SUPPORTED`, `REPRESENTATION_NOT_SUPPORTED`, `INVALID_OPTIONS`, `INTERNAL_ERROR`.
> **Review correction.** There is **no `DEACTIVATED` error code** in DID Resolution v0.3. Deactivation is **not** an error — it is signaled by `didDocument: null` + `didDocumentMetadata.deactivated = true`. Earlier drafts (and the did:ethr resolver) that listed `DEACTIVATED` as an error code, or returned an empty-but-present document, are non-conformant here. [DID Resolution v0.3 §4.3, §4.4, https://www.w3.org/TR/did-resolution/]

**HTTPS binding (P):** `GET https://resolver.clockchain.io/1.0/identifiers/{did}` → `application/did+ld+json`, supporting `?versionTime=` and `?versionId=`.

### 4.3 UPDATE / rotate key (P)

| Aspect | Detail |
|---|---|
| On-chain call | `updateAgent(bytes32 agentId, OperationType op, bytes payload)` and dedicated `rotateReceiptSigningKey(bytes32 agentId, bytes newPubKey, uint64 validFrom, uint64 validTo)`. |
| Authorized by | `#controller-key-1` signature only. |
| Event | `AgentAttributeChanged(bytes32 indexed agentId, bytes32 keyId, bytes value, uint64 validTo, uint64 clockchainTimestampProof, bytes32 previousChange)` |
| Key rotation procedure | (1) add new Ed25519 key as `#receipt-signing-key-2` with `assertionMethod`; (2) revoke old via §6.1; ideally one atomic tx. The new fragment increments `-N`. |
| **Time anchor** | Each change's `clockchainTimestampProof` updates `didDocumentMetadata.updated` and provides court-grade proof of exactly *when* a key became valid. Historical resolution (§4.2 step 6) recovers which key was active when any given receipt was signed. |

The DID identifier **never changes** on rotation (key material is bound only at genesis via §2.3).

### 4.4 DEACTIVATE (C — corrected)

| Aspect | Detail |
|---|---|
| On-chain call | `deactivateAgent(bytes32 agentId)`; sets registry owner to `address(0)` (ERC-1056 tombstone pattern). |
| Authorized by | `#controller-key-1` signature only. Irreversible. |
| Event | `AgentDeactivated(bytes32 indexed agentId, uint64 clockchainTimestampProof, bytes32 previousChange)` |
| **Resolver behavior (C)** | On deactivation the resolver **MUST set `didDocument` to `null`** (not `{}`, not an empty-array document) and `didDocumentMetadata.deactivated = true`, per **DID Resolution v0.3 §4.4**. Returning an empty-but-present document object is **non-conformant**. |
| Effect | No further updates possible; all prior verification methods treated as revoked as of `clockchainTimestampProof`. |

> **Engineering callout (do not copy did:ethr verbatim).** The did:ethr reference resolver returns a present document with empty `verificationMethod`/`assertionMethod`/`authentication` arrays on deactivation. **That diverges from the W3C normative algorithm**, which requires `didDocument: null`. did:clockchain follows the **W3C** rule. Historical resolution (resolve-at-time before the deactivation instant) still returns the full historical document for audit — only *current* resolution returns null. [DID Resolution v0.3 §4.4]

### 4.5 Event-log resolution model (C/P)

No full DID document is stored on-chain — only events, each carrying `previousChange` (block/tx pointer) forming a singly-linked chain the resolver walks in reverse without scanning the whole chain. **(C)** [ERC-1056, https://eips.ethereum.org/EIPS/eip-1056 ; ethr-did-resolver]

### 4.6 Clockchain TimestampOracle interface (G)

> **Review fix — relabeled (C)→(P/G).** Every `clockchainTimestampProof` field depends on an on-chain time oracle whose ABI is **not yet publicly specified**. This is an **open gap in v0.1**.

**Projected interface (P):**
```solidity
interface IClockchainOracle {
    /// @return UTC nanoseconds agreed by the validator consensus at call time
    function getConsensusTimestamp() external view returns (uint64);
}
```
The registry calls `IClockchainOracle.getConsensusTimestamp()` at transaction time and writes the result into the event. **(G) The normative ABI for `IClockchainOracle` MUST be published as a normative appendix to this specification before mainnet launch.** Until then, all timestamp-anchoring requirements that cite `clockchainTimestampProof` are **(P/G)**, not (C).

---

## 5. How a receipt binds to the identity

An **Agent Notarized Receipt** is a W3C Verifiable Credential (VC Data Model 2.0) with `issuer: "did:clockchain:<network>:<agentId>"` and a Data Integrity proof referencing the receipt-signing key by its fragment id.

### 5.1 The proof object (C, with method-level tightening)

```jsonc
"proof": {
  "type": "DataIntegrityProof",                                  // MUST (C)
  "cryptosuite": "eddsa-rdfc-2022",                              // MUST for DataIntegrityProof (C)
  "proofPurpose": "assertionMethod",                            // MUST (C)
  "verificationMethod":
    "did:clockchain:testnet:<agentId>#receipt-signing-key-1",   // see note A
  "created": "2026-05-28T12:00:00Z",                            // see note B
  "proofValue": "z<base58btc-Ed25519-signature>"                // MUST (C)
}
```

> **Note A — `verificationMethod` (review fix).** Per VC Data Integrity 1.0, `verificationMethod` in a proof is **OPTIONAL**. did:clockchain **tightens** this: the proof **MUST include `verificationMethod`** as a **method-specific requirement**, because the whole purpose is to link the receipt to a specific key. **Verifiers of did:clockchain receipts MUST reject any receipt proof that omits `verificationMethod`.** This is a permitted method-level tightening of the base spec, not a claim about VC-DI itself. **(C base / P tightening)** [VC-DI 1.0 §2.1, https://www.w3.org/TR/vc-data-integrity/]

> **Note B — `created` (review fix).** Per vc-di-eddsa v1.0 / VC-DI 1.0, `created` is **OPTIONAL**. did:clockchain **SHOULD** include it (RECOMMENDED) for Clockchain timestamp anchoring: a receipt without `created` cannot be checked against the `versionTime` resolution path in §5.2 step 4. It is **not** a base-spec MUST. **(C)** [vc-di-eddsa v1.0 §3.2; VC-DI 1.0]

> **(C)** `proofValue` is the detached Ed25519 signature ([RFC 8032]) base-58-btc multibase-encoded; `proofPurpose` MUST be a string; for `DataIntegrityProof`, `cryptosuite` MUST be present. [vc-di-eddsa v1.0 §3.2; VC-DI 1.0]

### 5.2 End-to-end verification (the closed gap)

A verifier adjudicating a receipt at time **T** (where T is the receipt's Clockchain-anchored `created`, or the certified time of the action) performs:

1. **Extract** `proof.verificationMethod` → reject if absent (Note A). Confirm `proof.proofPurpose == "assertionMethod"`.
2. **Resolve** `did:clockchain:<network>:<agentId>` **at `versionTime = T`** (§4.2) against the registry, comparing all `validTo`/`revoked` values to the **Clockchain block timestamp**, not the local clock.
   - If the DID is deactivated *as of T* → reject.
3. **Check membership:** the fragment `#receipt-signing-key-N` MUST appear in the resolved document's `assertionMethod` array **and** not be expired/revoked as of T. If absent or revoked-before-T → reject. (Two-layer check: in-document `revoked`/`validTo` **and** absence of an on-chain `VerificationMethodRevoked` event with block timestamp ≤ T — §6.1.)
4. **Retrieve** the 32-byte Ed25519 public key from that method's `publicKeyMultibase`.
5. **Canonicalize** the receipt with RDFC (RDF Dataset Canonicalization), hash, and run **Ed25519 verify** over the proof's signature. MUST return true.
6. **(Optional, court-grade)** Independently re-check the Clockchain timestamp anchor for the receipt and for the key's validity window via the `ClockchainTimestampService` / public API — confirming WHEN, witnessed by neutral validators.

> **(C)** vc-di-eddsa verify: retrieve key bytes via `verificationMethod`, transform+canonicalize, hash, EdDSA-verify against `proofValue`. [vc-di-eddsa v1.0 §3.2]. Proof-purpose check: the signing key must appear under the issuer's `assertionMethod`. [W3C CID 1.0 §2.3.x; VC-DI 1.0 §2.6 — note VC-DI gives this as guidance, so did:clockchain makes the membership check **normative** at the method level.]

This chain — `receipt.proof.verificationMethod` → resolver → `assertionMethod` → Ed25519 key → signature verify, gated by Clockchain time — proves **which** agent, under **which** key, at a court-grade **when**. ERC-8004's `agentWallet` cannot perform steps 1–5; the gap is closed.

---

## 6. Revocation & delegation

### 6.1 Two-layer revocation (C / C-P)

**(a) In-document key revocation (C).** A verification method MAY carry `revoked` (an XMLSCHEMA11-2 `dateTimeStamp`) and/or `expires`. Systems **MUST NOT** verify proofs associated with a method **at or after** its `revoked` time; **SHOULD** stop at/after `expires`. Both are write-once ("once the value is set, it is not expected to be updated"). did:clockchain embeds these **inside the verification method object** so the timestamp is co-signed with the document and itself Clockchain-time-anchored.

> **(C)** [W3C CID 1.0 §2.2: `revoked` MUST be a dateTimeStamp specifying when the method MUST NOT be used; `expires` is the soft bound.]

**(b) On-chain revocation registry (C/P).** Because CID defines the `revoked` *property* but no registry mechanism, did:clockchain adds events:
- Time-bounded expiry: `AgentAttributeChanged.validTo` — resolver excludes any method with `validTo < T`. **(C, ERC-1056 pattern)**
- Permanent revocation: `revokeAgentAttribute(bytes32 agentId, bytes32 keyId)` sets `validTo = 0` and emits `VerificationMethodRevoked(agentId, keyId, uint64 revokedAtClockchainTs, bytes32 previousChange)`.

**Race-free ordering (P) — the differentiator.** A verifier checking a receipt at T MUST (i) replay events up to the block whose **Clockchain timestamp ≤ T**, (ii) confirm the method was present as of that block, (iii) confirm no `VerificationMethodRevoked` for that method has Clockchain block timestamp ≤ T. Because both the *receipt anchor* and the *revocation event* carry validator-consensus timestamps, **"receipt timestamp < revocation timestamp" is an objective, court-admissible ordering** that neither party can forge.

**(c) Receipt (VC) revocation (C).** Issued receipts use **W3C BitstringStatusList v1.0** (Recommendation, 15 May 2025): each receipt carries a `credentialStatus` of `type: "BitstringStatusListEntry"` with `statusPurpose: "revocation"`, a randomly-assigned `statusListIndex`, and a `statusListCredential` URL; the status list is signed by the issuer's `assertionMethod` key.
> **Review fix — `?timestamp=` is conditional.** BitstringStatusList §3.2: *"If such a feature is supported, and if query parameters are supported by the URL scheme, then the name of the query parameter MUST be `timestamp`."* So historical status query is **optional at the issuer's discretion** — issuers who omit it are still BitstringStatusList-conformant. did:clockchain **RECOMMENDS (SHOULD)** implementing `?timestamp=` for court-grade adjudication; issuers who do not **SHOULD document the limitation** in their service-endpoint metadata. **(C)** [https://www.w3.org/TR/vc-bitstring-status-list/]

### 6.2 Whole-DID deactivation (C)

See §4.4. `AgentDeactivated` sets owner to `0x0`; resolver returns `didDocument: null` + `deactivated: true`. The Clockchain timestamp of that event is the court-grade deactivation instant. Historical (versionTime) resolution still works for audit.

### 6.3 Scoped, time-boxed delegation (C anchor / P-G chain format)

**Anchor (C).** A parent agent that delegates receipt-signing authority lists a **dedicated `capabilityDelegation` key** (`#delegation-key-1`) in its DID document — separate from the `assertionMethod` receipt-signing key and from any payment address.
> **(C)** `capabilityDelegation` is OPTIONAL; if present, it is a set of one or more verification methods authorized to delegate a capability. [W3C CID 1.0 §2.3.x]

**On-chain (C, ERC-1056 pattern).** `addAgentDelegate(bytes32 agentId, bytes32 delegateType, address delegateAddress, uint64 validTo)` emits `AgentDelegateChanged`; the resolver adds the delegate as a verification method (type `EcdsaSecp256k1RecoveryMethod2020` with CAIP-10 `blockchainAccountId`) referenced in `assertionMethod`, time-bounded by `validTo`. Immediate revocation: `revokeDelegate(...)` → `AgentDelegateChanged` with past `validTo` + Clockchain timestamp.

**Delegation token format (P/G).**
> **Review fix — relabeled (C/P)→(P/G); corrected UCAN/DID-method claim.** **UCAN** is the recommended token shape (principals are DIDs natively; `exp` REQUIRED-or-null and maps to a Clockchain block; `prf` CID chain gives immutable provenance; attenuation MUST hold). **However, the UCAN core spec MANDATES `did:key` for `iss`/`aud`/`sub`; other DID methods are off-spec.** Therefore did:clockchain delegation chains MUST choose one of:
> - **(a)** represent the agent's key as `did:key` inside UCAN fields and cross-reference the `did:clockchain` DID via a linked proof/caveat; **or**
> - **(b)** use **ZCAP-LD v0.3**, which natively supports arbitrary DID methods for controller fields.
>
> This is an **open gap (G)** requiring either a formal UCAN extension or a switch to ZCAP-LD. **(C UCAN attenuation/exp; G method-compat)** [UCAN spec, https://ucan.xyz/specification/ ; UCAN revocation, https://ucan.xyz/revocation/ ; ZCAP-LD v0.3, https://w3c-ccg.github.io/zcap-spec/]

**Example UCAN delegation caveat (P):** `iss`=parent `did:key`, `aud`=child `did:key`, `sub`=parent, `cmd`=`/clockchain/receipt/create`, `args`=`{ "maxValue": 100, "currency": "USDC" }`, `nbf`=window start, `exp`=window end (both Unix epochs mapping to Clockchain blocks), `prf`=[parent's authorizing CID].

**Depth & attenuation (C anchor / P-G enforcement).**
- Max delegation depth **N = 5** (declared here; verifiers MUST enforce). ZCAP-LD SHOULD cap chains at 10; did:clockchain tightens to 5 for agent hierarchies. **(C)**
- Each child's capabilities MUST be a subset of the parent's (no amplification). **(C, UCAN/ZCAP)**
- **On-chain enforcement limit (review fix, P/G):** parsing/comparing structured capability maps inside Solidity is gas-prohibitive. Therefore **on-chain the registry records only the delegation CID and its `validTo`, and MUST reject a delegation whose `validTo` exceeds the parent's `validTo` (time-bound attenuation only).** **Capability-scope attenuation MUST be enforced off-chain by verifiers** when replaying the chain. **(P/G)**

**Verifier delegation check (P).** At T, confirm: (1) child's `assertionMethod` key valid (versionTime resolution); (2) delegation chain valid (`nbf ≤ T < exp` for every link); (3) no revocation CID for any link has Clockchain block timestamp ≤ T.

### 6.4 ERC-7710 / ERC-7715 (G)

These define EVM smart-contract delegation (`redeemDelegations`) and wallet permission requests — scoped to on-chain *transaction execution*, with **no** signing-identity model, **no** native DID integration, and **no** normative revocation. For off-chain *receipt* signing, UCAN/ZCAP-LD is the better fit. If a did:clockchain agent also controls an EVM smart account, the ERC-7710 delegation and the UCAN/ZCAP delegation SHOULD be co-issued and cross-referenced. **(G)** [ERC-7710, https://eips.ethereum.org/EIPS/eip-7710]

---

## 7. Worked example

### 7.1 DID document (resolved, active)

```json
{
  "@context": [
    "https://www.w3.org/ns/did/v1.1",
    "https://w3id.org/security/multikey/v1",
    "https://w3id.org/clockchain/did/v1"
  ],
  "id": "did:clockchain:testnet:a3f7c2d1b8e94f06a3f7c2d1b8e94f06a3f7c2d1b8e94f06a3f7c2d1b8e94f06",
  "controller": "did:clockchain:testnet:a3f7c2d1b8e94f06a3f7c2d1b8e94f06a3f7c2d1b8e94f06a3f7c2d1b8e94f06",
  "verificationMethod": [
    {
      "id": "did:clockchain:testnet:a3f7c2d1b8e94f06a3f7c2d1b8e94f06a3f7c2d1b8e94f06a3f7c2d1b8e94f06#receipt-signing-key-1",
      "type": "Multikey",
      "controller": "did:clockchain:testnet:a3f7c2d1b8e94f06a3f7c2d1b8e94f06a3f7c2d1b8e94f06a3f7c2d1b8e94f06",
      "publicKeyMultibase": "z6MkhaXgBZDvotDkL5257faiztiGiC2QtKLGpbnnEGta2doK"
    },
    {
      "id": "did:clockchain:testnet:a3f7c2d1b8e94f06a3f7c2d1b8e94f06a3f7c2d1b8e94f06a3f7c2d1b8e94f06#receipt-signing-key-1-ed25519vk2018",
      "type": "Ed25519VerificationKey2018",
      "controller": "did:clockchain:testnet:a3f7c2d1b8e94f06a3f7c2d1b8e94f06a3f7c2d1b8e94f06a3f7c2d1b8e94f06",
      "publicKeyMultibase": "z6MkhaXgBZDvotDkL5257faiztiGiC2QtKLGpbnnEGta2doK"
    },
    {
      "id": "did:clockchain:testnet:a3f7c2d1b8e94f06a3f7c2d1b8e94f06a3f7c2d1b8e94f06a3f7c2d1b8e94f06#controller-key-1",
      "type": "EcdsaSecp256k1VerificationKey2019",
      "controller": "did:clockchain:testnet:a3f7c2d1b8e94f06a3f7c2d1b8e94f06a3f7c2d1b8e94f06a3f7c2d1b8e94f06",
      "publicKeyMultibase": "zQ3shokFTS3brHcDQrn82RUDfCZESWL1ZdCEJwekUDPQiYBme"
    },
    {
      "id": "did:clockchain:testnet:a3f7c2d1b8e94f06a3f7c2d1b8e94f06a3f7c2d1b8e94f06a3f7c2d1b8e94f06#delegation-key-1",
      "type": "Multikey",
      "controller": "did:clockchain:testnet:a3f7c2d1b8e94f06a3f7c2d1b8e94f06a3f7c2d1b8e94f06a3f7c2d1b8e94f06",
      "publicKeyMultibase": "z6MkpTHR8VNsBxYAAWHut2Geadd9jSwuBV8xRoAnwWsdvktH"
    }
  ],
  "authentication":      ["did:clockchain:testnet:a3f7c2d1b8e94f06a3f7c2d1b8e94f06a3f7c2d1b8e94f06a3f7c2d1b8e94f06#controller-key-1"],
  "assertionMethod":     ["did:clockchain:testnet:a3f7c2d1b8e94f06a3f7c2d1b8e94f06a3f7c2d1b8e94f06a3f7c2d1b8e94f06#receipt-signing-key-1"],
  "capabilityInvocation":["did:clockchain:testnet:a3f7c2d1b8e94f06a3f7c2d1b8e94f06a3f7c2d1b8e94f06a3f7c2d1b8e94f06#controller-key-1"],
  "capabilityDelegation":["did:clockchain:testnet:a3f7c2d1b8e94f06a3f7c2d1b8e94f06a3f7c2d1b8e94f06a3f7c2d1b8e94f06#delegation-key-1"],
  "service": [
    {
      "id": "did:clockchain:testnet:a3f7c2d1b8e94f06a3f7c2d1b8e94f06a3f7c2d1b8e94f06a3f7c2d1b8e94f06#clockchain-time",
      "type": "ClockchainTimestampService",
      "serviceEndpoint": "https://time.clockchain.io/v1/proofs"
    }
  ]
}
```

> Note: the `#receipt-signing-key-1-ed25519vk2018` entry is the optional **parallel `Ed25519VerificationKey2018`** representation from §3.3 (same key bytes), present for resolvers that validate against the registered-types list. It is **not** separately listed in `assertionMethod` to avoid duplicate-key verification; clients keying off registered types map it by matching `publicKeyMultibase`.

**Corresponding resolution metadata (active):**
```json
{
  "didResolutionMetadata": { "contentType": "application/did+ld+json" },
  "didDocumentMetadata": {
    "created":  "2026-05-28T12:00:00Z",
    "updated":  "2026-05-28T12:00:00Z",
    "versionId":"0x9f2c…(block hash of AgentRegistered)",
    "deactivated": false
  }
}
```

**After `deactivateAgent` (C):**
```json
{
  "didResolutionMetadata": { "contentType": "application/did+ld+json" },
  "didDocument": null,
  "didDocumentMetadata": { "deactivated": true, "updated": "2026-09-01T08:30:00Z" }
}
```

### 7.2 Signed Agent Notarized Receipt (Product B)

```json
{
  "@context": [
    "https://www.w3.org/ns/credentials/v2",
    "https://w3id.org/clockchain/receipt/v1"
  ],
  "type": ["VerifiableCredential", "AgentNotarizedReceipt"],
  "issuer": "did:clockchain:testnet:a3f7c2d1b8e94f06a3f7c2d1b8e94f06a3f7c2d1b8e94f06a3f7c2d1b8e94f06",
  "validFrom": "2026-05-28T12:05:00Z",
  "credentialSubject": {
    "action": "executed-payment-instruction",
    "target": "invoice:2026-0042",
    "amount": { "value": "100.00", "currency": "USDC" },
    "actedUnderAuthority": "urn:clockchain:delegation:bafy…(UCAN CID, if delegated)"
  },
  "credentialStatus": {
    "id": "https://status.clockchain.io/agents/a3f7c2d1/list#94312",
    "type": "BitstringStatusListEntry",
    "statusPurpose": "revocation",
    "statusListIndex": "94312",
    "statusListCredential": "https://status.clockchain.io/agents/a3f7c2d1/list"
  },
  "proof": {
    "type": "DataIntegrityProof",
    "cryptosuite": "eddsa-rdfc-2022",
    "proofPurpose": "assertionMethod",
    "verificationMethod": "did:clockchain:testnet:a3f7c2d1b8e94f06a3f7c2d1b8e94f06a3f7c2d1b8e94f06a3f7c2d1b8e94f06#receipt-signing-key-1",
    "created": "2026-05-28T12:05:00Z",
    "proofValue": "z3FXQjec5Lh3eYa2sB7w7vM1f…(base58btc Ed25519 signature)"
  }
}
```

A verifier follows §5.2: extracts `verificationMethod` → resolves the issuer DID at `versionTime = 2026-05-28T12:05:00Z` → confirms `#receipt-signing-key-1` is in `assertionMethod` and not revoked-before-T (against the Clockchain block timestamp) → fetches the Ed25519 key → RDFC-canonicalizes and Ed25519-verifies → optionally re-checks the Clockchain time anchor and the BitstringStatusList status (with `?timestamp=2026-05-28T12:05:00Z` if supported).

---

## 8. Security & privacy considerations

> DID Core requires both sections. **(C)** [DID Core 1.1 §7.3 Security Requirements, §7.4 Privacy Requirements]

### 8.1 Threat model (P)
- **Key compromise** — receipt-signing or controller key theft (mitigated by §3.2 separation, §6.1 revocation, TEE/MPC custody §9.2).
- **Replay** — receipts are VCs over canonicalized content with a unique `statusListIndex`; verifiers SHOULD bind receipts to action context.
- **Registry front-running** — registration/rotation txs MAY reveal a key before confirmation; mitigate with commit-reveal where the chain supports it (G).
- **Eclipse / time manipulation** — the threat that an attacker feeds a false timestamp. Mitigated by sourcing time from **validator consensus** (no single node), not `block.timestamp`; the oracle interface hardening is part of the §4.6 (G).

### 8.2 Non-repudiation & court-grade time (P)
Because the signing time and every lifecycle event are certified by independent validators with no stake in the receipt's outcome, the WHO/WHEN cannot be self-certified by the beneficiary. This is the value the ERC-8004 `agentWallet` model cannot provide.

### 8.3 Key rotation & recovery (P)
On suspected compromise: revoke (`validTo=0` / `VerificationMethodRevoked`) and rotate (new `#receipt-signing-key-N`). Receipts signed **before** the compromised key's revocation instant **retain validity** *iff* the Clockchain timestamp proves they predate the revocation — which §6.1's objective ordering establishes.

### 8.4 Controller/signing-key separation (P)
The controller key (document updates) MUST be distinct from the receipt-signing key (assertions). A compromised signing key cannot take over the DID document; a compromised controller key cannot retroactively forge receipts under a different signing key without leaving a Clockchain-timestamped rotation trail.

### 8.5 Conformance test vector (separation guard) (P)
A compliant registry MUST reject this registration:
```
registerAgent(agentId, K, K, paymentAddr)   // receiptSigningPubKey == controllerPubKey
→ MUST revert ("controller and receipt-signing keys MUST differ")
```
and MUST accept it only when `keccak256(receiptSigningPubKey) != keccak256(controllerPubKey)`.

### 8.6 Privacy (P)
- **Correlation** — `agent-id` is pseudonymous but linkable; the spec RECOMMENDS separate DIDs per context.
- **Selective disclosure / unlinkability** — receipts MAY use BBS (`vc-di-bbs`) where unlinkability is required.
- **On-chain material** — only **public** keys are stored on-chain; private keys never touch the chain (custody §9.2).

---

## 9. Open implementation decisions

Each is a decision with options and tradeoffs; v0.1 records the recommended default.

### 9.1 Signature suite (decision: **Ed25519 / `eddsa-rdfc-2022`**, P)
- **Option A — Ed25519 + Multikey + eddsa-rdfc-2022 (recommended).** Deterministic signing (no nonce-leak risk), fast, native W3C cryptosuite. Tradeoff: `Multikey` type not yet in DID Spec Registries (§3.3) — mitigated by parallel `Ed25519VerificationKey2018`.
- **Option B — secp256k1 (`EcdsaSecp256k1…`).** EVM-native interop. Tradeoff: requires a random nonce; not the W3C-preferred receipt suite. **Permitted as a secondary key only; MUST NOT be the primary receipt-signing key.**
- **Option C — BBS (`vc-di-bbs`).** Unlinkable selective disclosure. Tradeoff: heavier, less ubiquitous tooling; reserve for privacy-sensitive receipts.

### 9.2 Receipt-signing key custody (decision: tiered, P)
- **Tier 1 — TEE** (Intel TDX, AMD SEV-SNP, Apple Secure Enclave, ARM TrustZone). Recommended for standalone agents; attestation quote MAY be published as a service endpoint. Tradeoff: hardware/vendor dependence.
- **Tier 2 — MPC/TSS (t-of-n)** with proactive share refresh that does **not** change the public key (so no DID update needed). Recommended for multi-operator/institutional agents. Tradeoff: operational complexity, network round-trips.
- **Tier 3 — Session keys.** Short-lived keys chained to a TEE/MPC root via a delegation VC; auto-limited by `validTo`. For high-throughput agents (thousands of receipts/min). Tradeoff: chain-verification overhead; MUST be delegated, never standalone.

### 9.3 Registry contract design (decision: first-class receipt key + linked events, P)
- **Option A — receipt-signing key as a first-class struct field** with dedicated `rotateReceiptSigningKey` + `DIDKeyChanged`-style event (recommended; removes "which attribute is canonical" ambiguity).
- **Option B — pure did:ethr free-form attributes** (`setAttribute` naming convention). Tradeoff: maximal did:ethr tooling reuse, but ambiguous canonical key and weaker ABI-level purpose separation.
- **Cross-cutting (G):** the `IClockchainOracle` ABI (§4.6) and whether the oracle is a precompile or contract are open.

### 9.4 Resolver hosting (decision: hybrid, P)
- **Option A — hosted HTTPS** `https://resolver.clockchain.io/1.0/identifiers/{did}` (recommended for adoption; lowest integration cost). Tradeoff: a trust/availability dependency on Clockchain-operated infra.
- **Option B — local/library resolver** (client reconstructs from RPC + events). Maximal trust-minimization. Tradeoff: client complexity, RPC access required.
- **Option C — Universal Resolver driver.** Ecosystem interop. Tradeoff: requires the §10 registry entry and a published driver.

### 9.5 Delegation token (decision: pending, G)
UCAN (with `did:key` cross-reference) vs. ZCAP-LD (native arbitrary DID methods). See §6.3. Resolve before v0.2; affects the verifier library surface.

---

## 10. Conformance & references

### 10.1 Conformance statement
did:clockchain v0.1 targets conformance with **W3C DID Core 1.1**, **W3C Controlled Identifiers 1.0**, **W3C VC Data Model 2.0**, **W3C VC Data Integrity 1.0**, and **W3C Data Integrity EdDSA Cryptosuites v1.0**. Outstanding items before a conformance claim can be made: (i) register the method in the W3C DID Methods extension registry (§10.3); (ii) register/confirm the `Multikey` type or ship the parallel `Ed25519VerificationKey2018` (§3.3); (iii) publish the `IClockchainOracle` ABI appendix (§4.6, **G**); (iv) resolve the delegation-token method-compatibility gap (§6.3/§9.5, **G**).

### 10.2 Registration requirements (C)
DID Methods extension registry entries require a human-readable description, a link to this normative spec, a JSON-LD context URL (`https://w3id.org/clockchain/did/v1`), and IP-rights clearance; naming must be indicative of function. **(C)** [DID Spec Registries (NOTE, 2024), https://www.w3.org/TR/2024/NOTE-did-spec-registries-20240516/ ; DID Methods, https://www.w3.org/TR/did-extensions-methods/]

### 10.3 Normative references (real URLs)
- W3C **DID Core 1.1** — https://www.w3.org/TR/did-1.1/ (ABNF §3.1; CRUD §7.2; Security/Privacy §7.3–7.4; `@context` §6.2.3)
- W3C **DID Core 1.0** (Recommendation, 2022) — https://www.w3.org/TR/did-1.0/
- W3C **DID Resolution v0.3** — https://www.w3.org/TR/did-resolution/ (resolve §4; deactivated `didDocument: null` §4.4; `versionTime` §3; metadata §4.3)
- W3C **Controlled Identifiers (CID) 1.0** (Recommendation, May 2025) — https://www.w3.org/TR/cid-1.0/ (`revoked`/`expires` §2.2; relationships §2.3; Multikey; controller binding §2.2)
- W3C **VC Data Model 2.0** — https://www.w3.org/TR/vc-data-model-2.0/
- W3C **VC Data Integrity 1.0** (Recommendation, 2025) — https://www.w3.org/TR/vc-data-integrity/ (`verificationMethod`/`created` OPTIONAL; `proofPurpose` required §2.1)
- W3C **Data Integrity EdDSA Cryptosuites v1.0** (Recommendation, 2025) — https://www.w3.org/TR/vc-di-eddsa/ (`eddsa-rdfc-2022`; proof §3.2; verify §3.2)
- W3C **Bitstring Status List v1.0** (Recommendation, 15 May 2025) — https://www.w3.org/TR/vc-bitstring-status-list/ (`BitstringStatusListEntry` §3; `?timestamp=` conditional §3.2)
- W3C **DID Extensions: Methods** — https://www.w3.org/TR/did-extensions-methods/
- W3C **DID Extensions: Properties** — https://www.w3.org/TR/did-extensions-properties/
- W3C **DID Spec Registries** (NOTE, 16 May 2024) — https://www.w3.org/TR/2024/NOTE-did-spec-registries-20240516/

### 10.4 Informative / prior-art references
- **ERC-1056** Lightweight Identity — https://eips.ethereum.org/EIPS/eip-1056
- **did:ethr** method spec — https://github.com/decentralized-identity/ethr-did-resolver/blob/master/doc/did-method-spec.md
- **ERC-8004** Trustless Agents (`agentWallet` = payment-receiving only — the gap) — https://eips.ethereum.org/EIPS/eip-8004
- **did:key v0.9** — https://w3c-ccg.github.io/did-key-spec/
- **did:pkh** — https://github.com/w3c-ccg/did-pkh/blob/main/did-pkh-method-draft.md
- **did:web** — https://w3c-ccg.github.io/did-method-web/
- **did:webvh v1.0** — https://identity.foundation/didwebvh/next/
- **cheqd** ADR-001 — https://docs.cheqd.io/product/architecture/adr-list/adr-001-cheqd-did-method
- **UCAN** spec — https://ucan.xyz/specification/ ; **UCAN revocation** — https://ucan.xyz/revocation/
- **ZCAP-LD v0.3** — https://w3c-ccg.github.io/zcap-spec/
- **ERC-7710** Smart Contract Delegation — https://eips.ethereum.org/EIPS/eip-7710 ; **ERC-7715** — https://eips.ethereum.org/EIPS/eip-7715
- **Clockchain public testnet** (live Feb 2026) — https://news.marketersmedia.com/clockchain-opens-public-testnet-introducing-a-new-blockchain-based-global-time-standard/89184089

---

### Change log vs. research dossier (review fixes applied)
1. **Deactivation** → resolver returns `didDocument: null` (not empty doc); explicit "do not copy did:ethr verbatim" callout. §4.2/§4.4 **(C)**
2. **`DEACTIVATED` error code removed** — not a DID Resolution error code; deactivation signaled via metadata. §4.2 **(C)**
3. **Method name** `clockchain` final; variant spellings invalid/non-registerable note added. §2.1
4. **Proof `created`** → SHOULD/OPTIONAL (was "MUST"). §5.1 Note B **(C)**
5. **Proof `verificationMethod`** → framed as did:clockchain method-level tightening of an OPTIONAL base field; verifiers MUST reject if absent. §5.1 Note A **(C base / P)**
6. **`Multikey` registry status** → flagged; parallel `Ed25519VerificationKey2018` added. §3.3 **(C/G)**
7. **UCAN `did:key` mandate** → corrected; REQ relabeled **(P/G)**; ZCAP-LD alternative. §6.3
8. **BitstringStatusList `?timestamp=`** → conditional/optional; SHOULD not MUST. §6.1(c) **(C)**
9. **Clockchain TimestampOracle** → relabeled **(P/G)**; ABI appendix gap recorded. §4.6
10. **agent-id derivation** → single normative rule `SHA-256(chainId‖registry‖receiptKey)`; base58btc variant removed. §2.3
11. **On-chain scope attenuation** → moved off-chain; on-chain only time-bound `validTo` attenuation. §6.3 **(P/G)**
12. **Controller≠signing-key guard** → contract `require` + revert + test vector. §4.1/§8.5 **(P)**
