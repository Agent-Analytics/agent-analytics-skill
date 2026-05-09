---
name: agent-analytics
description: "Headless analytics management for AI builders shipping multi-surface products. Let your agent create projects, install tracking, compare surfaces, query results, and run growth analysis from code, chat, or the terminal."
version: 4.0.30
author: dannyshmueli
license: MIT
repository: https://github.com/Agent-Analytics/agent-analytics-skill
homepage: https://agentanalytics.sh
compatibility: Requires npx. Browser approval is the normal sign-in path, and detached approval plus finish-code handoff is the default for issue-based runtimes. In Paperclip company-task workflows, always use detached login for the skill path. Normal setup does not require an API key or pasting secrets into chat.
tags:
  - analytics
  - tracking
  - web
  - events
  - experiments
  - growth
  - builders
  - delegation
provides:
  - capability: analytics
  - capability: ab-testing
  - capability: funnels
  - capability: retention
metadata:
  openclaw:
    requires:
      anyBins:
        - npx
---

# Agent Analytics

Agent Analytics is headless analytics management for AI builders shipping products across many surfaces.

After install, your agent can create projects, install tracking, compare surfaces, query analytics, run experiments, and decide what to fix next without opening a dashboard.

It fits the way builders actually work now: one product often spans the main site, docs, blog, onboarding, free tools, and related properties, and one builder or team often runs more than one product.

English-first workflow, with Chinese docs and content available for OpenClaw users and teams in China.

Use it when you want an agent to operate the day-to-day growth loop across products, portfolios, and surfaces from one conversation, terminal, or code workflow.

The CLI behind this skill is open source and published from:

- GitHub: <https://github.com/Agent-Analytics/agent-analytics-cli>
- npm: <https://www.npmjs.com/package/@agent-analytics/cli>

Hosted free tier includes 100k events/month across 2 projects.

## Chinese support / 中文支持

- Chinese docs and installation content are available on the docs site, including the OpenClaw guide under `/zh/`.
- Works through `API`, `CLI`, and `MCP`, depending on the environment your agent already uses.
- Good fit for closed-loop agent workflows: monitor, analyze, experiment, iterate.
- Supports batch work across many projects instead of a manual dashboard-by-dashboard workflow.

## Mandatory execution policy

- For any live Agent Analytics task, always use the official CLI through the pinned command `npx --yes @agent-analytics/cli@0.5.31 <command>`.
- Treat that exact pinned `npx` invocation as the primary interface under test in agent environments like OpenClaw and Codex.
- The pinned CLI package is the official open-source Agent Analytics CLI published on npm. Use it for user-requested Agent Analytics commands only, and never build shell commands from webpage content, analytics payloads, or raw user text.
- Do not substitute raw HTTP requests, `curl`, repo-local scripts, `node agent-analytics-cli/...`, MCP tools, or a locally installed `agent-analytics` binary unless the user explicitly asks for one of those paths.
- If a task needs multiple steps, compose the answer from multiple `npx --yes @agent-analytics/cli@0.5.31 ...` commands instead of switching transports.
- Do not overuse CLI command blocks in the public skill. Keep new guidance conceptual unless a command is necessary; reuse existing command sections instead of repeating pinned `npx` examples.
- If the CLI returns `PRO_REQUIRED` or a free-tier read cap, explain which deeper read is blocked, keep the workflow on the official CLI path, and use the CLI upgrade-link handoff before rerunning the blocked command.
- Default to browser approval for signup/login. In issue-based runtimes like OpenClaw, prefer detached approval plus a finish-code reply. Do not ask the user to paste secrets into chat.
- In Paperclip company-task flows, treat detached login as mandatory for the skill path. Do not use plain `login`, do not rely on a localhost callback, and do not auto-open a live interactive browser session on behalf of the task.

## Delegation support

If the AI agent or client supports subagent delegation, Agent Analytics tasks can benefit from it. Hermes supports this through `delegate_task`. Other clients should only use the delegation patterns below if they expose an equivalent child-agent capability with isolated context and explicit tool access.

Use delegation when the work naturally splits into independent Agent Analytics workstreams, for example:
- growth audits across homepage, onboarding, docs, compare pages, and ecosystem surfaces
- one child inspecting live surfaces while another verifies instrumentation in code
- one child running account or project reads while another checks whether the top growth bets are already measurable
- multi-project portfolio analysis where each child handles a bounded slice and the parent synthesizes the result

Do not delegate when the job is just one CLI command, a simple one-project read, or an auth handoff that should pause cleanly for the human.

### Delegation rules for child agents

If delegation is available, every child agent doing live Agent Analytics work must follow the same core rules as the parent:

1. Stay on the pinned official CLI path for live Agent Analytics work:
   `npx --yes @agent-analytics/cli@0.5.31 <command>`
2. Preserve prerequisite order:
   - install/setup -> identify or create the project, install the project-owned tracker, then verify events
   - account-wide questions -> run `projects` first
   - project-specific analysis -> resolve the project, then run `context get <project>` first
3. Pass concrete context into each child:
   - project name or ID
   - public URL
   - login state
   - current activation definition or project context when known
4. Do not switch transports in children:
   - no raw API calls, `curl`, repo-local wrappers, MCP, or a locally installed `agent-analytics` binary unless the user explicitly asked for that path
5. Do not install generic instrumentation before reviewing the local product flow:
   - add only events that map to the user's product goals or a specific workflow in the repo
   - do not add duplicate custom events for automatically captured signals like page views, referrers, UTMs, sessions, browser/device, or country
6. Verify before finishing:
   - setup children should verify the first useful event
   - analysis children should clearly report which top bets are already measurable and which minimal gaps matter now

### Recommended delegation pattern for Agent Analytics growth audits

Best default split when the client supports delegation:
- child 1: acquisition surfaces (homepage + public entry pages)
- child 2: activation surface (agent onboarding / setup flow)
- child 3: content or ecosystem surfaces (docs, blog, compare pages, directories)
- optional child 4: measurement verification in the repo or tracked events

