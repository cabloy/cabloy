import fse from 'fs-extra';
import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

import { removeSpecialFiles } from './utils.ts';

const __replaceFiles = ['modules/home-user/src/dto/login.ts', 'modules/home-user/src/dto/register.ts'];
const __replaceContents = [
  { from: 'zova-rest-cabloy-basic-admin', to: 'zova-rest-cabloy-start-admin' },
  { from: 'basic-captcha:formFieldCaptcha', to: 'start-captcha:formFieldCaptcha' }
]

async function _versionTemplate(templateName: string) {
  // cp a-home
  const suiteHomeSrc = path.resolve(fileURLToPath(import.meta.url), '../../src/suite/a-home');
  const suiteHomeDest = path.resolve(
    fileURLToPath(import.meta.url),
    `../../packages-cli/cli-set-api/cli/templates/create/project/${templateName}/boilerplate/src/suite/a-home`,
  );
  await fse.remove(suiteHomeDest);
  await fse.copy(suiteHomeSrc, suiteHomeDest);
  await fse.remove(path.join(suiteHomeDest, 'node_modules'));
  for (const moduleName of ['home-base', 'home-index', 'home-user']) {
    await removeSpecialFiles(suiteHomeDest, moduleName);
  }
}

async function _versionTemplateReplace(templateName: string) {
  const suiteHomeDest = path.resolve(
    fileURLToPath(import.meta.url),
    `../../packages-cli/cli-set-api/cli/templates/create/project/${templateName}/boilerplate/src/suite/a-home`,
  );
  for (const file of __replaceFiles) {
    const filePath = path.join(suiteHomeDest, file);
    let content = await fs.readFile(filePath, 'utf-8');
    for (const { from, to } of __replaceContents) {
      content = content.replaceAll(from, to);
    }
    await fs.writeFile(filePath, content, 'utf-8');
  }
}

async function versionTemplates() {
  await _versionTemplate('cabloy-basic');
  await _versionTemplate('cabloy-start');
  await _versionTemplateReplace('cabloy-start');
}

versionTemplates();
