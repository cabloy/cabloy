import { mkdtemp, readFile, rm, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { resolve } from 'node:path';
import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
  createChartModel,
  generateCharts,
  parseAtpIds,
  parseProgress,
  parseWbs,
} from './generate-implementation-charts.mjs';

const files = {
  'README.md': '# Demo Internal Planning\n\nEnglish planning records.\n',
  'pdp-wbs.md': `# Delivery Plan

### Phase 10: Baseline

Dependencies: none.

#### WBS-10-01: Freeze the baseline

Tasks:

- confirm the baseline;

Acceptance checks:

- satisfy ATP-DEMO-01.

### Phase 20: Delivery

Dependencies: \`WBS-10-*\`.

#### WBS-20-01: Deliver <tenant> & review

Dependencies: \`WBS-10-01\`.

Tasks:

- implement the feature for <tenant> & review it;

Acceptance checks:

- satisfy ATP-DEMO-01.

#### WBS-20-02: Deferred follow-up

Status: \`deferred\`.
`,
  'test-plan.md': `# Test Plan

## Acceptance Scenario Catalogue

| ID | Scenario |
| --- | --- |
| \`ATP-DEMO-01\` | Verify the baseline and feature. |
`,
  'progress.md': `# Progress

> Last reviewed: 2026-08-29.

| WBS ID | Status |
| --- | --- |
| \`WBS-10-01\` | \`not-started\` |
| \`WBS-20-01\` | \`in-progress\` |
| \`WBS-20-02\` | \`deferred\` |
`,
};

async function fixture(overrides = {}) {
  const directory = await mkdtemp(resolve(tmpdir(), 'cabloy-spec-charts-'));
  for (const [name, content] of Object.entries({ ...files, ...overrides })) {
    await writeFile(resolve(directory, name), content);
  }
  return directory;
}

async function removeFixture(directory) {
  await rm(directory, { recursive: true, force: true });
}

test('parses task dependencies independently from phase dependencies', () => {
  const model = parseWbs(files['pdp-wbs.md']);
  assert.equal(model.tasks.find(task => task.id === 'WBS-20-01').dependency, '`WBS-10-01`.');
  assert.equal(model.tasks.find(task => task.id === 'WBS-20-02').dependency, '`WBS-10-*`.');
});

test('requires formal ATP definitions rather than prose mentions', () => {
  assert.deepEqual([...parseAtpIds(files['test-plan.md'])], ['ATP-DEMO-01']);
  assert.deepEqual([...parseAtpIds('A prose mention of ATP-DEMO-99.')], []);
});

test('creates a mixed-status model with deferred scope separated', () => {
  const model = createChartModel({
    readme: files['README.md'],
    wbs: files['pdp-wbs.md'],
    progress: files['progress.md'],
    testPlan: files['test-plan.md'],
  });
  assert.equal(model.language, 'en');
  assert.equal(model.activeTasks.length, 2);
  assert.equal(model.deferredTasks.length, 1);
  assert.equal(model.verified, 0);
});

test('selects the earliest dependency-ready WBS item', async t => {
  const directory = await fixture({
    'pdp-wbs.md': `${files['pdp-wbs.md']}\n\n### Phase 30: Independent follow-up\n\nDependencies: none.\n\n#### WBS-30-01: Start the independent follow-up\n`,
    'progress.md': `${files['progress.md']}| \`WBS-30-01\` | \`in-progress\` |\n`,
  });
  t.after(() => removeFixture(directory));
  await generateCharts(directory);
  const gantt = await readFile(resolve(directory, 'implementation-gantt.svg'), 'utf8');
  assert.match(gantt, /WBS-30-01: Start the independent follow-up/);
  assert.match(gantt, /Next executable WBS item/);
});

test('renders a phase description directly beneath its phase label', async t => {
  const directory = await fixture({
    'pdp-wbs.md': files['pdp-wbs.md'].replace(
      'Phase 10: Baseline',
      'Phase 10: A deliberately extended <phase> & description that wraps safely',
    ),
  });
  t.after(() => removeFixture(directory));
  const gantt = (await generateCharts(directory)).artifacts.get('implementation-gantt.svg');
  assert.match(gantt, /<text class="phase" x="72" y="270">Phase 10<\/text><text class="small" x="72" y="283">A deliberately extended<\/text><text class="small" x="72" y="295">&lt;phase&gt; &amp; description that<\/text><text class="small" x="72" y="307">wraps safely<\/text><text class="num" x="265" y="329">WBS-10-01<\/text>/);
  assert.match(gantt, /<text class="phase" x="72" y="363">Phase 20<\/text><text class="small" x="72" y="376">Delivery<\/text><text class="num" x="265" y="398">WBS-20-01<\/text>/);
  assert.doesNotMatch(gantt, /y="432">Delivery<\/text>/);
});

