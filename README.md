# Agent Analytics Skill

Public skill repo for installing Agent Analytics into agent environments with:

```bash
npx skills add Agent-Analytics/agent-analytics-skill@agent-analytics
```

This repo intentionally contains only the public skill definition. It does not include the private MCP server implementation or deployment configuration.

## What this skill does

The `agent-analytics` skill teaches an agent how to use the official Agent Analytics CLI to:

- create projects
- install tracking
- inspect traffic and events
- analyze funnels and retention
- run experiments

The skill is intentionally pinned to the official CLI invocation:

```bash
npx @agent-analytics/cli@0.5.4 <command>
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
- API reference: <https://docs.agentanalytics.sh/api/>
- OpenAPI spec: <https://docs.agentanalytics.sh/openapi.yaml>
- CLI package: <https://github.com/Agent-Analytics/agent-analytics-cli>
- MCP server docs: <https://docs.agentanalytics.sh/installation/>
