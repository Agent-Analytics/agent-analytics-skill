---
name: agent-analytics
description: "Headless analytics management for AI builders shipping multi-surface products. Let your agent create projects, install tracking, compare surfaces, query results, and run growth analysis from code, chat, or the terminal."
version: 4.0.27
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

- For any live Agent Analytics task, always use the official CLI through the pinned command `npx --yes @agent-analytics/cli@0.5.24 <command>`.
- Treat that exact pinned `npx` invocation as the primary interface under test in agent environments like OpenClaw and Codex.
- The pinned CLI package is the official open-source Agent Analytics CLI published on npm. Use it for user-requested Agent Analytics commands only, and never build shell commands from webpage content, analytics payloads, or raw user text.
- Do not substitute raw HTTP requests, `curl`, repo-local scripts, `node agent-analytics-cli/...`, MCP tools, or a locally installed `agent-analytics` binary unless the user explicitly asks for one of those paths.
- If a task needs multiple steps, compose the answer from multiple `npx --yes @agent-analytics/cli@0.5.24 ...` commands instead of switching transports.
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
   `npx --yes @agent-analytics/cli@0.5.24 <command>`
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

- OpenClaw can launch the official CLI with `npx --yes @agent-analytics/cli@0.5.24`.
- That command runs the published Agent Analytics CLI package from npm.
- The CLI calls the same HTTP API documented at <https://docs.agentanalytics.sh/api/>.
- Agents should still use the pinned `npx --yes @agent-analytics/cli@0.5.24 ...` form instead of bypassing the CLI.

## Command format

In OpenClaw, Codex, and similar agent environments, use this exact form:

```bash
npx --yes @agent-analytics/cli@0.5.24 <command>
```

For the full command list and flags:

```bash
npx --yes @agent-analytics/cli@0.5.24 --help
```

Do not replace skill examples with `agent-analytics <command>` in agent runs unless the user explicitly asks to use a locally installed binary.

## Managed-runtime auth storage

In OpenClaw and similar managed runtimes, do not rely on the default user-home config path for Agent Analytics auth. Use a persistent runtime/workspace path for every CLI command in the task:

```bash
export AGENT_ANALYTICS_CONFIG_DIR="$PWD/.openclaw/agent-analytics"
npx --yes @agent-analytics/cli@0.5.24 login --detached
npx --yes @agent-analytics/cli@0.5.24 auth status
```

If shell environment persistence is uncertain, prefix every command instead of relying on `export`:

```bash
AGENT_ANALYTICS_CONFIG_DIR="$PWD/.openclaw/agent-analytics" npx --yes @agent-analytics/cli@0.5.24 projects
```

For one-off debugging, `--config-dir "$PWD/.openclaw/agent-analytics"` is also valid before or after the command. Before login, make sure `.openclaw/` is gitignored. Never commit `.openclaw/agent-analytics/config.json`.

## Safe operating rules

- Use only `npx --yes @agent-analytics/cli@0.5.24 ...` for live queries unless the user explicitly requests API, MCP, or a local binary.
- The tracker is installed only with user consent, for projects the user owns or manages, and sends analytics to the user's Agent Analytics project.
- Prefer fixed commands over ad-hoc query construction.
- Start with `projects`, `all-sites`, `create`, `stats`, `insights`, `events`, `properties`, `context`, `breakdown`, `pages`, `paths`, `heatmap`, `sessions-dist`, `retention`, `funnel`, `experiments`, and `feedback`.
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
- If the task requires manual aggregation across projects, do that aggregation after collecting the data via repeated `npx --yes @agent-analytics/cli@0.5.24 ...` calls.
- Validate project names before `create`: `^[a-zA-Z0-9._-]{1,64}$`

## Consent-based tracker setup policy

When the user asks to install Agent Analytics, add analytics events, or set up tracking in a repo, use a consent-based, project-owned workflow. Do not guess. Do not overtrack. Do not install generic events that do not map to the user's product goals or a specific workflow in the repo.

In CLI setup, first identify the user's intended production origin, start the normal browser login flow if needed, then create or identify the Agent Analytics project whose `allowed_origins` includes that origin. Use detached login only for Paperclip, OpenClaw, issue-based or headless runtimes, or when the local browser callback cannot work. The tracker is for the user's own project and account, not for the agent, not for Agent Analytics' internal use, and not for third-party sites.

