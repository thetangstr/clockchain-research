# Agent Orchestration, Lifecycle & Token Flow: Where the Agent Notary Layer Fits

> *Registration is the anchor, not the product. The recurring trust value lives in orchestration handoffs, lifecycle transitions, and token flows — and token flow, where money and regulation concentrate, is the wedge.*

**Date:** 2026-05-28 · **Status:** research-stage · **Version:** v0.1 · **Author:** Architecture

---

## 1. The reframe

Prior Clockchain research treated **Agent Notarized Identity (Product A)** as a registration product: an agent is born, it gets a DID, the moment is notarized, done. That framing under-prices the asset. Registration is a **single event per agent**. It is the anchor — the cryptographic root that everything else dereferences — but it is not where the recurring trust demand concentrates.

The recurring demand is in the **dynamic system**: the events that happen thousands of times per agent per day, each of which a regulator, counterparty, or court might later need to reconstruct. Those events cluster into three pillars:

| Pillar | What it is | Event frequency | Where the regulation lands |
|---|---|---|---|
| **Orchestration** | How agents are coordinated, dispatched, hand off work | Per handoff (10²–10⁴/day per fleet) | EU AI Act Art. 12 attributability; SOC 2 CC7.2 |
| **Lifecycle** | The arc from provisioning to retirement and every state transition | Per transition (10¹–10²/day per agent) | EU AI Act Art. 12 lifetime logging; NHI governance |
| **Token flow** | How economic value moves — payments, staking, fees, settlement | **Per spend (proportional to economic activity, unbounded)** | FATF R.16; GENIUS Act; SEC 17a-4; MiCA; IMF KYA |

The thesis this report pressure-tests and confirms: **the center of gravity is the dynamic system, and the highest-value target is token flow.** Two structural reasons:

1. **Frequency scales with value, not headcount.** A fleet of 50 agents registers 50 times. But if those agents procure API calls, cloud compute, and SaaS tools autonomously, they emit a payment event every time they act. The notarizable-event stream is proportional to *economic throughput*, which is exactly the quantity regulators tax, monitor, and litigate.

