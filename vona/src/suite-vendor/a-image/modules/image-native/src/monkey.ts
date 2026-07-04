import type { IMonkeyAppStart } from 'vona';

import fse from 'fs-extra';
import path from 'node:path';
import { BeanSimple, cast, getPlatformArch, resolveAddon } from 'vona';

const __Version = '8.18.3';

const __MapTargetNames = {
  'linux-arm64': `libvips-cpp.so.${__Version}`,
  'linux-x64': `libvips-cpp.so.${__Version}`,
  'darwin-arm64': `libvips-cpp.${__Version}.dylib`,
  'darwin-x64': `libvips-cpp.${__Version}.dylib`,
  'win32-x64': 'libvips-42.dll',
};

export class Monkey extends BeanSimple implements IMonkeyAppStart {
  async appStart() {
    cast(this.app).__prepareSharpLibvips = () => {
      const platformArch = getPlatformArch();
      const addonFileSrc = resolveAddon('sharpLibvips');
      const addonDirDest = path.join(
        import.meta.dirname,
        `node_modules/@img/sharp-libvips-${platformArch}/lib`,
      );
      const addonFileDest = path.join(addonDirDest, __MapTargetNames[platformArch]);
      if (!fse.existsSync(addonFileDest)) {
        fse.ensureDirSync(addonDirDest);
        fse.copyFileSync(addonFileSrc, addonFileDest);
      }
    };
  }
}
