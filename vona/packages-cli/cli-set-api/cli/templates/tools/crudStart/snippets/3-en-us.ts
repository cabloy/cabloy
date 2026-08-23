import { metadataCustomSnippet } from '@cabloy/cli';
import { catchError } from '@cabloy/utils';
import fs from 'node:fs';

import { locale_transform } from '../utils.ts';

const __resources = {
  BasicInformation: 'Basic Information',
  Name: 'Name',
  Description: 'Description',
  Operations: 'Operations',
};

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
      return cli.helper.invokeCli([':init:locale', argv.module, '--nometadata'], {
        cwd: argv.projectPath,
      });
    });
    return fs.readFileSync(targetFile).toString('utf8');
  },
  async transform({ ast, argv }) {
    const resource = argv.resourceNameCapitalize;
    const resources = {
      ...__resources,
      [`${resource}Controller`]: `${resource} Management`,
      [`${resource}Create`]: `Create ${resource}`,
      [`${resource}Select`]: `Query ${resource} List`,
      [`${resource}View`]: `View ${resource}`,
      [`${resource}Update`]: `Update ${resource}`,
      [`${resource}Delete`]: `Delete ${resource}`,
    };
    return locale_transform({ ast, argv, resources });
  },
});
