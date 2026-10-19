import fse from 'fs-extra';
import path from 'node:path';
import yaml from 'yaml';

const dependencySections = ['dependencies', 'devDependencies', 'optionalDependencies'] as const;

type ImporterDependency = {
  specifier?: string;
  version?: string;
};

type Importer = Partial<
  Record<(typeof dependencySections)[number], Record<string, ImporterDependency>>
>;

type ParsedLockfile = {
  importers?: Record<string, Importer>;
};

type ModuleCandidate = {
  range: string;
  moduleRoot: string;
};

export async function extractRestDependencyVersions(
  projectPath: string,
  deps: string[],
  moduleRoots: string[] = [],
): Promise<Record<string, string>> {
  const lockfilePath = path.join(projectPath, 'pnpm-lock.yaml');
  const lockfileContent = await fse.readFile(lockfilePath, 'utf8');
  const parsedLockfile = yaml.parse(lockfileContent) as ParsedLockfile;
  const depsVersion: Record<string, string> = {};

  for (const dep of deps) {
    const rootRange = getPackageDependencyRangeFromLock(parsedLockfile, dep);
    if (rootRange) {
      depsVersion[dep] = rootRange;
      continue;
    }

    const moduleCandidates = await getModuleCandidates(
      projectPath,
      parsedLockfile,
      dep,
      moduleRoots,
    );
    const distinctCandidates = getDistinctCandidates(moduleCandidates);
    if (distinctCandidates.length > 1) {
      throw createConflictingCandidatesError(dep, distinctCandidates);
    }
    if (distinctCandidates.length === 1) {
      depsVersion[dep] = distinctCandidates[0].range;
      continue;
    }

    const rootVersion = await getPackageVersionFromNodeModules(projectPath, dep);
    if (rootVersion) {
      depsVersion[dep] = `^${rootVersion}`;
      continue;
    }

    throw createUnresolvedDependencyError(projectPath, dep, moduleRoots);
  }

  return depsVersion;
}

function getPackageDependencyRangeFromLock(
  parsedLockfile: ParsedLockfile,
  packageName: string,
): string | null {
  const importer = parsedLockfile.importers?.['.'];
  return getImporterDependencyRange(importer, packageName);
}

function getImporterDependencyRange(
  importer: Importer | undefined,
  packageName: string,
): string | null {
  if (!importer) return null;

  for (const section of dependencySections) {
    const dependencyRange = normalizeImporterDependency(importer[section]?.[packageName]);
    if (dependencyRange) return dependencyRange;
  }
  return null;
}

function normalizeImporterDependency(
  importerDependency: ImporterDependency | undefined,
): string | null {
  if (!importerDependency) return null;

  const specifier = importerDependency.specifier;
  if (specifier?.startsWith('npm:')) return specifier;

  const version = normalizeLockfileVersion(importerDependency.version);
  if (!version) return null;
  return `^${version}`;
}

function normalizeLockfileVersion(version: string | undefined): string | null {
  if (!version) return null;
  if (version.startsWith('link:') || version.startsWith('file:')) return null;

  const versionWithoutPeers = version.split('(')[0];
  if (!versionWithoutPeers) return null;
  if (/^\d/.test(versionWithoutPeers)) return versionWithoutPeers;

  const aliasSeparator = versionWithoutPeers.lastIndexOf('@');
  if (aliasSeparator === -1) return null;

  const aliasedVersion = versionWithoutPeers.slice(aliasSeparator + 1);
  if (!aliasedVersion || !/^\d/.test(aliasedVersion)) return null;
  return aliasedVersion;
}

