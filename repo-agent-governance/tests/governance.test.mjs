import assert from 'node:assert/strict';
import { spawnSync } from 'node:child_process';
import {
  cpSync,
  existsSync,
  mkdirSync,
  mkdtempSync,
  readFileSync,
  rmSync,
  writeFileSync,
} from 'node:fs';
import { tmpdir } from 'node:os';
import { dirname, resolve } from 'node:path';
import { test } from 'node:test';

import { check, GOVERNANCE_DIR, ROOT_DIR } from '../scripts/governance.mjs';
import {
  analyze,
  buildMessages,
  isCodeFile,
  resolveEdition,
} from '../tools/contract-loop/core.mjs';
import { extractCodexEditedFilePaths } from '../tools/contract-loop/hook-runtime.mjs';

function createFixture() {
  const root = mkdtempSync(resolve(tmpdir(), 'cabloy-agent-governance-'));
  cpSync(GOVERNANCE_DIR, resolve(root, 'repo-agent-governance'), { recursive: true });
  writeFileSync(resolve(root, '__CABLOY_BASIC__'), '');
  return root;
}

function runNode(root, executable, ...args) {
  const result = spawnSync(process.execPath, [executable, ...args], {
    cwd: root,
    encoding: 'utf8',
    env: {
      ...process.env,
      CABLOY_GOVERNANCE_ROOT: root,
    },
  });
  return {
    status: result.status,
    output: `${result.stdout}${result.stderr}`,
  };
}

function runGovernance(root, ...args) {
  return runNode(root, resolve(root, 'repo-agent-governance/scripts/governance.mjs'), ...args);
}

function runHook(root, executable, payload) {
  const result = spawnSync(process.execPath, [executable], {
    cwd: root,
    encoding: 'utf8',
    input: JSON.stringify(payload),
    env: {
      ...process.env,
      CABLOY_GOVERNANCE_ROOT: root,
    },
  });
  return {
    status: result.status,
    output: `${result.stdout}${result.stderr}`,
  };
}

function readState(root) {
  return JSON.parse(readFileSync(resolve(root, '.cabloy-agent-governance-state.json'), 'utf8'));
}

function modifyPolicy(root, addition) {
  const policyPath = resolve(root, 'repo-agent-governance/policies/repository.md');
  writeFileSync(policyPath, `${readFileSync(policyPath, 'utf8').trimEnd()}\n\n${addition}\n`);
}

function removePolicyTarget(root, target) {
  const manifestPath = resolve(root, 'repo-agent-governance/manifest.json');
  const manifest = JSON.parse(readFileSync(manifestPath, 'utf8'));
  manifest.policy.targets = manifest.policy.targets.filter(item => item.target !== target);
  writeFileSync(manifestPath, `${JSON.stringify(manifest, null, 2)}\n`);
}

function setCursorHookTarget(root, target) {
  const manifestPath = resolve(root, 'repo-agent-governance/manifest.json');
  const manifest = JSON.parse(readFileSync(manifestPath, 'utf8'));
  manifest.cursor.hooks[0].target = target;
  writeFileSync(manifestPath, `${JSON.stringify(manifest, null, 2)}\n`);
}

function withFixture(callback) {
  const root = createFixture();
  try {
    callback(root);
  } finally {
    rmSync(root, { recursive: true, force: true });
  }
}

test('committed governance adapters match their canonical sources', () => {
  const result = check();
  assert.deepEqual(result.problems, []);
  assert.ok(result.assets.length > 0);
  assert.ok(existsSync(resolve(GOVERNANCE_DIR, 'managed-assets.json')));
});

test('all generated skill bundles retain their source identity', () => {
  for (const asset of check().assets.filter(
    asset => asset.category === 'skill' && asset.target.endsWith('/SKILL.md'),
  )) {
    const source = `${readFileSync(resolve(GOVERNANCE_DIR, asset.source), 'utf8')
      .replace(/\r\n?/g, '\n')
      .replace(/\n*$/, '')}\n`;
    const target = readFileSync(resolve(ROOT_DIR, asset.target), 'utf8');
    assert.equal(target, source, asset.target);
    assert.match(target, /^---\nname: [^\n]+\ndescription: [^\n]+\n---\n/);
  }
});

test('governance adoption creates state and is idempotent', () => {
  withFixture(root => {
    assert.equal(runGovernance(root, 'adopt', '--apply').status, 0);
    const state = readState(root);
    assert.ok(state.assets.length > 0);
    assert.equal(runGovernance(root, 'adopt', '--apply').status, 0);
    assert.match(runGovernance(root, 'adopt', '--apply').output, /No governance adoption changes/);
  });
});

