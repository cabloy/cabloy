import type { IMetadataCustomGenerateOptions } from '@cabloy/cli';
import type { IGlobBeanFile } from '@cabloy/module-info';

import fse from 'fs-extra';
import path from 'node:path';

import type { IControllerInfo } from './types.ts';

import { generateFileComponent } from './generateFileComponent.ts';
import { generateFilePage } from './generateFilePage.ts';

export async function generateFile(
  options: IMetadataCustomGenerateOptions,
  globFile: IGlobBeanFile,
  controllerInfo: IControllerInfo,
) {
  const cli = options.cli;
  const fileDest = path.join(
    options.modulePath,
    `src/.metadata/${controllerInfo.type}/${controllerInfo.name}.ts`,
  );
  const content =
    controllerInfo.type === 'page'
      ? await generateFilePage(options, globFile, controllerInfo)
      : await generateFileComponent(options, globFile, controllerInfo);
  await fse.outputFile(fileDest, content);
  await cli.helper.formatFile({ fileName: fileDest });
}
