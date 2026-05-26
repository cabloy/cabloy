import type { glob } from '@cabloy/module-glob';
import type { VonaConfigMeta } from '@cabloy/module-info';

import { getEnvFiles } from '@cabloy/dotenv';
import chalk from 'chalk';
import fse from 'fs-extra';
import path from 'node:path';

import type { VonaBinConfigOptions } from './types.ts';

import { resolveTemplatePath } from '../../../utils.ts';
import { copyTemplateFile, getEnvMeta } from '../../utils.ts';
// import { generateZod } from './generateZod.ts';

export async function generateEntryFiles(
  configMeta: VonaConfigMeta,
  configOptions: VonaBinConfigOptions,
  modulesMeta: Awaited<ReturnType<typeof glob>>,
  env: NodeJS.ProcessEnv,
) {
  // config
  await __generateConfig();
  // modules meta
  await __generateModulesMeta();
  // env
  await __generateEnvJson();
  // app
  await __generateApp();
  // others
  await __generateOthers();
  // zod
  // await generateZod(configOptions);

  //////////////////////////////

  async function __generateConfig() {
    // check config
    let configDir = path.join(configOptions.appDir, 'src/backend/config');
    if (!fse.existsSync(configDir)) {
      // eslint-disable-next-line
      console.log(chalk.red('path not found: src/backend/config\n'));
      process.exit(0);
    }
    // meta
    const meta = getEnvMeta(configMeta);
    configDir = path.join(configOptions.appDir, 'src/backend/config/config');
    const files = getEnvFiles(meta, configDir, 'config', ['.ts', '.tsx'])!;
    const filenames = files.map(item => path.basename(item));
    const imports: string[] = [];
    const constNames: string[] = [];
    for (const filename of filenames) {
      const parts = filename.split('.');
      let constName = parts[0];
      for (let index = 1; index < parts.length - 1; index++) {
        constName += parts[index].charAt(0).toUpperCase() + parts[index].substring(1);
      }
      imports.push(`import ${constName} from '../src/backend/config/config/${filename}';`);
      constNames.push(constName);
    }
    const contentDest = `${imports.join('\n')}\nexport default [${constNames.join(', ')}];`;
    // output
    const fileDest = path.join(configOptions.appDir, configOptions.runtimeDir, 'config.ts');
    fse.ensureFileSync(fileDest);
    fse.writeFileSync(fileDest, contentDest, 'utf-8');
  }

  async function __generateApp() {
    const templates = [
      ['app/bootstrap.ejs', 'bootstrap.ts'],
      ['app/app.ejs', 'app.ts'],
    ];
    for (const [templateSrc, templateDest] of templates) {
      const fileSrc = resolveTemplatePath(templateSrc);
      const fileDest = path.join(configOptions.appDir, configOptions.runtimeDir, templateDest);
      await fse.ensureDir(path.join(configOptions.appDir, configOptions.runtimeDir));
      const vars = {
        appMonkey: fse.existsSync(path.join(configOptions.appDir, 'src/backend/config/monkey.ts')),
      };
      await copyTemplateFile(fileSrc, fileDest, vars);
    }
  }

  async function __generateOthers() {
    const templates = [['app/register.js', 'register.js']];
    for (const [templateSrc, templateDest] of templates) {
      const fileSrc = resolveTemplatePath(templateSrc);
      const fileDest = path.join(configOptions.appDir, configOptions.runtimeDir, templateDest);
      await fse.ensureDir(path.join(configOptions.appDir, configOptions.runtimeDir));
      const vars = {};
      await copyTemplateFile(fileSrc, fileDest, vars);
    }
  }

  async function __generateModulesMeta() {
    // modules
    const { modules, modulesArray } = modulesMeta;
    const moduleNames = modulesArray.map(item => item.info.relativeName);
    // src
    const fileSrc = resolveTemplatePath('app/vona-modules-meta.ejs');
    const fileDest = path.join(configOptions.appDir, configOptions.runtimeDir, 'modules-meta.ts');
    await fse.ensureDir(path.join(configOptions.appDir, configOptions.runtimeDir));
    await copyTemplateFile(fileSrc, fileDest, { modules, moduleNames });
  }

  async function __generateEnvJson() {
    const contentDest = `export default ${JSON.stringify(env, null, 2)} as unknown as NodeJS.ProcessEnv;\n`;
    // output
    const fileDest = path.join(configOptions.appDir, configOptions.runtimeDir, 'env.ts');
    fse.ensureFileSync(fileDest);
    fse.writeFileSync(fileDest, contentDest, 'utf-8');
  }
}
