# Technical Foundations: How Agent Registration Marries the Blockchain

> How an AI agent's cryptographic identity is bound to an immutable decentralized record, and what Clockchain's verifiable-time consensus adds that a plain on-chain registry cannot.

**Date:** 2026-05-28 · **Status:** research-stage · **Version:** v0.1 · **Audience:** internal protocol architecture

> **Reliability note.** This report distinguishes three tiers throughout: **(C)** confirmed against a primary spec/standard; **(P) projected** — an architectural inference from comparable systems, *not* verified against Clockchain's own (non-public) protocol docs; **(G) gap** — a known hole where no spec or evidence exists. Clockchain's internal cryptographic protocol (BFT variant, curve params, VRF scheme, slashing predicates) is **not publicly documented**; every claim about Clockchain's *internal* mechanics is **(P)**. The product is at **testnet** stage (public testnet Feb 2026); no production mainnet is confirmed as of 2026-05-28. All "court-admissible production" language below is **architectural**, not a live-product claim.

---

## 1. The marriage in one paragraph

Three facts must be welded into a single tamper-evident object for an agent action to be auditable after the fact: **WHO** acted (a cryptographically resolvable identity), **WHAT** they did (a content-addressed action payload), and **WHEN** they did it (a wall-clock time). Plain on-chain registries already solve WHO and WHAT well — ERC-8004 mints an ERC-721 passport whose `tokenURI` resolves to a content-addressed agent-card, and an EIP-712 signature binds an action payload to the signer's key. **The marriage's novel union is the WHEN.** Every existing registry timestamps its events with `block.timestamp` — an integer *asserted by the block proposer*, not measured against an external clock, not multi-signed, and not traceable to UTC. For an agent-authority audit this is the load-bearing weakness: the legally decisive questions are temporal — *was this DID still valid at the instant the agent acted? was authority revoked before or after the disputed transaction? was the delegation already expired?* A self-reported `block.timestamp` answers these as a **claim**; a multi-source, BFT-supermajority-attested UTC value answers them as a **proof**. Clockchain's thesis — and it is a thesis, the internal protocol is unverified **(P)** — is that verifiable time is the binding primitive: it does not replace the identity registry or the receipt log, it upgrades the *one field* (`genTime`/timestamp) on which the whole evidentiary chain pivots. That is the union: a standard on-chain identity stack (confirmed primitives) whose every lifecycle and action event is anchored to a time value with the properties RFC 3161 demands of a TSA — UTC-traceable, attested, independently verifiable — but produced by decentralized consensus rather than a single trusted third party.

This is precise, not a slogan, in exactly one way: **the differentiator is scoped to the timestamp.** Strip the verifiable-time layer and Clockchain Product A degenerates into ERC-8004 + ERC-1056 (a perfectly good registry that any competitor has). The defensible technical claim is narrow and therefore credible: *for the temporal assertions in an agent audit trail, a 2/3-BFT multi-source UTC attestation is categorically stronger evidence than a proposer-set integer.*

---

## 2. The end-to-end technical flow

The lifecycle has eleven steps spanning Product A (identity, steps 1–4) and Product B (receipts, steps 5–11). Confirmed primitives are marked **(C)**; Clockchain-internal steps are **(P)**.

1. **Principal key.** A human or org controls a root key — in practice an ERC-4337 smart-account **(C)**, not an EOA, so signing policy is programmable (`validateUserOp` can enforce session keys, threshold shares, or attested keys).
2. **Agent keypair + custody.** The agent's signing keypair is generated. Custody is one of: **TEE-enclave-bound (C)** (SGX/TDX generates the key inside attested compute; DCAP quote binds key → `MRENCLAVE` code measurement; Automata's on-chain DCAP contracts verify the quote in-EVM); **TSS-MPC (C)** (DKG produces *t*-of-*n* shares, no party ever holds the full key — GG18/GG20 for ECDSA, FROST for Ed25519); or a software key (no hardware binding — weakest).
3. **Registration transaction.** Two confirmed shapes:
   - **ERC-8004 `register(agentURI)` (C)** → mints ERC-721, assigns `uint256 agentId`, emits `Registered(agentId, agentURI, owner)`. `agentURI` stores **only** an IPFS CID (`ipfs://<CID>/<file>.json`), not the JSON — the CID is SHA-256 of the content, so the off-chain card is self-verifying.
   - **ERC-1056 / `did:ethr` (C)** → *no* registration tx required; any address is already `did:ethr:0x…`. Optional `setAttribute()` / `addDelegate()` writes form a `previousChange`-linked event list resolvers walk backward.