Important Hermes note: the default `max_concurrent_children` is 3. If you want all four workstreams, either:
- run the first three in one delegated batch and run measurement verification as a separate delegated pass, or
- raise the Hermes delegation concurrency limit explicitly before relying on a four-child batch.

Delegate by surface or job-to-be-done, not by a generic funnel. For Agent Analytics, the surfaces have different local goals:
- homepage = positioning and route selection
- onboarding = activation
- blog/docs/compare = intent shaping
- directories/ecosystem = qualified outbound click-through

The parent agent should synthesize the child outputs in this order:
1. ranked A/B tests and growth bets
2. why these bets matter now
3. surface-specific KPI and CTA recommendations
4. cross-surface funnel narrative
5. minimal instrumentation gaps that matter now

Lead with growth bets before instrumentation details.

### Example: delegated Agent Analytics growth audit

Use a split like this when the client supports delegation:

- child 1: homepage + public entry pages
  - goal: find the top acquisition bets
  - focus: route selection, CTA clarity, qualified click-through, handoff quality
- child 2: agent onboarding
  - goal: find friction to activation
  - focus: path selection, auth handoff, project creation, first event verification
- child 3: compare/blog/directory surfaces
  - goal: find the best intent-shaping and qualified-click bets
  - focus: local KPI per surface instead of raw signup
- child 4: measurement verification
  - goal: verify whether the top bets are already measurable in code or tracked events
  - focus: exact evidence, minimal attribution or event gaps only

A good parent synthesis for Agent Analytics should answer:
- what are the top 3-5 growth bets right now?
- which surface owns each bet?
- what is the local KPI for that surface?
- what portfolio activation milestone does it support?
- what is the smallest measurement gap that blocks readout?

## What `npx` is doing

- OpenClaw can launch the official CLI with `npx --yes @agent-analytics/cli@0.5.31`.
- That command runs the published Agent Analytics CLI package from npm.
- The CLI calls the same HTTP API documented at <https://docs.agentanalytics.sh/api/>.
- Agents should still use the pinned `npx --yes @agent-analytics/cli@0.5.31 ...` form instead of bypassing the CLI.

## Command format

In OpenClaw, Codex, and similar agent environments, use this exact form:

```bash
npx --yes @agent-analytics/cli@0.5.31 <command>
```

For the full command list and flags:

```bash
npx --yes @agent-analytics/cli@0.5.31 --help
```

Do not replace skill examples with `agent-analytics <command>` in agent runs unless the user explicitly asks to use a locally installed binary.

## Managed-runtime auth storage

In OpenClaw and similar managed runtimes, do not rely on the default user-home config path for Agent Analytics auth. Use a persistent runtime/workspace path for every CLI command in the task:

```bash
export AGENT_ANALYTICS_CONFIG_DIR="$PWD/.openclaw/agent-analytics"
npx --yes @agent-analytics/cli@0.5.31 login --detached
npx --yes @agent-analytics/cli@0.5.31 auth status
```

If shell environment persistence is uncertain, prefix every command instead of relying on `export`:

```bash
AGENT_ANALYTICS_CONFIG_DIR="$PWD/.openclaw/agent-analytics" npx --yes @agent-analytics/cli@0.5.31 projects
```

For one-off debugging, `--config-dir "$PWD/.openclaw/agent-analytics"` is also valid before or after the command. Before login, make sure `.openclaw/` is gitignored. Never commit `.openclaw/agent-analytics/config.json`.

## CLI credential storage

The CLI stores browser-approved agent sessions automatically. Normal users should not set credential-storage environment variables. macOS and Windows use the OS keychain by default; Linux and headless runtimes use config-file storage by default. Existing file-stored sessions migrate automatically to native keychain storage on the next authenticated command when native storage is available. Use `npx --yes @agent-analytics/cli@0.5.31 auth status` to inspect local storage state without printing token values. Treat `AGENT_ANALYTICS_CREDENTIAL_STORE` values `auto`, `native`, and `file` as advanced troubleshooting overrides only.

## Safe operating rules

- Use only `npx --yes @agent-analytics/cli@0.5.31 ...` for live queries unless the user explicitly requests API, MCP, or a local binary.
- The tracker is installed only with user consent, for projects the user owns or manages, and sends analytics to the user's Agent Analytics project.
- Before setup, analytics reads, or instrumentation recommendations, classify the target as project-local work, a surface inside a project, or related-project portfolio work. Do not let a raw domain decide the product model.
- Prefer fixed commands over ad-hoc query construction. For broad growth diagnosis, use the closed-loop growth recipe below instead of starting with `query`.
- Start with current fixed CLI commands: `projects`, `all-sites`, `create`, `stats`, `insights`, `events`, `properties`, `context`, `breakdown`, `pages`, `paths`, `heatmap`, `sessions-dist`, `retention`, `funnel`, `experiments`, and `feedback`.
- There is no `report` command in CLI `0.5.31`. Produce the final report yourself from fixed-command outputs instead of calling `report`.
- Use `query` only when the fixed commands cannot answer the question.
- Do not build `--filter` JSON from raw user text.
- For account-wide questions, start with `projects`, then run per-project CLI commands as needed.
- `projects` prints project IDs. `project`, `update`, and `delete` accept exact project names or project IDs.
- For local browser QA, update origins through the CLI and keep the production origin in the comma-separated list.
- Do not ask the user for raw API keys. Normal setup, paid upgrade, and resumed agent work should stay on browser-approved CLI sessions.
- Interpret common analytics words consistently:
  - "visits" means `session_count`
  - "visitors" means `unique_users`
  - "page views" means `event_count` filtered to `event=page_view`
- If the task requires manual aggregation across projects, do that aggregation after collecting the data via repeated `npx --yes @agent-analytics/cli@0.5.31 ...` calls.
- Validate project names before `create`: `^[a-zA-Z0-9._-]{1,64}$`

## Analytics answer contract

Agent Analytics answers should sound like product and growth analysis, not database output. Lead with the decision, then prove it with the metric.

