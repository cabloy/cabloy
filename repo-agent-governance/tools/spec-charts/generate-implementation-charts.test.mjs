import assert from 'node:assert/strict';
import { mkdtemp, readFile, readdir, rm, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { resolve } from 'node:path';
import { test } from 'node:test';

import {
  createChartModel,
  generateCharts,
  parseAtpIds,
  parseProgress,
  parseWbs,
  renderGantt,
  renderBurndown,
} from './generate-implementation-charts.mjs';
import { markdownLines, findIdentifiers, parseDefinitions } from './spec-parser.mjs';

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

test('parses progress rows by formal WBS and Status header columns', () => {
  const progress = parseProgress(
    [
      '# Progress',
      '',
      '> 最后审查日期： 2026-09-01',
      '',
      '| WBS ID | Work item | Status |',
      '| --- | --- | --- |',
      '| `WBS-DEMO-01` | Implementation title | `verified` |',
      '',
    ].join('\r\n'),
  );
  assert.equal(progress.reviewed, '2026-09-01');
  assert.deepEqual([...progress.rows], [['WBS-DEMO-01', 'verified']]);
});

test('does not parse prose wildcard ATP references as concrete IDs', () => {
  const model = parseWbs(
    [
      '# Delivery Plan',
      '',
      '### Phase 10: Baseline',
      '',
      '#### WBS-DEMO-01: Freeze the baseline',
      '',
      '- Track every `ATP-DEMO-*` after planning.',
      '',
    ].join('\n'),
  );
  assert.deepEqual(model.tasks[0].atps, []);
});

test('rejects malformed WBS headings with a trailing hyphen', () => {
  assert.throws(
    () =>
      parseWbs(
        ['# Delivery Plan', '', '### Phase 10: Baseline', '', '#### WBS-DEMO-01-: Freeze', ''].join(
          '\n',
        ),
      ),
    /No formal `#### WBS-…:` tasks/,
  );
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
  assert.doesNotMatch(renderGantt(model, 'Demo'), /--teal:/);
});

test('planning completion requires an explicit task mode and preserves verified-only metrics', () => {
  const wbs = files['pdp-wbs.md'].replace(
    '#### WBS-10-01: Freeze the baseline',
    '#### WBS-10-01: Freeze the baseline\n\nCompletion mode: planning-only.',
  );
  const progress = files['progress.md'].replace('`not-started`', '`planning-complete`');
  assert.throws(
    () =>
      createChartModel({
        readme: files['README.md'],
        wbs: files['pdp-wbs.md'],
        progress,
        testPlan: files['test-plan.md'],
      }),
    /planning-complete status without Completion mode/,
  );
  const model = createChartModel({
    readme: files['README.md'],
    wbs,
    progress,
    testPlan: files['test-plan.md'],
  });
  assert.equal(model.tasks[0].completionMode, 'planning-only');
  assert.equal(model.verified, 0);
  const gantt = renderGantt(model, 'Demo');
  assert.match(gantt, /Planning complete/);
  assert.match(gantt, /--teal:#087f83/);
  assert.doesNotMatch(renderBurndown(model, 'Demo'), /--teal:/);
  assert.match(gantt, /class="caption" x="96" y="195">WBS-20-01: Deliver/);
  assert.doesNotMatch(gantt, /class="caption" x="96" y="195">WBS-10-01/);
  assert.match(renderBurndown(model, 'Demo'), />2 remaining · 0 verified</);
  const blocked = createChartModel({
    readme: files['README.md'],
    wbs,
    progress: progress.replace('`in-progress`', '`blocked`'),
    testPlan: files['test-plan.md'],
  });
  assert.match(renderGantt(blocked, 'Demo'), /No dependency-ready WBS candidate is recorded/);
  assert.equal(blocked.verified, 0);
  const chinese = createChartModel({
    readme: '# 中文规划\n\n完整中文记录。',
    wbs,
    progress,
    testPlan: files['test-plan.md'],
  });
  assert.match(renderGantt(chinese, '示例'), /规划完成/);
  assert.match(renderBurndown(chinese, '示例'), /2 剩余 · 0 已核验/);
});

test('completion mode must be unique, supported and task-local', () => {
  const wbs = files['pdp-wbs.md'];
  for (const value of ['unknown.', '', 'planning-only.\nCompletion mode: planning-only.']) {
    assert.throws(
      () => parseWbs(wbs.replace('Tasks:', `Completion mode: ${value}\n\nTasks:`)),
      /Completion mode/,
    );
  }
  assert.throws(
    () =>
      parseWbs(
        wbs.replace('Dependencies: none.', 'Dependencies: none.\nCompletion mode: planning-only.'),
      ),
    /Completion mode must belong to a formal WBS task/,
  );
  assert.throws(
    () => parseWbs(`Completion mode: planning-only.\n${wbs}`),
    /Completion mode must belong to a formal WBS task/,
  );
  const progress = files['progress.md'].replace('`not-started`', '`planning-complete`');
  assert.throws(
    () =>
      createChartModel({
        readme: files['README.md'],
        wbs: wbs.replace('Tasks:', 'Status: in-progress.\nCompletion mode: planning-only.\nTasks:'),
        progress,
        testPlan: files['test-plan.md'],
      }),
    /explicit.*Status in-progress.*planning-complete/,
  );
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
  assert.match(gantt, /Dependency-ready WBS candidate/);
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
  assert.match(
    gantt,
    /<text class="phase" x="72" y="270">Phase 10<\/text><text class="small" x="72" y="283">A deliberately extended<\/text><text class="small" x="72" y="295">&lt;phase&gt; &amp; description that<\/text><text class="small" x="72" y="307">wraps safely<\/text><text class="num" x="265" y="329">WBS-10-01<\/text>/,
  );
  assert.match(
    gantt,
    /<text class="phase" x="72" y="363">Phase 20<\/text><text class="small" x="72" y="376">Delivery<\/text><text class="num" x="265" y="398">WBS-20-01<\/text>/,
  );
  assert.doesNotMatch(gantt, /y="432">Delivery<\/text>/);
});

test('widens and wraps the Dependencies column without covering status', async t => {
  const directory = await fixture({
    'pdp-wbs.md': files['pdp-wbs.md'].replace(
      'Dependencies: `WBS-10-01`.',
      'Dependencies: `WBS-10-01`, `WBS-10-01`, `WBS-10-01`, `WBS-10-01`.',
    ),
  });
  t.after(() => removeFixture(directory));
  const gantt = (await generateCharts(directory)).artifacts.get('implementation-gantt.svg');
  assert.match(gantt, /<text class="small" x="680" y="246">Dependencies<\/text>/);
  assert.match(
    gantt,
    /<text class="small" x="680" y="\d+"><tspan x="680" dy="0">[^<]+<\/tspan><tspan x="680" dy="12">[^<]+<\/tspan><\/text><circle cx="905" cy="\d+"/,
  );
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
  assert.throws(
    () =>
      createChartModel({
        readme: files['README.md'],
        wbs: files['pdp-wbs.md'],
        progress: files['progress.md'].replace('| `WBS-20-01` | `in-progress` |\n', ''),
        testPlan: files['test-plan.md'],
      }),
    /WBS-20-01 has no corresponding progress/,
  );
  assert.throws(
    () =>
      createChartModel({
        readme: files['README.md'],
        wbs: files['pdp-wbs.md'].replace('ATP-DEMO-01', 'ATP-MISSING-01'),
        progress: files['progress.md'],
        testPlan: files['test-plan.md'],
      }),
    /references undefined ATP-MISSING-01/,
  );
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
  assert.match(
    burndown,
    /<line x1="190" y1="410" x2="550\.0" y2="530\.0" stroke="var\(--blue\)" stroke-width="2"\/>/,
  );
  assert.match(
    burndown,
    /<line x1="550\.0" y1="530\.0" x2="910" y2="650" stroke="var\(--blue\)" stroke-width="2" stroke-dasharray="6 5"/,
  );
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

test('shared Markdown lines ignore fences and comments while retaining source locations', () => {
  const markdown = [
    '# Real',
    '<!-- ## Hidden',
    '- **PRD-HIDDEN-01**: comment -->',
    '```markdown',
    '### ATP-HIDDEN-01: example',
    '````',
    '~~~text',
    '#### WBS-HIDDEN-01: example',
    '~~~',
    '- **PRD-REAL-01**: actual requirement <!-- ATP-HIDDEN-02 -->',
  ].join('\n');
  const lines = markdownLines(markdown);
  assert.deepEqual(
    lines.filter(record => record.heading).map(record => record.heading.text),
    ['Real'],
  );
  const definitions = parseDefinitions(markdown, 'PRD-', { file: 'prd.md' });
  assert.deepEqual([...definitions.keys()], ['PRD-REAL-01']);
  assert.equal(definitions.get('PRD-REAL-01').line, 10);
  assert.equal(definitions.get('PRD-REAL-01').file, 'prd.md');
  assert.doesNotMatch(lines.at(-1).text, /ATP-HIDDEN/);
  assert.deepEqual(findIdentifiers('`ATP-REAL-01`, `ATP-REAL-*`, ATP-BAD-:', 'ATP-'), [
    'ATP-REAL-01',
  ]);
  assert.deepEqual(
    [...parseDefinitions('- **PRD-<!-- hidden -->FAKE-01**: not a formal token', 'PRD-')],
    [],
  );
});

test('formal requirement definitions support bold bullets and ID-leading headings only', () => {
  const definitions = parseDefinitions(
    [
      '## Requirements',
      '- **PRD-REAL-01**: requirement; trace SRS-REAL-01.',
      '### PRD-REAL-02: another requirement',
      'Mention PRD-REF-01 in prose.',
      '| PRD-REF-02 | coverage |',
      '### Coverage for PRD-REF-03',
    ].join('\n'),
    'PRD-',
  );
  assert.deepEqual([...definitions.keys()], ['PRD-REAL-01', 'PRD-REAL-02']);
  assert.throws(
    () => parseDefinitions('- **SRS-DUP-01**: a\n### SRS-DUP-01: b', 'SRS-'),
    /Duplicate SRS-DUP-01/,
  );
  assert.throws(() => parseDefinitions('- **PRD-A-01, PRD-A-02**: both', 'PRD-'), /Multiple PRD-/);
  assert.throws(() => parseDefinitions('### SRS-A-01 and SRS-A-02: both', 'SRS-'), /Multiple SRS-/);
});

test('definition bodies stop before the next definition or a sibling section', () => {
  const definitions = parseDefinitions(
    [
      '- **PRD-BODY-01**: first',
      'Traceability: SRS-BODY-01.',
      '- **PRD-BODY-02**: second',
      'Traceability: SRS-BODY-02.',
      '## Separate section',
      'Traceability: SRS-NOT-OWNED-01.',
      '### PRD-BODY-03: heading definition',
      '#### Supporting details',
      'Traceability: SRS-BODY-03.',
      '### Unrelated sibling',
      'Traceability: SRS-NOT-OWNED-02.',
    ].join('\n'),
    'PRD-',
  );
  assert.match(definitions.get('PRD-BODY-01').body, /SRS-BODY-01/);
  assert.doesNotMatch(definitions.get('PRD-BODY-01').body, /SRS-BODY-02/);
  assert.equal(definitions.get('PRD-BODY-01').endLine, 2);
  assert.doesNotMatch(definitions.get('PRD-BODY-02').body, /NOT-OWNED/);
  assert.match(definitions.get('PRD-BODY-03').body, /SRS-BODY-03/);
  assert.doesNotMatch(definitions.get('PRD-BODY-03').body, /NOT-OWNED/);
  const wbs = parseWbs(
    '### Phase 10: phase\n#### WBS-BODY-01: first\nTraceability: ATP-BODY-01.\n#### WBS-BODY-02: second\nTraceability: ATP-BODY-02.\n## Global\nTraceability: ATP-NOT-OWNED-01.',
  );
  assert.match(wbs.tasks[0].body, /ATP-BODY-01/);
  assert.doesNotMatch(wbs.tasks[0].body, /ATP-BODY-02/);
  assert.equal(wbs.tasks[0].endLine, 3);
  assert.doesNotMatch(wbs.tasks[1].body, /NOT-OWNED/);
  const mixed = parseDefinitions(
    '- **PRD-MIXED-01**: first\nTraceability: SRS-MIXED-01\n- **SRS-MIXED-01**: distinct definition\nTraceability: WBS-NOT-OWNED-01',
    'PRD-',
  );
  assert.doesNotMatch(mixed.get('PRD-MIXED-01').body, /WBS-NOT-OWNED/);
});

test('leading definitions preserve plain, code, and bold delimiters with long titles', () => {
  for (const label of [
    'PRD-FORMAT-01',
    '`PRD-FORMAT-01`',
    '**PRD-FORMAT-01**',
    '**`PRD-FORMAT-01`**',
  ]) {
    const definitions = parseDefinitions(`### ${label}: ${'A'.repeat(10000)}`, 'PRD-');
    assert.deepEqual([...definitions.keys()], ['PRD-FORMAT-01']);
  }
  assert.equal(parseDefinitions('### **PRD-FORMAT-01: unclosed bold', 'PRD-').size, 0);
  assert.equal(parseDefinitions('### `PRD-FORMAT-01: unclosed code', 'PRD-').size, 0);
  const wbs = parseWbs(
    '### Phase 10:   Trimmed phase   \n#### WBS-FORMAT-01: task\nDependencies:   none.',
  );
  assert.equal(wbs.phases[0].title, 'Trimmed phase');
  assert.equal(wbs.tasks[0].dependency, 'none.');
});

test('same-line multiple bold definitions or explicit heading definitions are rejected', () => {
  assert.throws(
    () => parseDefinitions('- **PRD-A-01**: first; **PRD-A-02**: second', 'PRD-'),
    /Multiple PRD-/,
  );
  assert.throws(() => parseAtpIds('### ATP-A-01: first; ATP-A-02: second'), /Multiple ATP-/);
});

test('ATP definitions reject duplicate catalogue rows and ambiguous multi-ID cells', () => {
  assert.throws(
    () => parseAtpIds(`${files['test-plan.md']}| \`ATP-DEMO-01\` | duplicate |\n`),
    /Duplicate ATP-DEMO-01/,
  );
  assert.throws(
    () =>
      parseAtpIds(files['test-plan.md'].replace('`ATP-DEMO-01`', '`ATP-DEMO-01`, `ATP-DEMO-02`')),
    /Multiple ATP IDs/,
  );
  assert.throws(
    () => parseAtpIds(`${files['test-plan.md']}\n### ATP-DEMO-01: duplicate heading`),
    /Duplicate ATP-DEMO-01/,
  );
});

test('ATP catalogue role headers define scenarios but coverage and evidence tables do not', () => {
  const markdown = [
    '## Coverage',
    '| ATP ID | Evidence |',
    '| --- | --- |',
    '| `ATP-REF-01` | reference only |',
    '## Acceptance Scenarios',
    '- **ATP-BULLET-01**: explicit scenario',
    '### ATP-HEADING-01: Explicit scenario',
    'Setup: fixture',
    '## Evidence',
    '- **ATP-REF-02**: evidence reference',
    '### CI evidence for ATP-REF-03',
    '| ATP ID | Scenario |',
    '| --- | --- |',
    '| ATP-REF-04 | rollout reference only |',
    '',
    '| ATP ID | Procedure |',
    '| --- | --- |',
    '| ATP-REF-05 | evidence procedure only |',
    '## Acceptance Scenario Catalogue',
    '| Primary traceability | Scenario and minimum proof | ATP ID |',
    '| --- | --- | --- |',
    '| WBS-REAL-01 | legacy definition | `ATP-CATALOGUE-01` |',
    '',
    '| ATP ID | Acceptance Procedure |',
    '| --- | --- |',
    '| ATP-CATALOGUE-02 | acceptance steps |',
  ].join('\n');
  assert.deepEqual(
    [...parseAtpIds(markdown)],
    ['ATP-BULLET-01', 'ATP-HEADING-01', 'ATP-CATALOGUE-01', 'ATP-CATALOGUE-02'],
  );
});

test('repository ATP catalogues remain compatible with strict definitions', async () => {
  const root = resolve(import.meta.dirname, '../../..');
  const suiteEntries = await readdir(resolve(root, 'repo-specs'), { withFileTypes: true });
  const suiteNames = suiteEntries
    .filter(entry => entry.isDirectory() && !entry.name.startsWith('.'))
    .map(entry => entry.name)
    .sort();
  assert.ok(suiteNames.length > 0, 'repo-specs must contain at least one suite directory');
  for (const suiteName of suiteNames) {
    const testPlan = await readFile(resolve(root, 'repo-specs', suiteName, 'test-plan.md'), 'utf8');
    const atpIds = parseAtpIds(testPlan);
    assert.ok(atpIds.size > 0, `${suiteName}/test-plan.md must define formal ATP scenarios`);
  }
});

test('progress rejects duplicate rows and multiple IDs in one row with source locations', () => {
  assert.throws(
    () =>
      parseProgress(`${files['progress.md']}| \`WBS-10-01\` | verified |\n`, {
        file: 'progress.md',
      }),
    /Duplicate WBS-10-01.*progress.md:/,
  );
  assert.throws(
    () => parseProgress(files['progress.md'].replace('`WBS-10-01`', '`WBS-10-01`, `WBS-20-01`')),
    /Multiple WBS IDs/,
  );
  const progress = parseProgress(files['progress.md'], { file: 'progress.md' });
  assert.deepEqual(progress.locations.get('WBS-10-01'), { file: 'progress.md', line: 7 });
  assert.deepEqual(progress.reviewedLocation, { file: 'progress.md', line: 3 });
});

test('WBS rejects duplicate and multi-ID headings rather than merging tasks', () => {
  assert.throws(
    () => parseWbs(`${files['pdp-wbs.md']}\n#### WBS-20-01: duplicate`),
    /Duplicate WBS-20-01/,
  );
  assert.throws(
    () => parseWbs('### Phase 10: phase\n#### WBS-A-01 and WBS-A-02: both'),
    /Multiple WBS IDs/,
  );
  assert.throws(
    () => parseWbs('### Phase 10: phase\n#### WBS-A-01: first; WBS-A-02: second'),
    /Multiple WBS IDs/,
  );
});

test('phase defaults are only read before the first task and task sections stop before global matrices', () => {
  const parsed = parseWbs(
    [
      '### Phase 10: phase',
      '#### WBS-A-01: first',
      'Dependency: none.',
      '#### WBS-A-02: second',
      'Dependency: WBS-A-01.',
      '#### WBS-A-03: third',
      '## Traceability Matrix',
      '| WBS-A-03 | ATP-NOT-OWNED-01 |',
      'Dependencies: WBS-UNKNOWN-01.',
    ].join('\n'),
  );
  assert.equal(parsed.phases[0].dependency, 'none');
  assert.deepEqual(
    parsed.tasks.map(task => task.dependencyIds),
    [[], ['WBS-A-01'], []],
  );
  assert.deepEqual(parsed.tasks[2].atps, []);
});

function dependencyFixture(dependency, extra = '') {
  return [
    '### Phase 10: first',
    'Dependency: none.',
    '#### WBS-10-01: first',
    '#### WBS-10-02: second',
    '### Phase 20: middle',
    'Dependencies: none.',
    '#### WBS-20-01: middle',
    '### Phase 30: last',
    'Dependencies: none.',
    '#### WBS-30-01: last',
    '### Phase 40: consumer',
    `Dependencies: ${dependency}`,
    '#### WBS-40-01: consumer',
    extra,
  ].join('\n');
}

test('dependency expansion includes exact IDs, all wildcard matches, and range middle tasks', () => {
  const exact = parseWbs(dependencyFixture('`WBS-10-01`, `WBS-30-01`.'));
  assert.deepEqual(exact.tasks.at(-1).dependencyIds, ['WBS-10-01', 'WBS-30-01']);
  const wildcard = parseWbs(dependencyFixture('`WBS-10-*`.'));
  assert.deepEqual(wildcard.tasks.at(-1).dependencyIds, ['WBS-10-01', 'WBS-10-02']);
  const range = parseWbs(dependencyFixture('`WBS-10-*` through `WBS-30-*`.'));
  assert.deepEqual(range.tasks.at(-1).dependencyIds, [
    'WBS-10-01',
    'WBS-10-02',
    'WBS-20-01',
    'WBS-30-01',
  ]);
  assert.equal(range.expandedEdges.get('WBS-40-01'), range.tasks.at(-1).dependencyIds);
  const dash = parseWbs(dependencyFixture('`WBS-10-02`–`WBS-30-01`.'));
  assert.deepEqual(dash.tasks.at(-1).dependencyIds, ['WBS-10-02', 'WBS-20-01', 'WBS-30-01']);
});

test('dependency parsing rejects unknown, malformed, reversed, and gate-only dependencies', () => {
  for (const dependency of [
    'WBS-UNKNOWN-01.',
    'WBS-UNKNOWN-*.',
    'WBS-10-01-:',
    'WBS-10-01**',
    'WBS-10-01 to',
    'WBS-10-01 through',
    'WBS-10-01 through WBS-<phase>-01',
    'WBS-30-01 through WBS-10-01',
    'approved scope only',
    '',
  ]) {
    assert.throws(
      () => parseWbs(dependencyFixture(dependency)),
      /unknown|unparseable/i,
      dependency,
    );
  }
});

test('self dependencies and cycles are rejected after wildcard and range expansion', () => {
  assert.throws(() => parseWbs(dependencyFixture('WBS-40-*')), /self dependency/);
  assert.throws(
    () => parseWbs(dependencyFixture('WBS-10-01 through WBS-40-01')),
    /self dependency/,
  );
  assert.throws(
    () =>
      parseWbs(
        dependencyFixture('WBS-20-01 through WBS-30-01').replace(
          '#### WBS-20-01: middle',
          '#### WBS-20-01: middle\nDependency: WBS-40-01.',
        ),
      ),
    /dependency cycle/,
  );
});

test('descriptive dependency gates survive parsing without becoming execution approval', () => {
  const parsed = parseWbs(
    dependencyFixture(
      '`WBS-10-01` and retained CI evidence. Each source slice additionally requires review.',
    ),
  );
  assert.deepEqual(parsed.tasks.at(-1).dependencyIds, ['WBS-10-01']);
  assert.match(parsed.tasks.at(-1).dependencyGate, /retained CI evidence.*requires review/);
});

test('candidate selection uses the expanded range graph including unverified middle tasks', () => {
  const wbs = dependencyFixture('WBS-10-01 through WBS-30-01.');
  const progress = [
    '| WBS ID | Status |',
    '| --- | --- |',
    '| WBS-10-01 | verified |',
    '| WBS-10-02 | verified |',
    '| WBS-20-01 | blocked |',
    '| WBS-30-01 | verified |',
    '| WBS-40-01 | not-started |',
  ].join('\n');
  const model = createChartModel({ readme: files['README.md'], wbs, progress, testPlan: '' });
  const gantt = renderGantt(model, 'Demo');
  assert.match(gantt, /No dependency-ready WBS candidate is recorded/);
  assert.doesNotMatch(gantt, /class="caption" x="96" y="195">WBS-40-01/);
  const ready = createChartModel({
    readme: files['README.md'],
    wbs,
    progress: progress.replace('blocked', 'verified'),
    testPlan: '',
  });
  assert.match(renderGantt(ready, 'Demo'), /class="caption" x="96" y="195">WBS-40-01: consumer/);
});

test('fenced examples and comments are ignored in WBS, ATP, and progress authority', () => {
  const examples =
    '\n```markdown\n### Phase 90: Fake\n#### WBS-FAKE-01: example\nDependency: WBS-NOT-DEFINED-01\n### ATP-FAKE-01: example\n| WBS ID | Status |\n| --- | --- |\n| WBS-FAKE-01 | verified |\n```\n<!-- ### ATP-COMMENT-01: hidden -->\n';
  assert.equal(parseWbs(files['pdp-wbs.md'] + examples).tasks.length, 3);
  assert.equal(parseAtpIds(files['test-plan.md'] + examples).size, 1);
  assert.equal(parseProgress(files['progress.md'] + examples).rows.size, 3);
});

test('explicit WBS Status must agree with progress, without treating text as verified evidence', () => {
  const create = wbs =>
    createChartModel({
      readme: files['README.md'],
      wbs,
      progress: files['progress.md'],
      testPlan: files['test-plan.md'],
    });
  assert.throws(
    () =>
      create(
        files['pdp-wbs.md'].replace(
          '#### WBS-10-01: Freeze the baseline',
          '#### WBS-10-01: Freeze the baseline\nStatus: verified.',
        ),
      ),
    /explicit.*Status verified.*not-started/,
  );
  const model = create(
    files['pdp-wbs.md'].replace(
      '#### WBS-10-01: Freeze the baseline',
      '#### WBS-10-01: Freeze the baseline\nStatus: not-started.',
    ),
  );
  assert.equal(model.tasks[0].recordedStatus, 'not-started');
  assert.equal(model.verified, 0);
});

test('Chinese descriptions, tooltips, aria labels, and fallback copy contain no generated English', () => {
  const model = createChartModel({
    readme: '# 中文示例内部规划\n\n完整的中文规划记录。',
    wbs: '### Phase 10: 初始阶段\nDependency: none.\n#### WBS-ZH-01: 示例工作',
    progress: '| WBS ID | Status |\n| --- | --- |\n| WBS-ZH-01 | blocked |',
    testPlan: '',
  });
  const gantt = renderGantt(model, '中文示例');
  const burndown = renderBurndown(model, '中文示例');
  for (const svg of [gantt, burndown]) {
    assert.match(svg, /最后审查日期: 未记录/);
    assert.doesNotMatch(
      svg,
      /formal WBS tasks|Current derived|active WBS items|remaining|not recorded|dependencies:| of |Approved|executable|verified/,
    );
  }
  assert.match(gantt, /aria-label="WBS-ZH-01: 示例工作; 依赖: 无; 受阻"/);
  assert.match(gantt, /<title>WBS-ZH-01: 示例工作; 依赖: 无; 受阻<\/title>/);
  assert.match(gantt, /没有已记录的依赖就绪 WBS 候选项/);
  assert.match(burndown, /aria-label="阶段 10：0 \/ 1 项已核验"/);
  assert.match(gantt, /依赖就绪不代表实施批准/);
  assert.match(burndown, /已记录 WBS 范围/);
});

test('burndown grows for eight phases and keeps phase rows clear of the footer', () => {
  const wbs = Array.from(
    { length: 8 },
    (_, index) =>
      `### Phase ${index + 1}: 阶段说明\nDependency: none.\n#### WBS-P-${index + 1}: 工作项`,
  ).join('\n');
  const progressRows = Array.from(
    { length: 8 },
    (_, index) => `| WBS-P-${index + 1} | not-started |`,
  ).join('\n');
  const progress = `| WBS ID | Status |\n| --- | --- |\n${progressRows}`;
  const model = createChartModel({
    readme: '# 中文规划\n完整中文记录。',
    wbs,
    progress,
    testPlan: '',
  });
  const svg = renderBurndown(model, '示例');
  const phaseY = Array.from(svg.matchAll(/<text class="task" x="96" y="(\d+)">阶段/g), match =>
    Number(match[1]),
  );
  assert.equal(phaseY.length, 8);
  const footerY = Number(svg.match(/<line class="grid" x1="72" y1="(\d+)" x2="1500"/)[1]);
  const height = Number(svg.match(/width="1600" height="(\d+)"/)[1]);
  assert.ok(footerY > Math.max(...phaseY) + 30);
  assert.ok(height > footerY + 48);
  assert.ok(phaseY[0] > 800 + 20);
});

test('long status labels and burndown explanations wrap within their existing columns', () => {
  const model = createChartModel({
    readme: files['README.md'],
    wbs: files['pdp-wbs.md'],
    progress: files['progress.md'].replace('`in-progress`', '`implementation-complete`'),
    testPlan: files['test-plan.md'],
  });
  const gantt = renderGantt(model, 'Demo');
  assert.match(
    gantt,
    /<text class="small" x="917" y="\d+"><tspan x="917" dy="0">[^<]*<\/tspan><tspan x="917" dy="12">[^<]*<\/tspan>/,
  );
  assert.doesNotMatch(gantt, /<text class="small" x="917" y="\d+">Implementation complete/);
  const burndown = renderBurndown(model, 'Demo');
  assert.match(
    burndown,
    /<text class="caption" x="1070" y="\d+"><tspan x="1070" dy="0">Relative positions/,
  );
  const explanationLines = Array.from(
    burndown.matchAll(/<tspan x="1070" dy="(?:0|18)">([^<]*)<\/tspan>/g),
    match => match[1],
  );
  assert.ok(explanationLines.length >= 2);
  assert.doesNotMatch(
    burndown,
    /<text class="caption" x="1070" y="\d+">Relative positions and overlap/,
  );
  assert.ok(explanationLines.every(line => line.length < 95));
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
  await assert.rejects(
    () => generateCharts(directory, { check: true }),
    /implementation-gantt\.svg/,
  );
  const second = await generateCharts(directory);
  assert.equal(
    second.artifacts.get('implementation-gantt.svg'),
    first.artifacts.get('implementation-gantt.svg'),
  );
});
