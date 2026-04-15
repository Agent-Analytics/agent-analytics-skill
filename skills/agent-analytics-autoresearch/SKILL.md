---
name: agent-analytics-autoresearch
description: "Run an autoresearch-style growth loop for landing pages, onboarding, pricing, and experiment candidates. Collect or read analytics snapshots, preserve product truth, generate/critique/synthesize variants, blind-rank with Borda scoring, and output two review-ready A/B test variants. Works with any analytics data; best with Agent Analytics CLI/API."
version: 1.0.1
author: dannyshmueli
license: MIT
repository: https://github.com/Agent-Analytics/agent-analytics-skill
homepage: https://agentanalytics.sh
compatibility: Requires a coding agent that can read and write local files. Agent Analytics data collection requires npx and browser approval or detached login. The loop can also run from pasted reports, SQL output, CSV exports, or existing analytics files.
tags:
  - analytics
  - autoresearch
  - growth
  - experiments
  - ab-testing
  - landing-pages
provides:
  - capability: autoresearch
  - capability: ab-testing
  - capability: growth-experiments
  - capability: landing-page-optimization
metadata:
  openclaw:
    requires:
      anyBins:
        - npx
---

# Agent Analytics Autoresearch

Use this skill when the user wants a data-informed growth loop for landing pages, onboarding, pricing, CTAs, signup, checkout, activation, or other experiment candidates.

This skill is based on:

- Autoresearch Growth template: <https://github.com/Agent-Analytics/autoresearch-growth>
- Agent Analytics: <https://agentanalytics.sh>
- Regular Agent Analytics skill: <https://github.com/Agent-Analytics/agent-analytics-skill/tree/main/skills/agent-analytics>

Use the regular `agent-analytics` skill for general setup, tracking installation, ad hoc reporting, and normal experiment operations. Use this skill for structured variant generation and judging from a project brief plus analytics data.

## Core Rule

Do not edit production copy, product code, or live experiment setup while running the loop unless the user explicitly asks. Produce reviewable artifacts first.

## Inputs

The loop needs:

- target surface
- current control copy
- product truth
- audience
- primary metric
- proxy metric
- guardrails
- analytics snapshot or data brief
- drift constraints

Agent Analytics is preferred, but not required. Accept any evidence source: Agent Analytics CLI/API, PostHog, GA4, Mixpanel, SQL, CSV exports, product logs, dashboard screenshots summarized by the user, or hand-written notes.

## Quick Start

If the user already has a repo or run folder, work there. Otherwise initialize a run:

```bash
bash <skill_dir>/scripts/init_autoresearch_run.sh homepage-signup
```

Then fill `brief.md`, collect or paste data, and run the loop:

```text
Read brief.md and run the autoresearch growth loop. Use the latest data snapshot. Run 5 rounds. Append one row per round to results.tsv and write final_variants.md with two distinct variants for review.
```

When using Agent Analytics, collect a snapshot:

```bash
bash <skill_dir>/scripts/collect_agent_analytics_snapshot.sh my-site signup cta_click
```

If `<skill_dir>` is not obvious in the runtime, read the script from this skill's `scripts/` folder and run an equivalent local command.

## References

Load these files only when needed:

- `references/program.md` - exact loop instructions.
- `references/brief-template.md` - project brief template.
- `references/final-variants-template.md` - final output template.
- `references/results-header.tsv` - exact `results.tsv` header.

## Loop Shape

1. Define the surface, control, audience, product truth, metric, proxy, and guardrails.
2. Collect or read a dated analytics snapshot.
3. Summarize useful signals and data limitations.
4. Generate candidate A.
5. Critique A harshly for genericness, drift, unsupported claims, weak conversion intent, and competitor-sayable language.
6. Write candidate B from the critique.
7. Synthesize AB from the strongest parts of A and B.
8. Blind-rank A, B, and AB with Borda scoring.
9. Append one TSV-safe row to `results.tsv`.
10. Repeat several rounds.
11. Write `final_variants.md` with two distinct variants and the recommended experiment shape.

## Agent Analytics Snapshot

Use the official CLI when collecting live Agent Analytics data:

```bash
npx @agent-analytics/cli@0.5.12 insights "$PROJECT_SLUG" --period 7d
npx @agent-analytics/cli@0.5.12 pages "$PROJECT_SLUG" --since 7d
npx @agent-analytics/cli@0.5.12 funnel "$PROJECT_SLUG" --steps "page_view,$PROXY_EVENT,$PRIMARY_EVENT" --since 7d
npx @agent-analytics/cli@0.5.12 events "$PROJECT_SLUG" --event "$PROXY_EVENT" --days 7 --limit 50
npx @agent-analytics/cli@0.5.12 events "$PROJECT_SLUG" --event "$PRIMARY_EVENT" --days 7 --limit 50
npx @agent-analytics/cli@0.5.12 experiments list "$PROJECT_SLUG"
```

If login is needed, prefer the regular `agent-analytics` skill's browser approval or detached login guidance.

## Scoring

Use Borda scoring:

- first place: 2 points
- second place: 1 point
- third place: 0 points

Judge by:

- specificity to the product
- clarity for the target audience
- likely primary-event intent
- preservation of product truth
- low competitor-sayable language
- fit with analytics data
- respect for guardrails

## Output

`final_variants.md` must include:

- candidate_1
- candidate_2
- exact changed copy
- rationale
- risks
- recommended experiment name
- experiment shape
- data limitations
- clear note that the experiment has not been wired yet

Only create or wire an experiment after explicit human approval.
