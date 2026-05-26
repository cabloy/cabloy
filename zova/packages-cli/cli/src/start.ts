import { CabloyCommand } from '@cabloy/cli';
import { createRequire } from 'node:module';

export class ZovaCommand extends CabloyCommand {
  constructor(rawArgv?) {
    super('zova', rawArgv);
    this.version = this._extractPackageVersion();
  }

  private _extractPackageVersion() {
    const require = createRequire(import.meta.url);
    const pkg = require('../package.json');
    return pkg.version;
  }
}
