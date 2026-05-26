import fse from 'fs-extra';
import { createRequire } from 'node:module';
import path from 'node:path';

import type { ZovaViteConfigOptions } from './types.ts';

import { copyTemplateIfNeed, pathToHref } from './utils.ts';

const __ImportCelLib = '@marcbachmann/cel-js';

export async function generateCel(configOptions: ZovaViteConfigOptions) {
  await __generateCelLibOperators(configOptions);
}

async function __generateCelLibOperators(configOptions: ZovaViteConfigOptions) {
  const pathCelLib = parseCelLibPath(configOptions.appDir);
  const fileSrc = path.join(pathCelLib, 'operators.js');
  const fileSrcBak = path.join(pathCelLib, 'operators-origin.js');
  copyTemplateIfNeed(fileSrc, fileSrcBak);
  const content = fse.readFileSync(fileSrcBak).toString();
  const contentNew = content.replace(
    'const value = type && ctx.getValue(ast.args)',
    `let value = type && ctx.getValue(ast.args)
      if(value && typeof value==='object' && value.constructor?.name==='CustomRefImpl') {
        value = value.value
      }`,
  );
  fse.writeFileSync(fileSrc, contentNew);
}

function parseCelLibPath(appDir: string) {
  const require = createRequire(pathToHref(path.join(appDir, '/')));
  const fileLibIndex = require.resolve(__ImportCelLib);
  return path.dirname(fileLibIndex);
}
