import fse from 'fs-extra';
import { globby } from 'globby';
import path from 'node:path';

export async function generateConfig(modulePath: string) {
  const configFile = path.join(modulePath, 'src/config/config.ts');
  if (!(await fse.pathExists(configFile))) return '';
  // combine
  const content = `/** config: begin */
export * from '../config/config.js';
import { config } from '../config/config.js';
/** config: end */
`;
  return content;
}

export async function generateConstant(modulePath: string) {
  const constantFile = path.join(modulePath, 'src/config/constants.ts');
  if (!(await fse.pathExists(constantFile))) return '';
  // combine
  const content = `/** constant: begin */
export * from '../config/constants.js';
import { constants } from '../config/constants.js';
/** constant: end */
`;
  return content;
}

export async function generateLocale1(modulePath: string, moduleName: string) {
  const files = await globby('src/config/locale/*.ts', { cwd: modulePath });
  if (files.length === 0) return '';
  files.sort();
  const contentImports: string[] = [];
  const contentLocales: string[] = [];
  for (const file of files) {
    const localeName = path.basename(file, '.ts');
    const className = `locale_${localeName.replace('-', '_')}`;
    contentImports.push(`import ${className} from '../config/locale/${localeName}.js';`);
    contentLocales.push(`  '${localeName}': ${className},`);
  }
  // combine
  const content = `import type { TypeLocaleBase } from 'zova';
import { useApp, useComputed } from 'zova';
${contentImports.join('\n')}

export const locales = {
${contentLocales.join('\n')}
};

export function $useLocale<K extends keyof (typeof locales)[TypeLocaleBase]>(key: K, ...args: any[]) {
  const app = useApp();
  const str = \`${moduleName}::\${key}\`;
  return useComputed(() => {
    return app.meta.text(str, ...args);
  });
}
`;
  return content;
}

export async function generateLocale2(contentLocales: string) {
  if (!contentLocales) return '';
  // combine
  const content = `/** locale: begin */
import { locales } from './locales.js';
/** locale: end */
`;
  return content;
}

export async function generateError(modulePath: string) {
  const errorFile = path.join(modulePath, 'src/config/errors.ts');
  if (!(await fse.pathExists(errorFile))) return '';
  // combine
  const content = `/** error: begin */
export * from '../config/errors.js';
import { errors } from '../config/errors.js';
/** error: end */
`;
  return content;
}