4. **Notarized identity ("birth certificate").** The on-chain `Registered` event (ERC-8004) or the first `DIDAttributeChanged` (ERC-1056) **is** the birth record. **(P)** Clockchain's value-add here: the issuance event carries a BFT-attested UTC timestamp, so authority cannot be backdated.
5. **Agent acts and signs.** The agent produces an action; the SDK captures `{action, inputs, outputs, tool-calls}` (B1), hashes the canonicalized payload, and signs it. Off-chain receipt signing → **Ed25519 (C)** (deterministic, no nonce-reuse failure mode, native to W3C VC `DataIntegrityProof`). On-chain registration → **ECDSA secp256k1 (C)** via EIP-712, because EVM `ecrecover` is secp256k1-native.
6. **Clockchain time consensus (P).** The SDK requests a timestamp. Internally (projected from Algorand/Tendermint-class systems, *not* from Clockchain docs): VRF leader sortition (RFC 9381 ECVRF **(C)** as a primitive) → each validator independently fuses GPS + atomic + NTP into a local time → 2/3-BFT round agrees one UTC value → validators co-sign. The compact attestation is plausibly a **BLS12-381 aggregate (C as a primitive)**: *N* signatures over the block header aggregate by G2 point-addition into one 96-byte signature, verifiable in one pairing `e(pk_agg, H(m)) = e(g1, σ_agg)`.
7. **Receipt minted.** The receipt is a W3C VC, `type: [VerifiableCredential, AgentReceipt]` **(C structure)**. `credentialSubject.id` = principal DID; `proof` carries `cryptosuite: eddsa-rdfc-2022`, `verificationMethod: <agent-DID>#key-1`, `proofValue: base58btc(Ed25519 sig)`. `receiptId = SHA-256(canonical_body)` is deterministic (idempotent submission). A `chain.prev_hash = SHA-256(prev_receipt)` field links receipts into a tamper-evident chain.
8. **Subnet append.** The receipt becomes a leaf in the subnet's **Merkle Mountain Range (C as structure)**: leaf = `SHA-256(0x00 ‖ receipt_bytes)`, node = `SHA-256(0x01 ‖ L ‖ R)` (RFC 6962 domain separation prevents second-preimage forgery). MMR is provably near-optimal for streaming appends (ePrint 2025/234).
9. **Subnet state-root.** Each subnet block header carries the MMR root + (projected) BLS aggregate of the subnet validator set.
10. **Mainnet rollup (P).** Every *K* blocks the subnet posts `{subnetId, fromBlock, toBlock, mmrRoot, validatorSetHash, proof}` to a mainnet contract, which verifies the validator-set BLS aggregate and stores the 32-byte `mmrRoot` immutably. Throughput lives on the subnet; finality + audit anchor live on mainnet.
11. **Third-party verification (C — fully self-sovereign).** A verifier, *without contacting Clockchain*: (a) resolves the agent DID (ERC-1056 event replay or did:web fetch); (b) extracts the `assertionMethod` public key; (c) runs W3C VC Data Integrity `verifyProof` over the canonicalized receipt; (d) recomputes the Merkle path leaf → `mmrRoot` and checks it against the mainnet record; (e) checks revocation via Bitstring Status List (optionally over Oblivious HTTP, RFC 9458, for query privacy); (f) verifies the time attestation's signatures against the published validator public keys.

### ASCII sequence diagram

```
 PRINCIPAL        AGENT RUNTIME        IDENTITY REGISTRY      CLOCKCHAIN          SUBNET            MAINNET           VERIFIER
 (ERC-4337)       (TEE / MPC key)      (ERC-8004 /            TIME CONSENSUS      (MMR log)         (rollup anchor)   (any 3rd party)
    |                  |                ERC-1056)              (VRF+BFT, P)         |                 |                 |
    |  derive/attest   |                  |                     |                   |                 |                 |
    |----------------->|                  |                     |                   |                 |                 |
    |                  |  register(agentURI)  [mint ERC-721]     |                   |                 |                 |
    |                  |--------------------->|                   |                 |                 |
    |                  |                  | Registered(agentId,   |                   |                 |                 |
    |                  |                  |   agentURI, owner)    |                   |                 |                 |
    |                  |   <== A1 ISSUANCE / A2 REGISTRY (the "birth certificate") ==>|                 |                 |
    |                  |                  |                     |                   |                 |                 |
    |                  | [agent acts: B1 capture, sign payload (Ed25519)]           |                 |                 |
    |                  |------- request timestamp(nonce, H(payload)) -------------->|                 |                 |
    |                  |                  |   1) VRF sortition -> leader            |                 |                 |
    |                  |                  |   2) per-validator GPS+atomic+NTP fuse  |                 |                 |
    |                  |                  |   3) 2/3 BFT agree on UTC value         |                 |                 |
    |                  |                  |   4) co-sign (BLS aggregate, P)         |                 |                 |
    |                  |<====== signed UTC time-certificate (B3) ===================|                 |                 |
    |                  | [mint receipt: VC{subject, action, T, proof}; B5]          |                 |                 |
    |                  |------- append leaf = SHA256(0x00 ‖ receipt) -------------------------------->|  (B4)            |
    |                  |                  |                     |     MMR root over epoch -----------> store mmrRoot   |
    |                  |                  |                     |                   |   {subnetId,    | (immutable)      |
    |                  |                  |                     |                   |    mmrRoot,     |                 |
    |                  |                  |                     |                   |    BLS agg} ---->|                 |
    |                  |                  |                     |                   |                 |                 |
    |                  |                  |                     |                   |                 |  VERIFY (no Clockchain call):
    |                  |                  |                     |                   |                 |  resolve DID -> key
    |                  |                  |                     |                   |                 |  verifyProof(receipt)
    |                  |                  |                     |                   |                 |  Merkle path -> mmrRoot
    |                  |                  |                     |                   |                 |  check time-cert sigs
    |                  |                  |                     |                   |                 |  status-list (OHTTP) <----+
    |                  |                  |                     |                   |                 |                 |
   WHO --------------- WHAT ------------------------------------ WHEN --------------------------------------------------- PROOF
```

**The marriage point is step B2 (identity binding):** the receipt embeds the agent's DID *and* a signature whose verification key is the DID's registered `assertionMethod` key. That single cryptographic link is what ties "this registered agent" (Product A) to "did this specific thing at this specific verified time" (Product B). **(G — open mechanism):** the dossier's earlier proposal to use ERC-8004's `agentWallet` as this binding is **wrong** — see §3 note and §7.

---

## 3. The primitives, layer by layer

Each layer maps to the *actual* implementing primitive (confirmed against its spec) plus the governing design choice. **(P)** marks where Clockchain's contribution is a projection.

