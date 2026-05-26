import { metadataCustomSnippet } from '@cabloy/cli';
import { catchError } from '@cabloy/utils';
import fs from 'node:fs';

import { locale_transform } from '../utils.ts';

const __resources = { Name: 'Name', Description: 'Description', Operations: 'Operations' };

declare module '@cabloy/cli' {
  interface ICommandArgv {
    module: string;
    resourceNameCapitalize: string;
  }
}

export default metadataCustomSnippet({
  file: 'src/config/locale/en-us.ts',
  language: 'plain',
  init: async ({ cli, argv, targetFile }) => {
    await catchError(() => {
      return cli.helper.invokeCli([':init:locale', argv.module, '--nometadata', '--noformat'], {
        cwd: argv.projectPath,
      });
    });
    return fs.readFileSync(targetFile).toString('utf8');
  },
  async transform({ ast, argv }) {
    return locale_transform({ ast, argv, resources: __resources });
  },
});