async function getModuleCandidates(
  projectPath: string,
  parsedLockfile: ParsedLockfile,
  packageName: string,
  moduleRoots: string[],
): Promise<ModuleCandidate[]> {
  const candidates: ModuleCandidate[] = [];
  for (const moduleRoot of moduleRoots) {
    const absoluteModuleRoot = path.resolve(projectPath, moduleRoot);
    if (absoluteModuleRoot === path.resolve(projectPath)) continue;

    const importerKey = getImporterKey(projectPath, absoluteModuleRoot);
    const importerRange = getImporterDependencyRange(
      parsedLockfile.importers?.[importerKey],
      packageName,
    );
    if (importerRange) {
      candidates.push({ range: importerRange, moduleRoot: importerKey });
      continue;
    }

    const manifestSpecifier = await getManifestDependencySpecifier(absoluteModuleRoot, packageName);
    if (!manifestSpecifier) continue;

    const installedVersion = await getPackageVersionFromNodeModules(
      absoluteModuleRoot,
      packageName,
    );
    if (!installedVersion) continue;
    candidates.push({
      range: manifestSpecifier.startsWith('npm:') ? manifestSpecifier : `^${installedVersion}`,
      moduleRoot: importerKey,
    });
  }
  return candidates;
}

async function getManifestDependencySpecifier(
  moduleRoot: string,
  packageName: string,
): Promise<string | null> {
  const manifestPath = path.join(moduleRoot, 'package.json');
  if (!fse.existsSync(manifestPath)) return null;

  const manifest = (await fse.readJson(manifestPath)) as Record<string, unknown>;
  for (const section of dependencySections) {
    const sectionDependencies = manifest[section];
    if (!sectionDependencies || typeof sectionDependencies !== 'object') continue;
    const specifier = (sectionDependencies as Record<string, unknown>)[packageName];
    if (typeof specifier === 'string') return specifier;
  }
  return null;
}

function getDistinctCandidates(candidates: ModuleCandidate[]): ModuleCandidate[] {
  const distinctCandidates = new Map<string, ModuleCandidate>();
  for (const candidate of candidates) {
    if (!distinctCandidates.has(candidate.range)) {
      distinctCandidates.set(candidate.range, candidate);
    }
  }
  return Array.from(distinctCandidates.values());
}

async function getPackageVersionFromNodeModules(
  packageRoot: string,
  packageName: string,
): Promise<string | null> {
  const pkgFile = path.join(packageRoot, 'node_modules', packageName, 'package.json');
  if (!fse.existsSync(pkgFile)) return null;
  const pkgContent = (await fse.readJson(pkgFile)) as Record<string, unknown>;
  return typeof pkgContent.version === 'string' && pkgContent.version ? pkgContent.version : null;
}

function getImporterKey(projectPath: string, moduleRoot: string): string {
  const relativePath = path.relative(projectPath, moduleRoot);
  return relativePath.replaceAll(path.sep, '/') || '.';
}

function getRepoRelativePath(projectPath: string, filePath: string): string {
  const relativePath = path.relative(projectPath, filePath).replaceAll(path.sep, '/');
  return relativePath || '.';
}

function createConflictingCandidatesError(
  packageName: string,
  candidates: ModuleCandidate[],
): Error {
  const details = candidates
    .map(candidate => `${candidate.moduleRoot} (${candidate.range})`)
    .join(', ');
  return new Error(
    `Conflicting REST dependency versions for ${packageName} in module importers: ${details}. ` +
      `Align the dependency versions or declare ${packageName} in the project root package.json ` +
      '(pnpm-lock.yaml).',
  );
}

function createUnresolvedDependencyError(
  projectPath: string,
  packageName: string,
  moduleRoots: string[],
): Error {
  const checkedModuleRoots = moduleRoots.length
    ? moduleRoots
        .map(moduleRoot => getRepoRelativePath(projectPath, path.resolve(projectPath, moduleRoot)))
        .join(', ')
    : '(none)';
  return new Error(
    `Unable to resolve REST dependency version for ${packageName}. Add it to the project or an owning ` +
      `module and install it; checked module roots: ${checkedModuleRoots}; lockfile: pnpm-lock.yaml.`,
  );
}
