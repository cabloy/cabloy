import type { BeanCliBase } from '@cabloy/cli';
import type { IMetadataCustomGenerateOptions } from '@cabloy/cli';
import type { OnionSceneMeta } from '@cabloy/module-info';

import { toUpperCaseFirstChar } from '@cabloy/word-utils';
import fse from 'fs-extra';
import path from 'node:path';

import { globBeanFiles } from './utils.ts';

export async function generateMetadataCustom(
  cli: BeanCliBase,
  sceneName: string,
  sceneMeta: OnionSceneMeta,
  moduleName: string,
  modulePath: string,
) {
  const sceneNameCapitalize = toUpperCaseFirstChar(sceneName);
  const globFiles = await globBeanFiles(sceneName, sceneMeta, moduleName, modulePath);
  if (globFiles.length === 0) return '';
  // custom
  let jsFile = path.join(
    sceneMeta.module!.root,
    'dist-cli',
    sceneMeta.metadataCustom!.replace('.ts', '.js'),
  );
  if (!fse.existsSync(jsFile)) {
    jsFile = path.join(sceneMeta.module!.root, 'cli', sceneMeta.metadataCustom!);
  }
  return await cli.helper.importDynamic(jsFile, async instance => {
    const options: IMetadataCustomGenerateOptions = {
      cli,
      sceneName,
      sceneNameCapitalize,
      sceneMeta,
      moduleName,
      modulePath,
      globFiles,
    };
    return await instance.default(options);
  });
}