### Product A — Agent Notarized Identity (WHO)

| Layer | Implementing primitive (C unless noted) | Data structure / standard | Key design choice |
|---|---|---|---|
| **A1 Issuance** | `register(agentURI)` mints ERC-721; or `did:ethr` implicit (zero-gas). Root-of-trust: **TEE DCAP** (key bound to `MRENCLAVE`) or **TSS-MPC** (*t*-of-*n* DKG). | ERC-8004 §register; ERC-1056; W3C VC v2.0 (operator-issued credential, `credentialSubject` = agent DID) | TEE attestation is the only mechanism that cryptographically binds the signing key to a *code measurement* — required for a code-provenance audit. Trades vendor-PKI trust + Spectre-class risk. |
| **A2 Registry** | ERC-8004 IdentityRegistry (`0x8004A169FB4a3325136EB29fA0ceB6D2e539a432`, live 2026-01-29); or EthereumDIDRegistry (`0xdca7ef03e98e0dc2b855be647c39abe984fcf21b`). | ERC-721 + URIStorage; ERC-1056 `previousChange`-linked events (`DIDOwnerChanged/DelegateChanged/AttributeChanged`) | **(P)** Clockchain upgrades each lifecycle event's timestamp from `block.timestamp` to a BFT-attested UTC value — the single differentiator at this layer. |
| **A3 Delegation** | **ZCAP-LD** capability chains (root `urn:zcap:root:<target>` by-ID, immediate parent embedded, ancestors by-ID); **ERC-7710** `redeemDelegations(bytes[],bytes32[],bytes[])`; **ERC-7579** session-key validator modules; **ERC-7715** `wallet_grantPermissions`. | JSON-LD zcaps; on-chain delegation calldata | ZCAP-LD caveats are *monotonically restrictive* (delegation can only narrow). **(G)** ZCAP-LD is a W3C-**CCG draft** (v0.3), not a Recommendation — building A3 on it is building on an unstable spec. |
| **A4 Attestation** | W3C VC (`DataIntegrityProof`/JOSE) from operator; TEE DCAP quote wrapped as VC; on-chain via ERC-8004 ValidationRegistry / EAS. | VC v2.0; EAS `Attestation` struct | Hardware attestations (DCAP) can be expressed as VCs, unifying software and hardware trust under one verification algorithm. |
| **A5 Revocation** | `did:ethr`: `changeOwner(0x0)` (permanent), `revokeDelegate()` (time-bound); VC `credentialStatus`; ERC-8004 `revokeFeedback` → `isRevoked`; ZCAP `expires`. | **Bitstring Status List v1.0** (≥131,072-slot GZIP bitstring, herd privacy); cryptographic accumulator (ZK non-membership) for high-value creds. | **(P)** Clockchain's contribution is decisive *here*: a BFT-attested UTC revocation time gives a *precise* (sub-second, consensus-round) window of valid authority — no median-skew or ±2h ambiguity. |
| **A6 Verification** | DID resolution + VC `verifyProof` (7-step, RDF/JCS canonicalize → verify) + ZCAP chain check + optional on-chain DCAP. **Selective disclosure: BBS+** (`bbs-2023`, unlinkable). | W3C VC Data Integrity 1.1; W3C BBS Cryptosuites v1.0; OpenID4VP + DCQL for presentation | **BBS+ over SD-JWT** for identity creds: each derived proof is cryptographically unlinkable (prove "registered before date X" without revealing which registration). ~5–10× ECDSA cost. SD-JWT acceptable for single-use receipts. |

### Product B — Agent Notarized Receipt (WHAT + WHEN)

| Layer | Implementing primitive (C unless noted) | Data structure / standard | Key design choice |
|---|---|---|---|
| **B1 Capture** | SDK intercepts action event; serialize → canonicalize (RFC 8785 JCS) → `SHA-256`. | Action Receipt body (agentreceipts.ai / IETF draft synthesis) | **(G)** No surveyed competitor specifies a capture layer; this is greenfield. |
| **B2 Identity Binding** | Receipt embeds agent DID; `proof.verificationMethod` → DID `#key`; Ed25519 sig over canonical body resolves to the registered `assertionMethod` key. | W3C DID 1.1 `verificationMethod`; VC `proof` | **(G — unresolved):** the mechanism that *makes* the marriage. The dossier's `agentWallet`-binding proposal is **refuted** — see note below. |
| **B3 Timestamping** | **(P)** Clockchain BFT UTC time-certificate (primary) + optional **RFC 3161** QTSP token (secondary, eIDAS legal fallback). Both bind the *same* bytes: TSA `messageImprint = SHA-256(canonical body)`. | RFC 3161 TSTInfo (C); BLS-signed header (P) | **The technical heart — see §4.** Dual-layer: trustless multi-source accuracy *plus* statutory recognition where a QTSP is required. |
| **B4 Subnet Anchoring** | MMR over receipts → 32-byte root per epoch → mainnet rollup `{subnetId, toBlock, mmrRoot, validatorBLSAggregate}`. | RFC 6962 Merkle model; MMR (ePrint 2025/234) | **MMR over flat-tree/Patricia/hash-chain:** O(log n) proofs + O(log n) append, optimal for strictly append-only logs. |
| **B5 Receipt Minting** | VC with Ed25519 `DataIntegrityProof` (off-chain portable) **or** EIP-712 `hashStruct` + secp256k1 → `ecrecover` on-chain → `ReceiptMinted(receiptId, agentDID, mmrLeafIndex, blockNumber)`. | W3C VC v2.0; EIP-712 (C) | Ed25519 portable proof + secp256k1 on-chain commitment. **BLS reserved for the validator-set timestamp layer**, not per-receipt signing. |
| **B6 Retrieval** | Content-addressed CID re-hash; Merkle inclusion proof → `mmrRoot` → mainnet tx; `ecrecover` of EIP-712 digest; OpenID4VP/DCQL presentation w/ BBS+ + nonce. | RFC 9458 OHTTP; OpenID4VP 1.0 | Verification is **self-sovereign** — every step is checkable from public chain state + published keys, with zero Clockchain API dependency. |

