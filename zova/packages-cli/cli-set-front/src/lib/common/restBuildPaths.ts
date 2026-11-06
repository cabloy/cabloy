import { lstat, readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';

export interface RestBuildPaths {
  isolated: boolean;
  runtimeDir: string;
  srcDir: string;
  outDir: string;
  tsconfigPath: string;
}

export async function resolveRestBuildPaths(
  projectPath: string,
  flavor: string,
  runtimeDir: string,
  env: Record<string, string | undefined> = process.env,
): Promise<RestBuildPaths> {
  const isolatedKeys = [
    'ZOVA_ISOLATED',
    'ZOVA_RUNTIME_DIR',
    'ZOVA_QUASAR_ROOT',
    'ZOVA_QUASAR_CACHE',
    'ZOVA_QUASAR_CONFIG_DIR',
    'ZOVA_REST_DIR',
    'ZOVA_REST_TSCONFIG',
    'ZOVA_REST_OUTDIR',
  ];
  const isolated = env.ZOVA_ISOLATED === 'true';
  if (isolatedKeys.some(key => env[key] !== undefined)) {
    if (!isolated || isolatedKeys.some(key => !env[key])) {
      throw new Error('Incomplete isolated REST build environment');
    }
  }
  if (!isolated) {
    return {
      isolated,
      runtimeDir,
      srcDir: path.join(projectPath, '.zova-rest'),
      outDir: path.join(projectPath, 'dist', `rest-${flavor}`),
      tsconfigPath: path.join(projectPath, 'tsconfig.rest.json'),
    };
  }
  if (!/^[a-z0-9][\w-]*$/i.test(flavor)) {
    throw new Error('Invalid isolated REST flavor');
  }
  const match = /^\.zova-build-([a-z0-9][\w-]*)$/i.exec(runtimeDir);
  if (!match) throw new Error('Isolated REST requires a run-specific Zova runtime directory');
  const id = match[1];
  const restDir = `.zova-rest-build-${id}`;
  const quasarDir = `.quasar-build-${id}`;
  if (
    env.ZOVA_RUNTIME_DIR !== runtimeDir ||
    env.ZOVA_QUASAR_ROOT !== path.join(projectPath, quasarDir) ||
    env.ZOVA_QUASAR_CACHE !== path.join(projectPath, quasarDir, 'cache') ||
    env.ZOVA_QUASAR_CONFIG_DIR !== path.join(projectPath, quasarDir, 'config') ||
    env.ZOVA_REST_DIR !== restDir ||
    env.ZOVA_REST_TSCONFIG !== `.tsconfig.rest-build-${id}.json`
  ) {
    throw new Error('Isolated REST paths must belong to the selected build run');
  }
  const outputRoot = path.join(projectPath, quasarDir, 'output');
  const outDir = env.ZOVA_REST_OUTDIR;
  if (
    !outDir ||
    !path.isAbsolute(outDir) ||
    path.dirname(path.resolve(outDir)) !== outputRoot ||
    path.basename(outDir) !== `rest-${flavor}`
  ) {
    throw new Error('Isolated REST output must be the selected run output directory');
  }
  // Validate every existing component before removing entry/output content. The
  // outer runner owns these roots and alone removes them after child drainage.
  for (const relative of [
    runtimeDir,
    restDir,
    quasarDir,
    `${quasarDir}/output`,
    `${quasarDir}/output/rest-${flavor}`,
    `${restDir}/entry`,
    `.tsconfig.rest-build-${id}.json`,
  ]) {
    try {
      const stat = await lstat(path.join(projectPath, relative));
      if (stat.isSymbolicLink())
        throw new Error(`Isolated REST path cannot be a symlink: ${relative}`);
      if (relative.endsWith('.json')) {
        if (!stat.isFile() || stat.nlink !== 1) {
          throw new Error('Isolated REST tsconfig must be a single-link regular file');
        }
      } else if (!stat.isDirectory()) {
        throw new Error(`Isolated REST path must be a directory: ${relative}`);
      }
    } catch (error) {
      if ((error as NodeJS.ErrnoException).code !== 'ENOENT') throw error;
      if ([runtimeDir, restDir, quasarDir].includes(relative)) {
        throw new Error(`Isolated REST root is missing: ${relative}`);
      }
    }
  }
  return {
    isolated,
    runtimeDir,
    srcDir: path.join(projectPath, restDir, 'entry'),
    outDir,
    tsconfigPath: path.join(projectPath, `.tsconfig.rest-build-${id}.json`),
  };
}

export async function writeIsolatedRestTsconfig(projectPath: string, paths: RestBuildPaths) {
  const basePath = path.join(projectPath, 'tsconfig.rest.json');
  const base = JSON.parse(await readFile(basePath, 'utf8'));
  const configDir = path.dirname(paths.tsconfigPath);
  const relative = (target: string) => path.relative(configDir, target).replaceAll('\\', '/');
  const include = (Array.isArray(base.include) ? base.include : [])
    .filter((item: string) => !/^\.?\/?\.zova-rest(?:\/|$)/.test(item))
    .map((item: string) => relative(path.resolve(projectPath, item)));
  include.push(`${relative(paths.srcDir)}/**/*`);
  await writeFile(
    paths.tsconfigPath,
    JSON.stringify(
      {
        extends: `./${relative(basePath)}`,
        // rolldown-plugin-dts supplies dirname(tsconfig) as tsgo's rootDir.
        // Keep this owned config beside the project config, not inside entry/.
        compilerOptions: { rootDir: '.' },
        include,
      },
      null,
      2,
    ),
  );
}
