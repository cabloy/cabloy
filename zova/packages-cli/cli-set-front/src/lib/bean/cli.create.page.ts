import type { CmdOptions } from '@cabloy/cli';

import { CliCreatePageBase } from '../common/cliCreatePage.ts';

export class CliCreatePage extends CliCreatePageBase {
  constructor(options: CmdOptions) {
    super(options, 'page');
  }
}