> **Refuted-primitive note (carried from the adversarial verdict, confirmed in §2 verification).** ERC-8004's `agentWallet` is defined in the spec as *"the address where the agent receives payments"* — a **payment-receiving address**, automatically cleared on transfer and re-set via EIP-712/ERC-1271. It is **not** a runtime signing-identity binding. Any earlier framing of `agentWallet` as the WHO↔WHAT marriage mechanism (B2) **conflates a payment address with a signing identity** and must be dropped. The actual binding mechanism (a DID-registered `assertionMethod` key that signs receipts) is described in B2 above, but a **Clockchain-native binding spec does not yet exist (G)** — see §7.

#### Primitives explicitly DROPPED per the adversarial verdict

| Dropped claim | Why |
|---|---|
| "Mainnet integrations with Ethereum and Polygon **operational**" | **Refuted (verified §2):** source states **testnet** launched Feb 2026; mainnet *planned* post-testnet. Integration is *scheduling-service* scope, status-ambiguous. No production mainnet confirmed as of 2026-05-28. |
| Ethereum **PoS** `block.timestamp` manipulation "via four mining pools / 900-second window" | **Mis-cited:** arXiv 2505.05328 and EIP-1482's 900s figure describe **PoW** (Nakamoto-style) chains, not PoS. PoS slot timing (~12s) is the correct PoS constraint and must be sourced from the beacon-chain consensus spec, **not** the PoW paper. (Citation gap — see §4 and Sources.) |
| ML-DSA-87 signature = **4595 bytes** | **Corrected (verified §2): 4627 bytes.** (ML-DSA-44 = 2420 B, ML-DSA-65 = 3293 B remain correct.) |
| Clockchain consensus "**IS** a distributed TSA" | **Overstated:** RFC 3161 requires CMS `SignedData` + an `id-kp-timeStamping` cert + QTSP supervision. Clockchain produces a *different artifact* (a signed block header). Use as **analogy**, not equivalence. |

---

## 4. Verifiable time as the binding primitive

This is the technical core. The argument is that **the temporal field is the one place where a plain on-chain registry is evidentially weak, and where decentralized verifiable time is categorically stronger.** Four properties define the gap.

### 4.1 What `block.timestamp` actually is (the weakness being attacked)

`block.timestamp` is a `uint256` *asserted by the block proposer*, constrained only by loose consensus bounds. It is **(a)** not measured against any external clock, **(b)** not multi-signed (one proposer writes it), **(c)** not UTC-traceable to BIPM, and **(d)** manipulable within protocol tolerance.

> **Citation discipline (correcting the dossier).** The dramatic "~900-second window / four mining pools avoiding multiples-of-9" figures (arXiv 2505.05328) describe **PoW** Nakamoto-style chains (Bitcoin, ETC, ETHW) — they do **not** apply to Ethereum PoS. The *correct* PoS statement is narrower and must be sourced from the beacon-chain spec: a PoS proposer sets the slot timestamp, and adversarial drift is bounded at roughly the slot interval (~12 s), not 900 s. **(G)** The dossier lacks a primary beacon-chain-spec citation for the PoS drift bound; treat the precise PoS manipulation magnitude as **unsourced** pending that citation. The qualitative point — *proposer-asserted, not externally anchored* — holds regardless and is sufficient for the argument.

For an agent-authority dispute the qualitative weakness is fatal even at 12 s: revocation-versus-action ordering, delegation-expiry boundaries, and "valid-at-T" questions can all turn on sub-second differences, and a 12-second proposer-controlled slop is both larger than the decision margin and *self-reported by an interested party*.

### 4.2 The four properties Clockchain's time layer claims to add (P — projected from comparable systems)

| Property | Mechanism (primitive, C) | What it defeats |
|---|---|---|
| **External anchoring** | Per-validator fusion of GPS (<40 ns to UTC, 95th pct), atomic-backed stratum-1 NTP (sub-µs), NTP (ms). | Single-source spoofing (GPS jamming *or* NTP poisoning alone cannot move the fused value). |
| **Multi-signature** | 2/3-BFT supermajority; with *n* ≥ 3*f*+1, no two conflicting values each reach 2*f*+1 (pigeonhole) → safety. | Single-proposer assertion. Forging requires corrupting ≥1/3 of stake *and* biasing time sources at those validators simultaneously. |
| **Independent verifiability** | BLS12-381 aggregate (96-byte sig, one-pairing verify) over the agreed header; VRF election proof (RFC 9381) published alongside. | "Trust the operator." Any third party checks the aggregate against published validator keys. |
| **Economic enforcement** | Token-stake slashing; a validator signing a time provably inconsistent with the supermajority is slashable on submission of two conflicting signed headers. | Converts honesty from a *legal/audit obligation* (RFC 3161 TSA) into a *cryptographic-economic* one with no single entity to subpoena. |

