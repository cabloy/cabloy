import fse from 'fs-extra';
import { globby } from 'globby';
import path from 'node:path';

export async function generateConfig(modulePath: string) {
  const configFile = path.join(modulePath, 'src/config/config.ts');
  if (!(await fse.pathExists(configFile))) return '';
  // combine
  const content = `/** config: begin */
export * from '../config/config.ts';
import { config } from '../config/config.ts';
/** config: end */
`;
  return content;
}

export async function generateConstant(modulePath: string) {
  const constantFile = path.join(modulePath, 'src/config/constants.ts');
  if (!(await fse.pathExists(constantFile))) return '';
  // combine
  const content = `/** constant: begin */
export * from '../config/constants.ts';
import { constants } from '../config/constants.ts';
/** constant: end */
`;
  return content;
}

export async function generateLocale1(modulePath: string) {
  const files = await globby('src/config/locale/*.ts', { cwd: modulePath });
  if (files.length === 0) return '';
  files.sort();
  const contentImports: string[] = [];
  const contentLocales: string[] = [];
  for (const file of files) {
    const localeName = path.basename(file, '.ts');
    const className = `locale_${localeName.replace('-', '_')}`;
    contentImports.push(`import ${className} from '../config/locale/${localeName}.ts';`);
    contentLocales.push(`  '${localeName}': ${className},`);
  }
  // combine
  const content = `${contentImports.join('\n')}

export const locales = {
${contentLocales.join('\n')}
};
`;
  return content;
}

export async function generateLocale2(contentLocales: string) {
  if (!contentLocales) return '';
  // combine
  const content = `/** locale: begin */
import { locales } from './locales.ts';
/** locale: end */
`;
  return content;
}

export async function generateError(modulePath: string) {
  const errorFile = path.join(modulePath, 'src/config/errors.ts');
  if (!(await fse.pathExists(errorFile))) return '';
  // combine
  const content = `/** error: begin */
export * from '../config/errors.ts';
import { errors } from '../config/errors.ts';
/** error: end */
`;
  return content;
}
