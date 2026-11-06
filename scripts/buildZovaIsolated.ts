import type { Stats } from 'node:fs';

import { execFile, spawn } from 'node:child_process';
import { randomUUID } from 'node:crypto';
import { constants } from 'node:fs';
import {
  chmod,
  copyFile,
  lstat,
  mkdir,
  mkdtemp,
  open,
  readdir,
  readFile,
  readlink,
  realpath,
  rename,
  rm,
  symlink,
  utimes,
  writeFile,
} from 'node:fs/promises';
import { createRequire } from 'node:module';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { promisify } from 'node:util';

import type { OwnedProcess } from './ownedProcess.ts';

import { startWindowsBuildProcess } from './buildProcessGuardianWindows.ts';

export interface OutputPlan {
  appVersion: string;
  buildOutDir: string;
  buildCopyDist: string;
  buildCopyRelease: string;
  buildRestCopyDist: string;
}
export type BuildOperation = 'pair' | 'ssr' | 'rest' | 'spa';
export type BuildAppMode = 'ssr' | 'spa';

export function parseBuildRequest(args: string[]): {
  operation: BuildOperation;
  flavors: string[];
} {
  let operation: BuildOperation = 'pair';
  let selected = false;
  const flavors: string[] = [];
  for (let index = 0; index < args.length; index++) {
    const arg = args[index]!;
    if (arg === '--') continue;
    if (arg === '--operation' || arg.startsWith('--operation=')) {
      if (selected) throw failure('Select the build operation only once');
      const value = arg === '--operation' ? args[++index] : arg.slice('--operation='.length);
      if (!['pair', 'ssr', 'rest', 'spa'].includes(value ?? ''))
        throw failure('Build operation must be pair, ssr, rest or spa');
      operation = value as BuildOperation;
      selected = true;
    } else {
      validateFlavor(arg);
      flavors.push(arg);
    }
  }
  if (!flavors.length) throw failure('Select at least one Zova flavor');
  if (new Set(flavors).size !== flavors.length) throw failure('Duplicate Zova build flavor');
  return { operation, flavors };
}

export interface BuildTarget {
  source: string;
  destination: string;
}
export interface BuildGeneratedRoots {
  quasar: string;
  runtime: string;
  rest: string;
}
export interface TargetOptions {
  rootDir: string;
  zovaDir: string;
  runDir: string;
  artifactRoot?: string;
}
const ROOT_DIR = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');