**The decisive contrast with plain Tendermint BFT-Time (C):** Tendermint takes a *weighted median of validators' self-reported clocks* and is biasable with >1/3 Byzantine stake. Clockchain's claimed improvement **(P)** is that each validator first grounds its sample in *physical* GPS/atomic reality *before* the BFT round, so the consensus agrees on a value already anchored to UTC, not merely to peer-reported local clocks. This is the technically meaningful distinction — and it is exactly the part that is **unverified against Clockchain's own docs (G)**.

### 4.3 Comparison to the three incumbent time standards

| | RFC 3161 / eIDAS QTSP (C) | OpenTimestamps / Bitcoin (C) | Clockchain (P) |
|---|---|---|---|
| **Trust model** | Single TSA, PKI + supervising authority | PoW, trust-minimized | 2/3-BFT staked quorum |
| **Time source** | TSA's own clock (self-reported) | Bitcoin block time (±~2 h window) | Multi-source GPS+atomic+NTP fused per validator |
| **Artifact** | CMS `SignedData`, `id-kp-timeStamping` cert | OP_RETURN-embedded Merkle root | BLS-signed consensus header |
| **Granularity** | Sub-second | ~10 min (block interval) | Sub-second (claimed) |
| **Single point of failure** | Yes (TSA key) | No | No |
| **Legal recognition (EU)** | **Yes** — eIDAS Art. 42 presumption of accuracy, burden reverses to challenger | Treated as evidence w/ expert testimony (e.g. Tribunal de Marseille, Mar 2025) | **(G) No** — no QTSP qualification; FINMA approval ≠ eIDAS QTSP |
| **Court-admissible *time*?** | Yes (statutory) | Existence yes; *precise time* contested | Architecturally strongest trust properties, but **statutory equivalence unestablished** |

**The honest synthesis:** Clockchain's time layer has *trust properties that exceed RFC 3161's technical requirements* (multi-source + BFT + slashing > single TSA + PKI), but **lacks RFC 3161's statutory recognition**. This is why the dual-layer B3 design (Clockchain primary + optional RFC 3161 QTSP token over identical `messageImprint` bytes) is the correct architecture: it captures the superior trust properties *and* the legal presumption, letting a verifier rely on either independently.

### 4.4 Two genuine, unresolved technical gaps in the time story

- **(G) No validator time-source attestation.** The patent (US 12,022,015) describes the *architecture* of multi-source fusion, but nothing forces a validator to actually run independent GPS/atomic hardware rather than NTP-only. Without a **TEE-attested time-source log per validator** (or equivalent), "GPS+atomic+NTP fusion" is an unenforced assumption, not a verifiable guarantee. This is arguably the single most important missing piece for the court-admissibility claim.
- **(G) Roughtime nonce-per-action binding is a proposal, not an implementation.** The Roughtime mechanism (prove the timestamp was generated *after* a specific client nonce — converting block-inclusion time into action-*initiation*-bounded time) directly addresses the court-identified gap that "blockchain timestamps reflect inclusion, not initiation." But Roughtime is a still-active IETF draft (draft-19, Mar 2026), and **there is no evidence Clockchain implements or plans it.** Presenting it as a current B3 mechanism would be inaccurate; it is a design candidate.

---

## 5. Technical prior-art comparison

The surveyed systems are strong on identity and (some) action binding. **All of them timestamp with `block.timestamp` or self-reported clocks** — that is the uniform gap, and it is precisely the gap Clockchain targets. (All competitor rows **(C)**; Clockchain row **(P)**.)

| System | Identity mechanism | Action binding | Time / ordering guarantee | Court-admissible *time*? | Gap Clockchain fills |
|---|---|---|---|---|---|
| **ERC-8004** | ERC-721 passport; `tokenURI`→IPFS card; `agentWallet` = *payment* addr (EIP-712/1271) | None native for actions (`agentWallet` is payment, not signing) | Block-event order only; `lastUpdate` = `block.timestamp` | No | Verified UTC on every registry write + an action-receipt primitive ERC-8004 lacks |
| **Kite Passport** (Avalanche L1) | 3-layer BIP-32: Standing Intent → Delegation Token → Session Sig; 60-s ephemeral session keys | **Strongest binding surveyed** — SS traces to agent DID + user wallet | Node system clock; 60-s session expiry; **no external UTC** | No | Verifiable UTC on the SI/DT/SS window so authority bounds are court-provable |
| **RNWY Passport** (Base) | ERC-5192 soulbound + EAS attestations | Binds *wallet*, not agent code; burn always possible | `block.timestamp` at mint; no post-mint action timestamping | No | Verified-time action receipts (RNWY has none) + precise issuance/lock time |
| **did:wba** | Path DID encodes Ed25519 thumbprint (`e1_…`); `eddsa-jcs-2022` | HTTP Message Signatures (RFC 9421), 1–5 min window | Signer-set `created`/`expires`; **no third-party attestation**; DID doc mutable via DNS/TLS | No | Consensus-backed timestamp + on-chain anchor (did:wba has neither) |
| **SPIFFE/SVID** | SPIFFE ID as URI-SAN in short-lived X.509; SPIRE-rotated | Workload auth only; **no action-level binding** | X.509 `notBefore/notAfter` = SPIRE-CA wall clock; **no audit log of issuance** mandated | No | An evidentiary audit trail entirely — SPIFFE optimizes for mTLS uptime, not forensics |
| **World ID AgentKit** | WorldIDRegistry Merkle tree; threshold vOPRF nullifier; ZK proof π_F | Links agent → human holder; **no time-of-action on-chain** | Nullifier proves *uniqueness*, not temporal order | No | Temporal ordering + verified action time (World ID commits neither) |
| **EAS** | Schema-typed attestation, `keccak256` UID | `data` field arbitrary; no agent-action schema | `time = uint64(block.timestamp)` — proposer-asserted, no BIPM traceability | No | Replace `block.timestamp` with BFT multi-source UTC meeting RFC 3161 accuracy |

