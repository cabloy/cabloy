import assert from 'node:assert/strict';
import { spawnSync } from 'node:child_process';
import { mkdir, mkdtemp, readFile, readdir, rm, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { dirname, resolve } from 'node:path';
import { test } from 'node:test';
import { fileURLToPath } from 'node:url';

import { auditPlanning } from '../tools/spec-audit/audit.mjs';

const CLI = fileURLToPath(new URL('../tools/spec-audit/audit.mjs', import.meta.url));
const BASELINE = {
  'README.md': '# Synthetic Planning\n\n[Product](./prd.md#requirements)\n',
  'prd.md':
    '# Product\n\n## Requirements\n\n### PRD-DEMO-01: Product outcome\n\nTraceability: `SRS-DEMO-01`\n',
  'srs.md':
    '# Technical Contracts\n\n### SRS-DEMO-01: Contract\n\nTraceability: `PRD-DEMO-01`, `WBS-DEMO-10-01`\n',
  'pdp-wbs.md':
    '# Delivery\n\n### Phase 10: Baseline\n\nDependencies: none.\n\n#### WBS-DEMO-10-01: Implement contract\n\nTraceability: `SRS-DEMO-01`, `ATP-DEMO-01`\n\nCompletion checks: inspect synthetic output.\n',
  'test-plan.md':
    '# Acceptance\n\n## Acceptance Scenarios\n\n### ATP-DEMO-01: Verify contract\n\nSetup: synthetic state.\n\nProcedure: inspect output.\n\nExpected result: contract holds.\n\nMinimum proof: redacted observation.\n\nTraceability: `WBS-DEMO-10-01`\n',
  'progress.md':
    '# Progress\n\n| WBS ID | Work item | Status |\n| --- | --- | --- |\n| WBS-DEMO-10-01 | Implement contract | not-started |\n',
  'decisions/0001-boundary.md': '# Boundary\n\nStatus: Proposed\n',
};

async function fixture(t, records = BASELINE) {
  const directory = await mkdtemp(resolve(tmpdir(), 'cabloy-spec-audit-'));
  t.after(() => rm(directory, { recursive: true, force: true }));
  for (const [file, markdown] of Object.entries(records)) {
    await mkdir(dirname(resolve(directory, file)), { recursive: true });
    await writeFile(resolve(directory, file), markdown);
  }
  return directory;
}

async function snapshot(directory, prefix = '') {
  const result = {};
  for (const entry of await readdir(resolve(directory, prefix), { withFileTypes: true })) {
    const file = prefix ? `${prefix}/${entry.name}` : entry.name;
    if (entry.isDirectory()) Object.assign(result, await snapshot(directory, file));
    else result[file] = await readFile(resolve(directory, file), 'utf8');
  }
  return result;
}

function codes(result) {
  return result.diagnostics.map(diagnostic => diagnostic.code);
}

test('complete baseline checks exact traceability without treating a Proposed ADR as accepted', async t => {
  const directory = await fixture(t);
  const result = await auditPlanning(directory);
  assert.deepEqual(result.diagnostics, []);
  assert.equal(result.definitions, 4);
  assert.equal(result.ok, true);
  assert.match(result.limitations, /approval.*evidence authenticity/);
});

test('canonical atomic bullets carry their own inline traceability', async t => {
  const records = {
    ...BASELINE,
    'prd.md':
      '# Product\n\n## Requirements\n\n- **PRD-DEMO-01**: Product outcome. Traceability: `SRS-DEMO-01`.\n',
    'srs.md':
      '# Technical Contracts\n\n- **SRS-DEMO-01**: Contract. Traceability: `PRD-DEMO-01`, `WBS-DEMO-10-01`.\n',
  };
  const result = await auditPlanning(await fixture(t, records));
  assert.equal(result.ok, true, JSON.stringify(result.diagnostics));
});

test('explicit four-column matrix supplies exact adjacent traceability', async t => {
  const records = Object.fromEntries(
    Object.entries(BASELINE).map(([file, value]) => [
      file,
      value.replace(/^Traceability:.*\n/gm, ''),
    ]),
  );
  records['README.md'] +=
    '\n| PRD | SRS | WBS | ATP |\n| --- | --- | --- | --- |\n| PRD-DEMO-01 | SRS-DEMO-01 | WBS-DEMO-10-01 | ATP-DEMO-01 |\n';
  const result = await auditPlanning(await fixture(t, records));
  assert.equal(result.ok, true, JSON.stringify(result.diagnostics));
});

test('ordinary co-occurrence and wildcard matrices cannot manufacture traceability', async t => {
  const records = Object.fromEntries(
    Object.entries(BASELINE).map(([file, value]) => [
      file,
      value.replace(/^Traceability:.*\n/gm, ''),
    ]),
  );
  records['README.md'] +=
    '\nPRD-DEMO-01 SRS-DEMO-01 WBS-DEMO-10-01 ATP-DEMO-01\n\n| PRD | SRS | WBS | ATP |\n| --- | --- | --- | --- |\n| PRD-DEMO-* | SRS-DEMO-* | WBS-DEMO-* | ATP-DEMO-* |\n';
  const result = await auditPlanning(await fixture(t, records));
  assert.equal(result.ok, false);
  assert.equal(
    result.diagnostics.filter(diagnostic => diagnostic.code.startsWith('traceability-')).length,
    6,
  );
});

test('lightweight records do not require absent baseline files or charts', async t => {
  const directory = await fixture(t, {
    'README.md': '# Lightweight\n',
    'prd.md': '### PRD-DEMO-01: Bounded outcome\n',
  });
  const before = await snapshot(directory);
  const result = await auditPlanning(directory, { lightweight: true });
  assert.equal(result.ok, true);
  assert.equal(result.mode, 'lightweight');
  assert.match(result.coverage, /full-chain coverage not checked/);
  assert.deepEqual(result.omittedRecords, ['srs.md', 'pdp-wbs.md', 'test-plan.md', 'progress.md']);
  assert.deepEqual(await snapshot(directory), before);
  const complete = await auditPlanning(directory);
  assert.ok(codes(complete).includes('missing-record'));
  assert.ok(codes(complete).includes('missing-adr'));
});

test('optional records are audited; fences, comments and evidence files are not authority', async t => {
  const records = {
    ...BASELINE,
    'rollout.md':
      '# Rollout\n\nUse `ATP-MISSING-01`.\n\n```md\n### ATP-EXAMPLE-01: Example\n```\n<!-- PRD-COMMENT-01 -->\n',
    'evidence/run.md': 'PRD-EVIDENCE-01\n',
  };
  const result = await auditPlanning(await fixture(t, records));
  assert.deepEqual(
    result.diagnostics
      .filter(diagnostic => diagnostic.code === 'undefined-reference')
      .map(diagnostic => [diagnostic.file, diagnostic.line, diagnostic.id]),
    [['rollout.md', 3, 'ATP-MISSING-01']],
  );
});

test('a mention or evidence table is not a formal ATP declaration', async t => {
  const records = {
    ...BASELINE,
    'test-plan.md':
      '# Proof\n\n| ATP ID | Evidence | Status |\n| --- | --- | --- |\n| ATP-DEMO-01 | synthetic | verified |\n',
  };
  const result = await auditPlanning(await fixture(t, records));
  assert.ok(codes(result).includes('missing-definition'));
  assert.ok(
    result.diagnostics.some(
      diagnostic => diagnostic.id === 'ATP-DEMO-01' && diagnostic.code === 'undefined-reference',
    ),
  );
});

test('duplicate formal definitions and duplicate progress rows retain diagnostic provenance', async t => {
  const records = {
    ...BASELINE,
    'prd.md': `${BASELINE['prd.md']}\n### PRD-DEMO-01: Duplicate\n`,
    'progress.md': `${BASELINE['progress.md']}| WBS-DEMO-10-01 | Duplicate | verified |\n`,
  };
  const result = await auditPlanning(await fixture(t, records));
  assert.ok(
    result.diagnostics.some(
      diagnostic => diagnostic.file === 'prd.md' && /Duplicate.*line/.test(diagnostic.message),
    ),
  );
  assert.ok(
    result.diagnostics.some(
      diagnostic => diagnostic.file === 'progress.md' && /Duplicate.*line/.test(diagnostic.message),
    ),
  );
});

test('progress omissions, extras and explicit WBS status conflicts are structural failures', async t => {
  const records = {
    ...BASELINE,
    'pdp-wbs.md': `${BASELINE['pdp-wbs.md']}\nStatus: in-progress\n\n#### WBS-DEMO-10-02: Additional task\n\nDependencies: none.\n`,
    'progress.md': `${BASELINE['progress.md']}| WBS-DEMO-99-01 | Unknown | not-started |\n`,
  };
  const result = await auditPlanning(await fixture(t, records));
  for (const code of ['missing-progress', 'unknown-progress', 'status-conflict'])
    assert.ok(codes(result).includes(code), code);
});

test('completed tasks cannot hide unfinished recorded prerequisites', async t => {
  const records = {
    ...BASELINE,
    'pdp-wbs.md': `${BASELINE['pdp-wbs.md']}\n#### WBS-DEMO-10-02: Dependent task\n\nDependencies: WBS-DEMO-10-01.\n`,
    'progress.md': `${BASELINE['progress.md']}| WBS-DEMO-10-02 | Dependent | verified |\n`,
  };
  const result = await auditPlanning(await fixture(t, records), { lightweight: true });
  assert.ok(
    result.diagnostics.some(
      diagnostic => diagnostic.id === 'WBS-DEMO-10-02' && diagnostic.code === 'dependency-state',
    ),
  );
});

test('local Markdown destinations, fragments and reference links are checked', async t => {
  const records = {
    ...BASELINE,
    'rollout.md':
      '# Rollout\n\n[Missing](./absent.md)\n[Bad fragment](./prd.md#absent)\n[Good][product]\n[Unknown][missing]\n\n[product]: ./prd.md#requirements\n\nPlanned source: `zova/src/target/new.ts`.\n',
  };
  const result = await auditPlanning(await fixture(t, records));
  assert.deepEqual(
    result.diagnostics.map(diagnostic => [diagnostic.code, diagnostic.line]),
    [
      ['link-target', 3],
      ['link-fragment', 4],
      ['link-reference', 6],
    ],
  );
});

test('link destinations are not authority references but labels and prose remain audited', async t => {
  const records = {
    ...BASELINE,
    'rollout.md':
      '# Rollout\n\n[WBS-MISSING-01](./evidence/WBS-DEMO-10-01-current-source.md) and `ATP-MISSING-01`.\n\n![SRS-MISSING-01](<./evidence/WBS-DEMO-10-01-image.md>)\n\n[WBS-DEMO-10-01][proof]\n\n[proof]: ./evidence/WBS-DEMO-10-01-referenced.md\n',
    'evidence/WBS-DEMO-10-01-current-source.md': '# Current source\n',
    'evidence/WBS-DEMO-10-01-image.md': '# Image\n',
    'evidence/WBS-DEMO-10-01-referenced.md': '# Referenced\n',
  };
  const result = await auditPlanning(await fixture(t, records));
  assert.deepEqual(
    result.diagnostics.map(diagnostic => [
      diagnostic.code,
      diagnostic.file,
      diagnostic.line,
      diagnostic.id,
    ]),
    [
      ['undefined-reference', 'rollout.md', 3, 'ATP-MISSING-01'],
      ['undefined-reference', 'rollout.md', 3, 'WBS-MISSING-01'],
      ['undefined-reference', 'rollout.md', 5, 'SRS-MISSING-01'],
    ],
  );
});

test('destination masking preserves local link and reference diagnostics', async t => {
  const records = {
    ...BASELINE,
    'rollout.md':
      '# Rollout\n\n[Missing](./evidence/WBS-DEMO-10-01-missing.md)\n[Bad fragment](./evidence/WBS-DEMO-10-01-existing.md#absent)\n[Good fragment](./evidence/WBS-DEMO-10-01-existing.md#present)\n[Bad encoding](./evidence/WBS-DEMO-10-01-%ZZ.md)\n[Undefined][missing]\n\n[unused]: <./evidence/WBS-DEMO-10-01-unused.md>\n',
    'evidence/WBS-DEMO-10-01-existing.md': '# Present\n',
  };
  const result = await auditPlanning(await fixture(t, records));
  assert.deepEqual(
    result.diagnostics.map(diagnostic => [diagnostic.code, diagnostic.line]),
    [
      ['link-target', 3],
      ['link-fragment', 4],
      ['link-format', 6],
      ['link-reference', 7],
    ],
  );
});

test('exact range endpoints do not masquerade as exact traceability', async t => {
  const records = {
    ...BASELINE,
    'prd.md': BASELINE['prd.md'].replace('`SRS-DEMO-01`', '`SRS-DEMO-01` through `SRS-DEMO-01`'),
  };
  // Remove the reverse PRD mapping so the ambiguous range is the sole proposed edge.
  records['srs.md'] = records['srs.md'].replace('`PRD-DEMO-01`, ', '');
  const result = await auditPlanning(await fixture(t, records));
  assert.ok(
    result.diagnostics.some(
      diagnostic => diagnostic.code === 'traceability-outgoing' && diagnostic.id === 'PRD-DEMO-01',
    ),
  );
});

test('definition body boundaries prevent another requirement from supplying an earlier mapping', async t => {
  const records = {
    ...BASELINE,
    'prd.md':
      '# Product\n\n## Requirements\n\n### PRD-DEMO-02: Unmapped\n\n### PRD-DEMO-01: Mapped\n\nTraceability: `SRS-DEMO-01`\n',
  };
  const result = await auditPlanning(await fixture(t, records));
  assert.ok(
    result.diagnostics.some(
      diagnostic => diagnostic.id === 'PRD-DEMO-02' && diagnostic.code === 'traceability-outgoing',
    ),
  );
  assert.ok(!result.diagnostics.some(diagnostic => diagnostic.id === 'PRD-DEMO-01'));
});

test('CLI emits deterministic JSON, exits nonzero on gaps and never writes planning files', async t => {
  const directory = await fixture(t, { 'README.md': '# Bounded\n\nATP-MISSING-01\n' });
  const before = await snapshot(directory);
  const args = [CLI, directory, '--lightweight', '--format', 'json'];
  const first = spawnSync(process.execPath, args, { encoding: 'utf8' });
  const second = spawnSync(process.execPath, args, { encoding: 'utf8' });
  assert.equal(first.status, 1);
  assert.equal(first.stdout, second.stdout);
  const result = JSON.parse(first.stdout);
  assert.equal(result.diagnostics[0].id, 'ATP-MISSING-01');
  assert.deepEqual(await snapshot(directory), before);
  const invalid = spawnSync(process.execPath, [CLI, '--fix'], { encoding: 'utf8' });
  assert.equal(invalid.status, 1);
  assert.match(invalid.stderr, /Unknown argument/);
});