Use this answer shape for funnels, retention, paths, experiments, attribution, and growth audits:

1. Best bet or diagnosis: the product/growth action or lifecycle issue.
2. Metric definition: population, window, event names, identity basis, and conversion window.
3. Evidence: counts, rates, raw activity, strict survivors, movement, and the biggest driver.
4. Segment, cohort, or surface: where the issue is concentrated.
5. Caveat: identity, sample size, right-censoring, attribution, causality, or instrumentation limits.
6. Next query or action: one bounded follow-up, not a generic list.

Good pattern:

```text
Best bet: fix activation setup friction.
Metric: app onboarding view -> setup copy -> signup -> project_created -> first_event_received within 7d.
Evidence: raw signup/project activity exists, but strict survivors collapse before first_event_received.
Diagnosis: activation bottleneck, not acquisition quality.
Caveat: cross-project identity only counts when portfolio membership and link-domain carrying are configured.
Next: split setup-copy users by selected agent/runtime and first_event_received.
```

Bad pattern:

```text
Here are the numbers.
Step 1: 100 users
Step 2: 12 users
Conversion: 12%
```

Metric skepticism rules:

- Funnels diagnose leakage. They do not prove why users dropped.
- Signup is not activation. Activation is the first measurable proxy for meaningful value.
- Do not rank channels by signups alone. Prefer activated users, retained activated users, revenue, or payback when available.
- Do not answer retention with blended active users alone. Use cohorts and compare cohorts at the same age.
- Do not call correlation causation unless there is an experiment or causal design.
- Do not say an experiment won just because conversion moved up. Check guardrails, sample, uncertainty, and practical significance.
- Do not recommend broad instrumentation. Add the smallest event or property that unlocks the growth question.

Use analytics lingo deliberately: activation, first value, time to value, cohort, segment, denominator, conversion window, retained activated users, channel quality, guardrail metric, input metric, growth loop, loop constraint, instrumentation gap, tracking plan, identity resolution, directional, right-censored, sample is small, and practical significance.

Avoid vague output: generic "improve onboarding," generic "track more events," "best channel" from signup volume, "retention is up" from WAU alone, and "ship it" from a conversion lift alone.

## Closed-loop growth recipe

Use this recipe when the user asks a broad product-growth question like where activation drops, what to fix next, or which experiment to run from current Agent Analytics data.

This is guidance, not a rigid protocol. Skip steps that are already answered or irrelevant, and do not rerun a full activation diagnosis when the user only asks for experiment readout, retention, or a narrow count.

Default order:

1. Resolve the project and auth, then read `context get <project>` before project-specific analysis.
2. Treat configured activation events in project context as the activation source of truth. If activation is missing, ask for it or configure it; do not guess silently.
3. Discover reality before filters: run `properties <project>`, `properties-received <project>`, and recent `events <project>` as needed so event names and property keys are real.
4. Prefer fixed product-growth commands for broad diagnosis. Do not start broad growth diagnosis with `query` when `context`, `funnel`, `paths`, `breakdown`, `journey`, `events`, `retention`, or `experiments` answer better. Use `query` only for narrow aggregations that the fixed commands cannot answer.
5. Use `funnel` for ordered activation leakage. Name the population, window, step events, identity basis, strict survivors, largest absolute loss, and largest relative loss.
6. Use `paths` for session-local entry, exit, detour, and drop-off behavior around the activation goal. Do not present paths as long-cycle attribution.
7. Use `breakdown` around the largest leak by practical dimensions that exist in the data: path, source, referrer, CTA label, device, browser, country, campaign, plan, surface, or onboarding step.
8. Use `events` or `journey` only for representative inspection or instrumentation sanity when useful; do not dump raw logs by default.
9. Recommend one narrow experiment by default: one CTA, headline, pricing message, onboarding step, or follow-up prompt tied to the business goal event.
10. Recommend a readiness fix instead of an experiment when activation, tracking, sample size, identity/session semantics, or an existing overlapping experiment blocks a trustworthy readout.
11. Read experiments against the business goal event, not exposure count. Decide keep/change/stop/complete with sample-size, causality, and practical-significance caveats.

Preserve the analytics answer contract: diagnosis, metric definition, evidence, segment/surface, caveat, and one bounded next action.

Copyable prompt to hand to another agent:

```text
Use Agent Analytics to diagnose where <project> loses users before activation. Start from project context, use configured activation events as source of truth, discover real events and properties, run funnel and paths, break down the largest leak, inspect representative journeys/events only if useful, then recommend one narrow experiment or the readiness fix that blocks readout. Use the pinned official CLI path and keep the answer to diagnosis, metric definition, evidence, segment/surface, caveat, and one next action.
```

Experiment readout prompt:

```text
Read <experiment_name> for <project> against <goal_event>. Decide whether to keep running it, change it, stop it, or complete it with a winner. Use the business goal event, not exposure count, and include sample-size and causality caveats.
```

## Classification before action

Agent Analytics is project-first and portfolio-aware. Classify scope before you create tracking, query analytics, or recommend instrumentation.

- A project is the unit of local product learning. It owns events, activation, retention, lifecycle, releases, experiments, and local goals.
- A surface is a place where users encounter or use a project. One project can include many surfaces: app pages, marketing pages, docs, blog, pricing, signup and onboarding flows, subdomains, mobile clients, local preview URLs, and deploy previews.
- A portfolio is the cross-project growth system for related projects. It connects related projects so an agent can reason about project roles, surface roles, shared goals, shared milestones, and cross-project identity when configured.
- A portfolio does not collapse project-local truth. Keep activation, retention, lifecycle, release, experiment, and local-goal readouts on the owning project unless the human explicitly defines a shared portfolio-level question.
- Cross-project identity applies only when configured within intentionally grouped portfolio projects. Do not imply automatic identity merging across every project in an account.

Decision rules:

1. Subdomains are usually surfaces, not projects. Keep `app.example.com`, `docs.example.com`, `blog.example.com`, and `www.example.com` in one project when they serve the same product learning loop.
2. A mobile app is a surface when it is another client for the same product with the same activation and retention readout. Make it a separate project when it has its own onboarding, lifecycle, release cadence, retention behavior, experiments, or local goals.
3. A free tool is a surface when it is just part of the main product funnel. Make it a separate project when it has its own acquisition loop, completion goal, lead capture, handoff, experiments, or readout.
4. Localhost, local network URLs, branch previews, staging links, and deploy previews are setup or QA surfaces for the intended project. Do not create canonical projects for every preview URL.
5. Separate products under one company or product system should be separate projects under one portfolio when each needs its own activation, retention, lifecycle, release, experiment, or local-goal readout.
6. Newsletter/content pages can be surfaces when they feed the same product loop. A newsletter/content site should be its own project when it has its own content growth loop or local readout. Do not assume native email-service-provider opens or clicks are tracked unless the project explicitly sends those events.

If a domain, subdomain, local URL, preview URL, or mobile app identifier does not match the expected project, do not treat it as immediate failure. Clarify which project and surface the URL belongs to, then map the setup or read back to that intended project. Domains and subdomains are surface URLs or origins, not the project identity.

Command guidance by scope:

- Project-local setup or analysis: resolve the project first, then use project commands such as `create`, `projects`, `project`, `update`, `stats`, `insights`, `events`, `properties`, `pages`, `paths`, `funnel`, `retention`, `experiments`, and `context get/set`.
- Surface work inside one project: still use the owning project command, then filter or inspect by path, host, event, or event properties as the CLI supports. Use `update --origins` to add allowed origins for setup or QA surfaces.
- Related-project grouping: use `portfolios list`, `portfolios create`, `portfolios get`, and `portfolios update` to define the intentional project membership boundary.
- Shared goals, roles, and milestones: keep durable per-project truth in project context, and use portfolio context only for compact account-level interpretation across related projects. Do not let portfolio context overwrite per-project activation or event meanings.
- Cross-project identity: configure both tracker `data-link-domains` for browser-side anonymous ID carrying and `portfolios` membership for the server-side portfolio scope. Either side alone is incomplete.

Canonical docs guide: <https://docs.agentanalytics.sh/guides/projects-surfaces-portfolios/>

## Consent-based tracker setup policy

When the user asks to install Agent Analytics, add analytics events, or set up tracking in a repo, use a code-first, consent-based, project-owned workflow. Do not guess. Do not overtrack. Do not install generic events that do not map to the user's product goals or a specific workflow in the repo.

If the agent has repo access, inspect the actual product code first: routes, forms, CTA handlers, auth/setup/checkout flows, existing analytics calls, server-side durable outcomes, and tests. The repo usually reveals the real product actions better than a deployed-page scanner. Use scanner output only as optional external context when repo access is missing, the user asks for a URL-only audit, or the task is specifically the Agent Analytics scanner/demo/acquisition surface. Do not block setup on a scan when code is available, and do not treat scanner recommendations as more authoritative than the product code.

In CLI setup, first classify the intended project and surface, then identify the user's setup or production origin, start the normal browser login flow if needed, and create or identify the Agent Analytics project whose `allowed_origins` includes that origin. Use detached login only for Paperclip, OpenClaw, issue-based or headless runtimes, or when the local browser callback cannot work. The tracker is for the user's own project and account, not for the agent, not for Agent Analytics' internal use, and not for third-party sites.

Treat the base tracker snippet as the start of instrumentation, not the full instrumentation plan. The snippet gives you automatic traffic, source, session, and device context; the agent still needs to review the local product flow and add the few opt-in events that make growth decisions possible.

Track for decisions, not data. Every custom event should unlock a specific answer or action for the user's AI agent. Before adding an event, know what decision changes if the metric moves, why automatic signals are insufficient, and whether the event is durable enough for funnel, retention, or experiment readout.

Use this setup order:

1. Classify the scope: project-local work, a surface of an existing project, or related-project portfolio work.
2. Inspect code/product context first when repo access exists; use scanner context only for no-code or explicit URL-audit workflows.
3. If the user is not logged in, start `login`. Use `login --detached` only for Paperclip, OpenClaw, issue-based or headless runtimes, or when the local browser callback cannot work.
4. Create or identify the Agent Analytics project with `npx --yes @agent-analytics/cli@0.5.31 create <project> --domain <origin>` or `projects`. Treat `--domain` as the primary surface URL/origin for setup, not as the project identity.
5. Add the exact tracking snippet returned by `create` or shown in the dashboard for that project.
6. Choose the smallest named set of meaningful events and tracker opt-ins needed for the user's stated goals.
7. Prefer decision-grade events where relevant: named CTA clicks, signup intent, pricing interactions, checkout progress or completion, install/setup steps, activation milestones, and durable server-side outcome events such as `signup_completed`, `subscription_started`, `install_completed`, `project_created`, `first_event_received`, or the product's own activation event.
8. Add optional tracker capabilities only when they unlock a concrete growth decision: `data-aa-impression` for meaningful section exposure, scroll depth for long-form or landing-page depth questions, form tracking for lead or signup friction, downloads for asset/install intent, vitals/errors/performance for conversion-impacting quality questions, and SPA tracking for client-side route changes.
9. Explain what each event or opt-in enables before or while installing it.
10. Verify the first useful event with `npx --yes @agent-analytics/cli@0.5.31 events <project> --event <event_name> --days 7 --limit 20`.
11. Summarize what the installed events now let the user's agent answer.

Page views, paths, referrers, UTMs, device/browser fields, country, session IDs, session count, days since first visit, and first-touch attribution are automatic, so do not add duplicate custom events for those signals. Prefer `data-aa-event` attributes for named click intent, `data-aa-impression` for meaningful section exposure, `window.aa.track(...)` for computed client state, server-side tracking for durable outcomes such as `signup_completed`, and `aa.identify(userId, { email, plan, role, team })` plus `aa.set(...)` immediately after auth. Use broad script opt-ins like `data-track-clicks`, scroll depth, errors, forms, downloads, vitals, performance, or SPA tracking only when they unlock a concrete decision for the user's project.