function within(root: string, target: string) {
  const relative = path.relative(root, target);
  return (
    relative === '' ||
    (!relative.startsWith(`..${path.sep}`) && relative !== '..' && !path.isAbsolute(relative))
  );
}
function overlaps(a: string, b: string) {
  return within(a, b) || within(b, a);
}
function samePath(a: string, b: string) {
  return path.relative(a, b) === '';
}
function pathComponent(value: string) {
  return process.platform === 'win32' ? value.toLowerCase() : value;
}
// Reject Win32 aliases before path.resolve can normalize them into a different target.
function validateOutputPath(value: string) {
  if (process.platform !== 'win32') return;
  if (
    /^[\\/]{2}[?.][\\/]/.test(value) ||
    /^[\\/]\?\?[\\/]/.test(value) ||
    /^[a-z]:(?![\\/])/i.test(value)
  ) {
    throw failure('Unsupported Windows output path namespace or drive-relative path');
  }
  const rest = value.replace(/^[a-z]:(?=[\\/])/i, '');
  if (
    rest.split(/[\\/]/).some(part => {
      if (!part || part === '.' || part === '..') return false;
      return (
        /[<>:"|?*]/.test(part) ||
        [...part].some(character => character.charCodeAt(0) < 32) ||
        /[. ]$/.test(part) ||
        /^(?:con|prn|aux|nul|com[1-9¹²³]|lpt[1-9¹²³])(?:\.|$)/i.test(part)
      );
    })
  ) {
    throw failure('Unsupported ambiguous Windows output path');
  }
}
function failure(message: string, cause?: unknown) {
  return new Error(message, { cause });
}
function missing(error: unknown) {
  return (error as NodeJS.ErrnoException).code === 'ENOENT';
}
async function exists(file: string) {
  try {
    await lstat(file);
    return true;
  } catch (error) {
    if (missing(error)) return false;
    throw error;
  }
}
function validateFlavor(flavor: string) {
  if (!/^[a-z][\w-]*$/i.test(flavor)) throw failure('Invalid Zova build flavor');
}

async function copyRegularFile(from: string, to: string, stat: Stats) {
  // COPYFILE_FICLONE is optional: Node falls back to a regular independent copy.
  await copyFile(from, to, constants.COPYFILE_FICLONE);
  await chmod(to, stat.mode);
  await utimes(to, stat.atime, stat.mtime);
}

/** Copy current files, never hardlink or follow symlinks into the original tree. */
export async function copySnapshotTree(
  source: string,
  destination: string,
  options: { excludeTopLevel?: ReadonlySet<string> } = {},
): Promise<void> {
  source = await realpath(source);
  destination = path.resolve(destination);
  if (overlaps(source, destination)) throw failure('Snapshot source and destination overlap');
  const links: string[] = [];
  await copy(source, destination, '');
  // Resolve in the completed copy too: a lexical internal link can chain through an escape.
  for (const link of links) {
    let resolved: string;
    try {
      resolved = await realpath(link);
    } catch (cause) {
      throw failure('Snapshot contains a broken or cyclic symlink', cause);
    }
    if (!within(destination, resolved))
      throw failure('Snapshot symlink escapes the copied workspace');
  }
  async function copy(from: string, to: string, relative: string) {
    const stat = await lstat(from);
    if (stat.isSymbolicLink()) {
      const text = await readlink(from);
      const target = path.resolve(path.dirname(from), text);
      if (!within(source, target))
        throw failure(`Unsupported external snapshot symlink: ${relative}`);
      let actual: string;
      try {
        actual = await realpath(from);
      } catch (cause) {
        throw failure('Snapshot contains a broken or cyclic symlink', cause);
      }
      if (!within(source, actual))
        throw failure(`Snapshot symlink escapes through another link: ${relative}`);
      if (process.platform === 'win32') {
        const resolved = await lstat(actual);
        if (resolved.isDirectory()) {
          // Absolute junctions need neither Developer Mode nor symlink privileges.
          await symlink(path.join(destination, path.relative(source, target)), to, 'junction');
          links.push(to);
        } else if (resolved.isFile()) {
          // File symlinks cannot be recreated without privileges. Do not share a hardlink.
          await copyRegularFile(actual, to, resolved);
        } else {
          throw failure(`Unsupported special file behind snapshot link: ${relative}`);
        }
      } else {
        await symlink(
          path.isAbsolute(text) ? path.join(destination, path.relative(source, target)) : text,
          to,
        );
        links.push(to);
      }
    } else if (stat.isDirectory()) {
      await mkdir(to, { mode: stat.mode });
      for (const entry of await readdir(from)) {
        if (relative === '' && options.excludeTopLevel?.has(entry)) continue;
        if (
          relative === '' &&
          (entry.endsWith('.tsbuildinfo') || /^quasar\.config\..*temporary\.compiled/.test(entry))
        ) {
          continue;
        }
        await copy(path.join(from, entry), path.join(to, entry), path.join(relative, entry));
      }
    } else if (stat.isFile()) {
      await copyRegularFile(from, to, stat);
    } else {
      throw failure(`Unsupported special file in snapshot: ${relative}`);
    }
  }
}

function overrideEnv(env: NodeJS.ProcessEnv, overrides: NodeJS.ProcessEnv): NodeJS.ProcessEnv {
  const result = { ...env };
  if (process.platform === 'win32') {
    for (const key of Object.keys(result)) {
      if (Object.hasOwn(overrides, key.toUpperCase())) delete result[key];
    }
  }
  return { ...result, ...overrides };
}

export function outputPlanEnv(
  env: NodeJS.ProcessEnv,
  flavor: string,
  appMode: BuildAppMode = 'ssr',
): NodeJS.ProcessEnv {
  validateFlavor(flavor);
  return overrideEnv(env, {
    NODE_ENV: 'production',
    FLAVOR: flavor,
    META_FLAVOR: flavor,
    META_MODE: 'production',
    META_APP_MODE: appMode,
  });
}

export function compilationEnv(
  env: NodeJS.ProcessEnv,
  privateOutDir: string,
  flavor: string,
  appMode: BuildAppMode = 'ssr',
): NodeJS.ProcessEnv {
  validateFlavor(flavor);
  // Both Vite and the extension understand this app-relative path. Keep artifacts
  // inside the owned generated root, not the shared zova/dist tree (or an absolute
  // path that path.join(appDir, getOutDir()) would reinterpret in older versions).
  if (
    !/^\.quasar-build-[a-zA-Z0-9-]+\/output\/(?:ssr|spa)-[\w-]+$/.test(privateOutDir) ||
    path.posix.basename(privateOutDir) !== `${appMode}-${flavor}`
  ) {
    throw failure('Compilation output must be the canonical private generated-root path');
  }
  return overrideEnv(outputPlanEnv(env, flavor, appMode), {
    BUILD_OUTDIR: privateOutDir,
    BUILD_COPY_DIST: '',
    BUILD_COPY_RELEASE: '',
    BUILD_REST_COPY_DIST: '',
  });
}

export function buildGeneratedRoots(zovaDir: string, runDir: string): BuildGeneratedRoots {
  const id = path.basename(runDir).replace(/^zova-build-/, '');
  if (!/^[a-z0-9-]+$/i.test(id) || path.basename(runDir) !== `zova-build-${id}`)
    throw failure('Invalid private build run name');
  return {
    quasar: path.join(zovaDir, `.quasar-build-${id}`),
    runtime: path.join(zovaDir, `.zova-build-${id}`),
    rest: path.join(zovaDir, `.zova-rest-build-${id}`),
  };
}

export function generatedBuildEnv(
  env: NodeJS.ProcessEnv,
  roots: BuildGeneratedRoots,
): NodeJS.ProcessEnv {
  return overrideEnv(env, {
    ZOVA_ISOLATED: 'true',
    ZOVA_RUNTIME_DIR: path.basename(roots.runtime),
    ZOVA_QUASAR_ROOT: roots.quasar,
    ZOVA_QUASAR_CACHE: path.join(roots.quasar, 'cache'),
    ZOVA_QUASAR_CONFIG_DIR: path.join(roots.quasar, 'config'),
    ZOVA_REST_DIR: path.basename(roots.rest),
    ZOVA_REST_TSCONFIG: `.tsconfig.rest-build-${path.basename(roots.rest).slice('.zova-rest-build-'.length)}.json`,
  });
}

export function createBuildTargets(
  zovaDir: string,
  flavor: string,
  plan: OutputPlan,
  sources: { ssr?: string; rest?: string; spa?: string },
): BuildTarget[] {
  validateFlavor(flavor);
  if (!/^[a-z0-9][\w.+-]*$/i.test(plan.appVersion))
    throw failure('Missing or unsafe APP_VERSION in output plan');
  const targets: BuildTarget[] = [];
  for (const appMode of ['ssr', 'spa'] as const) {
    const source = sources[appMode];
    if (!source) continue;
    validateOutputPath(plan.buildOutDir);
    const name = `${appMode}-${flavor}`;
    const releaseName = `${name}-${plan.appVersion}`;
    const intendedOut = plan.buildOutDir
      ? path.resolve(zovaDir, plan.buildOutDir)
      : path.join(zovaDir, 'dist', name);
    targets.push(
      { source, destination: path.join(zovaDir, 'dist', name) },
      { source, destination: intendedOut },
      { source, destination: path.join(zovaDir, 'dist-releases', releaseName) },
    );
    addCopies(source, plan.buildCopyDist, path.basename(intendedOut));
    addCopies(source, plan.buildCopyRelease, releaseName);
  }
  if (sources.rest) {
    const name = `rest-${flavor}`;
    targets.push(
      { source: sources.rest, destination: path.join(zovaDir, 'dist', name) },
      {
        source: sources.rest,
        destination: path.join(zovaDir, 'dist-releases', `${name}-${plan.appVersion}`),
      },
    );
    const kebab = (flavor[0]!.toLowerCase() + flavor.slice(1))
      .replace(/([A-Z])/g, '-$1')
      .toLowerCase();
    addCopies(sources.rest, plan.buildRestCopyDist, kebab);
  }
  return targets.filter(
    (target, index) =>
      targets.findIndex(
        other =>
          samePath(other.destination, target.destination) && samePath(other.source, target.source),
      ) === index,
  );
  function addCopies(source: string, value: string, name: string) {
    if (!value) return;
    for (const dir of value.split(',')) {
      if (!dir.trim() || dir !== dir.trim())
        throw failure('Empty or padded build copy destination is unsupported');
      validateOutputPath(dir);
      targets.push({ source, destination: path.resolve(zovaDir, dir, name) });
    }
  }
}

// Resolve existing ancestors without requiring the final output to exist.
async function canonical(file: string): Promise<string> {
  file = path.resolve(file);
  try {
    return await realpath(file);
  } catch (error) {
    if (!missing(error)) throw error;
    const parent = path.dirname(file);
    if (parent === file) throw error;
    return path.join(await canonical(parent), path.basename(file));
  }
}

export async function validateBuildTargets(
  targets: BuildTarget[],
  options: TargetOptions,
): Promise<void> {
  const root = await realpath(options.rootDir);
  const zova = await realpath(options.zovaDir);
  const run = await realpath(options.runDir);
  let artifactRoot = run;
  if (options.artifactRoot) {
    const expected = buildGeneratedRoots(zova, run).quasar;
    if (!samePath(options.artifactRoot, expected) || (await lstat(expected)).isSymbolicLink())
      throw failure('Build artifact root must be the owned generated root');
    artifactRoot = await realpath(expected);
    if (
      !samePath(artifactRoot, expected) ||
      (await readFile(path.join(expected, 'owner.json'), 'utf8')) !==
        (await readFile(path.join(run, 'owner.json'), 'utf8'))
    ) {
      throw failure('Build artifact root ownership changed');
    }
  }
  const destinations: string[] = [];
  for (const target of targets) {
    validateOutputPath(target.destination);
    const destination = await canonical(target.destination);
    validateOutputPath(destination);
    const source = await canonical(target.source);
    if (!within(artifactRoot, source) || samePath(source, artifactRoot))
      throw failure('Build artifact source must belong to this private run');
    if (
      overlaps(run, destination) ||
      overlaps(artifactRoot, destination) ||
      within(destination, root)
    ) {
      throw failure('Build target overlaps the checkout or private run');
    }
    if ((await exists(target.destination)) && (await lstat(target.destination)).isSymbolicLink())
      throw failure('Build target must not replace a symlink');
    const parts = [
      ...path.resolve(target.destination).split(path.sep),
      ...destination.split(path.sep),
    ].map(pathComponent);
    if (
      parts.some(part =>
        ['node_modules', '.git', '.zova', '.quasar', 'run', '.cache'].includes(part),
      )
    ) {
      throw failure('Build target overlaps runtime, cache or dependencies');
    }
    if (within(root, destination)) {
      // These are artifact surfaces, not permission to replace arbitrary source.
      const rel = pathComponent(path.relative(root, destination).split(path.sep).join('/'));
      const artifact =
        (within(path.join(zova, 'dist'), destination) &&
          !samePath(destination, path.join(zova, 'dist'))) ||
        (within(path.join(zova, 'dist-releases'), destination) &&
          !samePath(destination, path.join(zova, 'dist-releases'))) ||
        /^vona\/\.zova-rest\/[^/]+(?:\/.*)?$/.test(rel) ||
        /^(?:vona|zova)\/src\/(?:module(?:-vendor)?\/[^/]+|suite(?:-vendor)?\/[^/]+\/modules\/[^/]+)\/assets\/site\/[^/]+(?:\/.*)?$/.test(
          rel,
        );
      if (!artifact)
        throw failure('Build target overlaps checkout source or an unsupported artifact surface');
    }
    if (destinations.some(other => overlaps(other, destination)))
      throw failure('Build destinations overlap');
    destinations.push(destination);
  }
}

/** Stage all artifacts first, then replace with same-parent backups and rollback. */
export async function publishBuildTargets(
  targets: BuildTarget[],
  options: TargetOptions & {
    beforeReplace?: (target: BuildTarget, index: number) => Promise<void>;
  },
): Promise<void> {
  await validateBuildTargets(targets, options);
  const staged: {
    target: BuildTarget;
    container: string;
    backup: string;
    replacement: string;
    moved: boolean;
    installed: boolean;
  }[] = [];
  let preserveBackups = false;
  try {
    for (const target of targets) {
      const stat = await lstat(target.source);
      if (!stat.isDirectory() || stat.isSymbolicLink())
        throw failure('Build artifact must be a real directory');
      await mkdir(path.dirname(target.destination), { recursive: true });
      const container = await mkdtemp(
        path.join(path.dirname(target.destination), '.zova-publish-'),
      );
      const item = {
        target,
        container,
        backup: path.join(container, 'previous'),
        replacement: path.join(container, 'replacement'),
        moved: false,
        installed: false,
      };
      staged.push(item);
      await copySnapshotTree(target.source, item.replacement);
    }
    await validateBuildTargets(targets, options);
    for (const [index, item] of staged.entries()) {
      await options.beforeReplace?.(item.target, index);
      if (await exists(item.target.destination)) {
        await rename(item.target.destination, item.backup);
        item.moved = true;
      }
      await rename(item.replacement, item.target.destination);
      item.installed = true;
    }
  } catch (cause) {
    const rollbackErrors: unknown[] = [];
    for (const item of staged.toReversed()) {
      try {
        if (item.installed) await rm(item.target.destination, { recursive: true, force: true });
        if (item.moved) await rename(item.backup, item.target.destination);
      } catch (error) {
        rollbackErrors.push(error);
      }
    }
    if (rollbackErrors.length) {
      preserveBackups = true;
      throw new AggregateError(
        [cause, ...rollbackErrors],
        `Artifact handoff and rollback failed; retain .zova-publish-* backups beside outputs: ${staged
          .filter(item => item.moved)
          .map(item => item.container)
          .join(', ')}`,
      );
    }
    throw failure('Artifact handoff failed; previous outputs restored', cause);
  } finally {
    if (!preserveBackups) {
      for (const item of staged) await rm(item.container, { recursive: true, force: true });
    }
  }
}

export async function runPairedBuild(options: {
  flavor: string;
  runSSR: () => Promise<void>;
  runREST: () => Promise<void>;
  publish: () => Promise<void>;
}): Promise<void> {
  validateFlavor(options.flavor);
  await options.runSSR();
  await options.runREST();
  await options.publish();
}

export async function withBuildLock(
  rootDir: string,
  operation: (runDir: string, roots: BuildGeneratedRoots) => Promise<void>,
): Promise<void> {
  const base = path.join(rootDir, 'run');
  await mkdir(base, { recursive: true });
  if ((await lstat(base)).isSymbolicLink())
    throw failure('Build run directory must not be a symlink');
  const lock = path.join(base, 'zova-build.lock');
  try {
    await mkdir(lock);
  } catch (cause) {
    throw failure(
      'Another isolated Zova build owns run/zova-build.lock; no stale-lock takeover is automatic',
      cause,
    );
  }
  const owner = JSON.stringify({ pid: process.pid, token: randomUUID() });
  let runDir: string | undefined;
  const generated: string[] = [];
  let restTsconfig: string | undefined;
  const identities = new Map<string, Stats>();
  let retain = false;
  let primary: unknown;
  let failed = false;
  try {
    await writeFile(path.join(lock, 'owner.json'), owner, { flag: 'wx', mode: 0o600 });
    runDir = await mkdtemp(path.join(base, 'zova-build-'));
    await writeFile(path.join(runDir, 'owner.json'), owner, { flag: 'wx', mode: 0o600 });
    identities.set(lock, await lstat(lock));
    identities.set(runDir, await lstat(runDir));
    const zova = path.join(rootDir, 'zova');
    await mkdir(zova, { recursive: true });
    if ((await lstat(zova)).isSymbolicLink())
      throw failure('Zova application directory must not be a symlink');
    const roots = buildGeneratedRoots(zova, runDir);
    for (const directory of Object.values(roots)) {
      await mkdir(directory, { mode: 0o700 });
      identities.set(directory, await lstat(directory));
      generated.push(directory);
      await writeFile(path.join(directory, 'owner.json'), owner, { flag: 'wx', mode: 0o600 });
    }
    await mkdir(path.join(roots.quasar, 'cache'));
    await mkdir(path.join(roots.quasar, 'config'));
    await mkdir(path.join(roots.quasar, 'output'));
    // rolldown-plugin-dts derives --rootDir from the tsconfig's directory. Keep
    // this owned generated file beside the application tsconfig, not in REST's
    // private entry root. REST updates it in place, preserving this identity.
    const tsconfig = path.join(zova, generatedBuildEnv({}, roots).ZOVA_REST_TSCONFIG!);
    await writeFile(tsconfig, '{}\n', { flag: 'wx', mode: 0o600 });
    restTsconfig = tsconfig;
    identities.set(tsconfig, await lstat(tsconfig));
    await operation(runDir, roots);
  } catch (error) {
    retain = !!(error as { retainRun?: boolean }).retainRun;
    primary = error;
    failed = true;
  }
  if (!retain) {
    try {
      // Never remove a replaced directory, even if it occupies our former name.
      for (const directory of [lock, ...(runDir ? [runDir] : []), ...generated]) {
        const stat = await lstat(directory);
        const identity = identities.get(directory);
        if (
          !stat.isDirectory() ||
          stat.isSymbolicLink() ||
          (identity && (stat.dev !== identity.dev || stat.ino !== identity.ino)) ||
          (await readFile(path.join(directory, 'owner.json'), 'utf8')) !== owner
        ) {
          throw failure('Build directory ownership changed; scratch and lock retained');
        }
      }
      if (restTsconfig) {
        const stat = await lstat(restTsconfig);
        const identity = identities.get(restTsconfig)!;
        if (
          !stat.isFile() ||
          stat.isSymbolicLink() ||
          stat.nlink !== 1 ||
          stat.dev !== identity.dev ||
          stat.ino !== identity.ino
        ) {
          throw failure('Build tsconfig ownership changed; scratch and lock retained');
        }
      }
      if (restTsconfig) await rm(restTsconfig);
      for (const directory of generated.toReversed()) await rm(directory, { recursive: true });
      if (runDir) await rm(runDir, { recursive: true, force: true });
      await rm(lock, { recursive: true });
    } catch (cleanupError) {
      if (failed) {
        throw new AggregateError(
          [primary, cleanupError],
          'Build failed and private scratch cleanup failed',
        );
      }
      throw cleanupError;
    }
  } else {
    console.error(
      '[zova-build] Children did not drain; generated roots, private run and build lock retained for manual inspection',
    );
  }
  if (failed) throw primary;
}

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));
const inspectProcesses = promisify(execFile);
async function groupAlive(pid: number) {
  // Inspect rather than signal(0): on Darwin a reaped leader can produce EPERM
  // even when its group is gone. Zombies cannot write generated files.
  const { stdout } = await inspectProcesses(
    'ps',
    ['-A', '-o', 'pid=', '-o', 'pgid=', '-o', 'state='],
    { timeout: 5000, maxBuffer: 4 * 1024 * 1024 },
  );
  return stdout.split('\n').some(line => {
    const [member, group, state] = line.trim().split(/\s+/);
    return member && group && state && Number(group) === pid && !state.startsWith('Z');
  });
}
function signalGroup(pid: number, signal: NodeJS.Signals) {
  try {
    process.kill(-pid, signal);
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code !== 'ESRCH') throw error;
  }
}

