import type { BeanCliBase } from '@cabloy/cli';

declare module '@cabloy/cli' {
  interface ICommandArgv {
    aggregate?: boolean;
    groupBy?: 'name' | 'description';
  }
}

// Validate before any directory creation, snippets, or delegated CLI writes.
export function prepareCrudAnalysis(argv: { aggregate?: unknown; groupBy?: unknown }) {
  if (argv.aggregate !== undefined && typeof argv.aggregate !== 'boolean') {
    throw new Error('--aggregate must be a boolean');
  }
  if (argv.groupBy !== undefined && argv.groupBy !== 'name' && argv.groupBy !== 'description') {
    throw new Error('--groupBy must be exactly name or description for a fresh CRUD entity');
  }
}

export async function renderCrudAnalysis(cli: BeanCliBase, targetDir: string, setName: string) {
  const { argv } = cli.context;
  if (!argv.aggregate && !argv.groupBy) return;
  for (const part of [
    'common',
    ...(argv.groupBy ? ['group'] : []),
    ...(argv.aggregate ? ['aggregate'] : []),
  ]) {
    await cli.template.renderBoilerplateAndSnippets({
      targetDir,
      setName,
      boilerplatePath: `tools/crudAnalysis/${part}`,
    });
  }
}