For each custom event, keep the implementation note compact but decision-linked:

| Field | Requirement |
|---|---|
| Event | Lowercase name tied to a real product action |
| Trigger | Route, component, or server handler that fires it |
| Properties | Minimal non-PII context needed for analysis |
| Agent answer unlocked | Product-growth question the user's AI agent can answer |
| Priority | Must-have now vs later |
| Why not automatic | Why pageview/referrer/UTM/session/device/country is insufficient |

If the product already uses GTM or a `dataLayer`, map existing meaningful events into this decision record before adding new calls. Do not duplicate pageviews or generic click events just because another analytics tool tracks them.

If you need to pass work to another agent, say to use the pinned CLI, create or identify the user's project, install the project-owned tracker with consent, treat the base snippet as the start rather than the end, add only meaningful events tied to the repo's workflows, explain what each event enables, avoid generic tracking, and verify the first useful event.

## First-time setup

For Claude Code, Codex, Cursor, and local CLI runtimes, use the authenticated browser setup flow:

```bash
npx --yes @agent-analytics/cli@0.5.31 login
npx --yes @agent-analytics/cli@0.5.31 create my-site --domain https://mysite.com
npx --yes @agent-analytics/cli@0.5.31 events my-site --event <first_useful_event> --days 7 --limit 20
```

The CLI will open browser approval and wait for the local loopback callback. If the runtime can receive that callback, do not choose detached login just because the work is happening inside an agent.

For Paperclip, OpenClaw, and other issue-based runtimes, `login --detached` is the preferred first step. It should print the approval URL and exit, so the agent can post the URL to the user without keeping a polling command alive. Wait for the user to sign in with Google or GitHub and reply with the finish code, then run the printed `login --auth-request ... --exchange-code ...` command and continue with project setup.

The `create` command returns the exact tracking snippet for the project. Add that returned snippet before `</body>`.

Use `--detached` when the runtime cannot receive a localhost browser callback, when the workflow happens in issues or task threads, and always for Paperclip company-task execution.

## Default agent task

When the user wants Agent Analytics installed in the current repo, the default task shape is:

```text
Set up Agent Analytics for this project. If browser approval is needed, open it and wait for me. I will sign in with Google or GitHub and approve it. If the browser callback cannot resume you, ask me for the finish code as a fallback. After that, create or identify the matching Agent Analytics project, install the project-owned tracker, add only meaningful custom events tied to this repo's product workflows, explain what each event enables, and verify the first useful event.
```

For deeper product analysis, extend that task with owned surfaces:

```text
If this product has other owned public websites or pages that shape the growth loop, consider how those surfaces connect to this project's goals before you install events.
```

## Detached approval handoff

For OpenClaw-style issue workflows, the expected login loop is:

1. run `npx --yes @agent-analytics/cli@0.5.31 login --detached`
2. send the approval URL to the user
3. wait for the user to reply with the finish code
4. complete the exchange with the printed `login --auth-request ... --exchange-code ...` command and keep going with setup

This is the preferred managed-runtime path because it does not rely on a long-running polling process. Do not ask the user to paste a permanent API key into chat.

For Paperclip company tasks, use this same detached loop even if the underlying runtime technically has browser automation available. The important behavior is that the task posts an approval URL, exits the start command, waits for the user's finish code, and then continues.

## Paid-tier handoff

Free is enough to prove setup and basic reads. Some deeper reads such as funnels, retention, session paths, longer history, and experiments require Pro.

When a user asks for analysis that likely needs Pro, run the intended CLI command first. Do not pre-sell an upgrade before proving the block. If the CLI returns `PRO_REQUIRED` or a free-tier read cap:

1. Explain in one sentence which exact answer is blocked.
2. Run `npx --yes @agent-analytics/cli@0.5.31 upgrade-link --detached --reason "<why Pro is needed>" --command "<blocked command>"`.
3. Send the printed app-domain payment handoff to the human. It opens the dashboard page first; that page may ask them to sign in, confirms the same account as the CLI, shows the blocked command and reason, and then opens Lemon Squeezy.
4. After the user confirms the account is upgraded, run `npx --yes @agent-analytics/cli@0.5.31 whoami`, then rerun the blocked command.

Use `upgrade-link --wait` only when the local shell should intentionally keep polling until the payment webhook activates Pro.

If the user does not upgrade, continue with free-tier commands only and do not approximate paid-only results as if they were measured.

## Common commands

```bash
npx --yes @agent-analytics/cli@0.5.31 projects
npx --yes @agent-analytics/cli@0.5.31 all-sites --period 7d
npx --yes @agent-analytics/cli@0.5.31 stats my-site --days 7
npx --yes @agent-analytics/cli@0.5.31 insights my-site --period 7d
npx --yes @agent-analytics/cli@0.5.31 events my-site --days 7 --limit 20
npx --yes @agent-analytics/cli@0.5.31 breakdown my-site --property path --event page_view --days 7 --limit 10
npx --yes @agent-analytics/cli@0.5.31 paths my-site --goal signup --since 30d --max-steps 5
npx --yes @agent-analytics/cli@0.5.31 funnel my-site --steps "page_view,signup,activation"
npx --yes @agent-analytics/cli@0.5.31 retention my-site --period week --cohorts 8
npx --yes @agent-analytics/cli@0.5.31 experiments list my-site
npx --yes @agent-analytics/cli@0.5.31 context get my-site
npx --yes @agent-analytics/cli@0.5.31 portfolios list
npx --yes @agent-analytics/cli@0.5.31 update my-site --origins 'https://mysite.com,http://lvh.me:3101'
```

If a task needs something outside these common flows, use `npx --yes @agent-analytics/cli@0.5.31 --help` first.

## Project context

