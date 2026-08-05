import assert from 'node:assert/strict';
import { execFileSync } from 'node:child_process';
import { mkdtempSync, mkdirSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { basename, resolve } from 'node:path';
import test from 'node:test';

import { isLinkedGitWorktree, updateBaseAppName } from './initAppName.ts';

function git(cwd: string, args: string[]): void {
  execFileSync('git', args, { cwd, stdio: 'ignore' });
}

function writeBaseEnvFiles(rootDir: string, appName: string): void {
  for (const relativePath of ['vona/env/.env', 'zova/env/.env']) {
    const filePath = resolve(rootDir, relativePath);
    mkdirSync(resolve(filePath, '..'), { recursive: true });
    writeFileSync(filePath, `APP_NAME = ${appName}\nOTHER_VALUE = preserved\n`);
  }
}

function readBaseEnvFiles(rootDir: string): string[] {
  return ['vona/env/.env', 'zova/env/.env'].map(relativePath =>
    readFileSync(resolve(rootDir, relativePath), 'utf-8'),
  );
}

test('classifies project roots before updating base APP_NAME files', { concurrency: false }, () => {
  const tempDir = mkdtempSync(resolve(tmpdir(), 'cabloy-init-app-name-'));
  const primaryDir = resolve(tempDir, 'primary');
  const linkedDir = resolve(tempDir, 'linked');
  try {
    mkdirSync(primaryDir);
    git(primaryDir, ['init']);
    git(primaryDir, ['config', 'user.email', 'test@example.com']);
    git(primaryDir, ['config', 'user.name', 'Cabloy Test']);
    writeBaseEnvFiles(primaryDir, 'original');
    git(primaryDir, ['add', '.']);
    git(primaryDir, ['commit', '-m', 'initial fixture']);

    assert.equal(isLinkedGitWorktree(primaryDir), false);
    assert.equal(updateBaseAppName(primaryDir), true);
    for (const content of readBaseEnvFiles(primaryDir)) {
      assert.equal(content, `APP_NAME = ${basename(primaryDir)}\nOTHER_VALUE = preserved\n`);
    }

    git(primaryDir, ['checkout', '--', '.']);
    git(primaryDir, ['worktree', 'add', '--detach', linkedDir, 'HEAD']);
    const linkedBefore = readBaseEnvFiles(linkedDir);
    assert.equal(isLinkedGitWorktree(linkedDir), true);
    assert.equal(updateBaseAppName(linkedDir), false);
    assert.deepEqual(readBaseEnvFiles(linkedDir), linkedBefore);

    const nestedProjectDir = resolve(linkedDir, 'created-project');
    writeBaseEnvFiles(nestedProjectDir, 'original');
    assert.equal(isLinkedGitWorktree(nestedProjectDir), false);
    assert.equal(updateBaseAppName(nestedProjectDir), true);
    for (const content of readBaseEnvFiles(nestedProjectDir)) {
      assert.equal(content, `APP_NAME = ${basename(nestedProjectDir)}\nOTHER_VALUE = preserved\n`);
    }

    const nonGitProjectDir = resolve(tempDir, 'non-git-project');
    writeBaseEnvFiles(nonGitProjectDir, 'original');
    assert.equal(isLinkedGitWorktree(nonGitProjectDir), false);
    assert.equal(updateBaseAppName(nonGitProjectDir), true);
    for (const content of readBaseEnvFiles(nonGitProjectDir)) {
      assert.equal(content, `APP_NAME = ${basename(nonGitProjectDir)}\nOTHER_VALUE = preserved\n`);
    }
  } finally {
    rmSync(tempDir, { recursive: true, force: true });
  }
});
