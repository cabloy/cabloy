import assert from 'node:assert/strict';
import { mkdtempSync, mkdirSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { describe, it } from 'node:test';

import { CliToolsDeps } from '../src/lib/bean/cli.tools.deps.ts';

describe('tools.deps REST workspace installation', () => {
  for (const manifestChanged of [false, true]) {
    it(
      manifestChanged
        ? 'does not install twice when package generation already installed'
        : 'installs bundle dependencies even when the root manifest is unchanged',
      async () => {
        const projectPath = mkdtempSync(join(tmpdir(), 'vona-tools-deps-'));
        try {
          mkdirSync(join(projectPath, '.zova-rest', 'test-bundle'), { recursive: true });
          const cli = Object.create(CliToolsDeps.prototype) as CliToolsDeps;
          const calls: string[] = [];
          const pnpmInstall = async () => {
            calls.push('install');
          };
          Object.defineProperty(cli, 'helper', { value: { pnpmInstall } });
          Object.defineProperty(cli, 'common', {
            value: {
              _generatePackageJson: async target => {
                assert.equal(target, projectPath);
                calls.push('package');
                if (manifestChanged) await pnpmInstall();
                return manifestChanged;
              },
              _generateTypeModulesFile: async target => {
                assert.equal(target, projectPath);
                calls.push('modules');
              },
            },
          });
          cli._generateTypeProjectFile = async target => {
            assert.equal(target, projectPath);
            calls.push('project');
          };

          await cli._generate(projectPath);

          assert.deepEqual(calls, ['package', 'install', 'modules', 'project']);
        } finally {
          rmSync(projectPath, { recursive: true, force: true });
        }
      },
    );
  }
});