test('selects Chinese chart copy from a Chinese README', () => {
  const model = createChartModel({
    readme: '# 示例内部规划\n\n这是中文规划记录。\n',
    wbs: files['pdp-wbs.md'],
    progress: files['progress.md'],
    testPlan: files['test-plan.md'],
  });
  assert.equal(model.language, 'zh');
  assert.equal(model.copy.ganttTitle, '实施路线图');
});

test('rejects missing progress rows and dangling ATP references', () => {
  assert.throws(() => createChartModel({
    readme: files['README.md'],
    wbs: files['pdp-wbs.md'],
    progress: files['progress.md'].replace('| `WBS-20-01` | `in-progress` |\n', ''),
    testPlan: files['test-plan.md'],
  }), /WBS-20-01 has no corresponding progress/);
  assert.throws(() => createChartModel({
    readme: files['README.md'],
    wbs: files['pdp-wbs.md'].replace('ATP-DEMO-01', 'ATP-MISSING-01'),
    progress: files['progress.md'],
    testPlan: files['test-plan.md'],
  }), /references undefined ATP-MISSING-01/);
});

test('renders partial burndown progress at its remaining-count position', async t => {
  const directory = await fixture({
    'progress.md': files['progress.md'].replace('`not-started`', '`verified`'),
  });
  t.after(() => removeFixture(directory));
  const result = await generateCharts(directory);
  const burndown = result.artifacts.get('implementation-burndown.svg');
  assert.match(burndown, />1 remaining · 1 verified</);
  assert.match(burndown, />2 remaining</);
  assert.doesNotMatch(burndown, />0 \/ 2</);
  assert.match(burndown, /<line x1="190" y1="410" x2="550\.0" y2="530\.0" stroke="var\(--blue\)" stroke-width="2"\/>/);
  assert.match(burndown, /<line x1="550\.0" y1="530\.0" x2="910" y2="650" stroke="var\(--blue\)" stroke-width="2" stroke-dasharray="6 5"/);
  assert.match(burndown, /<circle cx="550\.0" cy="530\.0" r="8"/);
  assert.doesNotMatch(burndown, /r="14" fill="var\(--aqua\)"/);
});

test('renders a completion marker only when no WBS items remain', async t => {
  const directory = await fixture({
    'progress.md': files['progress.md']
      .replace('`not-started`', '`verified`')
      .replace('`in-progress`', '`verified`'),
  });
  t.after(() => removeFixture(directory));
  const burndown = (await generateCharts(directory)).artifacts.get('implementation-burndown.svg');
  assert.match(burndown, />0 remaining · 2 verified</);
  assert.match(burndown, /<line x1="190" y1="410" x2="910\.0" y2="650\.0"/);
  assert.match(burndown, /<circle cx="910\.0" cy="650\.0" r="14"/);
  assert.match(burndown, /M904\.0 650\.0 L908\.0 654\.0 L916\.0 645\.0/);
});

test('writes deterministic XML-escaped artifacts and detects stale output', async t => {
  const directory = await fixture();
  t.after(() => removeFixture(directory));
  const first = await generateCharts(directory);
  assert.match(first.artifacts.get('implementation-gantt.svg'), /tenant/);
  assert.match(first.artifacts.get('implementation-gantt.svg'), /role="img"/);
  assert.match(first.artifacts.get('implementation-burndown.svg'), /role="img"/);
  assert.equal((await generateCharts(directory, { check: true })).stale.length, 0);
  await writeFile(resolve(directory, 'implementation-gantt.svg'), 'stale');
  await assert.rejects(() => generateCharts(directory, { check: true }), /implementation-gantt\.svg/);
  const second = await generateCharts(directory);
  assert.equal(second.artifacts.get('implementation-gantt.svg'), first.artifacts.get('implementation-gantt.svg'));
});
