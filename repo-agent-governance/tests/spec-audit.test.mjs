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

const PLANNING_GATE = {
  ...BASELINE,
  'srs.md': BASELINE['srs.md'].replace(', `WBS-DEMO-10-01`', ''),
  'test-plan.md': BASELINE['test-plan.md'].replace('Traceability: `WBS-DEMO-10-01`', ''),
  'pdp-wbs.md':
    '# Delivery\n\n### Phase 10: Baseline\n\nDependencies: none.\n\n#### WBS-DEMO-10-01: Review planning baseline\n\nTraceability mode: planning-baseline-review\n\nReview authority: [ADR](./decisions/0001-boundary.md).\n\nTasks:\n\n- Reconcile the whole requirements, contracts, work and acceptance catalogue.\n\nAcceptance checks:\n\n- Confirm the boundary ADR was accepted by its decision owner.\n',
  'decisions/0001-boundary.md':
    '# Boundary\n\n## Status\n\nAccepted.\n\n## Decision\n\nAccept the planning boundary.\n',
};

test('explicit planning-baseline gate omits only its WBS adjacency checks', async t => {
  const result = await auditPlanning(await fixture(t, PLANNING_GATE));
  assert.deepEqual(
    result.diagnostics.map(diagnostic => [diagnostic.id, diagnostic.code]),
    [
      ['SRS-DEMO-01', 'traceability-outgoing'],
      ['ATP-DEMO-01', 'traceability-incoming'],
    ],
  );
  assert.equal(result.ok, false);
});

test('a planning gate coexists with a fully connected product chain', async t => {
  const records = {
    ...BASELINE,
    'pdp-wbs.md': `${PLANNING_GATE['pdp-wbs.md']}\n#### WBS-DEMO-10-02: Implement contract\n\nTraceability: \`SRS-DEMO-01\`, \`ATP-DEMO-01\`.\n`,
    'srs.md': BASELINE['srs.md'].replace('WBS-DEMO-10-01', 'WBS-DEMO-10-02'),
    'test-plan.md': BASELINE['test-plan.md'].replace('WBS-DEMO-10-01', 'WBS-DEMO-10-02'),
    'progress.md': `${BASELINE['progress.md']}| WBS-DEMO-10-02 | Implement contract | not-started |\n`,
    'decisions/0001-boundary.md': PLANNING_GATE['decisions/0001-boundary.md'],
  };
  const result = await auditPlanning(await fixture(t, records));
  assert.deepEqual(result.diagnostics, []);
  assert.equal(result.ok, true);
});

test('planning closure and baseline traceability classification remain independent', async t => {
  const records = {
    ...BASELINE,
    'pdp-wbs.md': `${PLANNING_GATE['pdp-wbs.md']}\n#### WBS-DEMO-10-02: Implement contract\n\nTraceability: \`SRS-DEMO-01\`, \`ATP-DEMO-01\`.\n`,
    'srs.md': BASELINE['srs.md'].replace('WBS-DEMO-10-01', 'WBS-DEMO-10-02'),
    'test-plan.md': BASELINE['test-plan.md'].replace('WBS-DEMO-10-01', 'WBS-DEMO-10-02'),
    'progress.md': `${BASELINE['progress.md'].replace('not-started |', 'planning-complete |')}| WBS-DEMO-10-02 | Implement contract | not-started |\n`,
    'decisions/0001-boundary.md': PLANNING_GATE['decisions/0001-boundary.md'],
  };
  const missingMode = await auditPlanning(await fixture(t, records));
  assert.deepEqual(codes(missingMode), ['completion-mode']);
  const withMode = {
    ...records,
    'pdp-wbs.md': records['pdp-wbs.md'].replace(
      'Traceability mode: planning-baseline-review',
      'Traceability mode: planning-baseline-review\n\nCompletion mode: planning-only.',
    ),
  };
  const eligible = await auditPlanning(await fixture(t, withMode));
  assert.equal(eligible.ok, true, JSON.stringify(eligible.diagnostics));
  const invalidGate = await auditPlanning(
    await fixture(t, {
      ...withMode,
      'pdp-wbs.md': withMode['pdp-wbs.md'].replace(
        'Traceability mode: planning-baseline-review',
        'Traceability mode: unknown',
      ),
    }),
  );
  assert.ok(codes(invalidGate).includes('traceability-mode'));
  assert.ok(!codes(invalidGate).includes('completion-mode'));
});

