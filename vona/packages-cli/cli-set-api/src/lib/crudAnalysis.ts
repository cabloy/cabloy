import type { BeanCliBase } from '@cabloy/cli';

export async function renderCrudAnalysis(cli: BeanCliBase, targetDir: string, setName: string) {
  for (const part of ['common', 'group', 'aggregate']) {
    await cli.template.renderBoilerplateAndSnippets({
      targetDir,
      setName,
      boilerplatePath: `tools/crudAnalysis/${part}`,
    });
  }
}
