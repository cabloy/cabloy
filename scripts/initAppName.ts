import { execFileSync } from 'node:child_process';
import { existsSync, readFileSync, realpathSync, writeFileSync } from 'node:fs';
import { basename, resolve } from 'node:path';

function gitOutput(rootDir: string, args: string[]): string {
  return execFileSync('git', args, {
    cwd: rootDir,
    encoding: 'utf-8',
    stdio: ['ignore', 'pipe', 'ignore'],
  }).trim();
}

export function isLinkedGitWorktree(rootDir: string): boolean {
  const projectRoot = realpathSync(resolve(rootDir));
  try {
    const gitRoot = realpathSync(
      resolve(gitOutput(projectRoot, ['rev-parse', '--path-format=absolute', '--show-toplevel'])),
    );
    if (gitRoot !== projectRoot) return false;

    const gitDir = realpathSync(
      resolve(gitOutput(projectRoot, ['rev-parse', '--path-format=absolute', '--git-dir'])),
    );
    const gitCommonDir = realpathSync(
      resolve(gitOutput(projectRoot, ['rev-parse', '--path-format=absolute', '--git-common-dir'])),
    );
    return gitDir !== gitCommonDir;
  } catch {
    return false;
  }
}

export function updateBaseAppName(rootDir: string): boolean {
  if (isLinkedGitWorktree(rootDir)) return false;

  const projectRoot = resolve(rootDir);
  const projectName = basename(projectRoot);
  const envFiles = [resolve(projectRoot, 'vona/env/.env'), resolve(projectRoot, 'zova/env/.env')];
  for (const filePath of envFiles) {
    if (!existsSync(filePath)) continue;
    const content = readFileSync(filePath, 'utf-8').replace(
      /^APP_NAME.*/m,
      `APP_NAME = ${projectName}`,
    );
    writeFileSync(filePath, content);
    // eslint-disable-next-line
    console.log(`[init] Set APP_NAME = ${projectName} in ${filePath}`);
  }
  return true;
}