export class OwnedBuildChildren {
  interrupted?: NodeJS.Signals;
  active?: number;
  stopError?: Error;
  private windowsStarter?: typeof startWindowsBuildProcess;
  private windowsProcess?: OwnedProcess;
  private windowsStop?: Promise<void>;
  private windowsStopFailure?: (error: Error) => void;

  // Only the Windows acquisition seam is injectable; normal execution uses the native platform.
  constructor(windowsStarter?: typeof startWindowsBuildProcess) {
    this.windowsStarter =
      windowsStarter ?? (process.platform === 'win32' ? startWindowsBuildProcess : undefined);
  }

  onSignal = (signal: NodeJS.Signals) => {
    this.interrupted ??= signal;
    if (this.windowsStarter) {
      this.stopWindows();
      return;
    }
    try {
      if (this.active) signalGroup(this.active, signal);
    } catch (cause) {
      this.stopError = Object.assign(failure('Cannot signal owned build process group', cause), {
        retainRun: true,
      });
    }
  };

  check() {
    if (this.stopError) throw this.stopError;
    if (this.interrupted) {
      throw Object.assign(failure(`Build interrupted by ${this.interrupted}`), {
        signal: this.interrupted,
      });
    }
  }

  private stopWindows() {
    if (!this.windowsProcess || this.windowsStop) return;
    const owned = this.windowsProcess;
    // Defer invocation so both a synchronous throw and a rejected stop are observed.
    this.windowsStop = Promise.resolve().then(async () => {
      try {
        const result = await owned.stop();
        if (result.type !== 'drained') throw failure('Windows stop did not prove drainage');
      } catch (cause) {
        this.stopError = Object.assign(
          failure('Cannot prove Windows build children stopped', cause),
          {
            retainRun: true,
          },
        );
        this.windowsStopFailure?.(this.stopError);
      }
    });
  }