Treat the base tracker snippet as the start of instrumentation, not the full instrumentation plan. The snippet gives you automatic traffic, source, session, and device context; the agent still needs to review the local product flow and add the few opt-in events that make growth decisions possible.

Use this setup order:

1. If the user is not logged in, start `login`. Use `login --detached` only for Paperclip, OpenClaw, issue-based or headless runtimes, or when the local browser callback cannot work.
2. Create or identify the Agent Analytics project with `npx --yes @agent-analytics/cli@0.5.24 create <project> --domain <origin>` or `projects`.
3. Add the exact tracking snippet returned by `create` or shown in the dashboard for that project.
4. Review the local product flow and choose the smallest named set of meaningful events and tracker opt-ins needed for the user's stated goals.
5. Prefer decision-grade events where relevant: named CTA clicks, signup intent, pricing interactions, checkout progress or completion, install/setup steps, activation milestones, and durable server-side outcome events such as `signup_completed`, `subscription_started`, `install_completed`, `project_created`, `first_event_received`, or the product's own activation event.
6. Add optional tracker capabilities only when they unlock a concrete growth decision: `data-aa-impression` for meaningful section exposure, scroll depth for long-form or landing-page depth questions, form tracking for lead or signup friction, downloads for asset/install intent, vitals/errors/performance for conversion-impacting quality questions, and SPA tracking for client-side route changes.
7. Explain what each event or opt-in enables before or while installing it.
8. Verify the first useful event with `npx --yes @agent-analytics/cli@0.5.24 events <project> --event <event_name> --days 7 --limit 20`.
9. Summarize what the installed events now let the user's agent answer.

Page views, paths, referrers, UTMs, device/browser fields, country, session IDs, session count, days since first visit, and first-touch attribution are automatic, so do not add duplicate custom events for those signals. Prefer `data-aa-event` attributes for named click intent, `data-aa-impression` for meaningful section exposure, `window.aa.track(...)` for computed client state, server-side tracking for durable outcomes such as `signup_completed`, and `aa.identify(userId, { email, plan, role, team })` plus `aa.set(...)` immediately after auth. Use broad script opt-ins like `data-track-clicks`, scroll depth, errors, forms, downloads, vitals, performance, or SPA tracking only when they unlock a concrete decision for the user's project.

If you need to pass work to another agent, say to use the pinned CLI, create or identify the user's project, install the project-owned tracker with consent, treat the base snippet as the start rather than the end, add only meaningful events tied to the repo's workflows, explain what each event enables, avoid generic tracking, and verify the first useful event.

## First-time setup

For Claude Code, Codex, Cursor, and local CLI runtimes, use the authenticated browser setup flow:

```bash
npx --yes @agent-analytics/cli@0.5.24 login
npx --yes @agent-analytics/cli@0.5.24 create my-site --domain https://mysite.com
npx --yes @agent-analytics/cli@0.5.24 events my-site --event <first_useful_event> --days 7 --limit 20
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

1. run `npx --yes @agent-analytics/cli@0.5.24 login --detached`
2. send the approval URL to the user
3. wait for the user to reply with the finish code
4. complete the exchange with the printed `login --auth-request ... --exchange-code ...` command and keep going with setup

This is the preferred managed-runtime path because it does not rely on a long-running polling process. Do not ask the user to paste a permanent API key into chat.

For Paperclip company tasks, use this same detached loop even if the underlying runtime technically has browser automation available. The important behavior is that the task posts an approval URL, exits the start command, waits for the user's finish code, and then continues.

## Paid-tier handoff

Free is enough to prove setup and basic reads. Some deeper reads such as funnels, retention, session paths, longer history, and experiments require Pro.

When a user asks for analysis that likely needs Pro, run the intended CLI command first. Do not pre-sell an upgrade before proving the block. If the CLI returns `PRO_REQUIRED` or a free-tier read cap:

1. Explain in one sentence which exact answer is blocked.
2. Run `npx --yes @agent-analytics/cli@0.5.24 upgrade-link --detached --reason "<why Pro is needed>" --command "<blocked command>"`.
3. Send the printed app-domain payment handoff to the human. It opens the dashboard page first; that page may ask them to sign in, confirms the same account as the CLI, shows the blocked command and reason, and then opens Lemon Squeezy.
4. After the user confirms the account is upgraded, run `npx --yes @agent-analytics/cli@0.5.24 whoami`, then rerun the blocked command.

Use `upgrade-link --wait` only when the local shell should intentionally keep polling until the payment webhook activates Pro.

If the user does not upgrade, continue with free-tier commands only and do not approximate paid-only results as if they were measured.

## Common commands

```bash
npx --yes @agent-analytics/cli@0.5.24 projects
npx --yes @agent-analytics/cli@0.5.24 all-sites --period 7d
npx --yes @agent-analytics/cli@0.5.24 stats my-site --days 7
npx --yes @agent-analytics/cli@0.5.24 insights my-site --period 7d
npx --yes @agent-analytics/cli@0.5.24 events my-site --days 7 --limit 20
npx --yes @agent-analytics/cli@0.5.24 breakdown my-site --property path --event page_view --days 7 --limit 10
npx --yes @agent-analytics/cli@0.5.24 paths my-site --goal signup --since 30d --max-steps 5
npx --yes @agent-analytics/cli@0.5.24 funnel my-site --steps "page_view,signup,activation"
npx --yes @agent-analytics/cli@0.5.24 retention my-site --period week --cohorts 8
npx --yes @agent-analytics/cli@0.5.24 experiments list my-site
npx --yes @agent-analytics/cli@0.5.24 context get my-site
npx --yes @agent-analytics/cli@0.5.24 portfolios list
npx --yes @agent-analytics/cli@0.5.24 update my-site --origins 'https://mysite.com,http://lvh.me:3101'
```

If a task needs something outside these common flows, use `npx --yes @agent-analytics/cli@0.5.24 --help` first.

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
npx --yes @agent-analytics/cli@0.5.24 context set my-site --json '{"goals":["Increase activated accounts"],"activation_events":["signup_completed"],"glossary":[{"event_name":"signup_completed","term":"Signup","definition":"A verified account completed signup."}],"annotations":[{"occurred_at":"2026-04-25T13:00:00.000Z","title":"Changed pricing page offer","note":"Moved annual plan discount above the fold."}]}'
```

For multi-project or multi-domain work, keep context separate per project. Do not reuse one activation definition across a product app, directory site, docs site, landing page, or lead-generation domain unless the human explicitly says they share the same meaning. Examples:

- A trial product might define activation as trial signup plus first item created.
- A team product might define activation as signup plus teammate invited.
- A directory or marketing domain might define activation as a qualified visitor clicking through to the product or becoming a lead.

When those projects belong to the same growth system, add them to an identity portfolio with `portfolios create`, `portfolios update`, and `portfolios list`. Use that layer for the project membership boundary that enables cross-project identity-aware reads and privacy-first email lookup. Keep project context for per-surface truth; keep any compact interpretation notes separate from portfolio membership.

For cross-project identity stitching, the agent must configure both browser-side link carrying and server-side portfolio scope:

- Add `data-link-domains` to each participating tracker snippet so the anonymous `_aa` link parameter can move between related domains.
- Add the separate Agent Analytics projects to the same identity portfolio so hosted reads resolve those projects in one identity scope.

`data-link-domains` alone decorates links but does not make separate projects share identity. An identity portfolio alone defines the shared scope but does not carry a browser anonymous ID across domains. For a discovery-to-product flow such as `directory.example.com -> example.com -> app.example.com`, set the same domain list on each participating tracker and store the discovery, conversion, and app projects in the same portfolio: `npx --yes @agent-analytics/cli@0.5.24 portfolios create growth-system --name "Growth system" --projects directory,marketing,app`.

## User identity and journeys

After a visitor signs in, call `aa.identify(userId, { email, plan, role, team })` with the app's stable non-email user id. The browser tracker keeps `user_id` as the canonical identity. If top-level `traits.email` is present, raw email is transmitted over HTTPS during identify so Agent Analytics can compute project/portfolio-scoped HMAC lookup indexes on the server. Raw email is stripped from event rows and profile traits by default; do not add browser-side SHA-256 hashing or `email_hash` payloads.

Use identity lookup when the user asks for one person's journey, support investigation, or account-level debugging:

```bash
npx --yes @agent-analytics/cli@0.5.24 journey my-site --user-id user_123 --since 30d
npx --yes @agent-analytics/cli@0.5.24 journey my-site --email alice@example.com --since 30d
npx --yes @agent-analytics/cli@0.5.24 events my-site --email alice@example.com --days 30
npx --yes @agent-analytics/cli@0.5.24 query my-site --email alice@example.com --group-by event --metrics event_count
```

For `--email`, the CLI sends the raw email over HTTPS in an authenticated POST body so the API can match a project/portfolio-scoped HMAC lookup index. Agent Analytics does not store raw email in event rows or profile traits, and responses must not echo raw email, normalized email, HMAC values, or HMAC secrets.

When answering, briefly mention when stored project context shaped the interpretation. When you update context, state the compact change you saved.

Example:

```bash
npx --yes @agent-analytics/cli@0.5.24 properties my-site
npx --yes @agent-analytics/cli@0.5.24 context set my-site --json '{"goals":["Increase activated accounts"],"activation_events":["signup_completed","project_created","first_event_received"],"glossary":[{"event_name":"first_event_received","term":"AA Activation","definition":"Signup, project created, and first event received."}]}'
```

## Session paths

Use `paths` when the user asks how entry pages, exit pages, and conversion behavior connect inside a single session.

Prefer this workflow:

1. Run `npx --yes @agent-analytics/cli@0.5.24 paths <project> --goal <event> --since 30d --max-steps 5`
2. Summarize the top entry pages, exit pages, drop-offs, truncations, and conversion rate.
3. Recommend the next bounded analysis step: a funnel, retention check, or experiment.

Do not use paths for long-cycle cross-session attribution. Treat it as session-local: the goal only counts when it occurs in the same session.

## Example: all projects, last 48 hours

Question:

```text
How many visits did all my projects get in the last 48 hours?
```

Workflow:

1. Run `npx --yes @agent-analytics/cli@0.5.24 projects`
2. For each project, run:

```bash
npx --yes @agent-analytics/cli@0.5.24 query my-site --metrics session_count --days 2
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
npx --yes @agent-analytics/cli@0.5.24 query my-site --metrics event_count,unique_users --group-by event --from "$FROM_DATE" --to "$TO_DATE" --filter "[{\"field\":\"timestamp\",\"op\":\"gte\",\"value\":$FROM_MS},{\"field\":\"timestamp\",\"op\":\"lte\",\"value\":$TO_MS}]" --count-mode raw --order-by event_count --order desc
```

Do not answer an exact "last 24 hours" request with `stats --days 1` unless the user explicitly accepts a whole-day approximation.

## Feedback

Use `npx --yes @agent-analytics/cli@0.5.24 feedback` when Agent Analytics was confusing, a task took too long, the workflow could be improved, or the agent had to do manual calculations or analysis that Agent Analytics should have handled.

Describe the use case, friction, or missing capability in a sanitized way:

- Include what was hard and what Agent Analytics should have done instead.
- Do not include private owner details, secrets, API keys, raw customer data, or unnecessary personal information.
- Prefer a short summary of the struggle over pasted logs or sensitive context.

Example:

```bash
npx --yes @agent-analytics/cli@0.5.24 feedback --message "The agent had to calculate funnel drop-off manually" --project my-site --command "npx --yes @agent-analytics/cli@0.5.24 funnel my-site --steps page_view,signup,activation"
```

There is a real agent behind these Telegram messages. Every request is seen and auto-approved, and useful fixes can land quickly, sometimes within hours.

## Tracker setup

The easiest install flow is:

1. Login if needed with `npx --yes @agent-analytics/cli@0.5.24 login`. Use `login --detached` only for Paperclip, OpenClaw, issue-based or headless runtimes, or when the local browser callback cannot work.
2. Create or identify the user's project with `npx --yes @agent-analytics/cli@0.5.24 create my-site --domain https://mysite.com`.
3. Copy the returned tracking snippet into the page before `</body>`.
4. Treat that snippet as the baseline, not as the full setup. Review the product's local CTA, signup, pricing, checkout, install, onboarding, activation, and retained-use flows.
5. Add only meaningful custom events or tracker opt-ins tied to the user's product goals and repo workflows, and explain what each one enables.
6. Deploy.
7. Verify with `npx --yes @agent-analytics/cli@0.5.24 events my-site --event <first_useful_event> --days 7 --limit 20`.