test('initializer adopts canonical adapters for a fresh transition package', () => {
  withFixture(root => {
    const scriptsDirectory = resolve(root, 'scripts');
    mkdirSync(scriptsDirectory);
    const bootstrap = resolve(ROOT_DIR, 'scripts/bootstrapAgentGovernance.mjs');
    const fixtureBootstrap = resolve(scriptsDirectory, 'bootstrapAgentGovernance.mjs');
    const content = readFileSync(bootstrap, 'utf8').replace(
      "const ROOT_DIR = resolve(dirname(fileURLToPath(import.meta.url)), '..');",
      'const ROOT_DIR = process.env.CABLOY_GOVERNANCE_ROOT;',
    );
    writeFileSync(fixtureBootstrap, content);
    const result = runNode(root, fixtureBootstrap);
    assert.equal(result.status, 0, result.output);
    assert.ok(existsSync(resolve(root, 'CLAUDE.md')));
    assert.equal(readState(root).assets.length, check().assets.length);
  });
});

test('initializer preserves a legacy-customized adapter during a staged upgrade', () => {
  withFixture(root => {
    const scriptsDirectory = resolve(root, 'scripts');
    mkdirSync(scriptsDirectory);
    const bootstrap = resolve(ROOT_DIR, 'scripts/bootstrapAgentGovernance.mjs');
    const fixtureBootstrap = resolve(scriptsDirectory, 'bootstrapAgentGovernance.mjs');
    const content = readFileSync(bootstrap, 'utf8').replace(
      "const ROOT_DIR = resolve(dirname(fileURLToPath(import.meta.url)), '..');",
      'const ROOT_DIR = process.env.CABLOY_GOVERNANCE_ROOT;',
    );
    writeFileSync(fixtureBootstrap, content);
    writeFileSync(resolve(root, 'CLAUDE.md'), 'legacy project customization\n');
    writeFileSync(resolve(root, 'package.json'), readFileSync(resolve(ROOT_DIR, 'package.json')));

    const upgradeRoot = resolve(root, 'node_modules/.cabloy-upgrade');
    cpSync(GOVERNANCE_DIR, resolve(upgradeRoot, 'repo-agent-governance'), { recursive: true });
    writeFileSync(
      resolve(upgradeRoot, 'package.json'),
      readFileSync(resolve(ROOT_DIR, 'package.json')),
    );
    modifyPolicy(upgradeRoot, 'Staged governance source.');

    const result = runNode(root, fixtureBootstrap);
    assert.equal(result.status, 0, result.output);
    assert.match(result.output, /locally modified or legacy adapter outputs/);
    assert.equal(
      readFileSync(resolve(root, 'CLAUDE.md'), 'utf8'),
      'legacy project customization\n',
    );
    assert.match(
      readFileSync(resolve(root, 'repo-agent-governance/policies/repository.md'), 'utf8'),
      /Staged governance source/,
    );
    assert.match(readFileSync(resolve(root, 'AGENTS.md'), 'utf8'), /Staged governance source/);
  });
});

test('governance adoption adopts byte-identical legacy outputs', () => {
  withFixture(root => {
    assert.equal(runGovernance(root, 'render').status, 0);
    assert.equal(existsSync(resolve(root, '.cabloy-agent-governance-state.json')), false);
    assert.equal(runGovernance(root, 'adopt', '--apply').status, 0);
    assert.equal(readState(root).assets.length, check().assets.length);
  });
});

test('governance adoption preserves modified legacy outputs and records other ownership', () => {
  withFixture(root => {
    const policyPath = resolve(root, 'CLAUDE.md');
    writeFileSync(policyPath, 'project-owned policy\n');
    const result = runGovernance(root, 'adopt', '--apply');
    assert.equal(result.status, 2);
    assert.match(result.output, /conflicts: CLAUDE\.md/);
    assert.equal(readFileSync(policyPath, 'utf8'), 'project-owned policy\n');
    const state = readState(root);
    assert.equal(
      state.assets.some(asset => asset.target === 'CLAUDE.md'),
      false,
    );
    assert.equal(
      state.assets.some(asset => asset.target === 'AGENTS.md'),
      true,
    );
  });
});

