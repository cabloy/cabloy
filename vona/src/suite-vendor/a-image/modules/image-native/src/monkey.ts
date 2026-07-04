import type { IMonkeyAppStart } from 'vona';

import fse from 'fs-extra';
import path from 'node:path';
import { BeanSimple, cast, getPlatformArch, resolveAddon } from 'vona';

export class Monkey extends BeanSimple implements IMonkeyAppStart {
  async appStart() {
    cast(this.app).__prepareSharpLibvips = (targetName: string) => {
      const addonFileSrc = resolveAddon('sharpLibvips');
      const addonDirDest = path.join(
        import.meta.dirname,
        'addon',
        `node_modules/@img/sharp-libvips-${getPlatformArch()}/lib`,
      );
      const addonFileDest = path.join(addonDirDest, targetName);
      if (!fse.existsSync(addonFileDest)) {
        fse.ensureDirSync(addonDirDest);
        fse.copyFileSync(addonFileSrc, addonFileDest);
      }
    };
  }
}
