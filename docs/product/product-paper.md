---
title: Clockchain Agent Notary Layer — Product Paper
dek: A living product paper. Our current best understanding of what we're building, who it's for, and what's still a guess. Sharpened every week by research.
version: v0.1
date: 2026-05-29
maintainer: Jenn (Senior PM agent), reviewed by Yang Tang
status: research-stage — Clockchain is on public testnet; no production mainnet
---

# Clockchain Agent Notary Layer — Product Paper

*This is a living document. It holds our current best understanding and gets sharper every week. Each section is tagged **solid** (well-supported), **forming** (real but unproven), or **thin** (best guess, needs work). Nothing here is overstated: Clockchain is on testnet, so "court-grade evidence" means designed-for, not court-tested.*

---

## 1. Thesis · `solid`

Clockchain sells one thing in two forms: **proof of what an AI agent did, and proof of exactly when it did it — proof that does not depend on trusting whoever benefits from it.**

When an agent moves money or approves something, the questions that decide a dispute are about time: was its authority still valid at that instant? Did the payment happen before or after someone revoked it? Today the only answer is a timestamp the agent or its vendor reports about itself — easy to dispute. Clockchain's answer comes from many independent clocks that must agree before a time is locked in — hard to fake or argue with.

The bet: as autonomous agents start moving real money, "prove when" stops being a nice-to-have and becomes infrastructure — and a timestamp no interested party controls becomes the thing every agent receipt needs underneath it.

---

## 2. Product definition · `solid`

- **Product A — Agent Notarized Identity.** A registered identity for an agent that carries a dedicated *receipt-signing key*, kept separate from the agent's payment address. It proves *which* agent acted, under *what* authority, anchored to court-grade time.
- **Product B — Agent Notarized Receipt.** A signed, independently-timestamped receipt produced every time an agent does something consequential — a payment, an approval, a data access. Not a log you query later; a continuous stream of evidence across the agent's whole working life.
- **The category:** the **Agent Notary Layer** — the trust layer beneath agent platforms, the way a notary sits beneath a contract.

**What the research sharpened:** Product B is a *stream*, not a one-time record — its value grows with every action an agent takes, so it should be priced per receipt, not per seat. And there's a hole we have to close first: the "which agent signed it" link doesn't exist in today's standards (the popular ERC-8004 `agentWallet` is only a payment address), which is why Product A's signing identity is the load-bearing first build.

---

## 3. Product-market fit · `forming`

**Who.** Regulated settings where agents act and the action carries legal or financial weight. Our top three, ranked on willingness-to-pay, openness, and how fast we can reach them:
1. **Cybersecurity / SOC** — best access (we can run it inside AgentDash; security teams already buy forensic trails), fast-growing agent use.
2. **Financial / regulatory reporting** — biggest budgets and sharpest rules, but the most crowded with competitors.
3. **Legal / eDiscovery** — open field, and "court-grade evidence" is the most literal fit there.

**Why now.** Agents are starting to move money and act on their own. The rules with real teeth — anti-money-laundering (FATF), stablecoin law (the GENIUS Act), broker-dealer records (SEC 17a-4), EU AI Act logging — all assume a *human* did the transaction. **None of them say what happens when an autonomous agent does it.** That gap is real and unfilled.

**The wedge.** Agent money-movement. It's where the law already bites, where buyers are nervous, and where receipts happen most often.

**Honest caveat (why this is `forming`, not `solid`):** this is fit reasoned from regulation and buyer logic. We have **no signed design partner or customer evidence yet.** A gap in the rules is not the same as a mandate forcing anyone to buy. Outside counsel still needs to confirm an agent-initiated transaction actually triggers these obligations. PMF becomes `solid` when one real buyer says "I need this" with a budget behind it.

---

## 4. Hero features · `thin`

*Drafted from the research; not yet validated against a real buyer. These are our current best guess at the features that make Clockchain indispensable rather than nice-to-have.*

1. **The receipt stream** — every consequential agent action becomes a tamper-evident, signed record, automatically. The product, not a feature.
2. **Court-grade time** — a timestamp from independent validators that no party can fudge. The one thing no agent framework or observability tool has.
3. **The signing identity** (`did:clockchain`) — proof of *which* agent acted, with a key separate from its wallet. The anchor the whole receipt chain hangs off.
4. **"Valid-at-T" verification** — answer, with proof, "was this agent still authorized at the exact instant it acted?" The query that wins disputes (revoked-before-or-after).
5. **Regulator-ready export** — turn the receipt stream into the exact artifact a regulator, auditor, or court asks for (WORM record, court-evidence packet, originator record).
6. **Drop-in beneath existing stacks** — anchor under the tools customers already use (agent frameworks, observability) instead of replacing them. Complement, not rip-and-replace.

**What would make this `solid`:** walk these past one real compliance/security buyer and find which one they'd actually pay for. The likely headline is #4 (valid-at-T) for disputes or #5 (regulator-ready export) for audits — but that's a hypothesis until a buyer confirms it.

---

## 5. User journeys · `thin`

*Two journeys, as Yang asked: the agent's and the human's. Drafted from the lifecycle and AgentDash research; not yet walked end-to-end against a real deployment.*

