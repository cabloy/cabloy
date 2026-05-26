import type { IModule } from '@cabloy/module-info';

import fse from 'fs-extra';
import fs from 'node:fs';
import path from 'node:path';
import { pathToFileURL } from 'node:url';

export function getControllerFileName(module: IModule, type: 'page' | 'component', beanName) {
  const controllerFile = path.join(module.root, `src/${type}/${beanName}/controller.ts`);
  if (fs.existsSync(controllerFile)) {
    return 'controller.ts';
  }
  return 'controller.tsx';
}

export function copyTemplateIfNeed(fileSrc, fileDest) {
  if (!fse.existsSync(fileDest)) {
    fse.copyFileSync(fileSrc, fileDest);
  }
}

export function pathToHref(fileName: string): string {
  return pathToFileURL(fileName).href;
}

export async function loadJSONFile(fileName: string) {
  const pkgContent = (await fse.readFile(fileName)).toString();
  return JSON.parse(pkgContent);
}

export async function saveJSONFile(fileName: string, json: object) {
  await fse.writeFile(fileName, `${JSON.stringify(json, null, 2)}\n`);
}
