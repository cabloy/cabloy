import type { VonaMetaFlavor } from '@cabloy/module-info';

import boxen from 'boxen';
import chalk from 'chalk';
import { createRequire } from 'node:module';
import semver from 'semver';
import urllib from 'urllib';

import { getRegistry } from './registry.ts';

const boxenOptions = {
  padding: 1,
  margin: 1,
  align: 'center',
  borderColor: 'yellow',
  borderStyle: 'round',
};

export async function checkForUpdates(packageName: string) {
  try {
    // version old
    const require = createRequire(import.meta.url);
    const pkg = require(`${packageName}/package.json`);
    const versionOld = pkg.version;
    // version new
    const info = await getPackageInfo(packageName);
    const versionNew = info.version;
    // check
    const lt = semver.lt(versionOld, versionNew);
    if (!lt) return;
    // log
    let message = `[${chalk.keyword('cyan')(packageName)}] new version available: ${chalk.keyword(
      'yellow',
    )(versionOld)} → ${chalk.keyword('orange')(versionNew)}`;
    message += `\nRun ${chalk.keyword('orange')(`> pnpm add -g ${packageName} <`)} to update!`;
    // eslint-disable-next-line
    console.log('\n' + boxen(message, boxenOptions as any));
  } catch (_err) {
    // donothing
  }
}

export async function getPackageInfo(packageName: string) {
  const registry = await getRegistry();
  const result = await urllib.request(`${registry}${packageName}/latest`, {
    dataType: 'json',
    followRedirect: true,
    maxRedirects: 5,
  });
  if (result.status !== 200) {
    const message = `npm info ${packageName} got error: ${result.status}, ${result.data.reason}`;
    throw new Error(message);
  }
  return result.data;
}

export function patchFlavor(
  flavor?: VonaMetaFlavor | VonaMetaFlavor[],
): VonaMetaFlavor | undefined {
  return Array.isArray(flavor) ? flavor[flavor.length - 1] : flavor;
}