2. **Money is where the law already has teeth.** EU AI Act Art. 12 is new (enforcement 2026-08-02) and has no finalized technical logging standard yet [(C)](https://www.helpnetsecurity.com/2026/04/16/eu-ai-act-logging-requirements/). But FATF Travel Rule, the GENIUS Act AML/CFT regime, SEC Rule 17a-4, and MiCA are mature, deterministic, and carry criminal exposure — and **none of them define what to do when the originator of a transaction is an autonomous agent rather than a named human** [(C)](https://www.imf.org/en/publications/imf-notes/issues/2026/04/22/how-agentic-ai-will-reshape-payments-575560). That is a live compliance vacuum with money on both sides of it.

Each of the three pillars is, at bottom, the **same primitive**: a discrete, identity-bound, time-stamped event that today is recorded only in a mutable, operator-controlled log. The product insight is that they unify into **one receipt stream** (Section 5). Clockchain's wedge — the thing no orchestrator and no payment rail has — is **court-admissible verifiable time** (Section 6). And token flow is where you drive that wedge in first, because that is where the buyer already has a regulator at the door.

```
        REGISTRATION (Product A, one event)
                 │  anchors
                 ▼
   ┌─────────────────────────────────────────────────┐
   │   THE DYNAMIC SYSTEM (the recurring revenue)      │
   │                                                   │
   │   Orchestration ──▶ Lifecycle ──▶ TOKEN FLOW      │
   │   (handoffs)        (transitions)  (money) ◀── wedge
   │       │                 │              │          │
   │       └─────────────────┴──────────────┘          │
   │                  one event type:                  │
   │       WHO · WHAT · WHEN(verified) · WITHIN-BOUNDS  │
   │                       │                            │
   │                       ▼                            │
   │            STREAM of Agent Notarized Receipts      │
   └─────────────────────────────────────────────────┘
```

**The running example throughout: AgentDash.** A Chief-of-Staff (CoS) orchestrator receives high-level work, decomposes it, and routes subtasks to adapter-backed worker agents — Claude Code, Codex, Hermes, Cursor. Workers return structured outputs; the CoS synthesizes and either routes the next step or escalates to a human. This is the canonical *hierarchical-with-adapters* topology. It exercises all three pillars at once: the CoS→worker dispatch is an **orchestration handoff**, each worker spin-up/teardown is a **lifecycle transition**, and every API call a worker procures is a **token-flow event**. AgentDash is the system that needs all of this, and the system this report keeps returning to.

---

## 2. Orchestration — how agents coordinate, and the accountability gap

### 2.1 The topologies

Multi-agent coordination has converged on a small set of handoff primitives. The critical observation across all of them: **the handoff is an in-process object or an unsigned API message, never a bilaterally attested receipt.**

| Framework | Handoff primitive | What carries forward | Identity binding | Audit substrate |
|---|---|---|---|---|
| **LangGraph Supervisor** | `Command(goto, update, graph, resume)` returned from a node [(C)](https://reference.langchain.com/python/langgraph-swarm/handoff/create_handoff_tool) | Typed state dict (the `update` patch) | None — `goto='worker'` is a string node name | LangSmith exporter (vendor, mutable) |
| **LangGraph Swarm** | `create_handoff_tool()` → `transfer_to_<agent>` emits `Command(graph=PARENT)` | `messages` key, full history unless `input_filter` | None | LangSmith |
| **CrewAI Hierarchical** | Auto-generated manager LLM delegates `Task` objects | `context` field, message history | Agent role string | Callbacks + `TaskOutput` metadata |
| **OpenAI Agents SDK** | Handoff *is a tool call*; `HandoffInputData` forwarded | `input_history` + `new_items`, optional `input_filter` | Agent name string | `HandoffSpanData` (`from_agent`, `to_agent` only) → OpenAI Traces [(C)](https://openai.github.io/openai-agents-python/ref/tracing/span_data/) |
| **Google A2A** | `Task` object + state machine over JSON-RPC/SSE [(C)](https://a2a-protocol.org/latest/specification/) | `artifacts[]`, `history[]`, `status.message` | AgentCard (optional signature) | Server-side only, transitions not hash-chained |
| **Google ADK** | Sub-agent delegation: `chat`/`task`/`single-turn` modes | Event stream, compacted | Cryptographic agent ID (governance plane) | Cloud Trace |
| **MCP** | `tools/call` JSON-RPC round-trip [(C)](https://modelcontextprotocol.io/specification/2025-11-25/basic) | `params.arguments` | Session ID (routing key, not identity) | Host-process log |
| **AgentDash CoS→worker** | Typed task message to adapter | Structured task spec → structured output | Adapter type label | In-process **(P)** |

> **Refuted/corrected from prior research, carried forward honestly:** The earlier dossier claimed `HandoffSpan` captures `started_at, ended_at, trace_id, parent_id`. The span-*data* payload (`HandoffSpanData`) has only `from_agent` and `to_agent`; the timestamps live on the wrapping `SpanImpl`, not the handoff record [(C)](https://openai.github.io/openai-agents-python/ref/tracing/span_data/). The directional point holds; the field attribution was wrong. Similarly, `Mcp-Method`/`Mcp-Name` routing headers are a **2026-07-28** addition (SEP-2243), **not** in the 2025-11-25 spec the dossier cited — so this report does not rely on them.

### 2.2 The delegation-chain problem

The deeper gap is not "logs are mutable" — it is that **authority does not travel with the handoff in an enforceable, attenuated, time-bound form.** Authorization-capability research has mapped this precisely:

| Protocol | Delegation mechanism | The gap that survives |
|---|---|---|
| **ZCAP-LD** | JSON-LD signed caps, `parentCapability` chain | Invocation logging *not mandated*; spec admits "it is not even possible to see what entity is invoking a capability" [(C)](https://w3c-ccg.github.io/zcap-spec/) |
| **UCAN** | Token carries parent as `proof` link | "Impossible to guarantee knowledge of all sub-delegations" [(C)](https://ucan.xyz/specification/); no invocation-receipt format |
| **OAuth RFC 8693** (`act` claim) | Nested JWT actor claims | Prior actors are **informational only, non-enforceable** in access control [(C)](https://www.rfc-editor.org/rfc/rfc8693.html) |
| **ERC-7710/7715** | `redeemDelegations()` on Delegation Manager | **No on-chain event-logging mandate** for redemptions [(C)](https://eips.ethereum.org/EIPS/eip-7710) |
| **HDP** (IETF draft) | Ed25519 append-only hop chain, offline-verifiable | **No blockchain anchor, no external timestamp** — trust is Ed25519 + local session [(C)](https://arxiv.org/abs/2604.04522) |
| **AIP / IBCT** (IETF draft) | Block 0/N/N+1 with per-hop scope attenuation | Completion block **self-reported by default**; no verifiable timestamp [(C)](https://arxiv.org/html/2603.24775v1) |
| **PEDIGREE** (IETF draft) | SIT JWT, dual-layer (mandate ∩ ceiling), parent re-verify | **No external timestamp** — relies on JWT `iat`/`exp` only [(C)](https://datatracker.ietf.org/doc/draft-rampalli-pedigree/) |
| **DRP** (IETF draft) | Pre-exec receipt → append-only log; no action until inclusion proof; RFC 3161 TSA | Closest model, but **only covers user→operator**; sub-agent chains via parent-reference fields only [(C)](https://datatracker.ietf.org/doc/draft-nelson-agent-delegation-receipts/) |

The named failure modes (O'Reilly Radar's taxonomy [(C)](https://www.oreilly.com/radar/who-authorized-that-the-delegation-problem-in-multi-agent-ai/)): **ghost permissions** (downstream agents inherit access via implicit trust), **scope drift** (data/authority widens across hops without approval), **broken audit trails** (action traceable to a system but not to a decision). The PEDIGREE authors note bluntly that "sub-agents typically inherit all parent authority" and that some schemes "explicitly reject scope attenuation" [(C)](https://datatracker.ietf.org/doc/draft-rampalli-pedigree/).

Quantified: only **28% of organizations** can reliably trace agent actions back to a human sponsor across all environments [(C)](https://www.strata.io/blog/agentic-identity/the-ai-agent-identity-crisis-new-research-reveals-a-governance-gap/).

### 2.3 AgentDash through this lens

```
                    HUMAN PRINCIPAL (named, authenticated)
                         │  authorizes scope S₀
                         ▼
                  ┌──────────────┐
                  │  CoS (DID_C)  │  mandate: S₀
                  └──────┬───────┘
            handoff h₁   │   handoff h₂        handoff h₃
        ┌────────────────┼──────────────────┬──────────────┐
        ▼                ▼                  ▼              ▼
  ┌──────────┐    ┌──────────┐       ┌──────────┐   ┌──────────┐
  │ClaudeCode│    │  Codex    │       │  Hermes  │   │  Cursor  │
  │ (DID_w1) │    │ (DID_w2)  │       │ (DID_w3) │   │ (DID_w4) │
  │ scope ⊆S₀│    │ scope ⊆S₀ │       │ scope⊆S₀ │   │ scope⊆S₀ │
  └────┬─────┘    └───────────┘       └──────────┘   └──────────┘
       │ sub-handoff (web-search sub-agent)
       ▼
  ┌──────────┐    Each arrow = a handoff that today carries:
  │ sub-agent│      • NO co-signed timestamp
  └──────────┘      • NO attenuation proof (S_child ⊆ S_parent)
                    • NO external anchor
```

For each arrow, the four audit questions are unanswerable from a single artifact: **WHO** delegated (which identity, tracing to which human), **WHAT** scope was cryptographically bound (not requested) at that hop, **WHEN** (from a trusted external clock, not a client `iat`), and **DID** the action stay within scope. AgentDash can log all of this in its own database — but in a dispute, that log is the operator's word against the world.

### 2.4 Layer mapping (orchestration → A/B)

- **A3 Delegation** — each CoS→worker handoff `h_i` and each sub-handoff registers `{delegator DID, delegatee DID, attenuated scope, expiry, proof}`. The gap A3 fills *beyond* ZCAP-LD/UCAN/AIP/PEDIGREE: the **externally verified timestamp** on the delegation event. Every surveyed protocol uses a self-reported clock.
- **B2 Identity Binding** — the work item must carry the receiving agent's DID *before it executes*. No current framework enforces this at handoff (the item moves with ambient context). AIP Block N and PEDIGREE `parent_chain` are the closest, but lack the court-admissible time.
- **B1 Capture** intercepts at the emission point (`Command`, `HandoffSpan`, A2A `TaskStatus`, AgentDash dispatch). **B5 Receipt Minting** produces the bilateral, co-signed handoff receipt that the DEV Community analysis names as the missing primitive: *"If you want to prove a handoff to a third party, you need something both sides signed."* [(C)](https://dev.to/piqrypt/multi-agent-accountability-who-co-signs-the-handoff-between-your-crewai-agents-gi4)

---

## 3. Lifecycle — the full arc and the valid-at-T problem

### 3.1 The state model

Enterprise agent governance has standardized on a 6–8 state FSM. Microsoft's open-source **Agent Governance Toolkit (AGT)**, released 2026-04-02, is the reference [(C)](https://microsoft.github.io/agent-governance-toolkit/tutorials/30-agent-lifecycle/):

```
   request_provisioning()                approve()
  ┌──────────┐   ┌──────────────────┐   ┌──────────────┐
  │REQUESTED │──▶│ PENDING_APPROVAL  │──▶│ PROVISIONED   │
  └──────────┘   └──────────────────┘   └──────┬───────┘
                          │  reject              │ activate()  ── issues 24h creds
                          ▼                      ▼
                     ┌─────────┐          ┌──────────────┐
                     │REJECTED │          │    ACTIVE     │◀──┐ resume()
                     └─────────┘          └──┬────┬───────┘   │
                                 suspend()   │    │ heartbeat  │
                                             ▼    │ missed>24h  │
                                      ┌──────────┐│            │
                                      │SUSPENDED │┘            │
                                      └──────────┘             │
                                             │      ┌──────────┴─┐
                          decommission()     │      │  ORPHANED   │
                                ▼            ▼      └─────────────┘
                        ┌────────────────────────┐
                        │   DECOMMISSIONED        │ (irreversible,
                        │   creds revoked instant │  revokes all creds)
                        └────────────────────────┘

  Every transition writes: {timestamp, event_type, prev_state, new_state, actor, reason}
  ── but to ~/.agentmesh/lifecycle.json: operator-controlled, mutable.
```

The platform landscape splits along **governance-plane vs execution-plane** lifecycles:

| Platform | Lifecycle model | Suspend/kill mechanism | Audit substrate |
|---|---|---|---|
| **Microsoft AGT** | 7-state identity FSM [(C)](https://microsoft.github.io/agent-governance-toolkit/tutorials/30-agent-lifecycle/) | `suspend()` → all checks DENY | Local JSON file |
| **AWS Bedrock AgentCore** | *Two* models: Registry `DRAFT→PENDING→APPROVED` (+ `REJECTED`/`DEPRECATED` terminal); Runtime microVM with `idleRuntimeSessionTimeout` (900s default) + `maxLifetime` (8h, non-resettable) [(C)](https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/runtime-lifecycle-settings.html) | No SUSPEND — *terminate-and-resume* | CloudTrail (operator) |
| **Google Agent Sandbox / Substrate** | K8s CRD, singleton pods, `SandboxWarmPool` (300 allocs/s, p90 200ms), Pod Snapshots [(C)](https://kubernetes.io/blog/2026/03/20/running-agents-on-kubernetes-with-agent-sandbox/) | Snapshot/teleport (sub-second) | Cluster logs |
| **OpenAI Agents SDK** | Event hooks (`on_agent_start/end`, `on_handoff`), *not* an FSM [(C)](https://openai.github.io/openai-agents-python/agents/) | Human-in-loop interrupt | OpenAI Traces |
| **Saviynt / Okta IGA** | NHI lifecycle: register → entitle (JIT) → govern → retire [(C)](https://saviynt.com/blog/ai-agent-lifecycle-management) | State flip → DENY "within seconds" (no SLA) | IGA audit log |

> **(G/in-progress):** The Kubernetes `agent-sandbox` explicit Suspend/Resume CRD field is in PR #267 (opened 2026-01-28), **not yet released** [(G)](https://github.com/kubernetes-sigs/agent-sandbox/issues/36). Treat snapshot-based suspend as preview.

### 3.2 The valid-at-T problem (revocation propagation + stale credentials)

The highest-value lifecycle gap is the inability to produce a **cryptographically binding proof that agent X held authority-state Y at instant T.** Three constituent failures:

**(1) Revocation propagation window.** Every mechanism has latency between "revoke fires" and "all enforcers see it," during which a revoked agent keeps acting with no tamper-evident record that it did.

| Mechanism | Propagation / staleness window |
|---|---|
| OAuth RFC 7009 | Acknowledged delay, **no max window, no audit obligation** [(C)](https://www.rfc-editor.org/rfc/rfc7009.html) |
| SPIFFE/SPIRE | Non-renewal model → up to **one full SVID TTL (≤60 min)** before enforcement [(C)](https://www.hashicorp.com/en/blog/spiffe-securing-the-identity-of-agentic-ai-and-non-human-actors) |
| W3C Bitstring Status List | Cache `ttl` **implementation-defined**, no mandated min/max [(C)](https://www.w3.org/TR/vc-bitstring-status-list/) |
| Enterprise kill-switch | "Within seconds" — but **no documented SLA** to downstream systems [(C)](https://www.okta.com/identity-101/ai-agent-lifecycle-management/) |
| JWT TTL-based | Unauthorized ops scale as **O(v · TTL)** [(C)](https://arxiv.org/html/2605.05440) |

**(2) No historical status proof.** Bitstring Status List's `timestamp` query param is optional and issuers needn't retain snapshots [(C)](https://www.w3.org/TR/vc-bitstring-status-list/). DID deactivation propagation is method-specific [(C)](https://www.w3.org/TR/did-1.1/). OAuth token stores are delete-on-expiry. **OCSP stapling** is the closest existing valid-at-T analogue (CA-signed `thisUpdate`/`nextUpdate`) — but only for the TLS handshake moment, and Let's Encrypt deprecated OCSP entirely in May 2025 [(C)](https://axelspire.com/vault/operations/certificate-revocation-crl-ocsp/).

**(3) Multi-hop chain opacity.** In AgentDash, when CoS delegates to Claude Code which spawns a sub-agent, each hop "either reuses the original token (overprivileged) or has no token at all (untracked)" [(C)](https://www.oreilly.com/radar/who-authorized-that-the-delegation-problem-in-multi-agent-ai/). A2A specifically "does not define a mechanism for global state reconciliation or coordinated cache invalidation" — revocation applies inconsistently across peers [(C)](https://authzed.com/blog/agentic-ai-is-not-secure).

Quantified vacuum [(C)](https://labs.cloudsecurityalliance.org/research/csa-whitepaper-nonhuman-identity-agentic-ai-governance-v1-cs/): **78%** of orgs have no documented policy for creating/removing AI identities; **24%** take >24h to revoke after detection; **20%** have a formal API-key offboarding process. And **"ghost agents"** — decommissioned agents retaining dormant credentials — are a named 2026 attack vector [(C)](https://www.unosecur.com/resources/blog/the-ultimate-guide-to-ai-agent-lifecycle-security-from-provisioning-to-decommissioning).

### 3.3 The mid-task kill is the unnotarized crown jewel

The single highest-value lifecycle moment is **suspension/termination mid-execution.** When a running agent is killed (AWS microVM `maxLifetime` expiry, K8s eviction, Substrate teleport, human interrupt), the exact state at termination — what it computed, what credentials it held, what tools it had invoked — exists *only* inside the platform. **No external receipt proves what work was done before the kill, or that the operator didn't tamper with output afterward.** In regulated contexts (a half-completed trade, a partially-filed compliance document), that intermediate state determines liability. Observability tools (AgentOps, LangSmith, Arize) make this worse: they let event data **disappear after debugging** rather than retaining it as a queryable compliance asset [(C)](https://arize.com/blog/best-ai-observability-tools-for-autonomous-agents-in-2026/).

### 3.4 Layer mapping (lifecycle → A/B)

- **A1 Issuance** — the `PROVISIONED`/credential-first-issued moment → a "born-at-T" receipt with verifiable UTC.
- **A5 Revocation** — `DECOMMISSIONED`/`SUSPENDED`/revocation: the highest-risk transition. A5 anchors *"authority ended no later than T"*; **propagation receipts** at each enforcing node bound the stale-window — the thing RFC 7009 explicitly declines to bound.
- **B3 Timestamping** — replaces operator system clocks with multi-source UTC + BFT. A verifier asking *"was X authorized at T?"* checks: B5 issuance receipt before T, A5 revocation receipt after T (or absent), and the delegation chain between. **Structurally impossible with current mechanisms.**
- **B5 Receipt Minting** — every transition (`REQUESTED`…`DECOMMISSIONED`, credential-rotated, suspended-mid-task, orphaned) mints a receipt carrying `{agent DID, prev_state, new_state, actor, verified timestamp, transition payload hash}`. **This is the continuous-stream pattern** that distinguishes the product from one-time registration.

---

## 4. Token flow — how value moves, and why it is the highest-value notarization target

### 4.1 The rails

Agent payments are no longer theoretical. As of April 2026, x402 alone reports **69,000 active agents, 165M transactions, ~$50M cumulative volume** [(C)](https://www.linuxfoundation.org/press/linux-foundation-is-launching-the-x402-foundation-and-welcoming-the-contribution-of-the-x402-protocol).

| Rail | Mechanism | Settlement | Identity / mandate carried | The audit gap |
|---|---|---|---|---|
| **x402** (LF, Apr 2026) | HTTP 402 + `PAYMENT-REQUIRED`/`PAYMENT-SIGNATURE` headers; facilitator settles EIP-3009 [(C)](https://developers.cloudflare.com/agents/agentic-payments/x402/) | Stablecoin on Base/Polygon/Arbitrum <200ms | **Wallet address only** — no agent ID, no delegation chain | `PAYMENT-RESPONSE` (txHash) optional; **zero work-evidence** |
| **AP2** (Google → FIDO, Apr 28 2026) | 3 ECDSA JSON-LD mandates: Intent / Cart / Payment (W3C VCs) [(C)](https://ap2-protocol.org/) | Card / stablecoin | Strong — but lives in AP2 stack, not a neutral ledger | Replay + context-substitution **confirmed vulns**; ZTRV fix is a research add-on, not core spec [(C)](https://arxiv.org/html/2602.06345v1) |
| **MPP** (Stripe + Tempo, Mar 2026) | Session: deposit to reserve → stream signed off-chain vouchers → **collapse to one settlement tx** [(C)](https://docs.tempo.xyz/learn/tempo/machine-payments) | Tempo EVM L1 / USDC / cards / BTC | Spending Controls + Agent Guardrails (operator-set) | **Per-voucher auditability destroyed** — thousands of calls → one tx, no per-call receipt |
| **Coinbase Agentic Wallets** (Feb 11 2026) | MPC wallet (`cb-mpc`) in Nitro Enclave; policy engine pre-signs (caps, allowlists) [(C)](https://eco.com/support/en/articles/14845485-coinbase-agentic-wallets-explained) | EIP-3009 on Base | Session keys (ERC-7715-style) | Activity log is **off-chain CDP Portal**, operator-visible, not independently verifiable |
| **Skyfire KYAPay** | KYA verifies agent identity → USDC A2A micropayments [(C)](https://skyfire.xyz/product/) | USDC | Agent identity (signed JWT) | KYA **verification depth not publicly specified** |
| **Kite AI L1** (mainnet Apr 30 2026) | Avalanche EVM L1; **gas paid in whitelisted stablecoins**; state channels [(C)](https://gokite.ai/kite-whitepaper) | Native L1 | Agent Passport; Standing Intent (`max_tx`,`max_daily`,expiry) + Delegation Token | On-chain anchor only for channel open/close; off-chain stream un-notarized |
| **ERC-8004** (ETH mainnet Jan 29 2026) | Identity (ERC-721) + Reputation (`proofOfPayment`) + Validation registries [(C)](https://eips.ethereum.org/EIPS/eip-8004) | — | `agentId` NFT + `agentWallet` (EIP-712) | **Payment mechanisms deliberately out of scope**; block timestamps (miner-malleable) |
| **TessPay** (arXiv, Feb 2026) | Verify-then-pay: escrow → PoTE merkle root (TLSNotary + Agent-JWT + TEE) → conditional release [(C)](https://arxiv.org/html/2602.00213v1) | Escrow contract | Agent-JWT identity hash | PoTE anchored to block time, not certified UTC |
| **Nevermined** | x402 facilitator + smart-account metering [(C)](https://nevermined.ai/blog/building-agentic-payments-with-nevermined-x402-a2a-and-ap2) | Base, deterministic receipts | EIP-712 session keys | High-frequency metering, but on operator's terms |
| **Microsoft Copilot Credits** | Metered: 1 Credit = 1 unit compute; per-agent monthly caps [(C)](https://learn.microsoft.com/en-us/microsoft-copilot-studio/billing-licensing) | Azure billing | Tenant/agent ID | Receipts are **Azure billing records, no crypto binding to work** |

> **Corrected from prior research:** (a) **Kite funding** — PayPal Ventures + General Catalyst led an **$18M Series A**; the $33M total includes a later extension (Coinbase Ventures et al.) — not all $33M from the two named leads. (b) **Kite cost** — the **$0.000001/tx** figure is the *amortized off-chain* state-channel cost; on-chain open/close is standard Avalanche gas. (c) **A2A donation** — Google donated A2A to the Linux Foundation **2025-06-23**; the April 2026 "150+ orgs" release is the anniversary, not the donation. (d) **Nevermined "15K events/s" and "1.38M tx"** — appear only in vendor blog framing; treat as **(P)/(G)**, not confirmed throughput.

### 4.2 The attribute-every-movement gap

Every rail records *that* a payment happened and *to whom*. **None records, in one artifact, the full chain:** which agent, under which mandate, delegated by which human, at what verifiable time, within or in excess of which bounds.

```
   What you CAN prove today:        What you CANNOT prove today:
   ┌──────────────────────┐        ┌────────────────────────────────┐
   │ wallet 0xABC paid     │        │ which AGENT held 0xABC          │
   │ $500 to 0xDEF         │   ✗    │ under what MANDATE              │
   │ at block N            │  ───▶  │ delegated by which HUMAN        │
   │ (txHash)              │        │ at what VERIFIED time           │
   └──────────────────────┘        │ and whether $500 was IN BOUNDS  │
                                    └────────────────────────────────┘
```

Each rail covers a slice: x402 → the wallet-signed payment, no identity/chain. AP2 → intent + cart, but in-stack and replay-vulnerable. MPP → batch settlement that *erases* per-call provenance. Coinbase → policy decisions, but off-chain. ERC-4337 session keys enforce limits on-chain but their **provenance (who issued the key, from what mandate) is off-chain and mutable** [(C)](https://eips.ethereum.org/EIPS/eip-4337).

### 4.3 Why the law makes this the wedge

This is not a nice-to-have audit feature. It is a **compliance vacuum with criminal exposure**, and four regulators are walking into it:

| Regime | Requirement | The agent gap |
|---|---|---|
| **FATF R.16 Travel Rule** (Jun 2025) | Named **originator + beneficiary** data travels with every VA transfer; zero-threshold EU/AU from Jul 2026 [(C)](https://sumsub.com/blog/what-is-the-fatf-travel-rule/) | **No natural person to name as originator** when an agent initiates. Non-compliant by architectural default. |
| **GENIUS Act** FinCEN/OFAC NPRM (Apr 8 2026) | Stablecoin issuers as financial institutions; CDD, beneficial ownership, **SAR ≥$5,000** [(C)](https://www.federalregister.gov/documents/2026/04/10/2026-06963) | **Zero provisions for autonomous agents.** Assumes human customers. Enforcement Jan 18 2027. |
| **SEC Rule 17a-4** (2023, enforced 2025) | Audit trail: **sub-second, synchronized, tamper-resistant** timestamps; "user identification" [(C)](https://www.luthor.ai/guides/worm-vs-audit-trail-17a-4-storage-method-2025-architecture) | Exclusively human-centric ("by whom"); no AI-agent record exception. FINRA 2026 classifies AI agents as a distinct supervisory risk. |
| **IMF KYA** (Notes 2026/004) | 3-layer: probabilistic reasoning / deterministic authorization / settlement finality [(C)](https://www.imf.org/en/publications/imf-notes/issues/2026/04/22/how-agentic-ai-will-reshape-payments-575560) | Names the **"accountability vacuum"**: "unclear who is responsible (user, developer, or agent) for an autonomous AI hallucination leading to a payment." |

Fenwick (2026): existing consumer-protection law "may not appropriately address" agentic payments — including whether **Regulation E** authorization is met when a consumer delegates to an agent [(C)](https://www.fenwick.com/insights/publications/is-2026-the-year-of-agentic-payments). The authorization layer, per IMF, "lacks normative enforcement standards." The one ingredient every framework is missing — **an independently verified time at which the authorization existed** — is precisely Clockchain's primitive.

### 4.4 AgentDash token flow

In AgentDash, the CoS holds a budget mandate (say $10,000/day) and delegates sub-budgets to each worker (Claude Code ≤ $2,000/day for API/cloud procurement, etc.). Every procurement a worker makes is a token-flow event needing WHO/WHAT/WHEN/WITHIN-BOUNDS. The CoS→worker **budget delegation** is the moment economic authority — and liability — transfers. That delegation, today, is an unsigned in-process number.

### 4.5 Layer mapping (token flow → A/B + stretches)

- **A1 Issuance — economic-mandate fields.** Encode `{max_tx, max_daily, allowed_categories (MCC), allowed_counterparties, geographic_scope, validity_window, staking_amount ($CCTT), principal_DID}` *in the identity credential*. Kite Standing Intent and AP2 Intent Mandate prove industry convergence on exactly these fields; A1 is their neutral, time-anchored equivalent.
- **A3 Delegation — budget sub-delegation graph.** Each hop encodes the scope *reduction* (CoS $10k → worker $2k) as a verifiable credential with a court-admissible timestamp.
- **A5 Revocation — emergency freeze.** OFAC hit / account freeze / mandate expiry: any payment after the receipt timestamp is **provably post-revocation**.
- **B3 Timestamping** delivers exactly what 17a-4 demands ("sub-second, tamper-resistant, synchronized") and what IMF Layer 2 needs (a timestamped authorization record separable from the probabilistic Layer 1 decision) — which neither AP2, x402, nor MPP produce internally.
- **B5 Receipt Minting — the payment receipt IS the regulatory artifact.** For BSA: the SAR-supporting record for agent tx ≥ $5,000. For 17a-4: the AI-agent record satisfying the audit-trail alternative. For fiduciary duty: proof the agent acted within mandate at T.
- **Agent Credit System (stretch)** — agent posts `$CCTT` collateral against its `max_daily`; validators **slash** on proven mandate violation or fraudulent receipt. The economic-enforcement layer absent from every current protocol (AP2 signs but doesn't stake; ERC-4337 paymasters deposit but not against mandate violations).
- **Agent Smart Receipts (stretch)** — receipts that encode mandate-scope *verification*: "this tx was within delegated authority at T, per mandate hash H from principal P." A self-contained compliance artifact a stablecoin issuer can use to satisfy GENIUS beneficial-ownership (P = the beneficial owner).

---

## 5. The unifying model — one event type, a stream of receipts

The three pillars are the same primitive. Every orchestration handoff, every lifecycle transition, every token movement is a discrete event of the form:

```
   EVENT = { actor_DID, counterparty_DID, payload_hash,
             scope/mandate_ref, VERIFIED_UTC, prev→new state } 
                              │
                  ┌───────────┴───────────┐
                  │  Clockchain Agent-SDK   │
                  │  B1 Capture (hook)      │
                  │  B2 Identity Binding    │ ← resolves name → A-layer DID
                  │  B3 Timestamp (VRF+UTC) │ ← GPS+atomic+NTP, 2/3 BFT
                  │  B4 Subnet Anchor       │ ← SHA-256 rollup to mainnet
                  │  B5 Mint ANR            │
                  └───────────┬───────────┘
                              ▼
              ──●──●──●──●──●──●──●──●──●──▶  STREAM of Agent Notarized Receipts
                h₁ act prov h₂ pay susp pay rev …   (per agent, per day, unbounded)
```

This **reframes Product B from a one-shot action log into a continuous lifecycle + economic ledger.** The receipt count is proportional to economic and operational activity — not to the number of agents. That is the business reframe: registration sells once; the receipt stream meters forever.

### Event taxonomy (the notarizable-event catalog)

| # | Event | Pillar | Layer | Receipt payload (key fields) | Regulatory driver |
|---|---|---|---|---|---|
| E1 | Agent provisioned ("born-at-T") | Lifecycle | A1/B5 | creator, purpose, owner, UTC | EU AI Act 12 |
| E2 | Registry approved / deprecated | Lifecycle | A2/B5 | curator, decision, UTC | SOC 2 CC7.2 |
| E3 | Activated (creds issued) | Lifecycle | A1/B5 | cred ID, TTL, issuer, UTC | NHI governance |
| E4 | Credential rotated | Lifecycle | A4/B5 | old/new cred, actor, UTC | "no-gap" proof |
| E5 | **Orchestration handoff** | Orchestration | A3/B2/B5 | src DID, dst DID, payload hash, scope, UTC | EU AI Act 12 attributability |
| E6 | Sub-agent spawned | Orch/Life | A3/B5 | parent/child DID, attenuated scope, hop # | delegation audit |
| E7 | Scope-attenuation proof | Orchestration | A3/B5 | proof S_child ⊆ S_parent | forensic non-widening |
| E8 | **Mandate issuance (economic)** | Token | A1/B5 | principal DID, agent DID, `{max_tx,max_daily,MCC,…}` hash, UTC | GENIUS beneficial-owner |
| E9 | **Budget sub-delegation** | Token | A3/B5 | parent/child mandate hash, scope reduction, UTC | liability transfer |
| E10 | **Payment pre-authorization** | Token | B2/B5 | agent DID, mandate hash, amount, counterparty, MCC, in-bounds bool | FATF originator |
| E11 | **Payment settlement** | Token | B2/B3/B5 | final amount, txHash, network, agent DID, UTC | Travel Rule |
| E12 | Mandate-exceeded attempt | Token | A6/B5 | rejected action, constraint violated, mandate state | 17a-4 / fiduciary defense |
| E13 | Spending-velocity threshold hit | Token | B5 | cumulative state at crossing | SAR trigger ($5k) |
| E14 | Suspended mid-task | Lifecycle | A5/B5 | **state hash at suspension**, actor, UTC | liability at kill |
| E15 | Resumed | Lifecycle | A4/B5 | authorizer, checkpoint, UTC | continuity |
| E16 | Revocation (cred/mandate) | Life/Token | A5/B5 | revoker, reason, last-valid state, UTC | OFAC / kill-switch |
| E17 | Propagation confirmation | Lifecycle | A5/B5 | enforcing node ack | bounds stale-window |
| E18 | Decommissioned | Lifecycle | A5/B5 | actor, reason, UTC (irreversible) | ghost-agent prevention |
| E19 | Orphaned (heartbeat miss) | Lifecycle | A5/B5 | last-active vs detection UTC | abandoned-cred liability |
| E20 | Staking deposit | Token | Credit/B5 | collateral, scope covered, lockup | credit baseline |
| E21 | Slashing event | Token | Credit/B5 | violated-receipt hash, slashed amount | economic enforcement |
| E22 | Fee / commission extraction | Token | B5 | fee, platform DID, basis, mandate ref | fee-within-mandate audit |
| E23 | MPP session open / close | Token | B5 | session ID, cap, actual-vs-authorized | restores per-session provenance |
| E24 | Guardrail / policy denial | Orchestration | A6/B5 | guardrail, input hash, blocked bool | policy-enforcement evidence |
| E25 | Human-in-loop approval | Orchestration | A4/B5 | approver, decision, context hash, UTC | Reg E / oversight |

---

## 6. Where Clockchain wins vs. just-an-orchestrator and just-a-payment-rail

The competitive question is sharp: orchestrators (LangGraph, A2A, ADK) already log handoffs; payment rails (x402, AP2, Coinbase) already record transactions. **Why does anyone need a separate notary?** Because both classes share the same three structural deficits, and Clockchain's one differentiator — **court-admissible verifiable time** — resolves all three.

| Property | Just-an-orchestrator (A2A/ADK/LangGraph) | Just-a-payment-rail (x402/AP2/MPP/Coinbase) | **Clockchain ANR** |
|---|---|---|---|
| Bilateral co-signed event | ✗ unilateral log | ✗ wallet sig only | **✓ both DIDs sign** |
| Identity bound to event | ✗ name string | ✗ wallet address | **✓ A-layer DID** |
| External verifiable time | ✗ system clock | ✗ block timestamp (miner-malleable) | **✓ multi-source UTC + 2/3 BFT** |
| Tamper-evident, operator-independent | ✗ self-hosted / vendor backend | ✗ off-chain portal / batch-collapsed | **✓ subnet anchor + mainnet rollup** |
| Mandate-scope-at-T attestation | ✗ | partial, in-stack | **✓ A1/A3 + B3** |
| Independent verifier of ordering | ✗ no hash-chain | ✗ | **✓ inclusion proofs (B6)** |

The differentiator is **verifiable time**, and it is decisive in exactly the three places that matter most:

1. **Delegation expiry.** A self-reported `iat`/`exp` (every surveyed delegation protocol — HDP, AIP, PEDIGREE, UCAN) can be backdated. Clockchain answers *"the mandate was valid at T"* against an external clock no party controls. This is the gap the IETF drafts explicitly leave open.

2. **Revocation ordering.** The valid-at-T problem (§3.2) is fundamentally a *time-ordering* question: was the payment before or after the revocation? With block timestamps or operator logs, ordering is contestable. With BFT-consensus UTC, *"payment at T₁, revocation at T₂, T₁ > T₂ ⟹ provably unauthorized"* is court-admissible. Clockchain anchors **on-chain every second** [(C)](https://www.barchart.com/story/news/368793/clockchain-opens-public-testnet-introducing-a-new-blockchain-based-global-time-standard) — finer than the revocation propagation windows (≤60 min for SPIRE) it is bounding.

3. **Payment-authority-at-T.** SEC 17a-4 demands "sub-second, synchronized, tamper-resistant" time [(C)](https://www.luthor.ai/guides/worm-vs-audit-trail-17a-4-storage-method-2025-architecture). DRP gets closest with RFC 3161 TSA + append-only log [(C)](https://datatracker.ietf.org/doc/draft-nelson-agent-delegation-receipts/) — but RFC 3161 is a single trusted TSA, not BFT-consensus multi-source UTC, and DRP covers only user→operator. Clockchain is the substrate DRP's model implies but doesn't provide.

**Positioning:** Clockchain is **not** competing to route agents or to move stablecoins. It is the **neutral time-and-receipt layer underneath both** — the verifiable-time analogue of what an RFC 3161 TSA is to a PDF signature, but BFT-decentralized, multi-source, and agent-native. It composes *with* x402, AP2, A2A, and AgentDash rather than replacing them: B1 hooks their event emission, B5 mints the receipt they cannot.

---

## 7. What this means for the product baseline

Concrete edits to sharpen Products A and B around the dynamic-system reframe:

**Edit 1 — Reframe B5 from "receipt" to "receipt STREAM."** *Current baseline:* B5 mints an ANR for "an action." *Proposed:* B5 mints a **continuous, append-only receipt stream** keyed by agent DID, where each of the 25 event types (Table §5) produces a receipt. Product copy, SDK ergonomics, and pricing should reflect a *metered stream* (per-receipt or per-thousand), not a per-action one-off. **This is the single most important edit** — it converts Product B from a logging feature into a recurring-revenue ledger.

**Edit 2 — Add economic-mandate fields to A1 Issuance.** *Current baseline:* A1 issues identity (WHO + authority). *Proposed:* extend the issued credential with a machine-verifiable **economic mandate block**: `{max_tx, max_daily, allowed_categories, allowed_counterparties, geographic_scope, validity_window, staking_amount, principal_DID}`. Without these in A1, every downstream payment check is informal. Kite and AP2 prove the field set; Clockchain's version is the neutral, time-anchored one.

**Edit 3 — Make A3 capture the delegation CHAIN, not single delegations.** *Current baseline:* A3 = Delegation. *Proposed:* A3 captures the **full delegation graph with per-hop scope attenuation proofs** (E6, E7, E9). For AgentDash's CoS→worker→sub-agent topology, A3 must record that S_worker ⊆ S_CoS *cryptographically*, with each hop externally timestamped — directly closing the "sub-agents inherit all parent authority" failure.

**Edit 4 — Elevate A5 Revocation to first-class, with propagation receipts.** *Current baseline:* A5 = Revocation (one event). *Proposed:* A5 produces both the **revocation receipt** (last-valid-state + UTC) *and* **propagation-confirmation receipts** (E17) from each enforcing node, explicitly bounding the stale-window that RFC 7009 and SPIRE leave unbounded. Pair with the **mid-task suspension state-hash** (E14) as a named high-value receipt.

**Edit 5 — Position B3 as the regulatory-grade timestamp, explicitly.** Market B3 against the literal statutory language: SEC 17a-4 "sub-second, synchronized, tamper-resistant"; FATF "originator data provable post-facto"; IMF "Layer 2 deterministic authorization record." B3 is the only layer that satisfies all three; say so in those words.

**Edit 6 — Spec the two stretches as the economic-enforcement endgame.** Agent Credit System (E20/E21: `$CCTT` collateral against `max_daily`, slashable on proven violation) and Agent Smart Receipts (mandate-scope-verified receipts usable as GENIUS beneficial-ownership artifacts) are not side quests — they are how the receipt stream becomes *bonded*, turning a notary into an enforcement layer.

**Go-to-market sequencing implied:** lead with **token-flow receipts (E8–E13, E16, E22)** because that is where the buyer already has FATF/GENIUS/17a-4 pressure and a budget line; expand to lifecycle (E1–E4, E14–E19) for EU AI Act Art. 12 (Aug 2026); orchestration handoffs (E5–E7, E24) follow as the fleet matures. Registration (E1) is the on-ramp, not the destination.

---

## 8. Open questions & the one next move

**Open questions:**

1. **Capture latency vs. DRP's hard gate.** DRP mandates *no action until inclusion proof returns* [(C)](https://datatracker.ietf.org/doc/draft-nelson-agent-delegation-receipts/). Does Clockchain B1→B5 block the agent (strong, slow) or anchor asynchronously (fast, weaker)? For mid-task kill receipts (E14) and pre-auth (E10), the answer materially changes the legal guarantee. **(G — design decision, no evidence yet.)**

2. **High-frequency economics.** MPP collapses thousands of vouchers into one settlement tx specifically because per-call on-chain receipts are uneconomic [(C)](https://docs.tempo.xyz/learn/tempo/machine-payments). Can a customer-dedicated subnet Merkle-batch high-frequency events (E11, E23) while preserving per-event inclusion proofs? This is the technical crux of competing with batch-settlement rails. **(P)**

3. **The originator-of-record legal question.** When an ANR names `principal_DID` as the human behind an agent payment, does that satisfy FATF/GENIUS "beneficial owner" *as a matter of law*, or merely as evidence? No regulator has ruled. **(G.)**

4. **Standards posture.** DRP, AIP, PEDIGREE, HDP are all live IETF drafts converging on receipts-without-good-time. Does Clockchain publish B3 as the verifiable-time profile these drafts plug into (standards play) or stay proprietary (moat play)? **(G.)**

**The one next move:** Build the **token-flow receipt path end-to-end against x402 + AgentDash** — instrument one AgentDash CoS→worker budget delegation (E9) and the worker's subsequent x402 procurement (E10→E11), mint the bilateral ANR with B3 verified time, and produce a B6 inclusion proof. That single demo proves the wedge (verifiable payment-authority-at-T), exercises all three pillars in one trace, and produces the exact artifact a FATF/GENIUS/17a-4 buyer asks for. It is the smallest build that validates the thesis that token flow is the center of gravity.

---

## Sources

- LangGraph `create_handoff_tool` — https://reference.langchain.com/python/langgraph-swarm/handoff/create_handoff_tool
- OpenAI Agents SDK tracing span data (`HandoffSpanData`) — https://openai.github.io/openai-agents-python/ref/tracing/span_data/
- OpenAI Agents SDK handoffs / agents lifecycle — https://openai.github.io/openai-agents-python/agents/
- Google A2A Protocol specification — https://a2a-protocol.org/latest/specification/
- A2A surpasses 150 orgs (Linux Foundation) — https://www.linuxfoundation.org/press/a2a-protocol-surpasses-150-organizations-lands-in-major-cloud-platforms-and-sees-enterprise-production-use-in-first-year
- MCP specification 2025-11-25 (base) — https://modelcontextprotocol.io/specification/2025-11-25/basic
- Google ADK announcement — https://developers.googleblog.com/en/agent-development-kit-easy-to-build-multi-agent-applications/
- CrewAI Tasks — https://docs.crewai.com/concepts/tasks
- ZCAP-LD specification — https://w3c-ccg.github.io/zcap-spec/
- UCAN specification — https://ucan.xyz/specification/
- IETF RFC 8693 (OAuth Token Exchange, `act`) — https://www.rfc-editor.org/rfc/rfc8693.html
- IETF RFC 7009 (OAuth Token Revocation) — https://www.rfc-editor.org/rfc/rfc7009.html
- EIP-7710 (Smart Contract Delegation) — https://eips.ethereum.org/EIPS/eip-7710
- EIP-4337 (Account Abstraction) — https://eips.ethereum.org/EIPS/eip-4337
- HDP (arXiv 2604.04522) — https://arxiv.org/abs/2604.04522
- AIP / IBCT (arXiv 2603.24775) — https://arxiv.org/html/2603.24775v1
- PEDIGREE (IETF draft) — https://datatracker.ietf.org/doc/draft-rampalli-pedigree/
- DRP (IETF draft-nelson-agent-delegation-receipts) — https://datatracker.ietf.org/doc/draft-nelson-agent-delegation-receipts/
- Authorization Propagation in Multi-Agent AI (arXiv 2605.05440) — https://arxiv.org/html/2605.05440
- O'Reilly Radar — Who Authorized That? — https://www.oreilly.com/radar/who-authorized-that-the-delegation-problem-in-multi-agent-ai/
- DEV — Multi-agent accountability / co-signed handoffs — https://dev.to/piqrypt/multi-agent-accountability-who-co-signs-the-handoff-between-your-crewai-agents-gi4
- Strata — AI Agent Identity Crisis (28% traceability) — https://www.strata.io/blog/agentic-identity/the-ai-agent-identity-crisis-new-research-reveals-a-governance-gap/
- CSA NHI Governance Whitepaper (78%/24%/20%) — https://labs.cloudsecurityalliance.org/research/csa-whitepaper-nonhuman-identity-agentic-ai-governance-v1-cs/
- Microsoft Agent Governance Toolkit — Lifecycle — https://microsoft.github.io/agent-governance-toolkit/tutorials/30-agent-lifecycle/
- AWS Bedrock AgentCore — Runtime lifecycle settings — https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/runtime-lifecycle-settings.html
- AWS Bedrock AgentCore — Registry record lifecycle — https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/registry-record-lifecycle.html
- Kubernetes blog — Running Agents with Agent Sandbox — https://kubernetes.io/blog/2026/03/20/running-agents-on-kubernetes-with-agent-sandbox/
- Google Cloud — Agent Sandbox & Agent Substrate — https://cloud.google.com/blog/products/containers-kubernetes/bringing-you-agent-sandbox-on-gke-and-agent-substrate
- kubernetes-sigs/agent-sandbox suspend/resume (issue #36) — https://github.com/kubernetes-sigs/agent-sandbox/issues/36
- Saviynt — AI Agent Lifecycle Management — https://saviynt.com/blog/ai-agent-lifecycle-management
- Okta — AI Agent Lifecycle Management — https://www.okta.com/identity-101/ai-agent-lifecycle-management/
- Arize — Best AI Observability Tools 2026 — https://arize.com/blog/best-ai-observability-tools-for-autonomous-agents-in-2026/
- UnoSecur — AI Agent Lifecycle Security (ghost agents) — https://www.unosecur.com/resources/blog/the-ultimate-guide-to-ai-agent-lifecycle-security-from-provisioning-to-decommissioning
- W3C Bitstring Status List v1.0 — https://www.w3.org/TR/vc-bitstring-status-list/
- W3C DID 1.1 — https://www.w3.org/TR/did-1.1/
- SPIFFE for agentic AI (HashiCorp) — https://www.hashicorp.com/en/blog/spiffe-securing-the-identity-of-agentic-ai-and-non-human-actors
- Axelspire — Certificate Revocation (OCSP/CRL) — https://axelspire.com/vault/operations/certificate-revocation-crl-ocsp/
- authzed — Agentic AI is not Secure — https://authzed.com/blog/agentic-ai-is-not-secure
- EU AI Act Article 12 — https://ai-act-service-desk.ec.europa.eu/en/ai-act/article-12
- Help Net Security — EU AI Act logging requirements — https://www.helpnetsecurity.com/2026/04/16/eu-ai-act-logging-requirements/
- x402 Foundation launch (Linux Foundation, 22 members, 165M tx) — https://www.linuxfoundation.org/press/linux-foundation-is-launching-the-x402-foundation-and-welcoming-the-contribution-of-the-x402-protocol
- Cloudflare — x402 agentic payments — https://developers.cloudflare.com/agents/agentic-payments/x402/
- AP2 Protocol — https://ap2-protocol.org/
- AP2 Zero-Trust Runtime Verification (arXiv 2602.06345) — https://arxiv.org/html/2602.06345v1
- Tempo / Stripe Machine Payments Protocol — https://docs.tempo.xyz/learn/tempo/machine-payments
- Coinbase Agentic Wallets explained — https://eco.com/support/en/articles/14845485-coinbase-agentic-wallets-explained
- Skyfire — product — https://skyfire.xyz/product/
- Kite AI whitepaper — https://gokite.ai/kite-whitepaper
- ERC-8004 (Trustless Agents) — https://eips.ethereum.org/EIPS/eip-8004
- TessPay (arXiv 2602.00213) — https://arxiv.org/html/2602.00213v1
- Nevermined — agentic payments (x402+A2A+AP2) — https://nevermined.ai/blog/building-agentic-payments-with-nevermined-x402-a2a-and-ap2
- Microsoft Copilot Studio billing/licensing — https://learn.microsoft.com/en-us/microsoft-copilot-studio/billing-licensing
- FATF Travel Rule (Sumsub) — https://sumsub.com/blog/what-is-the-fatf-travel-rule/
- GENIUS Act FinCEN/OFAC NPRM (Federal Register) — https://www.federalregister.gov/documents/2026/04/10/2026-06963
- SEC Rule 17a-4 audit-trail (Luthor guide) — https://www.luthor.ai/guides/worm-vs-audit-trail-17a-4-storage-method-2025-architecture
- IMF Notes 2026/004 — Agentic AI & payments (KYA) — https://www.imf.org/en/publications/imf-notes/issues/2026/04/22/how-agentic-ai-will-reshape-payments-575560
- Fenwick — Is 2026 the Year of Agentic Payments — https://www.fenwick.com/insights/publications/is-2026-the-year-of-agentic-payments
- Mastercard Verifiable Intent (Digital Applied) — https://www.digitalapplied.com/blog/mastercard-verifiable-intent-trust-agentic-commerce
- EIP-7683 (Cross-Chain Intents) — https://eips.ethereum.org/EIPS/eip-7683
- Clockchain public testnet (Barchart) — https://www.barchart.com/story/news/368793/clockchain-opens-public-testnet-introducing-a-new-blockchain-based-global-time-standard
