import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';

const root = process.cwd();
const skill = readFileSync(join(root, 'skills/agent-analytics/SKILL.md'), 'utf8');
const readme = readFileSync(join(root, 'README.md'), 'utf8');

describe('agent-analytics skill contract', () => {
  it('pins the official CLI to 0.5.19 everywhere', () => {
    assert.match(skill, /version: 4\.0\.19/);
    assert.ok(skill.includes('npx --yes @agent-analytics/cli@0.5.19'));
    assert.ok(readme.includes('npx --yes @agent-analytics/cli@0.5.19'));
    assert.equal(/@agent-analytics\/cli@0\.5\.(12|13|14|15)/.test(skill), false);
    assert.equal(/@agent-analytics\/cli@0\.5\.(12|13|14|15)/.test(readme), false);
  });

  it('requires analysis-first setup before installing events', () => {
    assert.match(skill, /run .*scan <url>/i);
    assert.match(skill, /analysis-first/i);
    assert.match(skill, /do not guess/i);
    assert.match(skill, /do not overtrack/i);
    assert.match(skill, /do not install generic events/i);
  });

  it('documents persistent OpenClaw auth storage', () => {
    assert.match(skill, /AGENT_ANALYTICS_CONFIG_DIR/i);
    assert.match(skill, /\.openclaw\/agent-analytics/i);
    assert.match(skill, /auth status/i);
    assert.match(skill, /--config-dir/i);
    assert.match(skill, /Never commit .*config\.json/i);
  });

  it('uses minimum viable instrumentation and first useful event verification language', () => {
    assert.match(skill, /minimum viable instrumentation/i);
    assert.match(skill, /implementation_hint/i);
    assert.match(skill, /first useful recommended event/i);
    assert.match(skill, /events <project>/i);
    assert.match(skill, /what the installed events now let the user's agent answer/i);
  });

  it('maps analysis recommendations to tracker capabilities instead of duplicate generic events', () => {
    assert.match(skill, /data-aa-event/i);
    assert.match(skill, /data-aa-impression/i);
    assert.match(skill, /window\.aa\.track/i);
    assert.match(skill, /server-side tracking/i);
    assert.match(skill, /do not add duplicate custom events/i);
    assert.match(readme, /automatic tracker signals/i);
  });

  it('frames copied handoff as analytics judgment, not a generic prompt', () => {
    assert.match(skill, /Give your agent analytics judgment/i);
    assert.match(skill, /install only high-priority/i);
    assert.match(skill, /explain what each event enables/i);
  });

  it('teaches compact project context and event-name glossary upkeep', () => {
    assert.match(skill, /context get/i);
    assert.match(skill, /context set/i);
    assert.match(skill, /project_context/i);
    assert.match(skill, /properties <project>/i);
    assert.match(skill, /properties-received <project>/i);
    assert.match(skill, /event_name/i);
    assert.match(skill, /Keep .*short/i);
    assert.match(skill, /self-improving memory/i);
    assert.match(skill, /multi-project or multi-domain/i);
    assert.match(skill, /trial signup plus first item created/i);
    assert.match(skill, /teammate invited/i);
    assert.match(skill, /next analysis starts smarter/i);
  });
});
