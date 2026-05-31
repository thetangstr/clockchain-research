# Research Methodology — How Clark Does Analytical Research

**Version:** v0.1 — 2026-05-28
**Audience:** Clark (the clockchain Hermes profile), acting as senior researcher.
**Authority:** This SOP governs **analytical research artifacts**. It is the peer of `synthesize.md`, which governs voice briefs. Read whichever one matches the deliverable you are producing.

---

## Two kinds of deliverable — know which one you are making

Clark produces two fundamentally different research outputs. They have opposite formatting rules and different quality bars. Using the wrong SOP is the single most common failure mode.

| | **Voice brief** | **Analytical artifact** |
|---|---|---|
| Examples | The twice-weekly `/brief` JSON | Industry evaluation framework, competitive matrix, scorecard, customer-persona doc, state-of-category report, sequencing plan |
| Governed by | `synthesize.md` + `style.md` | **This file** |
| Audience | Yang listening via Gemini/Grok TTS | Yang reading on screen; sometimes external collaborators |
| Numbers | Spelled out as words ("thirty percent") | **Numerals required.** Tables, math, scores. |
| Tables/lists | Forbidden in `sections[].body` | **Required.** Scoring tables, ranked lists, matrices. |
| Output | One JSON file in `src/data/briefs/` | One Markdown file in `context/` (internal) or `docs/thesis/` (public) |
| Voice | Spoken cadence | Direct, dense, precise. No TTS constraints. |

**If you ever find yourself spelling out numbers as words inside a scoring table, you have applied the wrong SOP.** Analytical artifacts use numerals. The voice rules in `style.md` apply ONLY to voice briefs.

---

## The analytical research workflow

Five phases. Do them in order. The first round of any new artifact type may be led by Yang or the head-of-research pass; after that, Clark owns the quarterly re-runs.

### Phase 1 — Frame (before any research)

State, in writing at the top of the artifact:

1. **The decision this artifact informs.** Not "research on X" — the actual choice it changes. ("Which vertical do we chase first?" not "industry overview.") Name the inflection point from `inflection-points.md` if one applies.
2. **Scope — what is in and what is out.** Explicitly exclude what you are not covering and say why. An artifact that silently omits half the candidate space reads as if it covered everything.
3. **What prior work this builds on.** Cite the briefs, the baseline layers, or the prior version of this artifact. Never re-derive a finding that an earlier brief already established without citing it.

### Phase 2 — Diverge (enumerate broadly)

Before you score, rank, or recommend anything, **enumerate the full candidate set.** This is the phase the voice-brief workflow does not have, and its absence is why analytical artifacts miss obvious entries.

- List every candidate you can defend including — not just the obvious ones.
- For a vertical-selection artifact, that means brainstorming twenty industries and keeping fourteen, not starting with the ten that came to mind.
- If you cap the set (top N, drop the long tail), say so explicitly and keep a **watch list** of what you excluded. Silent truncation reads as completeness.
- Sanity check: "If a smart skeptic read this, what obvious candidate would they say I missed?" Add it before they do.

### Phase 3 — Score / analyze (convergent)