**The one-sentence verdict:** every competitor solves WHO (and Kite solves WHO→WHAT well), but **none solves WHEN to an evidentiary standard** — all inherit `block.timestamp`'s "asserted, not measured" flaw. Clockchain's defensible territory is exactly that column.

---

## 6. Open technical design decisions

Each is framed as decision · options · tradeoff · recommendation, linked to the relevant inflection point.

**D1 — Primary DID method for persistent agents.**
Options: `did:key` / `did:pkh` (zero-cost, generative — but **no rotation, no revocation**, fatal for persistent agents); `did:web` (rotation via `did.json`, but DNS/TLS trust, no on-chain audit log); **`did:ethr` / ERC-1056** (on-chain mutable, block-timestamped event log, `previousChange` history). *Tradeoff:* did:ethr costs gas per lifecycle write + needs an off-chain resolver indexer. *Recommendation:* **did:ethr**, precisely because its event log is the *only* place Clockchain's verifiable-time upgrade is meaningful — it is the substrate the differentiator attaches to. *Inflection:* a **`did:clockchain`** subnet-native method (G — no spec exists) would let identity + receipts register in one tx and remove a separate trust root; this is an open standardization question (cf. W3C Agent Identity CG, chartered Apr 2026, no completed specs).

**D2 — Signature scheme(s).**
Options: Ed25519, ECDSA-secp256k1, ECDSA-P256, BLS12-381, ML-DSA. *Tradeoff:* Ed25519 (64 B, deterministic, native to VC `DataIntegrityProof`) is not EVM-`ecrecover`-native; secp256k1 is. *Recommendation:* **Ed25519 off-chain receipt proof + secp256k1 EIP-712 on-chain commitment + BLS12-381 reserved for the validator timestamp layer.** *Inflection — PQC:* **hybrid Ed25519 + ML-DSA-65** for forward-safety, not ML-DSA-only. ML-DSA sizes are the cost driver: ML-DSA-65 sig = 3293 B, **ML-DSA-87 = 4627 B** (corrected) — ~38–72× Ed25519's 64 B. Choose ML-DSA-65 (level-3) for the hybrid; a quantum threat to Ed25519 is not expected before NIST's 2030 migration deadline.

**D3 — Key-custody model.**
Options: software key (no hardware binding — rejected); HSM (centralized, no remote attestation); **TEE/SGX-TDX** (measurement-bound key, on-chain DCAP verification); **TSS-MPC** (distributed, interactive rounds, honest-majority). *Tradeoff:* TEE requires vendor-PKI trust + carries Spectre-class microarchitectural risk; MPC adds latency. *Recommendation:* **TEE as the A1 root-of-trust where available** (only mechanism binding key → code measurement, which the code-provenance audit needs), **TSS-MPC fallback** where enclaves are unavailable. *Open:* whether to *require* TEE attestation of the *validator time source* (links to §4.4 gap).

**D4 — On-chain vs subnet split.**
Options: all actions direct-to-mainnet (max auditability, O(n) gas — prohibitive at agent volume); pure off-chain log (fast, no anchor); **subnet + periodic SHA-256 state-root rollup**. *Tradeoff:* the rollup introduces a subnet-operator liveness dependency and a finality lag (root anchored per-epoch, not per-action); seconds-to-minutes cadence is acceptable for most legal purposes. *Recommendation:* **subnet + MMR state-root rollup**; offer **optimistic** (challenge window) vs **ZK** (SNARK proving valid state transition) variants. *Open:* the SHA-256 root prevents *silent alteration* but does **not** prove the subnet log is *well-formed* without sharing it — a ZK-validity proof closes this but at significant infra cost. **(G)**

**D5 — Revocation data structure.**
Options: **Bitstring Status List + OHTTP** (no per-revocation on-chain write, ≥131,072-slot herd privacy, but bit position is a stable correlatable identifier); **cryptographic accumulator** (ZK non-membership, O(1) update, unlinkable witnesses, but on-chain write + witness-distribution infra). *Recommendation:* **bitstring for receipts (B6), accumulator for high-value identity creds (A5/A6)** — match privacy strength to credential value.

**D6 — Selective-disclosure scheme.**
Options: plain ECDSA (all-or-nothing); **SD-JWT** (selective but *linkable* — reused disclosure hashes correlate); **BBS+ / `bbs-2023`** (selective *and unlinkable*). *Tradeoff:* BBS+ is ~5–10× ECDSA cost. *Recommendation:* **BBS+ for identity credentials, SD-JWT acceptable for single-use receipts.**

---

## 7. What this means for the product baseline

Concrete edits to the A/B layer definitions, prioritized by how much each sharpens or corrects the canonical baseline.

**SHARPENS (tighten existing definitions):**

1. **A1 / A2 — name the differentiator narrowly.** Rewrite both layers to state explicitly: *the verifiable-time upgrade applies to the **timestamp field of each lifecycle event**, not to the identity mechanism itself.* Without this scoping the baseline overclaims; with it, the claim is credible and defensible. Adopt **did:ethr (ERC-1056) as the canonical persistent-agent method** and say *why* (it is the substrate the time differentiator attaches to), with **ERC-8004** as the discovery/reputation registry layered on top.

2. **A5 — foreground revocation as the strongest verifiable-time use case.** The precise revocation-time window (sub-second vs ±12 s) is where Clockchain's value is *least* contestable. The baseline should lead Product A's verifiable-time pitch with A5, not A1.

