// ATP-LOC-06: real development processes, filesystem watchers and browser Sys.
// Run from repository root with supported Node; no environment identity overrides.
import assert from 'node:assert/strict';
import { spawn } from 'node:child_process';
import { createHash } from 'node:crypto';
import fs from 'node:fs/promises';
import path from 'node:path';
import { chromium } from '@playwright/test';

const root = process.cwd();
const prefix = process.argv[2] ?? '';
const artifacts = path.join(root, 'repo-specs/cabloy-locale/evidence/phase-30/artifacts');
const originals = new Map();
const owned = new Set();
const keys = ['LocReloadProject', 'LocReloadProvider', 'LocReloadAggregator', 'LocReloadHelper', 'LocReloadKey', 'LocReloadContribution', 'LocReloadOrdinary', 'LocReloadTargetOnly'];
const delay = ms => new Promise(resolve => setTimeout(resolve, ms));
const hash = bytes => createHash('sha256').update(bytes).digest('hex');
function redact(text) {
  return text.replace(/\x1b\[[0-9;]*m/g, '').replace(/^.*(?:access.token|Bearer).*(?:\n|$)/gim, '[development credential diagnostic redacted]\n').replaceAll(root, '<REPO_ROOT>').replaceAll(process.env.HOME, '<HOME>');
}
async function retain(name, text) {
  await fs.writeFile(path.join(artifacts, `${prefix}${name}`), redact(text), { flag: 'wx' });
}
async function save(file) {
  const bytes = await fs.readFile(file);
  originals.set(file, bytes);
  return bytes.toString();
}
function start(command, label) {
  const child = spawn('npm', ['run', command], { cwd: root, detached: true, env: { ...process.env, NO_COLOR: '1' }, stdio: ['ignore', 'pipe', 'pipe'] });
  const runtime = { child, label, output: '', exit: undefined };
  owned.add(runtime);
  for (const stream of [child.stdout, child.stderr]) stream.on('data', chunk => { runtime.output += chunk.toString(); });
  child.on('exit', (code, signal) => { runtime.exit = { code, signal }; });
  return runtime;
}
async function stop(runtime) {
  if (!runtime || !owned.has(runtime)) return;
  try { process.kill(-runtime.child.pid, 'SIGINT'); } catch (error) { if (error.code !== 'ESRCH') throw error; }
  for (let i = 0; i < 240 && runtime.exit === undefined; i++) {
    await delay(250);
    // Nodemon can consume the first signal while its child shuts down.
    if (i === 20 && runtime.exit === undefined) {
      try { process.kill(-runtime.child.pid, 'SIGINT'); } catch (error) { if (error.code !== 'ESRCH') throw error; }
    }
  }
  await retain(`${runtime.label}.txt`, `${runtime.output}\nowned_wrapper_exit=${JSON.stringify(runtime.exit)}\n`);
  assert.ok(runtime.exit !== undefined, `${runtime.label}: owned process did not exit`);
  owned.delete(runtime);
}
async function until(fn, label, timeout = 90000) {
  const end = Date.now() + timeout;
  let last;
  while (Date.now() < end) {
    try { const result = await fn(); if (result) return result; } catch (error) { last = error; }
    await delay(400);
  }
  throw new Error(`${label}: timeout${last ? `: ${last.message}` : ''}`);
}
function backendSnapshot(runtime, offset = 0) {
  const lines = runtime.output.slice(offset).split('\n').filter(line => line.startsWith('LOC_RELOAD_PROOF '));
  return lines.length ? JSON.parse(lines.at(-1).slice('LOC_RELOAD_PROOF '.length)) : undefined;
}
function expected(stage) {
  const values = ['project', 'provider', stage >= 2 ? 'aggregator-1' : 'aggregator-0', stage >= 3 ? 'helper-1' : 'helper-0', stage >= 4 ? 'LocReloadKey' : 'key-0', stage >= 5 ? 'LocReloadContribution' : 'contribution-0', stage >= 1 ? 'ordinary-1' : 'ordinary-0', stage >= 5 ? 'LocReloadTargetOnly' : 'target-only-0'];
  return { scoped: values, global: values };
}
const report = { revision: (await import('node:child_process')).execFileSync('git', ['rev-parse', 'HEAD'], { encoding: 'utf8' }).trim(), command: 'node repo-specs/cabloy-locale/evidence/phase-30/watcher-proof.mjs', fixtures: [], backend: [], frontend: [] };
let backend;
let frontend;
let browser;
try {
  for (const stack of ['vona', 'zova']) {
    const removedTarget = stack === 'vona' ? 'home-index' : 'home-indexweb';
    const base = `${stack}/src/suite/a-home/modules/home-base/src`;
    const provider = `${stack}/src/suite/cabloy-locale/modules/locale-jajp/src`;
    const target = `${base}/config/locale/en-us.ts`;
    const helper = `${provider}/lib/locales/home-base.ts`;
    const aggregator = `${provider}/locales/index.ts`;
    const project = stack === 'vona' ? 'vona/src/backend/config/locale/en-us.ts' : 'zova/src/front/config/locale/en-us.ts';
    const targetOriginal = await save(target);
    const helperOriginal = await save(helper);
    const aggregatorOriginal = await save(aggregator);
    const projectOriginal = await save(project);
    const targetStage = stage => targetOriginal.replace('export default {', `export default {\n  LocReloadProject: 'ordinary loses',\n  LocReloadProvider: 'ordinary loses',\n  LocReloadOrdinary: 'ordinary-${stage >= 1 ? 1 : 0}',`);
    const helperStage = stage => helperOriginal.replace('export default {', `export default {\n  LocReloadProject: 'provider loses',\n  LocReloadProvider: 'provider',\n  LocReloadHelper: 'helper-${stage >= 3 ? 1 : 0}',\n${stage < 4 ? "  LocReloadKey: 'key-0',\n" : ''}`);
    const aggregatorStage = stage => aggregatorOriginal.replace("  'ja-jp': locale_ja_jp,", `  'ja-jp': locale_ja_jp,\n  'en-us': {\n    modules: {\n      'home-base': {\n        ...Object.fromEntries(Object.entries(locale_ja_jp.modules['home-base']).filter(([key]) => key.startsWith('LocReload'))),\n        LocReloadAggregator: 'aggregator-${stage >= 2 ? 1 : 0}',\n${stage < 5 ? "        LocReloadContribution: 'contribution-0',\n" : ''}      },\n${stage < 5 ? `      '${removedTarget}': { LocReloadContribution: 'contribution-0', LocReloadTargetOnly: 'target-only-0' },\n` : ''}    },\n  },`);
    const projectFixture = stack === 'vona' ? projectOriginal.replace('localeModules.modules = {};', "localeModules.modules = { 'home-base': { LocReloadProject: 'project' } } as any;") : projectOriginal.replace('modules: {},', "modules: { 'home-base': { LocReloadProject: 'project' } },");
    await fs.writeFile(project, projectFixture);
    await fs.writeFile(target, targetStage(0));
    await fs.writeFile(helper, helperStage(0));
    await fs.writeFile(aggregator, aggregatorStage(0));
    report.fixtures.push({ stack, paths: [project, target, helper, aggregator], keys, locale: 'en-us', policyUnchanged: true });
    // Keep exact temporary diffs/hashes without copying environment configuration.
    for (const file of [project, target, helper, aggregator]) report.fixtures.push({ file, originalSha256: hash(originals.get(file)), fixture: await fs.readFile(file, 'utf8') });
    if (stack === 'vona') {
      const main = `${base}/main.ts`;
      const mainOriginal = await save(main);
      const instrumentation = `\n    console.log('LOC_RELOAD_PROOF ' + JSON.stringify({ pid: process.pid, scoped: ${JSON.stringify(keys)}.map(key => this.app.meta.locale.getText(false, key === 'LocReloadTargetOnly' ? 'home-index' : 'home-base', 'en-us', key)), global: ${JSON.stringify(keys)}.map(key => this.app.meta.locale.getText(false, undefined, 'en-us', key)) }));`;
      await fs.writeFile(main, mainOriginal.replace('async moduleLoaded() {', `async moduleLoaded() {${instrumentation}`));
      report.fixtures.push({ file: main, originalSha256: hash(originals.get(main)), instrumentation });
      backend = start('dev:one', 'backend-watcher');
      await until(() => backendSnapshot(backend) && backend.output.includes('[hmr] ready:'), 'backend baseline');
      const first = backendSnapshot(backend);
      assert.deepEqual({ scoped: first.scoped, global: first.global }, expected(0));
      report.backend.push({ stage: 'baseline', snapshot: first });
      for (let stage = 1; stage <= 5; stage++) {
        const offset = backend.output.length;
        const file = stage === 1 ? target : stage === 3 || stage === 4 ? helper : aggregator;
        const contents = stage === 1 ? targetStage(stage) : stage === 3 || stage === 4 ? helperStage(stage) : aggregatorStage(stage);
        await fs.writeFile(file, contents);
        const snapshot = await until(() => {
          const result = backendSnapshot(backend, offset);
          return result && JSON.stringify({ scoped: result.scoped, global: result.global }) === JSON.stringify(expected(stage)) && backend.output.slice(offset).includes('[hmr] ready:') ? result : undefined;
        }, `backend watcher stage ${stage}`);
        report.backend.push({ stage, edited: file, sha256: hash(contents), snapshot });
        await delay(1800);
      }
      const final = report.backend.at(-1).snapshot;
      await stop(backend);
      backend = start('dev:one', 'backend-clean-start');
      const clean = await until(() => backend.output.includes('[hmr] ready:') && backendSnapshot(backend), 'backend clean');
      assert.deepEqual({ scoped: clean.scoped, global: clean.global }, { scoped: final.scoped, global: final.global });
      report.backend.push({ stage: 'clean-start', snapshot: clean, equivalent: true });
      // Backend remains available for the real standalone SSR Web API dependency.
    } else {
      frontend = start('dev:zova:web', 'frontend-watcher');
      await until(() => frontend.output.includes('Webserver is ready'), 'Web baseline server');
      browser = await chromium.launch({ headless: true });
      let page = await browser.newPage();
      const browserErrors = [];
      page.on('pageerror', error => browserErrors.push(error.message));
      await page.goto('http://localhost:9002/');
      const read = () => page.evaluate(keys => {
        const registry = window.sys?.meta?.locale;
        if (!registry?.localeModules['home-base']) return undefined;
        window.__localeProofDocument ??= `${performance.timeOrigin}`;
        return { document: window.__localeProofDocument, scoped: keys.map(key => registry.getText(false, key === 'LocReloadTargetOnly' ? 'home-indexweb' : 'home-base', 'en-us', key)), global: keys.map(key => registry.getText(false, undefined, 'en-us', key)) };
      }, keys);
      const first = await until(async () => { const r = await read(); return r && JSON.stringify({ scoped: r.scoped, global: r.global }) === JSON.stringify(expected(0)) && r; }, 'Web baseline registry');
      // Allow cold optimizer and initial hydration to settle before owned edits.
      await delay(15000);
      const settled = await read();
      assert.deepEqual({ scoped: settled.scoped, global: settled.global }, expected(0));
      report.frontend.push({ stage: 'baseline', snapshot: settled, startupErrors: [...browserErrors] });
      browserErrors.length = 0;
      let previous = settled;
      for (let stage = 1; stage <= 5; stage++) {
        const file = stage === 1 ? target : stage === 3 || stage === 4 ? helper : aggregator;
        const contents = stage === 1 ? targetStage(stage) : stage === 3 || stage === 4 ? helperStage(stage) : aggregatorStage(stage);
        await fs.writeFile(file, contents);
        const snapshot = await until(async () => { const r = await read(); return r && r.document !== previous.document && JSON.stringify({ scoped: r.scoped, global: r.global }) === JSON.stringify(expected(stage)) && r; }, `Web watcher stage ${stage}`);
        report.frontend.push({ stage, edited: file, sha256: hash(contents), snapshot, automaticDocumentReload: true });
        previous = snapshot;
        await delay(1500);
      }
      await page.close();
      await stop(frontend);
      frontend = start('dev:zova:web', 'frontend-clean-start');
      await until(() => frontend.output.includes('Webserver is ready'), 'Web clean server');
      page = await browser.newPage();
      await page.goto('http://localhost:9002/');
      const clean = await until(async () => { const r = await read(); return r && JSON.stringify({ scoped: r.scoped, global: r.global }) === JSON.stringify(expected(5)) && r; }, 'Web clean registry');
      assert.deepEqual({ scoped: clean.scoped, global: clean.global }, { scoped: previous.scoped, global: previous.global });
      report.frontend.push({ stage: 'clean-start', snapshot: clean, equivalent: true, browserErrors });
    }
  }
  report.result = 'passed';
} catch (error) {
  report.result = 'failed';
  report.error = error.stack;
  process.exitCode = 1;
} finally {
  if (browser) await browser.close();
  for (const runtime of [...owned].reverse()) {
    try { await stop(runtime); } catch (error) { report.cleanupError = String(error); process.exitCode = 1; }
  }
  report.restored = [];
  for (const [file, bytes] of originals) {
    await fs.writeFile(file, bytes);
    const restored = hash(await fs.readFile(file)) === hash(bytes);
    report.restored.push({ file, sha256: hash(bytes), restored });
    assert.ok(restored);
  }
  await retain('watcher-proof.json', JSON.stringify(report, null, 2));
  console.log(JSON.stringify({ result: report.result, backend: report.backend.length, frontend: report.frontend.length, restored: report.restored.every(item => item.restored), error: report.error && redact(report.error) }));
}
