import fse from 'fs-extra';
import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

import { removeSpecialFiles } from './utils.ts';

async function _versionTemplate(templateName: string) {
  // cp cabloy-start
  const suiteHomeSrc = path.resolve(fileURLToPath(import.meta.url), '../../src/suite/cabloy-start');
  const suiteHomeDest = path.resolve(
    fileURLToPath(import.meta.url),
    `../../packages-cli/cli-set-api/cli/templates/create/project/${templateName}/boilerplate/src/suite/cabloy-start`,
  );
  await fse.remove(suiteHomeDest);
  await fse.copy(suiteHomeSrc, suiteHomeDest);
  await fse.remove(path.join(suiteHomeDest, 'node_modules'));
  for (const moduleName of ['start-siteadmin', 'start-siteweb']) {
    await removeSpecialFiles(suiteHomeDest, moduleName, ['assets', 'zovaRest']);
  }
}

async function versionTemplates() {
  await _versionTemplate('cabloy-start');
}

versionTemplates();
