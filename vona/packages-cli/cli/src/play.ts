import fse from 'fs-extra';
import path from 'node:path';

import { loadJSONFile } from './utils.ts';

export async function playAttach(projectPath: string, args: string[]) {
  const runId = process.env.VONA_TEST_RUN_ID;
  if (runId) {
    const match = /^(\d{14})-[a-f0-9]{8}$/.exec(runId);
    const timestamp = match?.[1];
    const date = timestamp
      ? new Date(
          `${timestamp.slice(0, 4)}-${timestamp.slice(4, 6)}-${timestamp.slice(6, 8)}T${timestamp.slice(8, 10)}:${timestamp.slice(10, 12)}:${timestamp.slice(12, 14)}Z`,
        )
      : undefined;
    if (
      process.env.META_MODE !== 'test' ||
      !timestamp ||
      !date ||
      Number.isNaN(date.getTime()) ||
      date.toISOString().slice(0, 19).replace(/[-:T]/g, '') !== timestamp
    ) {
      throw new Error(
        'VONA_TEST_RUN_ID requires test mode and a UTC timestamp plus eight hex digits',
      );
    }
  }
  const dataDir = runId ? `.app-test-${runId}` : '.app';
  const runtimeFile = path.join(projectPath, dataDir, 'runtime/-.json');
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
