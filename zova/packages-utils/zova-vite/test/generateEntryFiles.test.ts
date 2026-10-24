import assert from 'node:assert/strict';
import { mkdtemp, mkdir, readFile, rm, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import path from 'node:path';
import { test } from 'node:test';

import { generateEntryFiles } from '../src/generateEntryFiles.ts';

test('generated application entry files retain actual source suffixes', async () => {
  const appDir = await mkdtemp(path.join(tmpdir(), 'zova-entry-'));
  try {
    const configDir = path.join(appDir, 'src/front/config');
    await mkdir(path.join(configDir, 'config'), { recursive: true });
    await writeFile(path.join(configDir, 'config/config.ts'), 'export default {};\n');
    await writeFile(path.join(configDir, 'monkey.ts'), 'export class AppMonkey {}\n');
    await writeFile(path.join(configDir, 'monkeySys.ts'), 'export class SysMonkey {}\n');
    const meta = { flavor: 'cabloyBasicAdmin', mode: 'production', appMode: 'ssr' };
    const options = { appDir, runtimeDir: '.zova' };
    const modules = { modules: {}, modulesArray: [] };
    await generateEntryFiles(meta as any, options as any, modules as any, {});
    const files = ['config.ts', 'app/controller.tsx', 'app/utils.ts'];
    const first = await Promise.all(
      files.map(file => readFile(path.join(appDir, '.zova', file), 'utf8')),
    );
    assert.match(first[0], /from '\.\.\/src\/front\/config\/config\/config\.ts'/);
    assert.match(first[1], /from '\.\/utils\.ts'/);
    assert.match(first[2], /from '\.\.\/\.\.\/src\/front\/config\/monkey\.ts'/);
    assert.match(first[2], /from '\.\.\/\.\.\/src\/front\/config\/monkeySys\.ts'/);
    assert.match(first[2], /from '\.\.\/config\.ts'/);
    assert.match(first[2], /from '\.\.\/env\.ts'/);
    assert.match(first[2], /from '\.\.\/modules-meta\.ts'/);
    assert.doesNotMatch(first.join('\n'), /from ['"]\.[^'"]*\.jsx?['"]/);
    await generateEntryFiles(meta as any, options as any, modules as any, {});
    const second = await Promise.all(
      files.map(file => readFile(path.join(appDir, '.zova', file), 'utf8')),
    );
    assert.deepEqual(second, first);
  } finally {
    await rm(appDir, { recursive: true, force: true });
  }
});