  private async runWindows(args: string[], cwd: string, env: NodeJS.ProcessEnv) {
    const stopFailed = new Promise<never>((_, reject) => {
      this.windowsStopFailure = reject;
    });
    void stopFailed.catch(() => {});
    let drained = false;
    try {
      try {
        this.windowsProcess = await this.windowsStarter!(process.execPath, args, cwd, env);
      } catch (cause) {
        // A rejected acquisition does not provide an OwnedProcess/drainage proof.
        throw Object.assign(failure('Cannot acquire Windows build process ownership', cause), {
          retainRun: true,
        });
      }
      // A signal can arrive before acquisition returns. Stop the eventual owned child too.
      if (this.interrupted) this.stopWindows();
      let result;
      try {
        result = await Promise.race([this.windowsProcess.wait(), stopFailed]);
        if (result.type !== 'drained') throw failure('Windows build wait did not prove drainage');
        drained = true;
      } catch (cause) {
        throw Object.assign(failure('Cannot prove Windows build children drained', cause), {
          retainRun: true,
        });
      }
      // wait() can resolve before a cancellation stop promise; cleanup must await both.
      if (this.windowsStop) await this.windowsStop;
      this.check();
      if (!result.result || result.result.code !== 0 || result.result.signal || result.failed) {
        throw Object.assign(
          failure(
            `Zova build child failed: ${result.result?.signal ?? `exit ${result.result?.code ?? 'unknown'}`}`,
          ),
          { exitCode: result.result?.code || 1, signal: result.result?.signal },
        );
      }
    } catch (error) {
      if (this.windowsProcess && !drained) this.stopWindows();
      if (this.windowsStop) await this.windowsStop;
      if (this.stopError) throw this.stopError;
      throw error;
    } finally {
      this.windowsProcess = undefined;
      this.windowsStop = undefined;
      this.windowsStopFailure = undefined;
    }
  }

