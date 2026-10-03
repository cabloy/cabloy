import { metadataCustomSnippet } from '@cabloy/cli';
import { mergeMetaIndex } from 'vona-cli-set-api/mergeMetaIndex';
import { catchError } from '@cabloy/utils';
import fs from 'node:fs';

declare module '@cabloy/cli' {
  interface ICommandArgv {
    module: string;
  }
}

const __snippet_import1 = "import { $tableColumns } from 'vona-module-a-ormutils';";
const __snippet_table = '<%=argv.moduleResourceName%>';

export default metadataCustomSnippet({
  file: 'src/bean/meta.index.ts',
  language: 'plain',
  format: true,
  init: async ({ cli, argv, targetFile }) => {
    await catchError(() => {
      return cli.helper.invokeCli(
        [':create:bean', 'meta', 'index', `--module=${argv.module}`, '--nometadata'],
        {
          cwd: argv.projectPath,
        },
      );
    });
    return fs.readFileSync(targetFile).toString('utf8');
  },
  async transform({ cli, ast }) {
    // import1
    if (!ast.includes(__snippet_import1)) {
      const code = await cli.template.renderContent({ content: __snippet_import1 });
      ast = ast.replace(
        "import { Meta } from 'vona-module-a-meta';",
        `import { Meta } from 'vona-module-a-meta';\n${code}`,
      );
    }
    const table = await cli.template.renderContent({ content: __snippet_table });
    return mergeMetaIndex(ast, table, 'name');
  },
});
