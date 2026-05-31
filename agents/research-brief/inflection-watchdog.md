# Inflection Point Watchdog — Clark's weekly forks check

**What this is.** Every week, Clark checks whether new research has moved any of the seven strategic forks in `context/inflection-points.md`, flags the movement, keeps that doc current, and posts a short status to Yang. This is the *watchdog* — it watches for the evidence that pushes a fork toward a decision, so a fork never quietly resolves itself without us noticing.

**Audience: Yang.** Plain English, short. Most weeks, most forks won't move — and saying that plainly is the right answer, not padding.

## The seven forks (live in `context/inflection-points.md`)

1. Identity-first vs SDK-first sequencing
2. Anchor-the-stack vs compete-the-stack
3. Vertical-first vs horizontal-first GTM
4. Subnet-native vs shared-subnet entry tier
5. Cryptographic-first vs compliance-checkbox-first messaging
6. Receipt-as-product vs SDK-as-product
7. AgentDash-led vs platform-led GTM

(The doc is the source of truth — read it; forks may be added or resolved.)

## The weekly loop

1. `cd ~/clockchain-research && git pull --ff-only origin main`.
2. Read `context/inflection-points.md` — each fork, its two sides, and its leading indicators.
3. Read the week's new research: the latest items in `src/data/briefs/`, the latest weekly digest in `src/data/weekly/`, and any new reports in `docs/thesis/`. What new evidence actually appeared this week?
4. **For each fork, judge honestly:** did real new evidence appear for either side this week? Which way did it push? Is the fork now close to resolving (one side clearly winning)? Only count cited evidence — a regulation, a named competitor move, a concrete adoption signal. Not vibes.
5. **Update `context/inflection-points.md`:**
   - For any fork that moved, append a dated one-line note under that fork: `YYYY-MM-DD: moved toward <side> — <one-line evidence>`.
   - If a fork is ready to resolve (overwhelming evidence), move it to the **Resolved** section with the date, the resolution in one sentence, and the supporting brief/report names. Do not auto-resolve without strong evidence.
6. **Write the "Inflection Watch" status** — plain, one line per fork: *moved toward X (because…)* / *no movement* / *close to resolving*. Lead with whatever moved; if nothing moved, say so in one line and stop.
7. **Save** to `src/data/weekly/<YYYY-MM-DD>-inflection-watch.md` and **post the status to Yang in Slack** (via `hermes send --to slack`).
8. If `context/inflection-points.md` changed, open a PR with just that change (do not auto-merge — Yang reviews the forks doc).

## Hard rules

- Move a fork only on real, cited evidence. Default to "no movement."
- Plain English. Short. A no-movement week is a two-line message.
- Be honest about uncertainty. A fork can move *slightly* — say so without overclaiming a resolution.
- When a fork looks close to resolving, flag it for a deeper look — the deep multi-agent re-evaluation runs in the research engine, not here. The watchdog's job is to *notice*, not to decide.

## Cadence

Weekly, Wednesday 7:00am Pacific (spread out from the Monday digest and the Tue/Fri briefs). Scheduled as the `clockchain-inflection-watchdog` job.
