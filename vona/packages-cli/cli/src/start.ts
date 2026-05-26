import { CabloyCommand } from '@cabloy/cli';
import { createRequire } from 'node:module';

export class VonaCommand extends CabloyCommand {
  constructor(rawArgv?: any[], disableVersion?: boolean) {
    super('vona', rawArgv);
    if (!disableVersion) {
      this.version = this._extractPackageVersion();
    }
  }

  private _extractPackageVersion() {
    const require = createRequire(import.meta.url);
    const pkg = require('../package.json');
    return pkg.version;
  }
}