test('planning review accepts existing and legacy accepted ADR status formats', async t => {
  for (const status of [
    '## Status\n\nAccepted.\n',
    '## Status\n\nAccepted\n',
    '- **Status:** Accepted\n',
  ]) {
    await t.test(status.trim().replace(/\n/g, ' '), async subtest => {
      const records = {
        ...PLANNING_GATE,
        'decisions/0001-boundary.md': `# Boundary\n\n${status}`,
      };
      const result = await auditPlanning(await fixture(subtest, records));
      assert.ok(!codes(result).includes('traceability-mode'), JSON.stringify(result.diagnostics));
    });
  }
});

test('baseline review prose may refer to the work catalogue without doing delivery work', async t => {
  const records = {
    ...PLANNING_GATE,
    'pdp-wbs.md': PLANNING_GATE['pdp-wbs.md'].replace(
      '- Reconcile the whole requirements, contracts, work and acceptance catalogue.',
      '- Review the implementation plan, build risks and migration strategy as planning inputs.',
    ),
  };
  const result = await auditPlanning(await fixture(t, records));
  assert.ok(!codes(result).includes('traceability-mode'), JSON.stringify(result.diagnostics));
});

test('baseline classification must be declared inside a bounded Phase 10 WBS task', async t => {
  const cases = [
    [
      'unknown',
      { 'pdp-wbs.md': PLANNING_GATE['pdp-wbs.md'].replace('planning-baseline-review', 'skip') },
    ],
    [
      'duplicate',
      {
        'pdp-wbs.md': PLANNING_GATE['pdp-wbs.md'].replace(
          'Tasks:',
          'Traceability mode: planning-baseline-review\n\nTasks:',
        ),
      },
    ],
    ['wrong phase', { 'pdp-wbs.md': PLANNING_GATE['pdp-wbs.md'].replace('Phase 10', 'Phase 20') }],
    ['no tasks', { 'pdp-wbs.md': PLANNING_GATE['pdp-wbs.md'].replace('Tasks:', 'Work:') }],
    [
      'no checks',
      { 'pdp-wbs.md': PLANNING_GATE['pdp-wbs.md'].replace('Acceptance checks:', 'Proof:') },
    ],
    [
      'mixed scope',
      {
        'pdp-wbs.md': `${PLANNING_GATE['pdp-wbs.md']}\n- Implement SRS-DEMO-01 through ATP-DEMO-01.\n`,
      },
    ],
    [
      'no authority',
      { 'pdp-wbs.md': PLANNING_GATE['pdp-wbs.md'].replace('Review authority:', 'Reviewer:') },
    ],
    [
      'unaccepted authority',
      {
        'decisions/0001-boundary.md': PLANNING_GATE['decisions/0001-boundary.md'].replace(
          'Accepted.',
          'Proposed.',
        ),
      },
    ],
    [
      'implementation in title',
      {
        'pdp-wbs.md': PLANNING_GATE['pdp-wbs.md'].replace(
          'Review planning baseline',
          'Review baseline and implement SRS-DEMO-01',
        ),
      },
    ],
    [
      'release task',
      {
        'pdp-wbs.md': PLANNING_GATE['pdp-wbs.md'].replace(
          '- Reconcile the whole requirements, contracts, work and acceptance catalogue.',
          '- Review the baseline and release the feature.',
        ),
      },
    ],
    [
      'implementation task',
      {
        'pdp-wbs.md': PLANNING_GATE['pdp-wbs.md'].replace(
          '- Reconcile the whole requirements, contracts, work and acceptance catalogue.',
          '- Review the baseline and implement the feature.',
        ),
      },
    ],
    [
      'implementation acceptance check',
      {
        'pdp-wbs.md': PLANNING_GATE['pdp-wbs.md'].replace(
          '- Confirm the boundary ADR was accepted by its decision owner.',
          '- Confirm the boundary ADR was accepted and deploy the feature.',
        ),
      },
    ],
    ...['Build the checkout backend.', 'Create a service.', 'Run a migration.'].map(instruction => [
      instruction,
      {
        'pdp-wbs.md': PLANNING_GATE['pdp-wbs.md'].replace(
          '- Reconcile the whole requirements, contracts, work and acceptance catalogue.',
          `- ${instruction}`,
        ),
      },
    ]),
    [
      'unmapped contract in title',
      {
        'pdp-wbs.md': PLANNING_GATE['pdp-wbs.md'].replace(
          'Review planning baseline',
          'Review planning baseline for SRS-DEMO-01',
        ),
      },
    ],
    [
      'contradictory ADR statuses',
      {
        'decisions/0001-boundary.md': '## Status\n\nAccepted.\n\n- **Status:** Proposed\n',
      },
    ],
    [
      'ADR status inside unrelated section',
      {
        'decisions/0001-boundary.md': '# Boundary\n\n## Background\n\n- **Status:** Accepted\n',
      },
    ],
    ['mapped from SRS', { 'srs.md': BASELINE['srs.md'] }],
    ['mapped to ATP', { 'test-plan.md': BASELINE['test-plan.md'] }],
    [
      'misplaced',
      {
        'README.md': `${PLANNING_GATE['README.md']}\nTraceability mode: planning-baseline-review\n`,
      },
    ],
    [
      'competing exception',
      {
        'pdp-wbs.md': PLANNING_GATE['pdp-wbs.md'].replace(
          'Tasks:',
          'Traceability exception: authority-only — Review the whole baseline.\n\nTasks:',
        ),
      },
    ],
  ];
  for (const [name, changed] of cases) {
    await t.test(name, async subtest => {
      const result = await auditPlanning(await fixture(subtest, { ...PLANNING_GATE, ...changed }));
      assert.ok(codes(result).includes('traceability-mode'), JSON.stringify(result.diagnostics));
      if (name !== 'misplaced' && name !== 'mapped from SRS') {
        assert.ok(
          result.diagnostics.some(
            diagnostic =>
              diagnostic.id === 'WBS-DEMO-10-01' && diagnostic.code === 'traceability-incoming',
          ),
        );
      }
      if (name !== 'misplaced' && name !== 'mapped to ATP' && name !== 'competing exception') {
        assert.ok(
          result.diagnostics.some(
            diagnostic =>
              diagnostic.id === 'WBS-DEMO-10-01' && diagnostic.code === 'traceability-outgoing',
          ),
        );
      }
    });
  }
});