  async run(args: string[], cwd: string, env: NodeJS.ProcessEnv): Promise<void> {
    this.check();
    if (this.windowsStarter) return await this.runWindows(args, cwd, env);
    const child = spawn(process.execPath, args, {
      cwd,
      env,
      detached: true,
      shell: false,
      stdio: 'inherit',
    });
    this.active = child.pid;
    let timer: ReturnType<typeof setInterval> | undefined;
    try {
      const result = await new Promise<{ code: number | null; signal: NodeJS.Signals | null }>(
        (resolve, reject) => {
          child.once('error', reject);
          child.once('close', (code, signal) => resolve({ code, signal }));
          // A child may ignore SIGTERM. Escalate only our live, owned process group.
          let interruptedAt: number | undefined;
          timer = setInterval(() => {
            if (!this.interrupted) return;
            interruptedAt ??= Date.now();
            if (child.pid && Date.now() - interruptedAt > 3000) {
              try {
                signalGroup(child.pid, 'SIGKILL');
              } catch (cause) {
                this.stopError = Object.assign(failure('Cannot stop owned build children', cause), {
                  retainRun: true,
                });
                reject(this.stopError);
              }
            }
          }, 100);
        },
      );
      if (child.pid) await this.drain(child.pid);
      this.check();
      if (result.code !== 0 || result.signal) {
        throw Object.assign(
          failure(`Zova build child failed: ${result.signal ?? `exit ${result.code}`}`),
          { exitCode: result.code ?? 1, signal: result.signal },
        );
      }
    } catch (error) {
      if (child.pid) await this.drain(child.pid);
      throw error;
    } finally {
      if (timer) clearInterval(timer);
      this.active = undefined;
    }
  }