test('governance adoption updates unchanged owned outputs and preserves later user edits', () => {
  withFixture(root => {
    assert.equal(runGovernance(root, 'adopt', '--apply').status, 0);
    modifyPolicy(root, 'Fixture-owned change.');
    assert.equal(runGovernance(root, 'adopt', '--apply').status, 0);
    assert.match(readFileSync(resolve(root, 'CLAUDE.md'), 'utf8'), /Fixture-owned change/);

    writeFileSync(resolve(root, 'CLAUDE.md'), 'locally customized adapter\n');
    modifyPolicy(root, 'A newer canonical change.');
    const result = runGovernance(root, 'adopt', '--apply');
    assert.equal(result.status, 2);
    assert.match(result.output, /conflicts: CLAUDE\.md/);
    assert.equal(readFileSync(resolve(root, 'CLAUDE.md'), 'utf8'), 'locally customized adapter\n');
  });
});

test('governance adoption deletes only unchanged retired outputs', () => {
  withFixture(root => {
    assert.equal(runGovernance(root, 'adopt', '--apply').status, 0);
    removePolicyTarget(root, 'AGENTS.md');
    assert.equal(runGovernance(root, 'adopt', '--apply').status, 0);
    assert.equal(existsSync(resolve(root, 'AGENTS.md')), false);
    assert.equal(
      readState(root).assets.some(asset => asset.target === 'AGENTS.md'),
      false,
    );
  });
});

test('governance rendering removes unchanged retired outputs', () => {
  withFixture(root => {
    const legacyTarget = '.cursor/hooks/contract-loop-gate.ts';
    setCursorHookTarget(root, legacyTarget);
    assert.equal(runGovernance(root, 'render').status, 0);
    assert.ok(existsSync(resolve(root, legacyTarget)));

    setCursorHookTarget(root, '.cursor/hooks/contract-loop-gate.mjs');
    assert.equal(runGovernance(root, 'render').status, 0);
    assert.equal(existsSync(resolve(root, legacyTarget)), false);
    assert.ok(existsSync(resolve(root, '.cursor/hooks/contract-loop-gate.mjs')));
  });
});

test('governance rendering preserves modified retired outputs', () => {
  withFixture(root => {
    const legacyTarget = '.cursor/hooks/contract-loop-gate.ts';
    setCursorHookTarget(root, legacyTarget);
    assert.equal(runGovernance(root, 'render').status, 0);
    const legacyPath = resolve(root, legacyTarget);
    writeFileSync(legacyPath, 'project-owned legacy hook\n');

    setCursorHookTarget(root, '.cursor/hooks/contract-loop-gate.mjs');
    assert.equal(runGovernance(root, 'render').status, 0);
    assert.equal(readFileSync(legacyPath, 'utf8'), 'project-owned legacy hook\n');
  });
});

test('governance adoption preserves modified retired outputs', () => {
  withFixture(root => {
    assert.equal(runGovernance(root, 'adopt', '--apply').status, 0);
    writeFileSync(resolve(root, 'AGENTS.md'), 'locally customized retired adapter\n');
    removePolicyTarget(root, 'AGENTS.md');
    const result = runGovernance(root, 'adopt', '--apply');
    assert.equal(result.status, 2);
    assert.match(result.output, /conflicts: AGENTS\.md/);
    assert.equal(
      readFileSync(resolve(root, 'AGENTS.md'), 'utf8'),
      'locally customized retired adapter\n',
    );
  });
});

test('governance adoption preserves unmanaged siblings and rejects malformed state', () => {
  withFixture(root => {
    const siblingPath = resolve(root, '.claude/skills/project-local/SKILL.md');
    mkdirSync(dirname(siblingPath), { recursive: true });
    writeFileSync(siblingPath, 'project-local skill\n');
    assert.equal(runGovernance(root, 'adopt', '--apply').status, 0);
    assert.equal(readFileSync(siblingPath, 'utf8'), 'project-local skill\n');

    writeFileSync(
      resolve(root, '.cabloy-agent-governance-state.json'),
      '{"schemaVersion":1,"assets":[{"target":"../../outside","sha256":"bad"}]}\n',
    );
    const result = runGovernance(root, 'adopt', '--apply');
    assert.equal(result.status, 1);
    assert.match(result.output, /Unable to parse governance installer state/);
  });
});

test('governance adoption force-updates one explicitly named target', () => {
  withFixture(root => {
    writeFileSync(resolve(root, 'CLAUDE.md'), 'locally customized adapter\n');
    assert.equal(runGovernance(root, 'adopt', '--apply').status, 2);
    assert.equal(runGovernance(root, 'adopt', '--apply', '--force', 'CLAUDE.md').status, 0);
    assert.notEqual(
      readFileSync(resolve(root, 'CLAUDE.md'), 'utf8'),
      'locally customized adapter\n',
    );
  });
});