### The agent's journey (the lifecycle)
1. **Born** — the agent is provisioned and gets a `did:clockchain` identity with its own receipt-signing key. The birth moment carries a court-grade timestamp.
2. **Granted authority** — its operator gives it a scoped, time-boxed mandate (e.g., "may spend up to X, until Y, for purpose Z"). Recorded as a receipt.
3. **Acts** — it calls tools, accesses data, moves money. Each consequential action is signed by its key and stamped with independent time → a receipt.
4. **Delegates** — if it hands work to a sub-agent, the delegation (with a narrowed scope) is itself a receipt.
5. **Revoked or expires** — authority is pulled or runs out; the moment is timestamped, so any later action is provably out-of-bounds.
6. **Retired** — the identity is deactivated; the full receipt chain remains verifiable forever.

### The human's journey (e.g., a compliance lead or platform owner)
1. **Integrate** — they add the Clockchain SDK to their agent platform (AgentDash is the first example). Their agents now emit receipts automatically — no change to how the agents work.
2. **Run normally** — receipts accumulate quietly in the background as agents do their jobs.
3. **The moment of need** — a regulator asks, an auditor arrives, a dispute lands, or a payment is challenged.
4. **Answer with proof** — they query the receipt stream: which agent did what, when, under whose authority — and get a cryptographic answer in seconds, not a scramble through vendor logs.
5. **Export** — they hand over a court-ready evidence packet and the matter is closed in their favor.

**The "aha":** the human goes from *"I hope our logs hold up"* to *"I can prove exactly what every agent did, and no one can argue with the clock."*

**What would make this `solid`:** walk the real AgentDash flow end-to-end — instrument one CoS→worker task that moves money, produce a real receipt, and verify it as an outside party would. That single walkthrough turns this from a sketch into a proven journey. *(This is the strongest candidate for next week's research.)*

---

## 6. What we need to build · `forming`

Honestly scoped. Most of this is design-stage; the actual protocol code lives in Clockchain's engine repos, not here.

- **The signing identity** (`did:clockchain` + receipt-signing key) — the #1 build. A draft spec blueprint already exists (W3C-conformant, closes the "who" gap).
- **The receipt** — the signed, time-stamped receipt object and how it references the signing key. The core of Product B.
- **The SDK** — the drop-in layer that captures agent actions and emits receipts (an agent-framework callback, a security-tool connector, an AgentDash plugin).
- **The time anchor** — the validator-consensus timestamp attached to every event. This is Clockchain's protocol layer (testnet today).
- **Customer isolation** — each customer's high-volume receipts run in their own space, with only a fingerprint rolled up to the shared ledger.
- **Verification & export** — the "valid-at-T" check and the regulator-format export tools.

**Honest note:** none of this is live on a production network yet. Sequencing and the actual code are an engineering conversation, not settled.

---

## 7. Open decisions · `solid`

The live forks. Each needs a call; the research has framed them, not closed them.

1. **First market — security or payments?** The analysis split evenly. Tiebreaker: *can we sign a security design partner outside Yang's own network in 60 days?* Yes → security first. No → payments is the only real urgency (though its rules don't bite until 2027).
2. **Standards — open or closed?** Industry groups are building agent-receipt standards with no good time layer — exactly our strength. Publish the *time format* as an open standard (so everyone needs our network to produce the timestamps) vs. keep it proprietary. Leaning open-format / closed-network.
3. **Does the law actually apply to agents yet?** The compliance gap is real, but a gap isn't a mandate. Needs outside counsel before we position around it.
4. **The two quiet kill-paths:** Microsoft Entra Agent ID is already bundled at ~$15/user, and an IETF draft proposes free Bitcoin-anchored time. Both could fill the gap before we reach mainnet. Mitigation: get inside the standard and watch the incumbents.

---

## 8. Confidence & what next · `solid` (this section is the honest dashboard)

| Section | Confidence | Note |
|---|---|---|
| Thesis | solid | The bet is sound; the proof is testnet architecture, not court-tested. |
| Product definition | solid | Clear, with the "who signs it" gap named as the first build. |
| Product-market fit | forming | Strong who/why logic; no signed buyer yet. |
| Hero features | thin | Drafted; need one real buyer to confirm which feature they'd pay for. |
| User journeys | thin | Drafted; need a real AgentDash end-to-end walkthrough. |
| What we need to build | forming | Inputs known; sequencing and code unsettled. |
| Open decisions | solid | Framed and honest; calls still to be made. |

**The single most valuable thing next week's research should sharpen:** the **user journeys** — specifically, walk the real AgentDash flow where an agent moves money, produce an actual receipt, and verify it as an outsider would. That one walkthrough turns both the journeys (§5) *and* the hero features (§4) from sketches into proven product, and it directly tests the wedge.

---

## Changelog

- **v0.1 — 2026-05-29** — First assembly by Jenn from the accumulated research (thesis, technical-foundations, orchestration/lifecycle/token-flow, the vertical deep-dives, the framework, the manifestos, the decision doc). Thesis and product definition are solid; product-market fit is forming; hero features and user journeys are thin first drafts and the priority for next week.