  async drain(pid: number) {
    try {
      if (!(await groupAlive(pid))) return;
      signalGroup(pid, 'SIGTERM');
      for (let i = 0; i < 30 && (await groupAlive(pid)); i++) await delay(100);
      if (!(await groupAlive(pid))) return;
      signalGroup(pid, 'SIGKILL');
      for (let i = 0; i < 30 && (await groupAlive(pid)); i++) await delay(100);
      if (await groupAlive(pid)) throw failure('Owned build process group did not drain');
    } catch (cause) {
      throw Object.assign(failure('Cannot prove owned build children drained', cause), {
        retainRun: true,
      });
    }
  }
}

async function resolveQuasar(zova: string): Promise<string> {
  try {
    const require = createRequire(path.join(zova, 'package.json'));
    const manifest = require.resolve('@quasar/app-vite/package.json');
    const pkg = JSON.parse(await readFile(manifest, 'utf8'));
    const bin = typeof pkg.bin === 'string' ? pkg.bin : pkg.bin?.quasar;
    if (typeof bin !== 'string') throw failure('Quasar package has no executable');
    const executable = await realpath(path.resolve(path.dirname(manifest), bin));
    return executable;
  } catch (cause) {
    throw failure(
      'Prepared Quasar dependencies required; run the existing dependency preparation deliberately before retrying',
      cause,
    );
  }
}
const OUTPUT_PLAN_LIMIT = 64 * 1024;

