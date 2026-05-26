import fse from 'fs-extra';
import path from 'node:path';

export async function generateMonkey(modulePath: string) {
  return generateMonkey_common(modulePath, 'monkey');
}

export async function generateMonkeySys(modulePath: string) {
  return generateMonkey_common(modulePath, 'monkeySys');
}

export async function generateMain(modulePath: string) {
  return generateMain_common(modulePath, 'main');
}

export async function generateMainSys(modulePath: string) {
  return generateMain_common(modulePath, 'mainSys');
}

async function generateMonkey_common(modulePath: string, commandName: string) {
  const monkeyFile = path.join(modulePath, `src/${commandName}.ts`);
  if (!(await fse.pathExists(monkeyFile))) return '';
  // combine
  const content = `/** ${commandName}: begin */
export * from '../${commandName}.js';
/** ${commandName}: end */
`;
  return content;
}

async function generateMain_common(modulePath: string, commandName: string) {
  const monkeyFile = path.join(modulePath, `src/${commandName}.ts`);
  if (!(await fse.pathExists(monkeyFile))) return '';
  // combine
  const content = `/** ${commandName}: begin */
export * from '../${commandName}.js';
/** ${commandName}: end */
`;
  return content;
}
