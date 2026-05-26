import { metadataCustomSnippet } from '@cabloy/cli';
import { catchError } from '@cabloy/utils';
import fs from 'node:fs';

declare module '@cabloy/cli' {
  interface ICommandArgv {
    module: string;
  }
}

const __snippet_update = `if (options.version === <%=argv.fileVersion%>) {
    const entity<%=argv.resourceNameCapitalize%> = this.scope.entity.<%=argv.resourceName%>;
    await this.bean.model.createTable(entity<%=argv.resourceNameCapitalize%>.$table, table => {
      table.comment(entity<%=argv.resourceNameCapitalize%>.$comment.$table);
      table.basicFields();
      table.string(entity<%=argv.resourceNameCapitalize%>.name, 50).comment(entity<%=argv.resourceNameCapitalize%>.$comment.name);
      table.string(entity<%=argv.resourceNameCapitalize%>.description, 255).comment(entity<%=argv.resourceNameCapitalize%>.$comment.description);
    });
  }
`;

export default metadataCustomSnippet({
  file: 'src/bean/meta.version.ts',
  language: 'gogo',
  format: true,
  init: async ({ cli, argv, targetFile }) => {
    await catchError(() => {
      return cli.helper.invokeCli(
        [
          ':create:bean',
          'meta',
          'version',
          `--module=${argv.module}`,
          '--nometadata',
          '--noformat',
        ],
        {
          cwd: argv.projectPath,
        },
      );
    });
    return fs.readFileSync(targetFile).toString('utf8');
  },
  async transform({ cli, ast }) {
    // update
    ast.replace(
      'async update(_options: IMetaVersionUpdateOptions) {$$$1}',
      'async update(options: IMetaVersionUpdateOptions) {$$$1}',
    );
    const code = await cli.template.renderContent({ content: __snippet_update });
    ast.replace('async update($$$0) {$$$1}', `async update($$$0) {\n  $$$1\n  ${code}}`);
    // ok
    return ast;
  },
});
