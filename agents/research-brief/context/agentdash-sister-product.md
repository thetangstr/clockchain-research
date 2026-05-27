# AgentDash — Sister Product and Design Partner of Record

> **What this file is.** AgentDash is the agent-orchestration platform Yang also builds and ships ([thetangstr/agentdash](https://github.com/thetangstr/agentdash)). It is the reference customer for Products A and B — a real product, with real paying customers, where Clockchain's agent-identity and agent-SDK get integrated, validated, and refined before being sold outward. Briefs treat AgentDash as both a customer and a validation harness.
>
> **Why this file exists.** Half the strategic value of Products A and B depends on AgentDash being a credible first deployment. The brief generator needs to know what AgentDash is, where it overlaps with Clockchain's product line, and how to evaluate research findings against the AgentDash use case.

---

## What AgentDash is

A **Chief-of-Staff-led, multi-human AI workspace.** Users type a request to their CoS; the CoS routes work to the right adapter-backed agent (Claude Code, Codex, Hermes, Cursor, OpenCode, OpenClaw, Gemini, Pi); multiple humans on the same workspace see the same thread. It is a fork of Paperclip, adding a UI redesign, a CoS-led onboarding flow, Free + Pro per-seat billing with a Stripe trial, an `/assess` agent-readiness flow, and a multi-human + CoS chat substrate.

Stack: Node 20, pnpm, Express 5 API server, React 19 + Vite + Tailwind 4 dashboard, embedded PostgreSQL + Drizzle ORM, WebSocket bus, JSON-RPC plugin workers, adapter packages for each agent runtime. Bootstrap is one `curl | bash` command plus a setup wizard. Local-trusted mode for dev, real auth + Stripe + Claude for production.

---

## Why AgentDash matters for Products A and B

### It is a real instance of every Clockchain customer archetype

AgentDash itself maps to all three Clockchain customer archetypes simultaneously:

1. **Agent orchestration platform** — it spawns and routes agents across multiple adapters. The CoS-led pattern is exactly the dispatch surface where Product A identity matters.
2. **Product embedding agent SDKs** — its `@`-mention summons trigger downstream agents. Every such trigger is a candidate Product B Smart Receipt.
3. **Regulated SaaS deployment** — multi-tenant, per-seat billing, real customer data. Enterprise tenants will demand audit trails as they scale.

The implication for the research: when a brief surfaces a finding about (say) LangChain callback handlers, the brief should also ask "how would the same finding apply to AgentDash's adapter packages?" — because AgentDash is where the integration ships first.

### It is the de-risked first deployment

Yang controls both products. Integrating Clockchain into AgentDash does not require selling to a third party, negotiating an API surface, or waiting on a partner's roadmap. The Product A and Product B SDKs can ship as AgentDash plugin workers, the CoS can mint birth certificates for the workers it dispatches, and Smart Receipts can land in the AgentDash workspace's audit log as a first-class feature.

This makes AgentDash the **design partner of record** for Inflection Point 7 (AgentDash-led vs. platform-led GTM). The default working assumption is AgentDash-led — until evidence pushes the other way.

### It is the proof artifact for outward sales

Once Clockchain is fully integrated into AgentDash, the AgentDash deployment is the live demo for selling to LangChain, Anthropic, OpenAI, ServiceNow, Salesforce, and others. The pitch is concrete: "Here is what your platform looks like with Clockchain wired in. We did it inside AgentDash. Yours is one integration away."

---

## How AgentDash maps to Product A and Product B layers

### Product A — Agent Identity

| Layer | AgentDash integration shape |
|---|---|
| A1 Issuance | The AgentDash setup wizard registers the workspace's principal DID; the CoS mints worker-agent DIDs as agents come online. Adapter-specific identity is bound to the worker DID. |
| A2 Registry | AgentDash workspace exposes `did:clockchain:agentdash:<workspace>:<agent>` resolution. Resolution scoped to workspace members for private workers; public for shared CoS personas. |
| A3 Delegation | The CoS holds the full `delegate` capability and sub-delegates scoped capabilities to each worker for the duration of a task. Scope encodes "this Claude Code can write to this repo for this user." |
| A4 Attestation | Adapter version, model version, and `/assess` agent-readiness results land as attestations on the worker's DID. |
| A5 Revocation | Workspace owner revokes via the AgentDash admin UI; revocation propagates to all running adapters within the next CoS heartbeat. |
| A6 Verification | AgentDash exposes a public verification endpoint per workspace. External counterparties can verify "yes, agent X did act on behalf of workspace Y at time Z." |

### Product B — Clockchain Agent-SDK

| Layer | AgentDash integration shape |
|---|---|
| B1 Capture | The SDK ships as an AgentDash plugin worker. Every adapter event (Claude Code tool call, Hermes chat turn, Cursor edit) flows through the plugin bus and is captured before going on the WebSocket bus. |
| B2 Identity binding | The CoS routing message includes the dispatched worker's DID; the SDK binds every captured event to it without configuration. |
| B3 Timestamping | The workspace's dedicated Clockchain subnet timestamps every event. For high-volume workspaces, the subnet's BFT quorum sizes up. |
| B4 Subnet anchoring | Each AgentDash workspace gets its own subnet. The subnet anchors hourly to mainnet by default; enterprise tenants can opt to anchor per-action for higher evidentiary weight. |
| B5 Receipt minting | One Smart Receipt per CoS-dispatched task (not per LLM call). The Receipt rolls up the full chain of events the worker produced while completing the task. |
| B6 Retrieval | AgentDash's workspace audit log lists Receipts inline with the chat thread. Bulk export to SEC / FDA / EBA formats becomes a Pro-tier feature. |

---

## How briefs should reason about AgentDash

When a brief's topic intersects an integration surface, framework, or use case where AgentDash is plausibly a customer or competitor:

- **Frame the finding through AgentDash first.** "If this is right, how would AgentDash integrate it?" That is the smoke test for whether the finding actually moves the product roadmap.
- **Map the finding to the layer table above.** Which Product A or B layer is most affected? That becomes the tie-back's specificity.
- **Compare AgentDash to the external customer profile.** A brief on LangChain might conclude: "LangChain's callback handler surface and AgentDash's adapter plugin surface require the same Product B capture-layer pattern, so the same SDK build serves both." Or it might conclude the opposite — they are different enough to require two integration shapes — and that is a Product B v1 scope decision.

When a brief is specifically about AgentDash as a customer (a `customer-profile-agentdash-validation` brief), the tie-back lands a **concrete AgentDash integration milestone** — e.g., "Ship Product A birth-certificate minting as an AgentDash plugin worker by [the appropriate AgentDash release cycle], anchored to a development subnet on the Clockchain testnet, with the workspace's `/assess` flow generating attestations against the worker DIDs."

---

## What we will NOT do with AgentDash

- Treat it as a hidden private project. AgentDash is public; the integration with Clockchain is a public story. Briefs may reference AgentDash freely.
- Force AgentDash to compromise its own architecture to fit Clockchain. The Product A and B integrations must serve AgentDash's CoS pattern, not the other way around. If a finding implies "AgentDash must change to make this work," flag the implication explicitly so Yang can decide whether AgentDash absorbs the change or the Clockchain product adapts.
- Leak unannounced AgentDash features. Public-safe wording applies to AgentDash content the same way it applies to Clockchain. Use what is already on the `thetangstr/agentdash` README; do not speculate about unreleased roadmap.