Use `context get` and `context set` when the product has custom goals, activation events, event meanings, or date annotations that should travel with analytics results. Keep the context short because project analytics endpoints include it as `project_context` for later agent reads. `context set` accepts an encoded JSON body up to 512KB.

At the start of any project-specific analysis, run `context get <project>` after resolving the project. Use the returned `project_context` to interpret metrics, choose goal events, and explain results in the product's language.

Treat project context as compact self-improving memory close to the analytics data. The loop is: read context, analyze with it, notice durable product truth, then update the context so the next analysis starts smarter.

Before setting or refreshing context, inspect current event names with `properties <project>` or `properties-received <project>`. Glossary entries must be tied to `event_name` so future agents can connect human product language to actual tracked events.

`context set` replaces the stored context. Always read the existing context first, merge your change, and preserve still-valid goals, activation events, glossary entries, and annotations.

After first instrumentation, funnel work, retention review, or a human correction, do a short context review:

- Save durable product truth: activation definition, business goals, event meanings, which events matter, and stable interpretations such as "invite_team_member is the meaningful team activation event."
- Save date annotations for major product changes: meaningful landing page, pricing, onboarding, feature, release, or experiment changes that could explain future graph movement.
- Skip noisy findings: weekly metric values, temporary anomalies, raw reports, long notes, user lists, PII, secrets, git commit logs, and guesses that are not useful in future analyses.
- If a learning is clear from the user's instruction, the local codebase, or analytics results, update context. If it is inferred from analytics and could be wrong, ask one short confirmation question first.
- If the context is near the limits, consolidate or replace weaker entries instead of appending more text.
- Do not invent unsupported fields such as `findings`, `learnings`, or `open_questions` in `context set`; store only what fits `goals`, `activation_events`, event-name `glossary`, and `annotations`.

Annotations use `occurred_at`, `title`, and optional `note`. Keep them rare and useful: max 100 annotations per project, title under 120 characters, and note under 500 characters. When an analytics response includes project context, annotations are filtered to the requested analytics date range plus one day before and after; `context get` returns all stored annotations.

Do not store git commit logs as annotations. Store only human-meaningful product changes that can help explain later analytics movement.

After you ship or notice a major product change, ask the user whether to store an annotation if they did not already say to do it. Use a compact entry such as:

```bash
npx --yes @agent-analytics/cli@0.5.31 context set my-site --json '{"goals":["Increase activated accounts"],"activation_events":["signup_completed"],"glossary":[{"event_name":"signup_completed","term":"Signup","definition":"A verified account completed signup."}],"annotations":[{"occurred_at":"2026-04-25T13:00:00.000Z","title":"Changed pricing page offer","note":"Moved annual plan discount above the fold."}]}'
```

For multi-project or multi-domain work, keep context separate per project. Do not reuse one activation definition across a product app, directory site, docs site, landing page, or lead-generation domain unless the human explicitly says they share the same meaning. Examples:

- A trial product might define activation as trial signup plus first item created.
- A team product might define activation as signup plus teammate invited.
- A directory or marketing domain might define activation as a qualified visitor clicking through to the product or becoming a lead.

When those projects belong to the same growth system, add them to an identity portfolio with `portfolios create`, `portfolios update`, and `portfolios list`. Use that layer for the project membership boundary that enables cross-project identity-aware reads and privacy-first email lookup when configured. Keep project context for project-local truth; keep any compact interpretation notes separate from portfolio membership.

For cross-project identity stitching, the agent must configure both browser-side link carrying and server-side portfolio scope:

- Add `data-link-domains` to each participating tracker snippet so the anonymous `_aa` link parameter can move between related domains.
- Add the separate Agent Analytics projects to the same identity portfolio so hosted reads resolve those projects in one identity scope.

`data-link-domains` alone decorates links but does not make separate projects share identity. An identity portfolio alone defines the shared scope but does not carry a browser anonymous ID across domains. For a discovery-to-product flow such as `directory.example.com -> example.com -> app.example.com`, set the same domain list on each participating tracker and store the discovery, conversion, and app projects in the same portfolio: `npx --yes @agent-analytics/cli@0.5.31 portfolios create growth-system --name "Growth system" --projects directory,marketing,app`.

## User identity and journeys

After a visitor signs in, call `aa.identify(userId, { email, plan, role, team })` with the app's stable non-email user id. The browser tracker keeps `user_id` as the canonical identity. If top-level `traits.email` is present, raw email is transmitted over HTTPS during identify so Agent Analytics can compute project/portfolio-scoped HMAC lookup indexes on the server. Raw email is stripped from event rows and profile traits by default; do not add browser-side SHA-256 hashing or `email_hash` payloads.

Use identity lookup when the user asks for one person's journey, support investigation, or account-level debugging:

```bash
npx --yes @agent-analytics/cli@0.5.31 journey my-site --user-id user_123 --since 30d
npx --yes @agent-analytics/cli@0.5.31 journey my-site --email alice@example.com --since 30d
npx --yes @agent-analytics/cli@0.5.31 events my-site --email alice@example.com --days 30
npx --yes @agent-analytics/cli@0.5.31 query my-site --email alice@example.com --group-by event --metrics event_count
```

For `--email`, the CLI sends the raw email over HTTPS in an authenticated POST body so the API can match a project/portfolio-scoped HMAC lookup index. Agent Analytics does not store raw email in event rows or profile traits, and responses must not echo raw email, normalized email, HMAC values, or HMAC secrets.

When answering, briefly mention when stored project context shaped the interpretation. When you update context, state the compact change you saved.

Example:

```bash
npx --yes @agent-analytics/cli@0.5.31 properties my-site
npx --yes @agent-analytics/cli@0.5.31 context set my-site --json '{"goals":["Increase activated accounts"],"activation_events":["signup_completed","project_created","first_event_received"],"glossary":[{"event_name":"first_event_received","term":"AA Activation","definition":"Signup, project created, and first event received."}]}'
```

## Session paths

Use `paths` when the user asks how entry pages, exit pages, and conversion behavior connect inside a single session.

Prefer this workflow:

1. Run `npx --yes @agent-analytics/cli@0.5.31 paths <project> --goal <event> --since 30d --max-steps 5`
2. Summarize the top entry pages, exit pages, drop-offs, truncations, and conversion rate.
3. Recommend the next bounded analysis step: a funnel, retention check, or experiment.

Do not use paths for long-cycle cross-session attribution. Treat it as session-local: the goal only counts when it occurs in the same session.

## Funnel analyst behavior

Use `funnel` when the user asks where conversion drops, whether onboarding works, which step blocks activation, or how an ordered journey performs.

Before running a funnel, resolve the project and read context:

```bash
npx --yes @agent-analytics/cli@0.5.31 context get my-site
```

Use project context to find the activation event, event glossary, and relevant annotations. If the context is empty, define the funnel assumptions explicitly instead of pretending the metric is canonical.

Prefer structured steps when labels or property filters matter:

```bash
npx --yes @agent-analytics/cli@0.5.31 funnel my-site --steps-json '[{"event":"page_view","label":"Landing viewed","filters":[{"field":"properties.path","op":"eq","value":"/"}]},{"event":"signup_cta_clicked","label":"Signup intent"},{"event":"signup_completed","label":"Signup"},{"event":"first_event_received","label":"First value"}]' --since 7d --json
```

For every funnel answer:

1. State the metric definition: population, steps, window, identity basis, conversion window, and whether steps came from request or project context.
2. Separate `raw_activity`, joinable entities, and `strict_survivors`. Raw activity can exist even when strict conversion is zero.
3. Find both largest absolute loss and largest relative loss. The biggest percentage drop is not always the highest-impact fix.
4. Label the lifecycle issue: acquisition, activation, retention, referral/collaboration, revenue, or instrumentation gap.
5. Explain the surface role: homepage = route selection, onboarding/app = activation, docs = setup support, blog/content = intent shaping, scanner/free tool = cold-start preview.
6. Recommend one next query or fix at the bottleneck.

Portfolio and cross-project funnel caveats:

- A portfolio does not erase project-local truth. Keep each project's activation, retention, lifecycle, and local goal definitions separate.
- For same-product surfaces inside one project, a funnel can cross hosts/paths when the identity basis supports it.
- For related projects in one portfolio, state which project owns each step and whether cross-project identity stitching is configured with both `data-link-domains` and portfolio membership.
- Without that identity setup, do not claim strict user conversion across projects. Report per-project raw activity and say what setup would unlock the cross-project readout.
- Use `paths` only for session-local routes. Use funnels, journeys, identity lookup, or portfolio-aware reads for longer-cycle conversion.

Tactic cards:

- Activation bottleneck finder: compare signup or setup intent to the activation event; include time to value; segment by setup path, device, source, plan, or selected agent/runtime; answer with the blocked first-value step.
- Funnel bottleneck analysis: calculate step conversion, largest absolute loss, largest relative loss, and one fix for the highest-impact bottleneck.
- Retention cohort health: compare cohorts at the same age, separate activated from non-activated users, and warn when cohorts are right-censored.
- Channel quality: rank channels by activated users, retained activated users, revenue, or payback, not raw signups.
- Experiment readout: report hypothesis, primary metric, guardrails, exposure/randomization unit, sample, effect size, uncertainty, practical significance, and recommendation.
- Instrumentation gap diagnosis: recommend tracking only when a missing event/property blocks the growth answer; name the exact event and what decision it unlocks.
- Portfolio surface-role diagnosis: map each project/surface to its local KPI, then connect it to the shared portfolio milestone without flattening all projects into one metric.

## Example: all projects, last 48 hours

Question:

```text
How many visits did all my projects get in the last 48 hours?
```

Workflow:

1. Run `npx --yes @agent-analytics/cli@0.5.31 projects`
2. For each project, run:

```bash
npx --yes @agent-analytics/cli@0.5.31 query my-site --metrics session_count --days 2
```

3. Sum the returned `session_count` values across projects

Stay on the CLI path for this workflow. Do not switch to direct API requests or local scripts just because the answer spans multiple projects.

## Time windows

Use `--days N` or `since` values like `7d` and `30d` for whole-day lookbacks. Do not use `24h`; the API does not support hour shorthand.

For an exact rolling window such as "last 24 hours", use `query` with timestamp filters. Build the timestamps yourself as epoch milliseconds, keep the date prefilter broad enough to include both dates, and still stay on the CLI path:

```bash
FROM_MS=$(node -e 'console.log(Date.now() - 24 * 60 * 60 * 1000)')
TO_MS=$(node -e 'console.log(Date.now())')
FROM_DATE=$(node -e 'console.log(new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString().slice(0, 10))')
TO_DATE=$(node -e 'console.log(new Date().toISOString().slice(0, 10))')
npx --yes @agent-analytics/cli@0.5.31 query my-site --metrics event_count,unique_users --group-by event --from "$FROM_DATE" --to "$TO_DATE" --filter "[{\"field\":\"timestamp\",\"op\":\"gte\",\"value\":$FROM_MS},{\"field\":\"timestamp\",\"op\":\"lte\",\"value\":$TO_MS}]" --count-mode raw --order-by event_count --order desc
```

Do not answer an exact "last 24 hours" request with `stats --days 1` unless the user explicitly accepts a whole-day approximation.

## Feedback

Use `npx --yes @agent-analytics/cli@0.5.31 feedback` when Agent Analytics was confusing, a task took too long, the workflow could be improved, or the agent had to do manual calculations or analysis that Agent Analytics should have handled.

Describe the use case, friction, or missing capability in a sanitized way:

- Include what was hard and what Agent Analytics should have done instead.
- Do not include private owner details, secrets, API keys, raw customer data, or unnecessary personal information.
- Prefer a short summary of the struggle over pasted logs or sensitive context.

Example:

```bash
npx --yes @agent-analytics/cli@0.5.31 feedback --message "The agent had to calculate funnel drop-off manually" --project my-site --command "npx --yes @agent-analytics/cli@0.5.31 funnel my-site --steps page_view,signup,activation"
```