/** Read only a bounded, private regular result after the helper's verified drainage. */
export async function readOutputPlan(file: string): Promise<OutputPlan> {
  const before = await lstat(file);
  if (
    !before.isFile() ||
    before.isSymbolicLink() ||
    before.nlink !== 1 ||
    before.size > OUTPUT_PLAN_LIMIT
  ) {
    throw failure('Output-plan result must be a bounded single-link regular file');
  }
  const handle = await open(file, constants.O_RDONLY | (constants.O_NOFOLLOW ?? 0));
  try {
    const opened = await handle.stat();
    if (
      !opened.isFile() ||
      opened.nlink !== 1 ||
      opened.size > OUTPUT_PLAN_LIMIT ||
      opened.dev !== before.dev ||
      opened.ino !== before.ino
    ) {
      throw failure('Output-plan result changed or is not a bounded regular file');
    }
    const buffer = Buffer.alloc(OUTPUT_PLAN_LIMIT + 1);
    let length = 0;
    while (length < buffer.length) {
      const { bytesRead } = await handle.read(buffer, length, buffer.length - length, null);
      if (!bytesRead) break;
      length += bytesRead;
    }
    if (length > OUTPUT_PLAN_LIMIT) throw failure('Output-plan result exceeds 64 KiB');
    return outputPlan(JSON.parse(buffer.toString('utf8', 0, length)));
  } finally {
    await handle.close();
  }
}

function outputPlan(message: unknown): OutputPlan {
  const keys = [
    'appVersion',
    'buildOutDir',
    'buildCopyDist',
    'buildCopyRelease',
    'buildRestCopyDist',
  ];
  if (
    !message ||
    typeof message !== 'object' ||
    Object.keys(message).length !== keys.length ||
    keys.some(
      key =>
        !Object.hasOwn(message, key) ||
        typeof (message as Record<string, unknown>)[key] !== 'string',
    )
  ) {
    throw failure('Invalid output-plan result payload');
  }
  return message as OutputPlan;
}

export async function validateBuildArtifacts(sources: {
  ssr?: string;
  rest?: string;
  spa?: string;
}): Promise<void> {
  const required = {
    ssr: ['handler.js', 'index.js', 'quasar.manifest.json', 'client'],
    rest: ['index.mjs', 'index.d.mts', 'package.json'],
    spa: ['index.html', 'assets'],
  };
  for (const mode of ['ssr', 'rest', 'spa'] as const) {
    const dir = sources[mode];
    if (!dir) continue;
    for (const file of required[mode]) {
      const artifact = path.join(dir, file);
      if (!(await exists(artifact)) || !within(dir, await realpath(artifact)))
        throw failure(`${mode} build is missing a contained required artifact: ${file}`);
    }
    if (mode === 'spa' && !(await readdir(path.join(dir, 'assets'))).length)
      throw failure('SPA build has no emitted assets');
  }
}

