import type { BeanCliBase, IMetadataCustomGenerateOptions } from '@cabloy/cli';
import type { IGlobBeanFile, OnionSceneMeta } from '@cabloy/module-info';

import { toUpperCaseFirstChar } from '@cabloy/word-utils';
import fse from 'fs-extra';
import path from 'node:path';

export async function generateMetadataCustom(
  cli: BeanCliBase,
  globFiles: IGlobBeanFile[],
  sceneName: string,
  sceneMeta: OnionSceneMeta,
  moduleName: string,
  modulePath: string,
) {
  const sceneNameCapitalize = toUpperCaseFirstChar(sceneName);
  if (globFiles.length === 0) return '';
  // custom
  let jsFile = path.join(sceneMeta.module!.root, 'dist-cli', sceneMeta.metadataCustom!.replace('.ts', '.js'));
  if (!(await fse.pathExists(jsFile))) {
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