3. **B3 — codify the dual-layer time design.** Baseline B3 should read: *Clockchain BFT UTC time-certificate (primary) + optional RFC 3161 QTSP token over identical `messageImprint = SHA-256(canonical body)` (legal fallback).* This is the architecture that reconciles superior trust properties with statutory recognition.

4. **B4 / B5 — specify MMR + the receipt object.** Baseline should name the **Merkle Mountain Range** (not generic "Merkle tree") and define the minted receipt as a W3C VC with deterministic `receiptId = SHA-256(canonical_body)` and a `chain.prev_hash` link.

**CHALLENGES (correct or flag):**

5. **B2 — remove the `agentWallet` binding claim (hard correction).** `agentWallet` is a **payment-receiving address** per the ERC-8004 spec (verified §2), not a signing identity. The baseline must define B2's marriage mechanism as *a DID-registered `assertionMethod` key signing the receipt*, and **flag that a Clockchain-native binding spec (a `did:clockchain` method + receipt-signing-key registration) does not yet exist (G).** This is the single most important correction — the WHO↔WHAT marriage is currently *underspecified*, and the baseline should say so rather than paper over it with `agentWallet`.

6. **Status language — drop "mainnet operational."** Every baseline reference to "operational mainnet integrations with Ethereum and Polygon" must be downgraded to **"public testnet (Feb 2026); mainnet planned post-testnet; scheduling-service integration scope."** (Verified §2.) All court-admissibility claims must be labeled **architectural**, not live-product.

7. **A3 — flag the ZCAP-LD stability risk.** Note in the baseline that ZCAP-LD is a **W3C-CCG draft (v0.3)**, not a Recommendation, and that ERC-7710/7715 are the production-track on-chain alternatives for the delegation layer.