export async function buildZovaIsolated(
  flavors: string[],
  rootDir = ROOT_DIR,
  operation: BuildOperation = 'pair',
): Promise<void> {
  parseBuildRequest(['--operation', operation, ...flavors]);
  const appMode: BuildAppMode = operation === 'spa' ? 'spa' : 'ssr';
  if (
    Object.keys(process.env).some(
      key =>
        (process.platform === 'win32' ? key.toUpperCase() : key) === 'NODE_PATH' &&
        process.env[key],
    )
  ) {
    throw failure('NODE_PATH overrides are unsupported for isolated builds');
  }
  rootDir = await realpath(rootDir);
  const children = new OwnedBuildChildren();
  const onInt = () => children.onSignal('SIGINT');
  const onTerm = () => children.onSignal('SIGTERM');
  process.on('SIGINT', onInt);
  process.on('SIGTERM', onTerm);
  try {
    await withBuildLock(rootDir, async (runDir, roots) => {
      const zova = path.join(rootDir, 'zova');
      process.stdout.write(
        '[zova-build] using prepared workspace with private generated roots; coordinate source/dependency generation throughout the build\n',
      );
      children.check();
      for (const file of [
        'package.json',
        'src/front/typing/modules.d.ts',
        ...(operation === 'ssr' || operation === 'pair' ? ['src-ssr/server.ts'] : []),
        'packages-cli/cli/src/bin/zova.ts',
      ]) {
        if (!(await exists(path.join(zova, file)))) {
          throw failure(
            `Prepared Zova workspace required: missing ${file}; run npm run deps:zova deliberately from the repository root before retrying`,
          );
        }
      }
      const quasar = operation === 'rest' ? undefined : await resolveQuasar(zova);
      const helper = path.join(ROOT_DIR, 'scripts/buildZovaOutputPlan.ts');
      const generatedEnv = generatedBuildEnv(process.env, roots);
      for (const flavor of flavors) {
        children.check();
        const resultFile = path.join(runDir, `output-plan-${randomUUID()}.json`);
        await children.run(
          [helper, zova, flavor, resultFile, appMode],
          zova,
          outputPlanEnv(generatedEnv, flavor, appMode),
        );
        const plan = await readOutputPlan(resultFile);
        const sources: { ssr?: string; rest?: string; spa?: string } = {};
        if (operation !== 'rest')
          sources[appMode] = path.join(roots.quasar, 'output', `${appMode}-${flavor}`);
        if (operation === 'pair' || operation === 'rest')
          sources.rest = path.join(roots.quasar, 'output', `rest-${flavor}`);
        const targets = createBuildTargets(zova, flavor, plan, sources);
        const options = { rootDir, zovaDir: zova, runDir, artifactRoot: roots.quasar };
        await validateBuildTargets(targets, options);
        const env = overrideEnv(
          compilationEnv(
            generatedEnv,
            `${path.basename(roots.quasar)}/output/${appMode}-${flavor}`,
            flavor,
            appMode,
          ),
          { ZOVA_REST_OUTDIR: sources.rest },
        );
        process.stdout.write(`[zova-build] compiling ${operation}: ${flavor}\n`);
        const runFrontend = async () => {
          await children.run([quasar!, 'build', '--mode', appMode, '--flavor', flavor], zova, env);
        };
        const runREST = async () => {
          await children.run(
            [
              path.join(zova, 'packages-cli/cli/src/bin/zova.ts'),
              ':bin:buildRest',
              '--flavor',
              flavor,
            ],
            zova,
            env,
          );
        };
        const publish = async () => {
          children.check();
          await validateBuildArtifacts(sources);
          await publishBuildTargets(targets, options);
          children.check();
        };
        if (operation === 'pair') {
          await runPairedBuild({ flavor, runSSR: runFrontend, runREST, publish });
        } else {
          if (operation === 'rest') await runREST();
          else await runFrontend();
          await publish();
        }
        process.stdout.write(`[zova-build] published ${operation} artifacts: ${flavor}\n`);
      }
    });
  } finally {
    process.off('SIGINT', onInt);
    process.off('SIGTERM', onTerm);
  }
}

if (process.argv[1] && fileURLToPath(import.meta.url) === path.resolve(process.argv[1])) {
  try {
    const { operation, flavors } = parseBuildRequest(process.argv.slice(2));
    await buildZovaIsolated(flavors, ROOT_DIR, operation);
  } catch (error) {
    console.error(error);
    const result = error as { exitCode?: number; signal?: NodeJS.Signals };
    process.exitCode =
      result.signal === 'SIGINT' ? 130 : result.signal === 'SIGTERM' ? 143 : result.exitCode || 1;
  }
}