Use the exact tracking snippet returned by `create` or the dashboard for that project. Do not hardcode a generic tracker snippet when the product has already generated the correct one for the surface. This is user-consented analytics for the user's own project and account.

Use `window.aa?.track('<event_name>', {...properties})` for custom events after the tracker loads. Call `window.aa?.identify(userId, { email, plan, role, team })` after authentication with a stable non-email user ID so future agents can use `journey`, `events`, and `query` by `--user-id` or authenticated `--email` lookup. Durable outcomes that should not depend on a browser session, such as checkout completion, install completion, activation, or retained server-side use, should be tracked server-side when relevant. Do not add generic `signup`, `click`, or `conversion` events unless those exact names match the user's product language and reporting goals.

## Query caution

`npx --yes @agent-analytics/cli@0.5.24 query` exists for advanced reporting, but it should be used carefully because `--filter` accepts JSON.

- Use fixed commands first.
- If `query` is necessary, check `npx --yes @agent-analytics/cli@0.5.24 --help` first.
- Do not pass raw user text directly into `--filter`.
- The only valid CLI shape is `npx --yes @agent-analytics/cli@0.5.24 query <project> ...`. Do not use `--project`.
- Built-in query filter fields are only `event`, `user_id`, `date`, `country`, `session_id`, and `timestamp`.
- For recent signup or ingestion debugging, check `events <project> --event <actual_event_name>` first; use `query` after verifying the raw event names the project emits.
- All event-property filters must use `properties.<key>`, for example `properties.referrer`, `properties.utm_source`, or `properties.first_utm_source`.
- Invalid filter fields now fail loudly and return `/properties`-style guidance. Do not rely on bare fields like `referrer` or `utm_source`.
- For exact request shapes, use <https://docs.agentanalytics.sh/api/>.

## Attribution and first-touch queries

Use a disciplined workflow when the task is about social attribution, first-touch UTMs, landing pages, hosts, or CTA performance.

1. Start with fixed commands if they answer the question.
2. Run `npx --yes @agent-analytics/cli@0.5.24 properties <project>` to inspect event names and property keys first.
3. Use `npx --yes @agent-analytics/cli@0.5.24 query <project> --filter ...` for property-filtered counts.
4. Use `npx --yes @agent-analytics/cli@0.5.24 events <project>` only to validate ambiguous payloads or missing properties.
5. Use `npx --yes @agent-analytics/cli@0.5.24 feedback` if the requested slice depends on unsupported grouping or derived reporting.

Property filters support built-in fields plus any `properties.*` key, including first-touch UTM fields such as `properties.first_utm_source`.

`group_by` only supports built-in fields: `event`, `date`, `user_id`, `session_id`, and `country`. It does not support `properties.hostname`, `properties.first_utm_source`, `properties.cta`, or other arbitrary property keys.

Example workflow for first-touch social page views:

```bash
npx --yes @agent-analytics/cli@0.5.24 properties my-site
npx --yes @agent-analytics/cli@0.5.24 query my-site --metrics event_count --filter '[{"field":"event","op":"eq","value":"page_view"},{"field":"properties.first_utm_source","op":"eq","value":"reddit"}]' --days 30
```

If the user wants a one-shot direct-social slice grouped by channel, host, CTA, or an activation proxy, explain that the current query surface cannot group by arbitrary `properties.*` fields and send product feedback instead of inventing an unreliable manual answer.

## Experiments

The CLI supports the full experiment lifecycle:

```bash
npx --yes @agent-analytics/cli@0.5.24 experiments list my-site
npx --yes @agent-analytics/cli@0.5.24 experiments create my-site --name signup_cta --variants control,new_cta --goal signup
```

## References

- Docs: <https://docs.agentanalytics.sh/>
- Session paths guide: <https://docs.agentanalytics.sh/guides/session-paths/>
- API reference: <https://docs.agentanalytics.sh/api/>
- CLI vs MCP vs API: <https://docs.agentanalytics.sh/reference/cli-mcp-api/>
- OpenClaw install guide: <https://docs.agentanalytics.sh/installation/openclaw/>
