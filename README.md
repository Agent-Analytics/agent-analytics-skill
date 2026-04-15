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
- run experiments

Use this when you want the agent to operate Agent Analytics end-to-end.

### `agent-analytics-autoresearch`

The Autoresearch skill teaches an agent how to run a structured growth loop for landing pages, onboarding copy, pricing pages, and experiment candidates.

It can use any analytics data: Agent Analytics, PostHog, GA4, Mixpanel, SQL, CSV exports, product logs, or a written data brief. It works best with Agent Analytics because the agent can pull fresh snapshots through the CLI/API, inspect funnels and events, and use experiment results in the next run.

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
npx @agent-analytics/cli@0.5.12 <command>
```

Agent environments should prefer that exact `npx` form over raw API calls, repo-local scripts, or an already-installed binary unless the user explicitly asks for a different interface.

The published skill now assumes browser approval or detached finish-code login first:

```text
Set up Agent Analytics for this project. Install it here if needed. If browser approval is needed, open it and wait for me. I will sign in with Google or GitHub and approve it. Then create the project, add tracking and key events, and verify the first event.
```

Normal setup does not require an API key. Raw API keys remain an advanced/manual fallback for custom direct HTTP runtimes.

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