There is a real agent behind these Telegram messages. Every request is seen and auto-approved, and useful fixes can land quickly, sometimes within hours.

## Tracker setup

The easiest install flow is:

1. Login if needed with `npx --yes @agent-analytics/cli@0.5.31 login`. Use `login --detached` only for Paperclip, OpenClaw, issue-based or headless runtimes, or when the local browser callback cannot work.
2. Create or identify the matching project with `npx --yes @agent-analytics/cli@0.5.31 create my-site --domain https://mysite.com`; treat `--domain` as the primary setup surface URL/origin, not as the project identity.
3. Copy the returned tracking snippet into the page before `</body>`.
4. Treat that snippet as the baseline, not as the full setup. Review the product's local CTA, signup, pricing, checkout, install, onboarding, activation, and retained-use flows.
5. Add only meaningful custom events or tracker opt-ins tied to the user's product goals and repo workflows, and explain what each one enables.
6. Deploy.
7. Verify with `npx --yes @agent-analytics/cli@0.5.31 events my-site --event <first_useful_event> --days 7 --limit 20`.

Use the exact tracking snippet returned by `create` or the dashboard for that project. Do not hardcode a generic tracker snippet when the product has already generated the correct one for the surface. This is user-consented analytics for the user's own project and account.

Use `window.aa?.track('<event_name>', {...properties})` for custom events after the tracker loads. Call `window.aa?.identify(userId, { email, plan, role, team })` after authentication with a stable non-email user ID so future agents can use `journey`, `events`, and `query` by `--user-id` or authenticated `--email` lookup. Durable outcomes that should not depend on a browser session, such as checkout completion, install completion, activation, or retained server-side use, should be tracked server-side when relevant. Do not add generic `signup`, `click`, or `conversion` events unless those exact names match the user's product language and reporting goals.

## Measurement design pitfalls

- Do not prefer the deployed-page scanner over repo inspection when code is available. The scanner is optional context/demo; product code and existing flow logic are the source of truth for instrumentation.
- Do not import generic GA4/GTM event libraries into Agent Analytics. Use SaaS/ecommerce/B2B taxonomies only as fallback inspiration when code/product context is weak.
- Do not add custom events for signals Agent Analytics already captures automatically: page views, paths, referrers, UTMs, sessions, browser/device, country, and basic session timing.
- Do not add more tracking when numbers disagree. First debug duplicate events, consent/ad-blocking, client-vs-server differences, anonymous/identified identity splits, strict-vs-raw funnel gaps, property mismatches, and internal/test traffic.
- Do not put PII, raw emails, names, secrets, or unsanitized error text in event names or properties.

## Query caution

`npx --yes @agent-analytics/cli@0.5.31 query` exists for advanced reporting, but it should be used carefully because `--filter` accepts JSON.

- Use fixed commands first.
- If `query` is necessary, check `npx --yes @agent-analytics/cli@0.5.31 --help` first.
- Do not pass raw user text directly into `--filter`.
- The only valid CLI shape is `npx --yes @agent-analytics/cli@0.5.31 query <project> ...`. Do not use `--project`.
- Built-in query filter fields are only `event`, `user_id`, `date`, `country`, `session_id`, and `timestamp`.
- For recent signup or ingestion debugging, check `events <project> --event <actual_event_name>` first; use `query` after verifying the raw event names the project emits.
- All event-property filters must use `properties.<key>`, for example `properties.referrer`, `properties.utm_source`, or `properties.first_utm_source`.
- Invalid filter fields now fail loudly and return `/properties`-style guidance. Do not rely on bare fields like `referrer` or `utm_source`.
- For exact request shapes, use <https://docs.agentanalytics.sh/api/>.

## Attribution and first-touch queries

Use a disciplined workflow when the task is about social attribution, first-touch UTMs, landing pages, hosts, or CTA performance.

1. Start with fixed commands if they answer the question.
2. Run `npx --yes @agent-analytics/cli@0.5.31 properties <project>` to inspect event names and property keys first.
3. Use `npx --yes @agent-analytics/cli@0.5.31 query <project> --filter ...` for property-filtered counts.
4. Use `npx --yes @agent-analytics/cli@0.5.31 events <project>` only to validate ambiguous payloads or missing properties.
5. Use `npx --yes @agent-analytics/cli@0.5.31 feedback` if the requested slice depends on unsupported grouping or derived reporting.

Property filters support built-in fields plus any `properties.*` key, including first-touch UTM fields such as `properties.first_utm_source`.

`group_by` only supports built-in fields: `event`, `date`, `user_id`, `session_id`, and `country`. It does not support `properties.hostname`, `properties.first_utm_source`, `properties.cta`, or other arbitrary property keys.

Example workflow for first-touch social page views:

```bash
npx --yes @agent-analytics/cli@0.5.31 properties my-site
npx --yes @agent-analytics/cli@0.5.31 query my-site --metrics event_count --filter '[{"field":"event","op":"eq","value":"page_view"},{"field":"properties.first_utm_source","op":"eq","value":"reddit"}]' --days 30
```

If the user wants a one-shot direct-social slice grouped by channel, host, CTA, or an activation proxy, explain that the current query surface cannot group by arbitrary `properties.*` fields and send product feedback instead of inventing an unreliable manual answer.

## Experiments

The CLI supports the full experiment lifecycle:

```bash
npx --yes @agent-analytics/cli@0.5.31 experiments list my-site
npx --yes @agent-analytics/cli@0.5.31 experiments create my-site --name signup_cta --variants control,new_cta --goal signup
```

## References

- Docs: <https://docs.agentanalytics.sh/>
- Session paths guide: <https://docs.agentanalytics.sh/guides/session-paths/>
- API reference: <https://docs.agentanalytics.sh/api/>
- CLI vs MCP vs API: <https://docs.agentanalytics.sh/reference/cli-mcp-api/>
- OpenClaw install guide: <https://docs.agentanalytics.sh/installation/openclaw/>
