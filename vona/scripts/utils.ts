import fse from 'fs-extra';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __specialFiles = ['dist', 'tsconfig.build.tsbuildinfo', 'node_modules', '.rollup.cache', 'src/.metadata/modules.d.ts'];

export async function removeSpecialFiles(suitePath: string, moduleName: string, moreFiles?: string[]) {
  for (const specialFile of __specialFiles) {
    await fse.remove(path.join(suitePath, `modules/${moduleName}`, specialFile));
  }
  if (moreFiles) {
    for (const specialFile of moreFiles) {
      await fse.remove(path.join(suitePath, `modules/${moduleName}`, specialFile));
    }
  }
}
