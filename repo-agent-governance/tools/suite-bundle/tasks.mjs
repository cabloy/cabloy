import { spawnSync } from 'node:child_process';
import { existsSync, readFileSync, renameSync, rmSync, writeFileSync } from 'node:fs';
import { resolve } from 'node:path';

export const TASK_SCHEMA_VERSION = 1;
export const TASK_KINDS = [
  'ensureSsrRegistration',
  'vonaMetadata',
  'zovaMetadata',
  'depsZova',
  'openapiSdk',
  'zovaBuildPair',
  'depsVona',
  'specCharts',
];

function jsonFile(path) {
  if (!existsSync(path)) return null;
  try {
    return JSON.parse(readFileSync(path, 'utf8'));
  } catch {
    throw new Error(`invalid JSON manifest: ${path}`);
  }
}

function quote(value) {
  return String(value).replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

function literal(source, key, start = 0) {
  const match = source.slice(start).match(new RegExp(`${quote(key)}\\s*:\\s*['\"]([^'\"]+)['\"]`));
  return match ? { value: match[1], index: start + match.index + match[0].length } : null;
}

function parseSsrDeclaration(path, source) {
  const result = [];
  let cursor = 0;
  while (true) {
    const marker = source.indexOf('@SsrSite', cursor);
    if (marker < 0) break;
    const open = source.indexOf('{', marker);
    if (open < 0) break;
    const close = source.indexOf('})', open);
    if (close < 0) break;
    const body = source.slice(open + 1, close);
    const siteId = literal(body, 'siteId');
    const publicPath = literal(body, 'publicPath');
    const bundlePath = literal(body, 'bundlePath');
    const diagnostics = body.match(/diagnostics\s*:\s*\{/);
    const buildCommand = diagnostics
      ? literal(body, 'buildCommand', diagnostics.index + diagnostics[0].length)
      : null;
    if (!siteId || !bundlePath || !buildCommand)
      throw new Error(`SSR declaration is incomplete: ${path}`);
    result.push({
      path,
      siteId: siteId.value,
      publicPath: publicPath?.value ?? '',
      bundlePath: bundlePath.value,
      buildCommand: buildCommand.value,
    });
    cursor = close + 2;
  }
  return result;
}

function safeBuildScript(key, value) {
  if (!/^build:zova:(?:[a-z][a-z0-9-]*:)*[a-z][a-z0-9-]*$/i.test(key)) return false;
  return (
    /^node scripts\/buildZovaIsolated\.ts(?: [a-z][a-z0-9-]*(?: [a-z][a-z0-9-]*)*)?$/i.test(
      value,
    ) || /^npm run build:zova:(?:[a-z][a-z0-9-]*:)*[a-z][a-z0-9-]*$/i.test(value)
  );
}

function safeZovaBuildScript(key, value) {
  if (!/^build:(?:ssr|rest):[a-z][a-z0-9-]*$/i.test(key)) return false;
  return /^npm run build:isolated -- --operation (?:ssr|rest) [a-z][a-z0-9-]*$/i.test(value);
}

function rootScriptCommand(scripts, key, seen = new Set()) {
  if (seen.has(key)) return null;
  seen.add(key);
  const value = scripts[key];
  if (typeof value !== 'string') return null;
  const nested = value.match(/^npm run (build:zova:(?:[a-z][a-z0-9-]*:)*[a-z][a-z0-9-]*)$/i);
  return nested ? rootScriptCommand(scripts, nested[1], seen) : value;
}

function flavorsFromRootScript(scripts, key, seen = new Set()) {
  if (seen.has(key)) return [];
  seen.add(key);
  const value = scripts[key];
  if (typeof value !== 'string') return [];
  const nested = value.match(/^npm run (build:zova:(?:[a-z][a-z0-9-]*:)*[a-z][a-z0-9-]*)$/i);
  if (nested) return flavorsFromRootScript(scripts, nested[1], seen);
  const direct = value.match(
    /^node scripts\/buildZovaIsolated\.ts(?: ([a-z][a-z0-9-]*(?: [a-z][a-z0-9-]*)*))?$/i,
  );
  return direct?.[1]?.split(' ') ?? [];
}

function deriveSsr(root, suite, resources) {
  const rootPackage = jsonFile(resolve(root, 'package.json')) ?? {};
  const zovaPackage = jsonFile(resolve(root, 'zova/package.original.json')) ?? {};
  const rootScripts = rootPackage.scripts ?? {};
  const zovaScripts = zovaPackage.scripts ?? {};
  const declarations = [];
  for (const resource of resources) {
    if (
      !resource.path.startsWith(`vona/src/suite/${suite}/`) ||
      !/\/ssrSite[^/]*\.ts$/.test(resource.path)
    ) {
      continue;
    }
    declarations.push(...parseSsrDeclaration(resource.path, resource.data.toString('utf8')));
  }
  const registrations = [];
  const flavors = new Set();
  for (const declaration of declarations) {
    let rootScriptKey = null;
    if (declaration.buildCommand) {
      const match = declaration.buildCommand.match(
        /^npm run (build:zova:(?:[a-z][a-z0-9-]*:)*[a-z][a-z0-9-]*)$/i,
      );
      if (match) rootScriptKey = match[1];
    }
    if (!rootScriptKey) {
      const candidate = Object.keys(rootScripts).find(
        key =>
          rootScripts[key] === declaration.buildCommand && safeBuildScript(key, rootScripts[key]),
      );
      rootScriptKey = candidate ?? null;
    }
    const rootScriptValue = rootScriptKey ? rootScripts[rootScriptKey] : null;
    const resolvedRootScript = rootScriptKey ? rootScriptCommand(rootScripts, rootScriptKey) : null;
    const foundFlavors = rootScriptKey ? flavorsFromRootScript(rootScripts, rootScriptKey) : [];
    for (const flavor of foundFlavors) flavors.add(flavor);
    if (
      !rootScriptKey ||
      !safeBuildScript(rootScriptKey, rootScriptValue) ||
      !resolvedRootScript ||
      !foundFlavors.length
    ) {
      throw new Error(`SSR declaration has no safe root build mapping: ${declaration.path}`);
    }
    for (const flavor of foundFlavors) {
      const ssrKey = `build:ssr:${flavor}`;
      const restKey = `build:rest:${flavor}`;
      const ssrValue = zovaScripts[ssrKey];
      const restValue = zovaScripts[restKey];
      if (!safeZovaBuildScript(ssrKey, ssrValue) || !safeZovaBuildScript(restKey, restValue)) {
        throw new Error(`SSR flavor has no safe paired Zova build mapping: ${flavor}`);
      }
      registrations.push({
        siteId: declaration.siteId,
        publicPath: declaration.publicPath,
        bundlePath: declaration.bundlePath,
        flavor,
        root: { path: 'package.json', key: rootScriptKey, value: rootScriptValue },
        zova: [
          { path: 'zova/package.original.json', key: ssrKey, value: ssrValue },
          { path: 'zova/package.original.json', key: restKey, value: restValue },
        ],
        evidence: [declaration.path],
      });
    }
  }
  return { registrations, flavors: [...flavors].toSorted() };
}

function task(id, kind, order, suite, extra = {}) {
  return {
    id,
    kind,
    order,
    edition: extra.edition,
    suite,
    approvalRequired: true,
    failurePolicy: 'stop',
    ...extra,
  };
}

export function requiredCommandsForTasks(plan) {
  return plan.tasks
    .filter(item => item.applicable !== false && item.kind !== 'ensureSsrRegistration')
    .map(item => {
      switch (item.kind) {
        case 'vonaMetadata':
          return 'npm run vona :tools:metadata -- --force';
        case 'zovaMetadata':
          return 'npm run zova :tools:metadata -- --force';
        case 'depsZova':
          return 'npm run deps:zova';
        case 'openapiSdk':
          return `npm run contract:generate:isolated -- ${item.module}`;
        case 'zovaBuildPair':
          return `npm run build:zova:isolated -- ${item.flavors.join(' ')}`;
        case 'depsVona':
          return 'npm run deps:vona';
        case 'specCharts':
          return `npm run spec:charts -- ${item.suite}`;
        default:
          return null;
      }
    })
    .filter((value, index, values) => value && values.indexOf(value) === index);
}

export function derivePostImportTasks({ root, suite, edition, resources }) {
  const ssr = deriveSsr(root, suite, resources);
  const moduleResources = resources.filter(item =>
    item.path.startsWith(`zova/src/suite/${suite}/modules/`),
  );
  const openapiModules = [
    ...new Set(
      moduleResources
        .filter(item => item.path.endsWith('/cli/openapi.config.ts'))
        .map(item => `${suite}/${item.path.split('/')[5]}`),
    ),
  ].toSorted();
  const specs = new Set(
    resources.filter(item => item.kind === 'specification').map(item => item.path),
  );
  const specRoot = `repo-specs/${suite}`;
  const chartInputs = ['README.md', 'pdp-wbs.md', 'progress.md', 'test-plan.md'].map(
    name => `${specRoot}/${name}`,
  );
  const tasks = [];
  let order = 0;
  if (ssr.registrations.length) {
    tasks.push(
      task(`ssr-registration-${suite}`, 'ensureSsrRegistration', order++, suite, {
        edition,
        registrations: ssr.registrations,
        flavors: ssr.flavors,
        expectedOutputs: ['package.json', 'zova/package.original.json'],
        evidence: [...new Set(ssr.registrations.flatMap(item => item.evidence))].toSorted(),
      }),
    );
  }
  tasks.push(
    task(`vona-metadata-${suite}`, 'vonaMetadata', order++, suite, {
      edition,
      scope: 'all-application-modules',
      expectedOutputs: ['vona/src/**/.metadata/**'],
    }),
    task(`zova-metadata-${suite}`, 'zovaMetadata', order++, suite, {
      edition,
      scope: 'all-application-modules',
      expectedOutputs: ['zova/src/**/.metadata/**'],
    }),
    task(`deps-zova-${suite}`, 'depsZova', order++, suite, {
      edition,
      expectedOutputs: ['zova/src/front/typing/modules.d.ts', 'zova/.zova/**'],
    }),
  );
  for (const module of openapiModules) {
    tasks.push(
      task(`openapi-${module.replaceAll('/', '-')}`, 'openapiSdk', order++, suite, {
        edition,
        module,
        evidence: [
          `zova/src/suite/${suite}/modules/${module.split('/').pop()}/cli/openapi.config.ts`,
        ],
        expectedOutputs: [`zova/src/suite/${suite}/modules/${module.split('/').pop()}/src/api/**`],
      }),
    );
  }
  if (ssr.flavors.length) {
    tasks.push(
      task(`zova-build-${suite}`, 'zovaBuildPair', order++, suite, {
        edition,
        flavors: ssr.flavors,
        expectedOutputs: [
          ...ssr.flavors.flatMap(flavor => [`zova/dist/ssr-${flavor}`, `zova/dist/rest-${flavor}`]),
          ...ssr.flavors.map(
            flavor => `vona/.zova-rest/${flavor.replace(/([A-Z])/g, '-$1').toLowerCase()}`,
          ),
        ],
        evidence: [...new Set(ssr.registrations.flatMap(item => item.evidence))].toSorted(),
      }),
    );
  }
  tasks.push(
    task(`deps-vona-${suite}`, 'depsVona', order++, suite, {
      edition,
      expectedOutputs: ['vona/.zova-rest/**'],
    }),
  );
  if (chartInputs.every(path => specs.has(path))) {
    tasks.push(
      task(`spec-charts-${suite}`, 'specCharts', order++, suite, {
        edition,
        evidence: chartInputs,
        expectedOutputs: [
          `${specRoot}/implementation-gantt.svg`,
          `${specRoot}/implementation-burndown.svg`,
        ],
      }),
    );
  }
  const ids = tasks.map(item => item.id);
  return {
    schemaVersion: TASK_SCHEMA_VERSION,
    authority: 'declarative-handoff',
    edition,
    suite,
    tasks: tasks.map((item, index) => ({
      ...item,
      dependsOn: index ? [ids[index - 1]] : [],
    })),
  };
}

function validateRegistration(registration) {
  if (
    !registration ||
    typeof registration.siteId !== 'string' ||
    !/^[a-z][a-z0-9-]*$/i.test(registration.siteId) ||
    !/^[a-z][a-zA-Z0-9-]*$/.test(registration.flavor)
  ) {
    throw new Error('SSR registration is invalid');
  }
  if (!/^build:zova:(?:[a-z][a-z0-9-]*:)*[a-z][a-z0-9-]*$/i.test(registration.root?.key))
    throw new Error('SSR registration root script is invalid');
  if (!safeBuildScript(registration.root.key, registration.root.value))
    throw new Error('SSR registration root command is not allowlisted');
  if (
    registration.root.path !== 'package.json' ||
    typeof registration.root.value !== 'string' ||
    !Array.isArray(registration.zova) ||
    registration.zova.length !== 2
  ) {
    throw new Error('SSR registration manifest mapping is invalid');
  }
  const expected = new Set([
    `build:ssr:${registration.flavor}`,
    `build:rest:${registration.flavor}`,
  ]);
  for (const entry of registration.zova) {
    if (
      entry.path !== 'zova/package.original.json' ||
      typeof entry.value !== 'string' ||
      !expected.delete(entry.key) ||
      !safeZovaBuildScript(entry.key, entry.value)
    ) {
      throw new Error('SSR registration Zova script is not allowlisted');
    }
  }
  if (expected.size) throw new Error('SSR registration is missing a paired Zova script');
}

export function validatePostImportTasks(plan, { suite, edition } = {}) {
  if (
    !plan ||
    plan.schemaVersion !== TASK_SCHEMA_VERSION ||
    plan.authority !== 'declarative-handoff'
  ) {
    throw new Error('invalid post-import task plan');
  }
  if (plan.edition !== edition || plan.suite !== suite || !Array.isArray(plan.tasks))
    throw new Error('post-import task plan does not match bundle');
  const ids = new Set();
  let previousOrder = -1;
  for (const item of plan.tasks) {
    if (!item || !TASK_KINDS.includes(item.kind) || typeof item.id !== 'string')
      throw new Error('post-import task has an unsupported kind or id');
    if (ids.has(item.id) || !Number.isInteger(item.order) || item.order <= previousOrder)
      throw new Error('post-import task order is invalid');
    if (!Array.isArray(item.dependsOn))
      throw new TypeError(`post-import task dependencies are invalid: ${item.id}`);
    ids.add(item.id);
    previousOrder = item.order;
    if (item.edition !== edition || item.suite !== suite || item.approvalRequired !== true)
      throw new Error(`post-import task scope is invalid: ${item.id}`);
    if (item.dependsOn.some(id => !ids.has(id)))
      throw new Error(`post-import task dependency is invalid: ${item.id}`);
    if (item.command || item.argv || item.cwd || item.environment)
      throw new Error(`post-import task contains executable command data: ${item.id}`);
    if (item.kind === 'ensureSsrRegistration') {
      if (!Array.isArray(item.registrations) || !item.registrations.length)
        throw new Error(`SSR registration task has no registrations: ${item.id}`);
      item.registrations.forEach(validateRegistration);
    }
    if (
      item.kind === 'zovaBuildPair' &&
      (!Array.isArray(item.flavors) ||
        !item.flavors.length ||
        item.flavors.some(flavor => !/^[a-z][a-zA-Z0-9-]*$/.test(flavor)))
    ) {
      throw new Error(`paired build task has no valid flavors: ${item.id}`);
    }
    if (
      item.kind === 'openapiSdk' &&
      (!/^[a-z][a-z0-9-]*\/[a-z][a-z0-9-]*$/.test(item.module) || !Array.isArray(item.evidence))
    ) {
      throw new Error(`OpenAPI task has no valid module evidence: ${item.id}`);
    }
    if (
      item.kind === 'specCharts' &&
      (!Array.isArray(item.evidence) ||
        item.evidence.length !== 4 ||
        item.evidence.some(
          path => typeof path !== 'string' || !path.startsWith(`repo-specs/${suite}/`),
        ))
    ) {
      throw new Error(`spec chart task has invalid evidence: ${item.id}`);
    }
  }
  return plan;
}

function packageJsonPath(root, relativePath) {
  return resolve(root, relativePath);
}

function ensureRegistration(root, registrations, { write = true } = {}) {
  const rootPath = packageJsonPath(root, 'package.json');
  const zovaPath = packageJsonPath(root, 'zova/package.original.json');
  const rootPackage = jsonFile(rootPath);
  const zovaPackage = jsonFile(zovaPath);
  if (!rootPackage?.scripts || !zovaPackage?.scripts)
    throw new Error('script registration manifest is missing');
  const isolatedRoot = rootPackage.scripts['build:zova:isolated'];
  if (isolatedRoot !== 'node scripts/buildZovaIsolated.ts')
    throw new Error('destination build:zova:isolated script is unavailable or customized');
  if (zovaPackage.scripts['build:isolated'] !== 'node ../scripts/buildZovaIsolated.ts')
    throw new Error('destination zova build:isolated script is unavailable or customized');
  const files = new Map([
    [rootPath, rootPackage],
    [zovaPath, zovaPackage],
  ]);
  const expectedRoot = new Map();
  const expectedZova = new Map();
  for (const registration of registrations) {
    validateRegistration(registration);
    expectedRoot.set(registration.root.key, registration.root.value);
    for (const entry of registration.zova) expectedZova.set(entry.key, entry.value);
  }
  for (const [key, value] of expectedRoot) {
    const current = rootPackage.scripts[key];
    if (current !== undefined && current !== value)
      throw new Error(`script registration conflicts with destination: package.json:${key}`);
    rootPackage.scripts[key] = value;
  }
  for (const [key, value] of expectedZova) {
    const current = zovaPackage.scripts[key];
    if (current !== undefined && current !== value) {
      throw new Error(
        `script registration conflicts with destination: zova/package.original.json:${key}`,
      );
    }
    zovaPackage.scripts[key] = value;
  }
  if (!write) return [...files.keys()];
  const staged = [];
  const backups = [];
  const installed = [];
  try {
    for (const [path, pkg] of files) {
      const temporary = `${path}.cabloy-suite-stage-${process.pid}`;
      writeFileSync(temporary, `${JSON.stringify(pkg, null, 2)}\n`);
      staged.push({ path, temporary });
    }
    for (const { path, temporary } of staged) {
      const backup = `${path}.cabloy-suite-backup-${process.pid}`;
      renameSync(path, backup);
      backups.push({ path, backup });
      renameSync(temporary, path);
      installed.push(path);
    }
    for (const { backup } of backups) rmSync(backup, { force: true });
  } catch (error) {
    for (const { temporary } of staged) rmSync(temporary, { force: true });
    for (const path of installed) rmSync(path, { force: true });
    for (const { path, backup } of backups) {
      if (existsSync(backup)) renameSync(backup, path);
    }
    throw error;
  }
  return [...files.keys()];
}

function fixedCommand(task, root) {
  const packageJson = jsonFile(resolve(root, 'package.json')) ?? {};
  const scripts = packageJson.scripts ?? {};
  const requireScript = name => {
    if (typeof scripts[name] !== 'string')
      throw new TypeError(`destination script is unavailable: ${name}`);
    return name;
  };
  switch (task.kind) {
    case 'vonaMetadata':
      return ['npm', ['run', requireScript('vona'), ':tools:metadata', '--', '--force']];
    case 'zovaMetadata':
      return ['npm', ['run', requireScript('zova'), ':tools:metadata', '--', '--force']];
    case 'depsZova':
      return ['npm', ['run', requireScript('deps:zova')]];
    case 'openapiSdk':
      return ['npm', ['run', requireScript('contract:generate:isolated'), '--', task.module]];
    case 'zovaBuildPair':
      return ['npm', ['run', requireScript('build:zova:isolated'), '--', ...task.flavors]];
    case 'depsVona':
      return ['npm', ['run', requireScript('deps:vona')]];
    case 'specCharts':
      return ['npm', ['run', requireScript('spec:charts'), '--', task.suite]];
    default:
      throw new Error(`task kind has no executable resolver: ${task.kind}`);
  }
}

export function validatePostImportDestination({ root, plan }) {
  validatePostImportTasks(plan, { suite: plan.suite, edition: plan.edition });
  for (const item of plan.tasks) {
    if (item.kind === 'ensureSsrRegistration') {
      ensureRegistration(root, item.registrations, { write: false });
    } else {
      fixedCommand(item, root);
    }
  }
  return plan;
}

export function runPostImportTasks({ root, plan, execute } = {}) {
  validatePostImportTasks(plan, { suite: plan.suite, edition: plan.edition });
  const results = [];
  for (const item of plan.tasks) {
    if (item.kind === 'ensureSsrRegistration') {
      ensureRegistration(root, item.registrations, { write: true });
      results.push({ id: item.id, status: 'completed', kind: item.kind });
      continue;
    }
    const [file, argv] = fixedCommand(item, root);
    const runner =
      execute ??
      ((command, args) =>
        spawnSync(command, args, {
          cwd: root,
          shell: false,
          stdio: 'inherit',
        }));
    const result = runner(file, argv, { cwd: root, shell: false });
    if (result?.status !== 0) {
      return {
        results,
        failed: { id: item.id, kind: item.kind, status: result?.status ?? 1 },
        pending: plan.tasks.slice(results.length + 1).map(task => task.id),
      };
    }
    results.push({ id: item.id, status: 'completed', kind: item.kind, argv });
  }
  return { results, failed: null, pending: [] };
}