test('contract-loop analysis preserves forward and reverse guidance', () => {
  const resolution = resolveEdition(ROOT_DIR);
  assert.equal(resolution.kind, 'resolved');
  const forward = analyze(
    '/repo/vona/src/module/demo/src/controller/demo.ts',
    '@Api.field()',
    resolution.edition,
  );
  assert.equal(forward.forwardReason, 'Backend contract source may have changed.');
  assert.equal(forward.reverseReason, null);
  const reverse = analyze(
    '/repo/zova/src/suite/demo/modules/demo/src/.metadata/index.ts',
    '',
    resolution.edition,
  );
  assert.equal(reverse.forwardReason, null);
  assert.equal(
    reverse.reverseReason,
    'Frontend-owned resources or metadata may affect backend consumers.',
  );
  assert.match(buildMessages(reverse, resolution), /npm run build:zova:admin/);
  assert.match(buildMessages(reverse, resolution), /npm run deps:vona/);
});

test('contract-loop recognizes supported vendor and suite source paths', () => {
  assert.equal(isCodeFile('/repo/zova/src/module-vendor/demo/src/bean/demo.ts'), true);
  assert.equal(
    isCodeFile('/repo/zova/src/suite-vendor/demo/modules/demo/src/component/demo.tsx'),
    true,
  );
  assert.equal(isCodeFile('/repo/vona/src/module/demo/src/service/demo.ts'), true);
  assert.equal(isCodeFile('/repo/repo-docs/ai/agent-governance.md'), false);
});

test('Codex contract-loop adapter evaluates apply_patch file paths', () => {
  withFixture(root => {
    const sourcePath = resolve(root, 'vona/src/module/demo/src/controller/demo.ts');
    mkdirSync(dirname(sourcePath), { recursive: true });
    writeFileSync(sourcePath, '@Api.field()\n');
    assert.equal(runGovernance(root, 'render').status, 0);

    const command = [
      '*** Begin Patch',
      '*** Update File: vona/src/module/demo/src/controller/demo.ts',
      '@@',
      '-@Api.field()',
      '+@Api.field()',
      '*** Update File: repo-docs/ai/agent-governance.md',
      '@@',
      '*** End Patch',
    ].join('\n');
    assert.deepEqual(extractCodexEditedFilePaths({ tool_input: { command } }), [
      'vona/src/module/demo/src/controller/demo.ts',
      'repo-docs/ai/agent-governance.md',
    ]);

    const result = runHook(root, resolve(root, '.codex/hooks/contract-loop-gate.mjs'), {
      hook_event_name: 'PostToolUse',
      tool_name: 'apply_patch',
      tool_input: { command },
    });
    assert.equal(result.status, 0, result.output);
    const output = JSON.parse(result.output);
    assert.equal(output.hookSpecificOutput.hookEventName, 'PostToolUse');
    assert.match(output.hookSpecificOutput.additionalContext, /Forward chain:/);
  });
});

test('Cursor contract-loop adapter handles Agent and Tab edit events', () => {
  withFixture(root => {
    const sourcePath = resolve(root, 'vona/src/module/demo/src/controller/demo.ts');
    mkdirSync(dirname(sourcePath), { recursive: true });
    writeFileSync(sourcePath, '@Api.field()\n');
    assert.equal(runGovernance(root, 'render').status, 0);

    const hooks = JSON.parse(readFileSync(resolve(root, '.cursor/hooks.json'), 'utf8'));
    assert.equal(hooks.hooks.postToolUse[0].matcher, 'Write');
    assert.equal(hooks.hooks.afterFileEdit[0].matcher, 'Write');
    assert.equal(hooks.hooks.afterTabFileEdit[0].matcher, 'TabWrite');

    const script = resolve(root, '.cursor/hooks/contract-loop-gate.mjs');
    for (const hookEventName of ['afterFileEdit', 'afterTabFileEdit']) {
      const result = runHook(root, script, {
        hook_event_name: hookEventName,
        file_path: sourcePath,
      });
      assert.equal(result.status, 0, result.output);
      assert.equal(result.output, '');
    }

    const result = runHook(root, script, {
      hook_event_name: 'postToolUse',
      tool_input: { file_path: sourcePath },
    });
    assert.equal(result.status, 0, result.output);
    assert.match(JSON.parse(result.output).additional_context, /Forward chain:/);
  });
});