- **Define every axis or dimension before you score anything.** Each axis gets a name, what it measures, a 1–5 (or chosen scale) rubric, and a weight with a one-line rationale.
- **Axes must be orthogonal.** If two axes move together across every row (e.g., v0.1's "Moat Fit" and "Public Chain Requirement"), you are double-counting one property — merge them.
- **Do not conflate distinct things in one axis** unless you intend to. "Evidentiary Pressure" combining urgency and severity is a deliberate choice, stated in the rubric. Accidental conflation is a bug.
- **Every score cites evidence.** A specific regulation, a named competitor, a concrete adoption signal — the same standard the brief rotation holds. "Feels high" is not a rationale.
- **Include the commercial reality, not just the technical fit.** Whether the technology fits is necessary but not sufficient. Always ask: who pays, how fast, how crowded, can we even get in. The most common analytical failure is a ranking that is technically perfect and commercially useless.

### Phase 4 — Self-audit (mandatory, non-negotiable)

Analytical artifacts carry numbers, and numbers are checkable. Before you write the recommendation:

- **Recompute every total** against the stated formula. Do the arithmetic in a script (`python_repl` or a Bash python one-liner), not in your head. v0.1 of the industry framework shipped ten wrong totals because this step did not exist.
- **Verify the stated maximum and minimum** match the formula.
- **Confirm the ranked table matches the per-item scores** — that the components in the summary table are the same numbers as the per-item detail.
- **Confirm the ranking is monotonic** (sorted the way you claim it is sorted).
- **Check internal consistency** — no row contradicts its own rationale; no claim in the summary contradicts the detail.

If any check fails, fix it before proceeding. State in the artifact that the audit ran (a one-line "verify the arithmetic every run" note in the How-to-Use section is enough).

### Phase 5 — Recommend and link

- **A ranking is not a plan.** End with a sequencing recommendation: do X first, then Y, then Z, with the rationale (usually: highest winnability first to de-risk the highest-need play later). The number-one row is rarely the right first move on its own.
- **Link the output back into the system.** Name which inflection point this advances and toward which side. Propose updates to `product-baseline.md` or `roadmap-clark-v0.md` if the findings warrant them. Cite which Product A/B layers (A1–A6, B1–B6) the recommendation touches.
- **Version the artifact.** Top-line version + date + maintainer, and a changelog block at the bottom, exactly like `product-baseline.md` and the manifestos. Every re-run bumps the version.

---

## Canonical naming and public-safety (applies to ALL research)

These rules apply to voice briefs and analytical artifacts alike. They are the same rules in `synthesize.md` and SOUL.md — repeated here so this SOP stands alone.

- **Use canonical product names** (baseline v0.2): **Agent Notarized Identity** (Product A), **Agent Notarized Receipt** (Product B), **Agent Notary Layer** (category). Never use the retired "Birth Certificate" or "Smart Receipt" as current names — only when explicitly discussing competitive positioning against Identity Digital's DNSid or Microsoft's framing.
- **Reference the six-layer model** (A1–A6, B1–B6) by identifier when a finding touches a layer.
- **Public-safe only.** No internal KR targets, no internal roadmap dates, no unannounced features, no non-public customer names. Use what is in the canonical context files or on `clockchain.network`.
- **Distinguish locked from exploratory claims.** Locked = manifestos, specs, baseline v0.2, the five-primitive moat. Exploratory = brief findings, framework scores, inflection-point evidence. Mark exploratory work as such; do not present a research score as settled company position.

---

## Where artifacts live

| Artifact kind | Location | Why |
|---|---|---|
| Voice brief | `src/data/briefs/<date>-<slug>.json` | Rendered to the public voice site |
| Internal analytical (frameworks, scorecards, personas, patterns) | `agents/research-brief/context/` | Loaded by Clark on future runs; informs briefs; not published to the voice site |
| Public analytical (manifestos, specs, state-of-category, category map) | `docs/thesis/` | Rendered to the public site; the category-defining artifacts |

When in doubt about internal vs public: if it contains scoring of named competitors, GTM sequencing, or anything Yang has not blessed for public consumption, it is internal (`context/`). Promote to `docs/thesis/` only on Yang's explicit call.

---

## The standing quality bar (the one-paragraph version)

A Clark analytical artifact: states the decision it informs and what is out of scope; enumerates the full candidate set with a watch list for anything dropped; defines orthogonal, evidence-cited axes including commercial reality; **has arithmetic that has been recomputed in a script and verified**; ends with a sequencing recommendation, not just a ranking; links to the inflection point it advances and the baseline layers it touches; uses canonical product names; and is versioned with a changelog. If any of those is missing, it is a draft, not a deliverable.

---

## Worked example

The current `context/industry-evaluation-framework.md` (v0.2) is the reference implementation of this methodology — it was the first artifact produced to this standard. Read it before producing a new analytical artifact. Its v0.2 changelog also documents exactly what v0.1 got wrong (math, missing commercial axes, incomplete candidate set), which is the failure catalog this SOP exists to prevent.

---

## Versioning

v0.1 — 2026-05-28 — initial methodology, written alongside the industry-framework v0.2 re-run that motivated it.
