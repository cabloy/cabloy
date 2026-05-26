import type { CmdOptions } from '@cabloy/cli';

import { CliCreateComponentBase } from '../common/cliCreateComponent.ts';

export class CliCreateComponent extends CliCreateComponentBase {
  constructor(options: CmdOptions) {
    super(options, 'component');
  }
}