test('ordinary unmapped WBS retains its adjacency diagnostics beside a planning gate', async t => {
  const records = {
    ...PLANNING_GATE,
    'pdp-wbs.md': `${PLANNING_GATE['pdp-wbs.md']}\n#### WBS-DEMO-10-02: Implement item\n\nTasks:\n\n- Implement the item.\n`,
    'progress.md': `${PLANNING_GATE['progress.md']}| WBS-DEMO-10-02 | Implement item | not-started |\n`,
  };
  const result = await auditPlanning(await fixture(t, records));
  assert.deepEqual(
    result.diagnostics
      .filter(diagnostic => diagnostic.id === 'WBS-DEMO-10-02')
      .map(diagnostic => diagnostic.code),
    ['traceability-incoming', 'traceability-outgoing'],
  );
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

test('technical-only SRS exempts its PRD parent, not its WBS successor', async t => {
  const records = {
    ...BASELINE,
    'srs.md':
      '# Contracts\n\n- **SRS-DEMO-01**: Test hygiene. Traceability exception: technical-only — Repository fixture policy owns cleanup.\n\nTraceability: `WBS-DEMO-10-01`\n\n- **SRS-DEMO-02**: Product contract. Traceability: `PRD-DEMO-01`, `WBS-DEMO-10-01`.\n',
    'prd.md': BASELINE['prd.md'].replace('`SRS-DEMO-01`', '`SRS-DEMO-02`'),
  };
  const result = await auditPlanning(await fixture(t, records));
  assert.deepEqual(result.diagnostics, []);
  const withoutException = {
    ...records,
    'srs.md': records['srs.md'].replace(
      ' Traceability exception: technical-only — Repository fixture policy owns cleanup.',
      '',
    ),
  };
  const missingParent = await auditPlanning(await fixture(t, withoutException));
  assert.ok(
    missingParent.diagnostics.some(
      diagnostic => diagnostic.id === 'SRS-DEMO-01' && diagnostic.code === 'traceability-incoming',
    ),
  );
  const missingSuccessor = await auditPlanning(
    await fixture(t, {
      ...records,
      'srs.md': records['srs.md'].replace('Traceability: `WBS-DEMO-10-01`\n', ''),
      'pdp-wbs.md': records['pdp-wbs.md'].replace('`SRS-DEMO-01`, ', ''),
    }),
  );
  assert.ok(
    missingSuccessor.diagnostics.some(
      diagnostic => diagnostic.id === 'SRS-DEMO-01' && diagnostic.code === 'traceability-outgoing',
    ),
  );
});

test('authority-only WBS exempts its ATP successor, not its SRS parent', async t => {
  const records = {
    ...BASELINE,
    'pdp-wbs.md': `${BASELINE['pdp-wbs.md']}\n#### WBS-DEMO-10-02: Review baseline\n\nTraceability exception: authority-only — Retain the baseline review disposition.\n\nTraceability: \`SRS-DEMO-01\`.\n`,
    'progress.md': `${BASELINE['progress.md']}| WBS-DEMO-10-02 | Review | not-started |\n`,
  };
  const result = await auditPlanning(await fixture(t, records));
  assert.deepEqual(result.diagnostics, []);
  const withoutException = {
    ...records,
    'pdp-wbs.md': records['pdp-wbs.md'].replace(
      'Traceability exception: authority-only — Retain the baseline review disposition.\n\n',
      '',
    ),
  };
  const missingSuccessor = await auditPlanning(await fixture(t, withoutException));
  assert.ok(
    missingSuccessor.diagnostics.some(
      diagnostic =>
        diagnostic.id === 'WBS-DEMO-10-02' && diagnostic.code === 'traceability-outgoing',
    ),
  );
  const missingParent = await auditPlanning(
    await fixture(t, {
      ...records,
      'pdp-wbs.md': records['pdp-wbs.md'].replace('Traceability: `SRS-DEMO-01`.\n', ''),
    }),
  );
  assert.ok(
    missingParent.diagnostics.some(
      diagnostic =>
        diagnostic.id === 'WBS-DEMO-10-02' && diagnostic.code === 'traceability-incoming',
    ),
  );
});

test('malformed, repeated and wrong-kind exceptions fail closed', async t => {
  const invalid = [
    'Traceability exception: technical-only —',
    'Traceability exception: technical-only — !',
    'Traceability exception: unknown — Rationale.',
    'Traceability exception: authority-only — Rationale.',
    'Traceability exception: technical-only — Rationale. Traceability exception: technical-only — Again.',
  ];
  for (const field of invalid) {
    const records = {
      ...BASELINE,
      'srs.md': BASELINE['srs.md'].replace(
        '### SRS-DEMO-01: Contract\n',
        `- **SRS-DEMO-01**: Contract. ${field}\n`,
      ),
    };
    const result = await auditPlanning(await fixture(t, records));
    assert.ok(
      result.diagnostics.some(diagnostic => diagnostic.code === 'traceability-exception'),
      field,
    );
  }
  const wrongWbs = {
    ...BASELINE,
    'pdp-wbs.md': BASELINE['pdp-wbs.md'].replace(
      'Completion checks:',
      'Traceability exception: technical-only — Not an SRS.\n\nCompletion checks:',
    ),
  };
  assert.ok(
    codes(await auditPlanning(await fixture(t, wrongWbs))).includes('traceability-exception'),
  );
});

test('an exception outside its own declaration cannot exempt a missing link', async t => {
  const records = {
    ...BASELINE,
    'srs.md':
      '# Contracts\n\nTraceability exception: technical-only — Preamble.\n\n- **SRS-DEMO-02**: Unmapped contract.\n- **SRS-DEMO-01**: Contract. Traceability exception: technical-only — Different record.\n\nTraceability: `PRD-DEMO-01`, `WBS-DEMO-10-01`\n',
    'pdp-wbs.md': `${BASELINE['pdp-wbs.md'].replace(
      'Dependencies: none.',
      'Dependencies: none.\n\nTraceability exception: authority-only — Phase preamble.',
    )}\n#### WBS-DEMO-10-02: Unmapped task\n`,
    'progress.md': `${BASELINE['progress.md']}| WBS-DEMO-10-02 | Unmapped | not-started |\n`,
  };
  const result = await auditPlanning(await fixture(t, records));
  for (const [id, code] of [
    ['SRS-DEMO-02', 'traceability-incoming'],
    ['WBS-DEMO-10-02', 'traceability-outgoing'],
  ]) {
    assert.ok(
      result.diagnostics.some(diagnostic => diagnostic.id === id && diagnostic.code === code),
    );
  }
  assert.ok(result.diagnostics.some(diagnostic => diagnostic.code === 'traceability-exception'));
});

test('classified gates retain reference and completed-prerequisite checks', async t => {
  const records = {
    ...BASELINE,
    'pdp-wbs.md': `${BASELINE['pdp-wbs.md']}\n#### WBS-DEMO-10-02: Review gate\n\nDependencies: WBS-DEMO-10-01.\n\nTraceability exception: authority-only — Retain the review disposition.\n\nTraceability: \`SRS-DEMO-01\`.\n\nReview \`SRS-MISSING-01\`.\n`,
    'progress.md': `${BASELINE['progress.md']}| WBS-DEMO-10-02 | Review | verified |\n`,
  };
  const result = await auditPlanning(await fixture(t, records));
  assert.ok(
    result.diagnostics.some(
      diagnostic => diagnostic.code === 'undefined-reference' && diagnostic.id === 'SRS-MISSING-01',
    ),
  );
  assert.ok(
    result.diagnostics.some(
      diagnostic => diagnostic.code === 'dependency-state' && diagnostic.id === 'WBS-DEMO-10-02',
    ),
  );
  assert.ok(
    !result.diagnostics.some(
      diagnostic =>
        diagnostic.code === 'traceability-outgoing' && diagnostic.id === 'WBS-DEMO-10-02',
    ),
  );
});

test('fences and comments cannot annotate a definition', async t => {
  const records = {
    ...BASELINE,
    'pdp-wbs.md': `${BASELINE['pdp-wbs.md']}\n#### WBS-DEMO-10-02: Review gate\n\nTraceability: \`SRS-DEMO-01\`.\n\n\`\`\`md\nTraceability exception: authority-only — Example only.\n\`\`\`\n\n<!-- Traceability exception: authority-only — Not authority. -->\n`,
    'progress.md': `${BASELINE['progress.md']}| WBS-DEMO-10-02 | Review | not-started |\n`,
  };
  const result = await auditPlanning(await fixture(t, records));
  assert.ok(
    result.diagnostics.some(
      diagnostic =>
        diagnostic.code === 'traceability-outgoing' && diagnostic.id === 'WBS-DEMO-10-02',
    ),
  );
  assert.ok(!codes(result).includes('traceability-exception'));
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

test('planning-complete requires a task-local mode in full and lightweight audits', async t => {
  const progress = BASELINE['progress.md'].replace('not-started |', 'planning-complete |');
  for (const lightweight of [false, true]) {
    const rejected = await auditPlanning(
      await fixture(t, { ...BASELINE, 'progress.md': progress }),
      { lightweight },
    );
    assert.ok(codes(rejected).includes('completion-mode'));
    const approved = await auditPlanning(
      await fixture(t, {
        ...BASELINE,
        'pdp-wbs.md': BASELINE['pdp-wbs.md'].replace(
          'Completion checks:',
          'Completion mode: planning-only.\n\nCompletion checks:',
        ),
        'progress.md': progress,
      }),
      { lightweight },
    );
    assert.equal(approved.ok, true, JSON.stringify(approved.diagnostics));
  }
});

test('planning-complete prerequisites allow recorded closure but never unblock successors', async t => {
  const wbs = `${BASELINE['pdp-wbs.md'].replace('Completion checks:', 'Completion mode: planning-only.\n\nCompletion checks:')}\n#### WBS-DEMO-10-02: Dependent review\n\nDependencies: WBS-DEMO-10-01.\n\nTraceability exception: authority-only — Retain the review decision.\n\nTraceability: \`SRS-DEMO-01\`.\n`;
  const progress = `${BASELINE['progress.md'].replace('not-started |', 'planning-complete |')}| WBS-DEMO-10-02 | Dependent | planning-complete |\n`;
  const records = { ...BASELINE, 'pdp-wbs.md': wbs, 'progress.md': progress };
  const completed = await auditPlanning(await fixture(t, records));
  assert.ok(codes(completed).includes('completion-mode'));
  assert.ok(!codes(completed).includes('dependency-state'));
  const blocked = await auditPlanning(
    await fixture(t, {
      ...records,
      'progress.md': progress.replace('Dependent | planning-complete', 'Dependent | blocked'),
    }),
  );
  assert.ok(!codes(blocked).includes('dependency-state'));
  assert.ok(!codes(blocked).includes('completion-mode'));
  const unfinished = await auditPlanning(
    await fixture(t, {
      ...records,
      'progress.md': progress.replace('planning-complete |', 'implementation-complete |'),
    }),
  );
  assert.ok(codes(unfinished).includes('dependency-state'));
  const waived = await auditPlanning(
    await fixture(t, {
      ...records,
      'progress.md': progress.replace('planning-complete |', 'waived |'),
    }),
  );
  assert.ok(codes(waived).includes('dependency-state'));
  const noMode = await auditPlanning(
    await fixture(t, {
      ...records,
      'pdp-wbs.md': wbs.replace('Completion mode: planning-only.\n\n', ''),
    }),
  );
  assert.ok(codes(noMode).includes('completion-mode'));
  assert.ok(codes(noMode).includes('dependency-state'));
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
