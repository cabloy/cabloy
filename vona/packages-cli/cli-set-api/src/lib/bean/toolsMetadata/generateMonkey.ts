import fse from 'fs-extra';
import path from 'node:path';

export async function generateMonkey(modulePath: string) {
  const monkeyFile = path.join(modulePath, 'src/monkey.ts');
  if (!fse.existsSync(monkeyFile)) return '';
  // combine
  const content = `/** monkey: begin */
export * from '../monkey.ts';
/** monkey: end */
`;
  return content;
}

export async function generateMain(modulePath: string) {
  const monkeyFile = path.join(modulePath, 'src/main.ts');
  if (!fse.existsSync(monkeyFile)) return '';
  // combine
  const content = `/** main: begin */
export * from '../main.ts';
/** main: end */
`;
  return content;
}
