import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';

const root = process.cwd();
const skill = readFileSync(join(root, 'skills/agent-analytics/SKILL.md'), 'utf8');
const autoresearchSkill = readFileSync(join(root, 'skills/agent-analytics-autoresearch/SKILL.md'), 'utf8');
const autoresearchBriefTemplate = readFileSync(
  join(root, 'skills/agent-analytics-autoresearch/references/brief-template.md'),
  'utf8',
);
const autoresearchSnapshotScript = readFileSync(
  join(root, 'skills/agent-analytics-autoresearch/scripts/collect_agent_analytics_snapshot.sh'),
  'utf8',
);
const autoresearchInitScript = readFileSync(
  join(root, 'skills/agent-analytics-autoresearch/scripts/init_autoresearch_run.sh'),
  'utf8',
);
const readme = readFileSync(join(root, 'README.md'), 'utf8');

describe('agent-analytics skill contract', () => {
  it('pins the official CLI to 0.5.23 everywhere', () => {
    assert.match(skill, /version: 4\.0\.24/);
    assert.ok(skill.includes('npx --yes @agent-analytics/cli@0.5.23'));
    assert.ok(readme.includes('npx --yes @agent-analytics/cli@0.5.23'));
    assert.match(autoresearchSkill, /version: 1\.0\.6/);
    assert.ok(autoresearchSkill.includes('npx --yes @agent-analytics/cli@0.5.23'));
    assert.ok(autoresearchBriefTemplate.includes('npx --yes @agent-analytics/cli@0.5.23'));
    assert.ok(autoresearchSnapshotScript.includes('npx --yes @agent-analytics/cli@0.5.23'));
    assert.equal(/@agent-analytics\/cli@0\.5\.(12|13|14|15|16|17|18|19)/.test(skill), false);
    assert.equal(/@agent-analytics\/cli@0\.5\.(12|13|14|15|16|17|18|19)/.test(readme), false);
    assert.equal(
      /@agent-analytics\/cli@0\.5\.(12|13|14|15|16|17|18|19)/.test(autoresearchSkill),
      false,
    );
    assert.equal(
      /@agent-analytics\/cli@0\.5\.(12|13|14|15|16|17|18|19)/.test(autoresearchBriefTemplate),
      false,
    );
    assert.equal(
      /@agent-analytics\/cli@0\.5\.(12|13|14|15|16|17|18|19)/.test(autoresearchSnapshotScript),
      false,
    );
  });

  it('documents the paid upgrade handoff without raw API-key fallback', () => {
    assert.match(skill, /Paid-tier handoff/i);
    assert.match(skill, /PRO_REQUIRED/i);
    assert.match(skill, /upgrade-link --detached/i);
    assert.match(skill, /upgrade-link --wait/i);
    assert.match(skill, /dashboard page first/i);
    assert.match(skill, /confirms the same account as the CLI/i);
    assert.match(skill, /blocked command and reason/i);
    assert.match(readme, /confirms the same account as the CLI/i);
    assert.match(skill, /whoami/i);
    assert.equal(/login --token/i.test(skill), false);
    assert.equal(/login --token/i.test(readme), false);
  });

  it('requires analysis-first setup before installing events', () => {
    assert.match(skill, /analysis-first/i);
    assert.match(skill, /do not guess/i);
    assert.match(skill, /do not overtrack/i);
    assert.match(skill, /do not install generic events/i);
    assert.match(skill, /Anonymous website-analysis preview is available on the public web scanner/i);
    assert.match(skill, /sign in first/i);
    assert.match(skill, /scan <url> --project <project> --json/i);
    assert.match(readme, /Anonymous website-analysis preview is available on the public web scanner/i);
    assert.match(readme, /scan <url> --project <project> --json/i);
  });

  it('teaches agents to scan additional owned surfaces for uncollected data', () => {
    assert.match(skill, /additional public websites the user owns/i);
    assert.match(skill, /product eyes/i);
    assert.match(skill, /not be collecting yet/i);
    assert.match(skill, /Only scan sites the user owns/i);
    assert.match(skill, /Compare `current_blindspots` and `minimum_viable_instrumentation`/i);
    assert.match(readme, /scan additional public websites the user owns/i);
    assert.match(readme, /data that may not be collected yet/i);
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
    assert.match(skill, /At the start of any project-specific analysis/i);
    assert.match(skill, /context set.*replaces the stored context/i);
    assert.match(skill, /Always read the existing context first/i);
    assert.match(skill, /Save durable product truth/i);
    assert.match(skill, /Skip noisy findings/i);
    assert.match(skill, /Do not invent unsupported fields/i);
    assert.match(skill, /multi-project or multi-domain/i);
    assert.match(skill, /portfolio-context get/i);
    assert.match(skill, /surface_roles/i);
    assert.match(skill, /data-link-domains/i);
    assert.match(skill, /cross-project identity stitching/i);
    assert.match(skill, /decorates links but does not make separate projects share identity/i);
    assert.match(readme, /cross-project identity stitching/i);
    assert.match(readme, /data-link-domains.*surface_roles/i);
    assert.match(skill, /trial signup plus first item created/i);
    assert.match(skill, /teammate invited/i);
    assert.match(skill, /next analysis starts smarter/i);
  });

  it('teaches Autoresearch to use project context as self-improving product memory', () => {
    assert.match(autoresearchSkill, /context get <project>/i);
    assert.match(autoresearchSkill, /project_context/i);
    assert.match(autoresearchSkill, /self-improving product memory/i);
    assert.match(autoresearchSkill, /durable product truth/i);
    assert.match(autoresearchSkill, /skip weekly numbers/i);
    assert.match(autoresearchSkill, /Do not store raw round notes/i);
    assert.match(autoresearchSkill, /references\/results-header\.txt/i);
    assert.doesNotMatch(autoresearchSkill, /references\/results-header\.tsv/i);
    assert.match(autoresearchInitScript, /references\/results-header\.txt/i);
    assert.doesNotMatch(autoresearchInitScript, /references\/results-header\.tsv/i);
    assert.match(readme, /Autoresearch should read Project Context before a snapshot/i);
  });
});
