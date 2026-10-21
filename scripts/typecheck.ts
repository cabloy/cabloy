import path from 'node:path';
import { fileURLToPath } from 'node:url';

import { runTypeScript } from '../vona/packages-cli/cli-set-api/src/lib/typescriptRunner.ts';

const [compiler, workspace, ...args] = process.argv.slice(2);
if ((compiler !== 'native' && compiler !== 'typescript') || !['vona', 'zova'].includes(workspace)) {
  console.error(
    'Usage: node scripts/typecheck.ts <native|typescript> <vona|zova> [compiler arguments]',
  );
  process.exitCode = 1;
} else {
  const projectPath = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..', workspace);
  try {
    await runTypeScript(compiler, args, { projectPath });
  } catch (error) {
    console.error(error instanceof Error ? error.message : error);
    process.exitCode = (error as { exitCode?: number }).exitCode ?? 1;
  }
}