8. **Legal claims — separate FINMA from eIDAS.** The baseline must not imply eIDAS Art. 42 presumption. **FINMA approval ≠ eIDAS QTSP qualification (G).** Court-admissibility in the EU requires QTSP status Clockchain has not obtained; the RFC 3161 dual-layer (edit #3) is the bridge.

**NET-NEW GAPS the baseline must acknowledge (do not hide):**

9. **Validator time-source attestation is unenforced (G).** Add an open-problem note to the B3/§4 baseline: nothing yet *proves* validators run GPS/atomic hardware vs NTP-only. A per-validator TEE-attested time-source log is the candidate fix and should be flagged as a roadmap item — it is foundational to the court-admissibility claim.

10. **Concurrent-action hash-chaining (G).** `chain.prev_hash` assumes *strictly sequential* actions per agent DID. The baseline does not address parallel/concurrent action streams from one agent, where a single linear hash chain breaks. Define either per-session sub-chains or a DAG/MMR-per-agent model before B5 is finalized.

11. **Clockchain-internal protocol is undocumented (G).** Every claim about Clockchain's *own* BFT variant, curve parameters, VRF scheme, and slashing predicates is a **projection from comparable systems**, not verified against Clockchain docs (which are not public). The baseline should state this provenance explicitly so downstream work does not mistake projected mechanics for specified ones.

---

## Sources

**Identity & DID standards**
- W3C Decentralized Identifiers (DID) Core / 1.1 — https://www.w3.org/TR/did-core/ , https://www.w3.org/TR/did-1.1/
- W3C-CCG did:key Method — https://w3c-ccg.github.io/did-key-spec/
- W3C-CCG did:web Method — https://w3c-ccg.github.io/did-method-web/
- W3C-CCG did:pkh Method (draft) — https://github.com/w3c-ccg/did-pkh/blob/main/did-pkh-method-draft.md
- EIP-1056 Ethereum Lightweight Identity — https://eips.ethereum.org/EIPS/eip-1056
- ethr-did-resolver method spec — https://github.com/decentralized-identity/ethr-did-resolver/blob/master/doc/did-method-spec.md
- did:wba method spec — https://agent-network-protocol.com/specs/did-method.html
- W3C Agent Identity Community Group — https://www.w3.org/community/agent-identity/

**Credentials, capabilities, disclosure, revocation**
- W3C VC Data Model 2.0 (Rec, 2025-05-15) — https://www.w3.org/TR/vc-data-model-2.0/
- W3C VC Data Integrity 1.1 — https://www.w3.org/TR/vc-data-integrity-1.1/
- W3C Data Integrity BBS Cryptosuites 1.0 — https://www.w3.org/TR/vc-di-bbs/
- IETF BBS Signature Scheme — https://identity.foundation/bbs-signature/draft-irtf-cfrg-bbs-signatures.html
- W3C Bitstring Status List 1.0 — https://www.w3.org/TR/vc-bitstring-status-list/
- W3C-CCG ZCAP-LD (v0.3 draft) — https://w3c-ccg.github.io/zcap-spec/
- W3C-CCG Data Minimization — https://w3c-ccg.github.io/data-minimization/
- Camenisch–Lysyanskaya Dynamic Accumulators — https://cs.brown.edu/people/alysyans/papers/camlys02.pdf
- IETF Oblivious Credential State (draft) — https://www.ietf.org/archive/id/draft-steele-spice-oblivious-credential-state-00.html
- RFC 9458 Oblivious HTTP — https://www.rfc-editor.org/rfc/rfc9458
- OpenID for Verifiable Presentations 1.0 — https://openid.net/specs/openid-4-verifiable-presentations-1_0.html

**On-chain agent registration & accounts**
- ERC-8004 (canonical) — https://eips.ethereum.org/EIPS/eip-8004
- erc-8004-contracts — https://github.com/erc-8004/erc-8004-contracts
- ERC-8004 + Filecoin Pin walkthrough — https://dev.to/hammertoe/making-services-discoverable-with-erc-8004-trustless-agent-registration-with-filecoin-pin-1al3
- Filecoin Docs: ERC-8004 Agent Registration — https://docs.filecoin.io/builder-cookbook/filecoin-pin/erc-8004-agent-registration
- ERC-5192 Soulbound — https://eips.ethereum.org/EIPS/eip-5192
- ERC-4337 Account Abstraction — https://eips.ethereum.org/EIPS/eip-4337
- ERC-7579 Modular Smart Accounts — https://eips.ethereum.org/EIPS/eip-7579
- ERC-7710 Smart Contract Delegation — https://eips.ethereum.org/EIPS/eip-7710
- EIP-712 Typed Structured Data — https://eips.ethereum.org/EIPS/eip-712 , https://github.com/ethereum/EIPs/blob/master/EIPS/eip-712.md
- EIP-1482 (draft) — https://eips.ethereum.org/EIPS/eip-1482

**Signatures, VRF, BFT, MMR**
- RFC 8032 EdDSA (Ed25519) — https://www.rfc-editor.org/rfc/rfc8032
- BLS12-381 signatures (Eth2 book) — https://eth2book.info/latest/part2/building_blocks/signatures/
- RFC 9381 ECVRF — https://datatracker.ietf.org/doc/html/rfc9381
- NIST FIPS 204 (ML-DSA; ML-DSA-87 sig = 4627 B) — https://csrc.nist.gov/pubs/fips/204/final , https://nvlpubs.nist.gov/nistpubs/fips/nist.fips.204.pdf
- RFC 6962 Certificate Transparency — https://www.rfc-editor.org/rfc/rfc6962.html
- MMR optimality (ePrint 2025/234) — https://eprint.iacr.org/2025/234
- Chainlink BFT consensus — https://chain.link/article/byzantine-fault-tolerant-consensus
- Chainlink VRF — https://chain.link/education-hub/verifiable-random-function-vrf
- Chainlink slashing — https://chain.link/article/slashing

**Time standards, manipulation evidence, legal**
- RFC 3161 Time-Stamp Protocol — https://www.rfc-editor.org/rfc/rfc3161.html , https://datatracker.ietf.org/doc/html/rfc3161
- Roughtime (draft) — https://datatracker.ietf.org/doc/html/draft-ietf-ntp-roughtime-07
- Tendermint BFT-Time / PBTS ADR-071 — https://docs.tendermint.com/master/spec/consensus/bft-time.html
- Solana Proof of History — https://solana.com/news/proof-of-history
- OpenTimestamps — https://opentimestamps.org/
- Bitcoin timestamp security (Lopp) — https://blog.lopp.net/bitcoin-timestamp-security/
- Timestamp Manipulation (PoW) — arXiv 2505.05328 — https://arxiv.org/html/2505.05328v5 *(applies to PoW, not Ethereum PoS — see §4.1)*
- GPS time accuracy — https://www.worldtimesolutions.com/resources/learning/timing-knowledge-centre/the-science-behind-gps-time/
- eIDAS qualified timestamps (legal value) — https://truescreen.io/articles/qualified-electronic-timestamps-legal-value/
- Court-ready blockchain evidence (2026) — https://truescreen.io/articles/blockchain-evidence-court-admissibility-standards/
- ETSI EN 319 421 (TSP requirements) — https://github.com/eu-digital-identity-wallet/eudi-doc-standards-and-technical-specifications/issues/160
- Two-tier blockchain notarization — https://arxiv.org/pdf/1902.03136

**Custody, TEE, MPC, prior-art systems, agent-receipt drafts**
- TEEs for AI agents (DCAP, Automata) — https://eco.com/support/en/articles/14796365-tees-for-ai-agents-verifiable-compute
- TSS-MPC deep dive — https://www.dynamic.xyz/blog/a-deep-dive-into-tss-mpc
- Kite Passport core concepts — https://docs.gokite.ai/get-started-why-kite/core-concepts-and-terminology
- Kite mainnet (Avalanche, Apr 2026) — https://coinalertnews.com/news/2026/04/30/kite-ai-mainnet-avalanche-agent-economy
- RNWY AI Agent Passport — https://rnwy.com/learn/ai-agent-passport , https://rnwy.com/blog/fingerprints-for-ai-soulbound-tokens
- SPIFFE X509-SVID — https://spiffe.io/docs/latest/spiffe-specs/x509-svid/
- World ID v4 protocol — https://github.com/worldcoin/world-id-protocol/blob/main/docs/world-id-4-specs/README.md
- EAS contracts (EAS.sol) — https://github.com/ethereum-attestation-service/eas-contracts/blob/master/contracts/EAS.sol
- agentreceipts.ai spec — https://agentreceipts.ai/specification/overview/
- IETF draft-nelson-agent-delegation-receipts-09 — https://www.ietf.org/archive/id/draft-nelson-agent-delegation-receipts-09.html
- AI Agents with DIDs and VCs — https://arxiv.org/pdf/2511.02841

**Clockchain (primary)**
- Patent US 12,022,015 "Method for Distributed and Secure Timekeeping" (D4D Sàrl) — https://www.cointrust.com/market-news/d4d-sarls-innovative-blockchain-clock-secures-key-patent
- Clockchain testnet announcement (Feb 2026; mainnet planned post-testnet) — https://www.cointrust.com/market-news/clockchain-unveils-testnet-for-verifiable-blockchain-time
- Patent award announcement — https://www.einpresswire.com/article/732597207/clockchain-awarded-patent-for-world-s-first-blockchain-clock
