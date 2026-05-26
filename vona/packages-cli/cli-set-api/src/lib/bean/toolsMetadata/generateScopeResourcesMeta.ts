import type { OnionMetaMeta, OnionSceneMeta } from '@cabloy/module-info';

import { toUpperCaseFirstChar } from '@cabloy/word-utils';
import { globby } from 'globby';

export async function generateScopeResourcesMeta(
  metaName: string,
  _metaMeta: OnionMetaMeta,
  _sceneName: string,
  _sceneMeta: OnionSceneMeta,
  _moduleName: string,
  modulePath: string,
) {
  const files = await globby(`src/bean/meta.${metaName}.ts`, { cwd: modulePath });
  if (files.length === 0) return '';
  // combine
  const content = `/** meta ${metaName}: begin */
import type { Meta${toUpperCaseFirstChar(metaName)} } from '../bean/meta.${metaName}.ts';
/** meta ${metaName}: end */
`;
  return content;
}
