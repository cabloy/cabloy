import type { IGlobBeanFile, OnionMetaMeta, OnionSceneMeta } from '@cabloy/module-info';

import { toUpperCaseFirstChar } from '@cabloy/word-utils';

export async function generateScopeResourcesMeta(
  globFiles: IGlobBeanFile[],
  metaName: string,
  _metaMeta: OnionMetaMeta,
  _sceneName: string,
  _sceneMeta: OnionSceneMeta,
  _moduleName: string,
  _modulePath: string,
) {
  if (globFiles.length === 0) return '';
  // combine
  const content = `/** meta ${metaName}: begin */
import { Meta${toUpperCaseFirstChar(metaName)} } from '../bean/meta.${metaName}.js';
/** meta ${metaName}: end */
`;
  return content;
}
