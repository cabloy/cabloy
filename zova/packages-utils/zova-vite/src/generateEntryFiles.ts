import type { glob } from '@cabloy/module-glob';
import type { ZovaConfigMeta } from '@cabloy/module-info';

import { getEnvFiles } from '@cabloy/dotenv';
import chalk from 'chalk';
import fse from 'fs-extra';
import path from 'node:path';

import type { ZovaViteConfigOptions } from './types.ts';

// import { generateCel } from './generateCel.ts';
// import { generateZod } from './generateZod.ts';
import { copyTemplateFile, getEnvMeta, resolveTemplatePath } from './utils.ts';

export async function generateEntryFiles(
  configMeta: ZovaConfigMeta,
  configOptions: ZovaViteConfigOptions,
  modulesMeta: Awaited<ReturnType<typeof glob>>,
  env: Record<string, string>,
) {
  // config
  await __generateConfig();
  // modules meta
  await __generateModulesMeta();
  // app component
  await __generateAppComponent();
  // env json
  await __generateEnvJson();
  // zod
  // await generateZod(configOptions);
  // cel
  // await generateCel(configOptions);

  //////////////////////////////

  async function __generateConfig() {
    // check config
    let configDir = path.join(configOptions.appDir, 'src/front/config');
    if (!fse.existsSync(configDir)) {
      // eslint-disable-next-line
      console.log(chalk.red('path not found: src/front/config\n'));
      process.exit(0);
    }
    // meta
    const meta = getEnvMeta(configMeta);
    configDir = path.join(configOptions.appDir, 'src/front/config/config');
    const files = getEnvFiles(meta, configDir, 'config', '.ts')!;
    const filenames = files.map(item => path.basename(item));
    const imports: string[] = [];
    const constNames: string[] = [];
    for (const filename of filenames) {
      const parts = filename.split('.');
      let constName = parts[0];
      for (let index = 1; index < parts.length - 1; index++) {
        constName += parts[index].charAt(0).toUpperCase() + parts[index].substring(1);
      }
      imports.push(
        `import ${constName} from '../src/front/config/config/${filename.replace('.ts', '.js')}';`,
      );
      constNames.push(constName);
    }
    const contentDest = `${imports.join('\n')}\nexport default [${constNames.join(', ')}];`;
    // output
    const fileDest = path.join(configOptions.appDir, configOptions.runtimeDir, 'config.ts');
    fse.ensureFileSync(fileDest);
    fse.writeFileSync(fileDest, contentDest, 'utf-8');
  }

  async function __generateAppComponent() {
    // dest
    const pathDest = path.join(configOptions.appDir, configOptions.runtimeDir, 'app');
    fse.ensureDirSync(pathDest);
    // vars
    const vars = {
      sysMonkey: fse.existsSync(path.join(configOptions.appDir, 'src/front/config/monkeySys.ts')),
      appMonkey: fse.existsSync(path.join(configOptions.appDir, 'src/front/config/monkey.ts')),
    };
    // src
    const files = ['controller.tsx_', 'utils.ts_'];
    for (const file of files) {
      const fileSrc = resolveTemplatePath(`app/${file}`);
      const fileDest = path.join(pathDest, file.substring(0, file.length - 1));
      await copyTemplateFile(fileSrc, fileDest, vars);
    }
  }

  async function __generateModulesMeta() {
    // modules
    const { modules, modulesArray } = modulesMeta;
    const moduleNames = modulesArray.map(item => item.info.relativeName);
    // src
    const fileSrc = resolveTemplatePath('zova-modules-meta.ejs');
    const fileDest = path.join(configOptions.appDir, configOptions.runtimeDir, 'modules-meta.ts');
    await fse.ensureDir(path.join(configOptions.appDir, configOptions.runtimeDir));
    await copyTemplateFile(fileSrc, fileDest, { modules, moduleNames });
  }

  async function __generateEnvJson() {
    // env
    const envNormal = {};
    const envSecret = {};
    for (const key in env) {
      if (key.startsWith('SECRET_')) {
        envSecret[key] = env[key];
      } else {
        envNormal[key] = env[key];
      }
    }
    // src
    const fileSrc = resolveTemplatePath('env.ejs');
    const fileDest = path.join(configOptions.appDir, configOptions.runtimeDir, 'env.ts');
    await copyTemplateFile(fileSrc, fileDest, {
      envNormal: JSON.stringify(envNormal, null, 2),
      envSecret: JSON.stringify(envSecret, null, 2),
    });
  }

  // import tmp from 'tmp';
  // import { build as esBuild } from 'esbuild';
  // import { pathToFileURL } from 'node:url';

  // function _pathToHref(fileName: string): string {
  //   return Path.sep === '\\' ? pathToFileURL(fileName).href : fileName;
  // }

  // async function __loadConfig(fileName: string, meta) {
  //   // temp
  //   const fileTempObj = tmp.fileSync({ postfix: '.mjs' });
  //   const fileTemp = fileTempObj.name;
  //   // build
  //   const esBuildConfig = __createEsbuildConfig(fileName, fileTemp);
  //   await esBuild(esBuildConfig as any);
  //   // load
  //   const fnResult = await import(_pathToHref(fileTemp));
  //   const configFn = fnResult.default || fnResult;
  //   const config = await configFn(meta);
  //   // delete temp
  //   fileTempObj.removeCallback();
  //   // ok
  //   return config;
  // }

  // function __createEsbuildConfig(fileSrc: string, fileDest: string) {
  //   return {
  //     platform: 'node',
  //     format: 'esm',
  //     bundle: true,
  //     packages: 'external',
  //     resolveExtensions: ['.mjs', '.js', '.mts', '.ts', '.json'],
  //     entryPoints: [fileSrc],
  //     outfile: fileDest,
  //   };
  // }
}
