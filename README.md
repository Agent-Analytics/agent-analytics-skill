# Agent Analytics Skills

Public skill repo for installing Agent Analytics skills into agent environments with:

```bash
npx skills add Agent-Analytics/agent-analytics-skill
```

List the available skills without installing:

```bash
npx skills add Agent-Analytics/agent-analytics-skill --list
```

Install one skill explicitly:

```bash
npx skills add Agent-Analytics/agent-analytics-skill --skill agent-analytics
npx skills add Agent-Analytics/agent-analytics-skill --skill agent-analytics-autoresearch
```

This repo intentionally contains only public skill definitions. It does not include the private MCP server implementation or deployment configuration.

## Skills

### `agent-analytics`

The regular Agent Analytics skill teaches an agent how to use the official Agent Analytics CLI to:

- create projects
- install tracking
- inspect traffic and events
- connect entry pages, exit pages, and goals with bounded session paths
- analyze funnels and retention
- store compact project goals, activation events, and event-name glossary context
- store date annotations for major landing page, pricing, onboarding, feature, release, or experiment changes
- keep that context as a per-project, self-improving memory after instrumentation, analysis, and human corrections
- configure identity portfolios for related projects and pair them with tracker `data-link-domains` for cross-project identity stitching
- install the project-owned tracker with consent and verify the first useful event
- read existing context before analysis, merge before writes, and save only durable product truth instead of noisy metric findings
- run experiments

Use this when you want the agent to operate Agent Analytics end-to-end.

### `agent-analytics-autoresearch`

The Autoresearch skill teaches an agent how to run a structured growth loop for landing pages, onboarding copy, pricing pages, and experiment candidates.

It can use any analytics data: Agent Analytics, PostHog, GA4, Mixpanel, SQL, CSV exports, product logs, or a written data brief. It works best with Agent Analytics because the agent can pull fresh snapshots through the CLI/API, inspect funnels and events, and use experiment results in the next run.

When using Agent Analytics data, Autoresearch should read Project Context before a snapshot and feed back only durable product truth after human correction or measured evidence. It should not store noisy round notes, weekly numbers, or temporary spikes as project memory.

Use this when you want the agent to:

- collect or read an analytics snapshot
- preserve product truth and drift constraints
- generate, critique, synthesize, and blind-rank variants
- output two review-ready variants for an A/B test
- rerun after live experiment data arrives

The workflow is based on the public template repo:

- Autoresearch Growth: <https://github.com/Agent-Analytics/autoresearch-growth>

## CLI Pinning

The skill is intentionally pinned to the official CLI invocation:

```bash
npx --yes @agent-analytics/cli@0.5.25 <command>
```

Agent environments should prefer that exact `npx` form over raw API calls, repo-local scripts, or an already-installed binary unless the user explicitly asks for a different interface.

The published skill now teaches the authenticated CLI setup flow:

```text
Set up Agent Analytics for this project. If browser approval is needed, open it and wait for me. I will sign in with Google or GitHub and approve it. If the browser callback cannot resume you, ask me for the finish code as a fallback. After that, create or identify the matching Agent Analytics project, install the project-owned tracker, add only meaningful custom events tied to this repo's product workflows, explain what each event enables, and verify the first useful event.
```

In Claude Code, Codex, Cursor, and local CLI runtimes, the setup flow signs in with the normal browser approval first, then creates or identifies the matching project before installing the project-owned tracker:

```bash
npx --yes @agent-analytics/cli@0.5.25 login
npx --yes @agent-analytics/cli@0.5.25 create <project> --domain <url>
npx --yes @agent-analytics/cli@0.5.25 events <project> --event <first_useful_event> --days 7 --limit 20
```

Use `login --detached` only for Paperclip, OpenClaw, issue-based or headless runtimes, or when the local browser callback cannot work.

The `create` command returns the exact tracking snippet for the project. Agents should add that snippet before `</body>`, review the local product flow, install only meaningful events tied to the user's goals, explain what each event enables, and avoid generic tracking.

Agents should map event needs to tracker.js capabilities instead of inventing generic instrumentation: use `data-aa-event` for named click intent, `data-aa-impression` for meaningful section exposure, `window.aa.track(...)` for computed client state, and server-side tracking for durable outcomes such as completed signup. Do not add custom duplicates for automatic tracker signals like `page_view`, path, referrer, UTMs, device/browser fields, country, session IDs, session count, days since first visit, or first-touch attribution.

For related projects that should share identity, the skill teaches agents to configure both sides of the flow: tracker `data-link-domains` carries the anonymous `_aa` value across domains, while `portfolios create/update` puts separate Agent Analytics projects into the same server-side identity and privacy-first email lookup scope.

For OpenClaw and similar managed runtimes, store CLI auth in a persistent workspace path instead of the default home config path:

```bash
export AGENT_ANALYTICS_CONFIG_DIR="$PWD/.openclaw/agent-analytics"
npx --yes @agent-analytics/cli@0.5.25 auth status
```

Normal setup, paid upgrade, and resumed agent work do not require an API key.

When a free account reaches a Pro-only analytics command, the skill should run the blocked command first, then use:

```bash
npx --yes @agent-analytics/cli@0.5.25 upgrade-link --detached --reason "<why Pro is needed>" --command "<blocked command>"
```

The CLI prints an app-domain payment handoff for the human. The dashboard page may ask the human to sign in, confirms the same account as the CLI, shows the blocked command and reason, and then opens Lemon Squeezy. The agent should run `whoami` after payment, then rerun the blocked command once Pro is active.

For direct MCP setup, use the install guides on the docs site.

## Related

- Docs: <https://docs.agentanalytics.sh/>
- Session paths guide: <https://docs.agentanalytics.sh/guides/session-paths/>
- API reference: <https://docs.agentanalytics.sh/api/>
- OpenAPI spec: <https://docs.agentanalytics.sh/openapi.yaml>
- CLI package: <https://github.com/Agent-Analytics/agent-analytics-cli>
- Regular Agent Analytics skill: <https://github.com/Agent-Analytics/agent-analytics-skill/tree/main/skills/agent-analytics>
- Autoresearch Growth template: <https://github.com/Agent-Analytics/autoresearch-growth>
- MCP server docs: <https://docs.agentanalytics.sh/installation/>
