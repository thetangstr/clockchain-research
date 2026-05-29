# Clockchain Industry Evaluation Framework

**Version:** v0.2 — 2026-05-28
**Maintainer:** Yang Tang (Head of AI Products). First round led by the head-of-research pass; Clark maintains going forward per `research-methodology.md`.

## v0.2 changelog (from v0.1)

v0.1 was a useful first cut but had three classes of problem, all fixed here:

1. **The math was wrong.** The stated maximum (40) did not match the formula (real max is 47.5 under the new axis set; was 35 under v0.1's own formula). Every per-industry total was off by one to four points, and the ranked-shortlist table listed unweighted components that did not match the per-axis scores. v0.2 recomputes every total and shows the arithmetic.
2. **The axes measured technical fit only — not whether we can win.** v0.1 scored whether the technology fits and whether regulation bites, but never whether the buyer pays, how crowded the space is, or whether we can actually reach the wedge. So it ranked Government Registries first — a vertical that is technically perfect and commercially glacial. v0.2 adds three commercial axes (Willingness To Pay, Competitive Whitespace, Wedge Access) and drops the conflated "Public Chain Requirement" axis (folded into Moat Fit).
3. **The candidate set was incomplete.** v0.1 scored ten industries and missed two of its own top three. v0.2 adds Cybersecurity/SOC, Legal/eDiscovery, Pharma supply chain (DSCSA), and Regulated-SaaS internal agents, and keeps a watch-list of unscored candidates so the gap is explicit.

Also: product names corrected to baseline v0.2 canonical (Agent Notarized Identity, Agent Notarized Receipt). v0.1 used the retired "Product A/B (Birth Certificate / Smart Receipt)" language.

**Headline finding of the re-run:** under commercially-honest axes the ranking reshuffles hard. Government Registries falls from #1 to a four-way tie at #5. The new top three — Regulatory Reporting, Cybersecurity/SOC, Legal/eDiscovery — includes two verticals that were not even in v0.1. The original framework's worst flaw was not arithmetic; it was that its top-ranked answer was a commercial trap and two of its real best answers were missing.

---

## Purpose

A repeatable rubric for scoring blockchain-agent use cases across industries, producing a ranked shortlist that tells us which verticals to chase first for Agent Notarized Identity (Product A) and Agent Notarized Receipt (Product B).

**Scope — what this framework evaluates and what it does NOT.** This framework ranks *industry verticals* (the regulated-vertical customer archetype). It does NOT evaluate the other two Clockchain customer archetypes from `products-overview.md`:

- **Agent orchestration platforms** (LangChain/LangSmith, Anthropic Agent SDK, OpenAI Agents SDK, Microsoft, Salesforce) — selected via the `customer-profile` brief rotation, not this framework.
- **Products embedding agent SDKs** (Notion, Linear, Slack, Cursor, Warp) — same.

Those are go-to-*partner* motions, not go-to-*vertical* motions. Do not score them here.

This framework directly informs **Inflection Point 3 — vertical-first vs horizontal-first GTM** (`inflection-points.md`). Its output is the evidence for which vertical, if any, becomes the first reference deployment. It builds on **Brief #2 (SEC 17a-4)**, which first established Regulatory Reporting as the sharpest wedge.

Run this framework quarterly. Re-score as the regulatory landscape, the agent ecosystem, and the competitive field evolve.

---

## The Six Evaluation Axes

Each axis is scored 1–5. Higher = stronger fit for Clockchain. Three axes measure *need* (is the technology genuinely required and is the regulation biting). Three measure *winnability* (can we actually capture this vertical commercially). v0.1 had only the need axes, which is why it ranked a commercially-impossible vertical first.

### Axis 1 — Moat Fit (need) — weight 2.0

Does this industry genuinely need ALL FIVE of Clockchain's primitives, or can a competitor satisfy it with a subset? The five primitives are: BFT validator quorum; five-layer court-admissible audit chain; customer-dedicated subnets; multi-source UTC consensus; token-staked validator slashing. Public verifiability is folded in here — the permanent ledger plus BFT quorum *is* the public-verifiability primitive, so v0.1's separate "Public Chain Requirement" axis (which correlated almost perfectly with Moat Fit) is removed.

| Score | Descriptor |
|---|---|
| 1 | Any commodity chain or a single oracle feed satisfies this |
| 2 | Needs on-chain settlement but not an audit chain |
| 3 | Needs verifiable timestamps but not the full audit chain (Chainlink OCR suffices) |
| 4 | Needs a multi-layer audit trail but not literally all five primitives |
| 5 | Needs every primitive AND public verifiability — nothing else satisfies it |

### Axis 2 — Evidentiary Pressure (need) — weight 2.0

Is there a specific, enforceable regulation mandating court-admissible records of automated actions, with a live enforcement window AND a severe penalty? This axis intentionally combines urgency (is enforcement happening now) and severity (what does non-compliance cost). A 5 requires both.

| Score | Descriptor | Examples |
|---|---|---|
| 1 | No regulatory pressure; trust is social | Internal tooling, consumer apps |
| 2 | Soft pressure; best-practice guidelines | Voluntary frameworks |
| 3 | Hard mandate but enforcement not yet live, OR live enforcement with mild penalties | Regulation passed, grace period |
| 4 | Live enforcement with real financial penalties | Active audits, fines issued |
| 5 | Live enforcement AND loss-of-license / criminal exposure | SEC 17a-4 actions, FDA, banking charter risk |

### Axis 3 — Agent Density (need) — weight 1.0

How many autonomous agents operate in this industry today, and how fast is that growing? Weighted lowest of the need axes because it is the most fluid — a vertical with low density today can flip in a year, so it is the weakest basis for a long-term bet.

| Score | Descriptor |
|---|---|
| 1 | No autonomous agents; humans do everything |
| 2 | Scripted automation, not agents |
| 3 | Early agent adoption; single-task agents in production |
| 4 | Active multi-agent orchestration; agent-to-agent handoffs |
| 5 | Dense agent ecosystem with agent-to-agent commerce |

### Axis 4 — Willingness To Pay (winnability) — weight 1.5

Does the buyer have budget AND pay on a workable timeline? This is the axis v0.1 most conspicuously lacked. A vertical with a perfect mandate but an eighteen-to-thirty-six-month procurement cycle and lowest-bidder dynamics (government) scores low here even if it scores 5 on need.

| Score | Descriptor |
|---|---|
| 1 | No budget, or free-tier expectation, or procurement measured in years |
| 2 | Budget exists but procurement is glacial (government RFP, multi-year) |
| 3 | Budget exists, procurement moderate (enterprise, 12 months) |
| 4 | Compliance-line budget, procurement workable (6–12 months) |
| 5 | Large resilient budget, fast procurement, an existing line item to charge against |

### Axis 5 — Competitive Whitespace (winnability) — weight 1.5

How crowded is this vertical with direct competitors already? Inverted: more whitespace = higher score. v0.1 ignored this entirely, which flattered Regulatory Reporting (the single most crowded vertical, where Luthor, Kiteworks, Traceprompt, asqav, AgentMint, and Microsoft Purview all already operate).

| Score | Descriptor |
|---|---|
| 1 | Crowded with multiple direct, funded competitors |
| 2 | Two or three direct competitors |
| 3 | One direct competitor or several adjacent players |
| 4 | Adjacent players only; the specific agent-notarization angle is open |
| 5 | Genuinely empty of agent-notarization competition |

### Axis 6 — Wedge Access (winnability) — weight 1.5

Can we actually get in? This rolls up AgentDash leverage (does our design-partner-of-record already serve this vertical), standards tailwind (is a standard pulling us in), reference-customer accessibility, and Yang/D4D network.

| Score | Descriptor |
|---|---|
| 1 | Cold. No leverage, hard procurement, security/clearance barriers |
| 2 | Cold enterprise sell; no AgentDash leverage, slow onboarding |
| 3 | Some access — standards tailwind OR a reachable buyer OR partial AgentDash fit |
| 4 | Strong access — AgentDash adjacency, a named contact, or clean standards path |
| 5 | AgentDash already serves it OR Yang has a direct design-partner relationship |

---

## Weighted Score

**Formula:** `Total = (Moat Fit × 2.0) + (Evidentiary Pressure × 2.0) + (Agent Density × 1.0) + (Willingness To Pay × 1.5) + (Competitive Whitespace × 1.5) + (Wedge Access × 1.5)`

**Maximum: 47.5** ( = 10 + 10 + 5 + 7.5 + 7.5 + 7.5 ). **Minimum: 9.5.**

Need axes (Moat Fit + Evidentiary Pressure + Agent Density) carry 25 of the 47.5 points; winnability axes (WTP + Whitespace + Wedge Access) carry 22.5. The split is deliberate: a vertical must both need us and be reachable. v0.1 effectively set winnability to zero.

---

## Industry Scores

Each row shows the six axis scores and the arithmetic. Verify the math against the formula on every re-run — see the self-audit step in `research-methodology.md`.

### 1. Regulatory Reporting & Compliance — Financial

| Axis | Score | Rationale |
|---|---|---|
| Moat Fit | 5 | SEC 17a-4, SOX 404, FINRA require WORM-format immutable audit trails with specific timestamping. The full chain is the literal requirement. |
| Evidentiary Pressure | 5 | Active SEC enforcement; record-keeping fines in the hundreds of millions; EU AI Act Article 12 adds a second mandate. Loss-of-license exposure. |
| Agent Density | 4 | Regulatory-reporting agents, compliance-monitoring bots, automated calculators already at major brokerages; agent-initiated trades need trails. |
| Willingness To Pay | 5 | Financial compliance is the largest, fastest-moving budget line of any vertical. An existing SKU to charge against. |
| Competitive Whitespace | 2 | The most crowded vertical. Luthor (explicitly 17a-4), Kiteworks, Traceprompt, asqav, AgentMint all here; Microsoft Purview adjacent. |
| Wedge Access | 3 | No direct AgentDash leverage, but Brief #2 wedge plus dual standards tailwind (SEC + EU AI Act); AgentDash could host a fintech tenant. |

**Total = (5×2)+(5×2)+(4×1)+(5×1.5)+(2×1.5)+(3×1.5) = 10+10+4+7.5+3+4.5 = 39.0**

### 2. Cybersecurity & SOC Agents *(new in v0.2)*

| Axis | Score | Rationale |
|---|---|---|
| Moat Fit | 4 | Forensic chain-of-custody for incidents, tamper-evident SOC logs, agent-to-agent auth; needs the full audit chain plus identity, subnets for tenant isolation. |
| Evidentiary Pressure | 4 | MITRE ATLAS, EU AI Act Article 15 (robustness/cybersecurity for high-risk AI), SEC cyber-incident 8-K four-day disclosure rule, forensic admissibility. Live. |
| Agent Density | 4 | SOC automation is among the fastest agent-adoption areas — SOAR, autonomous triage, CrowdStrike Charlotte AI, Microsoft Security Copilot. Growing fast. |
| Willingness To Pay | 4 | Security budgets are large and recession-resilient; CISOs pay for forensic defensibility. |
| Competitive Whitespace | 3 | Kiteworks (SIEM integration) is adjacent, but agent-action notarization for SOC is open. |
| Wedge Access | 4 | Zyberpol is named in Clockchain's own canonical files as a SOC-adjacent customer; AgentDash can run security agents; CISO buyer is reachable. Best access among regulated verticals. |

**Total = (4×2)+(4×2)+(4×1)+(4×1.5)+(3×1.5)+(4×1.5) = 8+8+4+6+4.5+6 = 36.5**

### 3. Legal — eDiscovery & Contract Automation *(new in v0.2)*

| Axis | Score | Rationale |
|---|---|---|
| Moat Fit | 4 | Judicial admissibility (Federal Rules of Evidence 901/902), eDiscovery chain of custody, attorney work-product audit. "Court-admissible" is the literal product. Leans 5; oracle-timestamping covers only the simplest cases. |
| Evidentiary Pressure | 4 | FRE 902(13)/(14) self-authentication of electronic records, FRCP 37(e) spoliation sanctions, legal-malpractice exposure. Strong but not per-transaction license loss. |
| Agent Density | 3 | Legal AI is exploding (Harvey, Hebbia, contract-review agents) but adoption is gated by liability caution. Trending up fast. |
| Willingness To Pay | 4 | Law firms and legal departments have budgets and bill clients; legaltech spend is rising sharply. |
| Competitive Whitespace | 4 | Truescreen (provenance) is adjacent, but agent-action notarization for legal is open. |
| Wedge Access | 3 | No direct AgentDash leverage yet, but AgentDash agents draft and review documents; legal buyer reachable via legaltech. |

**Total = (4×2)+(4×2)+(3×1)+(4×1.5)+(4×1.5)+(3×1.5) = 8+8+3+6+6+4.5 = 35.5**

### 4. Cross-Border Payments & Settlement

| Axis | Score | Rationale |
|---|---|---|
| Moat Fit | 4 | Settlement finality, compliance screening, reconciliation; needs multi-source UTC for regulated timestamps and the full chain for correspondent-banking audit. |
| Evidentiary Pressure | 5 | MiFID II, FATF Travel Rule, OFAC. Every transaction needs an immutable attributable record; banks fined billions for AML failures. |
| Agent Density | 3 | Settlement, compliance-screening, reconciliation agents emerging; not yet dense orchestration. |
| Willingness To Pay | 4 | Banks have massive compliance budgets but vendor onboarding runs 12–18 months. |
| Competitive Whitespace | 3 | SWIFT gpi, Ripple, established rails; crowding, but not in agent-attribution specifically. |
| Wedge Access | 2 | No AgentDash leverage; banks are a hard cold sell with regulatory-approval onboarding. |

**Total = (4×2)+(5×2)+(3×1)+(4×1.5)+(3×1.5)+(2×1.5) = 8+10+3+6+4.5+3 = 34.5**

### 5. Government Registries & Notary

| Axis | Score | Rationale |
|---|---|---|
| Moat Fit | 5 | Land titles, corporate filings, patent offices need immutable, publicly verifiable, timestamped records. Full chain plus BFT quorum. |
| Evidentiary Pressure | 5 | Notarization is a state function; e-recording statutes in all fifty states; e-filing mandates. |
| Agent Density | 3 | Filing agents (Wolters Kluwer, CT Corp, CSC, NRAI) are widespread; PACER e-filing mandatory since 2002. |
| Willingness To Pay | 2 | Government procurement is the slowest and most budget-constrained; RFP cycles 18–36 months, lowest-bidder dynamics. |
| Competitive Whitespace | 4 | Comparatively empty of agent-notary players; legacy GovTech incumbents are not agent-focused. |
| Wedge Access | 1 | No AgentDash leverage; the hardest cold sell; procurement barriers, FedRAMP, clearances. |

**Total = (5×2)+(5×2)+(3×1)+(2×1.5)+(4×1.5)+(1×1.5) = 10+10+3+3+6+1.5 = 33.5**

### 5 (tie). Healthcare & Clinical Data

| Axis | Score | Rationale |
|---|---|---|
| Moat Fit | 4 | Consent management, clinical-trial audit, HIPAA accounting of disclosures; full chain. PHI stays off-chain, hashes anchor on-chain (TEFCA permits). |
| Evidentiary Pressure | 5 | HIPAA 45 CFR §164.312(b), FDA 21 CFR Part 11, EU AI Act high-risk classification for clinical decision support. |
| Agent Density | 2 | Clinical decision support operates under physician oversight, not autonomously. |
| Willingness To Pay | 3 | Compliance budgets exist but hospital-IT procurement is slow (12 months plus); pharma faster. |
| Competitive Whitespace | 4 | Few blockchain-audit players focused on clinical specifically. |
| Wedge Access | 2 | No AgentDash leverage; regulated-healthcare cold sell with HIPAA BAA overhead. |

**Total = (4×2)+(5×2)+(2×1)+(3×1.5)+(4×1.5)+(2×1.5) = 8+10+2+4.5+6+3 = 33.5**

### 5 (tie). Pharma Supply Chain — DSCSA *(new in v0.2)*

| Axis | Score | Rationale |
|---|---|---|
| Moat Fit | 4 | Full interoperable electronic track-and-trace, tamper-evident, multi-party with trade-secret isolation (subnets). |
| Evidentiary Pressure | 5 | DSCSA mandates interoperable electronic track-and-trace; the stabilization period is ending into hard FDA enforcement with serious penalties. |
| Agent Density | 2 | Automated serialization and verification systems; few true autonomous agents yet. |
| Willingness To Pay | 4 | Pharma has deep budgets and a hard compliance deadline forcing spend now. |
| Competitive Whitespace | 3 | DSCSA vendors exist (TraceLink dominant) but the agent-notarization angle is open. |
| Wedge Access | 2 | No AgentDash leverage; pharma cold sell with GxP validated-systems overhead. |

**Total = (4×2)+(5×2)+(2×1)+(4×1.5)+(3×1.5)+(2×1.5) = 8+10+2+6+4.5+3 = 33.5**

### 5 (tie). Regulated-SaaS Internal Agents — Agentforce / ServiceNow / SAP Joule *(new in v0.2)*

| Axis | Score | Rationale |
|---|---|---|
| Moat Fit | 3 | Enterprise agent platforms need audit trails, but the platform vendor may build its own; Clockchain as external notary is a "nice to have" unless the customer is itself regulated. |
| Evidentiary Pressure | 3 | Indirect — a bank using Agentforce inherits 17a-4, but the platform layer itself faces softer pressure. |
| Agent Density | 5 | Agentforce, ServiceNow AI agents, SAP Joule are the densest enterprise agent-deployment surface right now. |
| Willingness To Pay | 4 | Enterprise SaaS customers pay, but a notary layer is something they may expect the platform to provide. |
| Competitive Whitespace | 3 | The platforms themselves are the competition (they may self-provide); external whitespace medium. |
| Wedge Access | 4 | Closest to AgentDash's own CoS-led pattern — AgentDash *is* a regulated-SaaS-internal-agent product, so this is the strongest conceptual fit with our design partner. |

**Total = (3×2)+(3×2)+(5×1)+(4×1.5)+(3×1.5)+(4×1.5) = 6+6+5+6+4.5+6 = 33.5**

### 9. Insurance — Parametric & Claims

| Axis | Score | Rationale |
|---|---|---|
| Moat Fit | 3 | Parametric pays on oracle triggers (Chainlink suffices); claims need audit but not the full chain. |
| Evidentiary Pressure | 3 | State insurance commissioners and EU IDD; enforcement uneven. |
| Agent Density | 3 | Claims-intake bots, fraud detection, catastrophe modeling. |
| Willingness To Pay | 4 | Insurers have budgets; fraud is a major cost driver they will pay to reduce. |
| Competitive Whitespace | 4 | Few blockchain-audit players in claims specifically. |
| Wedge Access | 2 | Cold; no AgentDash leverage. |

**Total = (3×2)+(3×2)+(3×1)+(4×1.5)+(4×1.5)+(2×1.5) = 6+6+3+6+6+3 = 30.0**

### 9 (tie). Supply Chain & Provenance

| Axis | Score | Rationale |
|---|---|---|
| Moat Fit | 4 | Multi-party provenance; subnets isolate trade secrets while sharing verification. |
| Evidentiary Pressure | 4 | FDA FSMA, EU Deforestation Regulation, customs. |
| Agent Density | 2 | IoT sensors and oracles automate entry; true autonomous agents rare. |
| Willingness To Pay | 3 | Budgets exist but the supply-chain-blockchain pilot graveyard (IBM Food Trust wound down) has made buyers wary. |
| Competitive Whitespace | 3 | Many supply-chain blockchain players, though many are failing. |
| Wedge Access | 2 | Cold enterprise sell; no AgentDash leverage. |

**Total = (4×2)+(4×2)+(2×1)+(3×1.5)+(3×1.5)+(2×1.5) = 8+8+2+4.5+4.5+3 = 30.0**

### 11. Carbon Credits & ESG Verification

| Axis | Score | Rationale |
|---|---|---|
| Moat Fit | 4 | Tamper-proof issuance, retirement, monitoring; subnets for methodology privacy. |
| Evidentiary Pressure | 4 | EU CBAM, California Cap-and-Trade, IC-VCM integrity initiatives. |
| Agent Density | 3 | dMRV satellite verification, registry bots (KlimaDAO, Toucan, Moss). |
| Willingness To Pay | 2 | VCM is in a credibility crisis; prices crashed, budgets shrinking, buyers skeptical. |
| Competitive Whitespace | 3 | Toucan, Flowcarbon and others, many struggling. |
| Wedge Access | 2 | Cold; no AgentDash leverage. |

**Total = (4×2)+(4×2)+(3×1)+(2×1.5)+(3×1.5)+(2×1.5) = 8+8+3+3+4.5+3 = 29.5**

### 12. IP, Royalty & Media Rights

| Axis | Score | Rationale |
|---|---|---|
| Moat Fit | 3 | Royalty distribution needs timestamping, not the full chain. |
| Evidentiary Pressure | 3 | Copyright Office filings, DMCA records, streaming royalty audits. |
| Agent Density | 2 | Largely manual (ASCAP/BMI); emerging NFT royalty-enforcement agents. |
| Willingness To Pay | 3 | Media companies pay but margins are tight; royalty disputes are real money. |
| Competitive Whitespace | 4 | Story Protocol is here but focused on IP-as-asset, not notarization. |
| Wedge Access | 3 | Story Protocol is a potential partner (Brief #4, inflection points); AgentDash agents produce IP. |

**Total = (3×2)+(3×2)+(2×1)+(3×1.5)+(4×1.5)+(3×1.5) = 6+6+2+4.5+6+4.5 = 29.0**

### 13. DeFi Trading

| Axis | Score | Rationale |
|---|---|---|
| Moat Fit | 3 | MEV, liquidations, yield optimization need timestamps and audit, but oracles (Chainlink, Pyth) cover most; full chain is overkill for trade execution. |
| Evidentiary Pressure | 3 | CFTC and SEC have pursued DeFi (Uniswap Wells notice, multiple settlements); FATF extending to DeFi. Rising, not yet per-bot license loss. |
| Agent Density | 5 | The densest agent ecosystem — MEV bots, arbitrage, yield optimizers, liquidators; agent-to-agent transactions routine. |
| Willingness To Pay | 2 | DeFi is crypto-native and resists paying for compliance tooling; treasuries spend on audits and security, not notary layers. |
| Competitive Whitespace | 3 | Some on-chain attestation players but not focused on DeFi-trade notarization. |
| Wedge Access | 2 | No AgentDash leverage; Clockchain would need protocols to build on it. The $CCTT/chain angle helps but is speculative. |

**Total = (3×2)+(3×2)+(5×1)+(2×1.5)+(3×1.5)+(2×1.5) = 6+6+5+3+4.5+3 = 27.5**

### 13 (tie). Identity & Credentials Verification

| Axis | Score | Rationale |
|---|---|---|
| Moat Fit | 4 | DID issuance, credential verification, revocation registries; Product A core. |
| Evidentiary Pressure | 3 | KYC/AML (FinCEN, AMLD6), eIDAS qualified signatures; required but not yet agent-specific. |
| Agent Density | 3 | Verification agents emerging across hospitality, finance, platforms. |
| Willingness To Pay | 3 | Identity vendors pay, but it is a crowded, commoditizing market with margin pressure. |
| Competitive Whitespace | 1 | The most crowded space of all — DNSid, OpenAgents AgentID, SPIFFE, DigiCert, World ID, the entire ERC-8004 ecosystem live here. |
| Wedge Access | 3 | Standards tailwind (eIDAS, ERC-8004); Product A is literally identity and AgentDash mints agent identities — but the crowding offsets it. |

**Total = (4×2)+(3×2)+(3×1)+(3×1.5)+(1×1.5)+(3×1.5) = 8+6+3+4.5+1.5+4.5 = 27.5**

---

## Ranked Shortlist

| Rank | Industry | Moat | Evid | Agent | WTP | White | Wedge | **Total** |
|---|---|---|---|---|---|---|---|---|
| 1 | **Regulatory Reporting (Financial)** | 5 | 5 | 4 | 5 | 2 | 3 | **39.0** |
| 2 | **Cybersecurity & SOC** *(new)* | 4 | 4 | 4 | 4 | 3 | 4 | **36.5** |
| 3 | **Legal — eDiscovery** *(new)* | 4 | 4 | 3 | 4 | 4 | 3 | **35.5** |
| 4 | **Cross-Border Payments** | 4 | 5 | 3 | 4 | 3 | 2 | **34.5** |
| 5 | **Government Registries** | 5 | 5 | 3 | 2 | 4 | 1 | **33.5** |
| 5 | **Healthcare & Clinical** | 4 | 5 | 2 | 3 | 4 | 2 | **33.5** |
| 5 | **Pharma DSCSA** *(new)* | 4 | 5 | 2 | 4 | 3 | 2 | **33.5** |
| 5 | **Regulated-SaaS Internal Agents** *(new)* | 3 | 3 | 5 | 4 | 3 | 4 | **33.5** |
| 9 | **Insurance** | 3 | 3 | 3 | 4 | 4 | 2 | **30.0** |
| 9 | **Supply Chain & Provenance** | 4 | 4 | 2 | 3 | 3 | 2 | **30.0** |
| 11 | **Carbon Credits & ESG** | 4 | 4 | 3 | 2 | 3 | 2 | **29.5** |
| 12 | **IP, Royalty & Media** | 3 | 3 | 2 | 3 | 4 | 3 | **29.0** |
| 13 | **DeFi Trading** | 3 | 3 | 5 | 2 | 3 | 2 | **27.5** |
| 13 | **Identity & Credentials** | 4 | 3 | 3 | 3 | 1 | 3 | **27.5** |

---

## The Shortlist — Top Three

### #1 — Regulatory Reporting & Compliance, Financial (39.0)

**Why it wins.** It is the only vertical that scores 5 on both need axes AND 5 on willingness-to-pay. SEC 17a-4 is active enforcement law; EU AI Act Article 12 adds a second mandate; financial compliance is the largest, fastest-moving budget line anywhere. The moment a financial agent initiates a trade, allocates a position, or calculates a fee, that action needs an immutable, attributable, timestamped record.

**The one risk that matters.** Competitive whitespace is a 2 — the lowest of any top-five vertical. Luthor targets 17a-4 explicitly; Kiteworks, Traceprompt, asqav, and AgentMint are all here; Microsoft Purview is one product decision away from bundling this. We win on the moat (none of them has the five-primitive court-admissible stack) but we are entering a knife fight, not an open field.

**The wedge.** Every autonomous trading, compliance-monitoring, or regulatory-reporting agent inside a broker-dealer is generating records that may not survive a 17a-4 audit today. Clockchain as the WORM-equivalent, court-admissible notary layer for agent actions inside financial firms.

**Product spec implication.** Both products required. The Agent Notarized Receipt (Product B, layers B1→B5→B6) must carry agent DID (from Product A's A1), action type, multi-source UTC timestamp, subnet anchor, and a defined retention period; SEC examiners must retrieve the full audit chain. Maps to baseline open questions in B5 (WORM mode) and B6 (regulator-format export).

### #2 — Cybersecurity & SOC Agents (36.5) *(new in v0.2)*

**Why it places second.** The best-balanced profile in the table — no axis below 3 — and the highest Wedge Access (4) of any regulated vertical, because Zyberpol is already named in Clockchain's canonical files as a SOC-adjacent customer and AgentDash can run security agents directly. SOC automation is also one of the fastest agent-adoption curves in the industry.

**The forcing function.** The SEC cyber-incident disclosure rule (8-K Item 1.05, four business days) plus EU AI Act Article 15 plus forensic admissibility requirements mean a SOC agent that triages or remediates an incident needs a tamper-evident, court-admissible record of what it did and when. MITRE ATLAS frames the agent-specific threat surface.

**The wedge.** When an autonomous SOC agent quarantines a host, blocks an IP, or escalates an incident, the chain of custody for that decision must hold up in a breach investigation and potentially in litigation. Clockchain Notarized Receipts as the forensic substrate beneath SOAR and security-copilot agents.

**Product spec implication.** Product B B1 Capture needs a SIEM/SOAR integration shape (the way the brief rotation already specs a LangChain callback handler). Product A A3 Delegation matters for scoped, revocable agent authority during an incident. Strong AgentDash dogfood candidate.

### #3 — Legal, eDiscovery & Contract Automation (35.5) *(new in v0.2)*

**Why it places third.** "Court-admissible" is the most literal possible application of the entire product — the Federal Rules of Evidence are the spec. Best Competitive Whitespace (4) among the top four. Legaltech budgets are booming and law firms bill the cost straight through to clients.

**The forcing function.** FRE 902(13) and 902(14) let electronic records self-authenticate when accompanied by a qualified certification — which is exactly what a Clockchain Notarized Receipt is. FRCP 37(e) spoliation sanctions punish missing or altered records. As legal AI agents (Harvey, Hebbia, contract-review bots) take on more drafting and review, the provenance of their actions becomes discoverable.

**The wedge.** Every agent-drafted contract clause, every agent-run document review, every agent-issued legal hold needs a chain of custody an opposing counsel cannot impeach. Clockchain Notarized Receipts as self-authenticating evidence under FRE 902.

**Product spec implication.** Product B B5 Receipt Minting should produce an FRE-902-shaped certification artifact. Product A A4 Attestation matters for "this agent used certified-model-version-Y." AgentDash agents already draft and review documents — a natural dogfood.

---

## Sequencing — not just a ranking

A ranked list is not a plan. The top three split into two different time horizons, and the right move is to run them in a deliberate order rather than chase the highest number.

1. **Beachhead now: Cybersecurity & SOC (#2), via AgentDash.** Despite ranking second, SOC is the *first* move because it has the highest Wedge Access and an in-house dogfood path (Zyberpol-adjacency plus AgentDash running security agents). Ship the Product B SIEM/SOAR capture integration inside AgentDash, produce real Notarized Receipts for real SOC-agent actions, and use that as the reference architecture. Fast, controllable, no external procurement gate.
2. **Land the lighthouse: Regulatory Reporting (#1), once the SOC reference exists.** Regulatory Reporting has the biggest budget and the sharpest mandate but the worst whitespace — so enter it *with a working reference deployment in hand*, not cold. The SOC beachhead de-risks the financial sell ("here is the court-admissible audit chain running in production").
3. **Expand on proof: Legal/eDiscovery (#3) as the third leg.** Open whitespace, literal FRE fit, and AgentDash document-agents make it the natural third vertical once the receipt format and verification flow are battle-tested.
4. **Hold, do not chase: Government Registries.** Technically a 5/5 on need, but WTP 2 and Wedge Access 1 make it a multi-year enterprise play. Keep it on the roadmap as a long-horizon prize; do not let its perfect need-score pull early resources into an 18–36-month procurement cycle.

This sequence advances **Inflection Point 3 (vertical-first vs horizontal-first)** toward a specific hybrid: horizontal SDK shipped through AgentDash, with SOC as the first vertical Receipt template, Regulatory Reporting as the second, Legal as the third.

---

## Watch List — candidates not yet scored

Named here so the gap is explicit rather than silent (see the completeness gate in `research-methodology.md`). Score these in a future quarter as evidence accumulates:

- **Autonomous vehicles** — NHTSA reporting, black-box-equivalent for AI driving decisions. High evidentiary, rising density.
- **Aviation maintenance records** — 14 CFR 91.417 lifetime retention. Maxes evidentiary; rising predictive-maintenance density.
- **Telecom CDR / subscriber records** — CALEA plus state retention. Very high density, medium evidentiary.
- **Energy / smart grid / demand response** — FERC and ISO market-participant obligations.
- **Education / academic credentialing** — Open Badges, eIDAS academic credentials.
- **Voting / civic infrastructure** — highest public-verifiability need of any vertical, but high political risk and low agent density.

---

## How to Use This Framework

1. **Run quarterly.** Regulatory pressure, agent density, and the competitive field all shift fast.
2. **Re-score on evidence, not vibes.** Each axis score must cite a specific regulation, a named competitor, or a concrete adoption signal — the same standard the brief rotation holds.
3. **Verify the arithmetic every run.** Recompute every total against the formula; confirm the ranked table matches the per-axis scores. v0.1 failed this and shipped ten wrong totals.
4. **Score the watch list before adding new verticals elsewhere.** Enumerate broadly (divergent) before ranking (convergent).
5. **Feed the output into the roadmap and the inflection points.** This framework is the evidence for Inflection Point 3; its top vertical should inform which Product A/B layers ship first (`product-baseline.md`, `roadmap-clark-v0.md`).
6. **Version every change.** Bump the version line and add a changelog entry, like every other canonical artifact.

---

## Versioning

v0.2 — 2026-05-28 — head-of-research re-run: fixed arithmetic, six-axis redesign with commercial axes, four new verticals, sequencing, watch list, canonical product names.
v0.1 — initial four-axis cut (math errors; technical-fit-only; ten verticals). Superseded.
