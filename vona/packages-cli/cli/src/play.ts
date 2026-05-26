import fse from 'fs-extra';
import path from 'node:path';

import { loadJSONFile } from './utils.ts';

export async function playAttach(projectPath: string, args: string[]) {
  const runtimeFile = path.join(projectPath, '.app/runtime/-.json');
  if (!fse.existsSync(runtimeFile)) throw new Error('dev server not running');
  // body
  const body = { args, projectPath };
  //
  const runtime = await loadJSONFile(runtimeFile);
  const runtimeCore = runtime['a-core'];
  const runtimeUser = runtime['a-user'];
  const result = await fetch(`${runtimeCore?.protocol}://${runtimeCore?.host}/api/play`, {
    method: 'post',
    headers: {
      'content-type': 'application/json',
      'authorization': `Bearer ${runtimeUser?.accessToken}`,
    },
    body: JSON.stringify(body),
  });
  if (result.status !== 200) {
    const message = `error: ${result.status}, ${result.statusText}`;
    throw new Error(message);
  }
  const resText = await result.text();
  const res = resText ? JSON.parse(resText) : undefined;
  if (!res) return;
  if (res.code !== 0) throw new Error(res.message);
  if (res.data !== undefined) {
    // eslint-disable-next-line no-console
    console.log(res.data);
  }
}
