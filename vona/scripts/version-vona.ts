import fse from 'fs-extra';
import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

async function _versionTemplate(templateName: string) {
  // version
  const pkgFileCurrent = path.resolve(fileURLToPath(import.meta.url), '../../packages-vona/vona/package.json');
  const pkgContentCurrent = (await fs.readFile(pkgFileCurrent)).toString();
  const version = pkgContentCurrent.match(/"version": "([^"]*)"/)![1];
  // change
  const pkgFile = path.resolve(
    fileURLToPath(import.meta.url),
    `../../packages-cli/cli-set-api/cli/templates/create/project/${templateName}/boilerplate/package.original.json`,
  );
  let pkgContent = (await fs.readFile(pkgFile)).toString();
  pkgContent = pkgContent.replace(/"vona": "\^([^"]*)"/, () => {
    return `"vona": "^${version}"`;
  });
  await fse.writeFile(pkgFile, pkgContent);
}

async function versionTemplates() {
  await _versionTemplate('cabloy-basic');
  await _versionTemplate('cabloy-start');
}

versionTemplates();
