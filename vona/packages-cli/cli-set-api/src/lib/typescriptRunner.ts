import { spawn } from 'node:child_process';
import { readFileSync } from 'node:fs';
import { createRequire } from 'node:module';
import path from 'node:path';

export type TypeScriptCompiler = 'native' | 'typescript';

export function resolveTypeScriptCompiler(
  compiler: TypeScriptCompiler,
  projectPath: string,
): string {
  const packageName = compiler === 'native' ? '@typescript/native' : 'typescript';
  const require = createRequire(path.resolve(projectPath, 'package.json'));
  let manifestPath: string;
  try {
    manifestPath = require.resolve(`${packageName}/package.json`);
  } catch (cause) {
    throw new Error(
      `Cannot resolve ${packageName}. Install the ${compiler === 'native' ? 'native TypeScript alias (npm:typescript@7.0.2)' : 'TypeScript package'} in the project or its repository root.`,
      { cause },
    );
  }
  const manifest = JSON.parse(readFileSync(manifestPath, 'utf8'));
  if (typeof manifest.bin?.tsc !== 'string') {
    throw new TypeError(`${packageName} does not declare a tsc executable.`);
  }
  return path.resolve(path.dirname(manifestPath), manifest.bin.tsc);
}

export async function runTypeScript(
  compiler: TypeScriptCompiler,
  args: string[],
  { projectPath, cwd = projectPath }: { projectPath: string; cwd?: string },
): Promise<void> {
  const executable = resolveTypeScriptCompiler(compiler, projectPath);
  await new Promise<void>((resolve, reject) => {
    const child = spawn(process.execPath, [executable, ...args], {
      cwd,
      stdio: 'inherit',
      shell: false,
    });
    child.once('error', reject);
    child.once('close', (code, signal) => {
      if (code === 0) {
        resolve();
      } else {
        reject(
          Object.assign(
            new Error(
              `TypeScript (${compiler}) failed: ${signal ? `signal ${signal}` : `exit code ${code}`}`,
            ),
            {
              exitCode: code ?? 1,
              signal,
            },
          ),
        );
      }
    });
  });
}
