import { writeFile } from 'node:fs/promises';
import path from 'node:path';
import { pathToFileURL } from 'node:url';

// Copied and run standalone in the private workspace. Persist only this allowlist,
// never the loaded environment or application stdout as a control channel.
const [appDir, flavor, resultFile] = process.argv.slice(2);
if (!appDir || !flavor || !resultFile)
  throw new Error('Output plan requires a snapshot, flavor and result file');
const loaderUrl = pathToFileURL(path.join(appDir, 'packages-utils/zova-vite/src/configUtils.ts'));
const { createConfigUtils } = await import(loaderUrl.href);
createConfigUtils(
  { flavor, mode: 'production', appMode: 'ssr' },
  { appDir, runtimeDir: '.zova' },
).loadEnvs();
const plan = {
  appVersion: process.env.APP_VERSION ?? '',
  buildOutDir: process.env.BUILD_OUTDIR ?? '',
  buildCopyDist: process.env.BUILD_COPY_DIST ?? '',
  buildCopyRelease: process.env.BUILD_COPY_RELEASE ?? '',
  buildRestCopyDist: process.env.BUILD_REST_COPY_DIST ?? '',
};
const json = JSON.stringify(plan);
if (Buffer.byteLength(json, 'utf8') > 64 * 1024)
  throw new Error('Output-plan result exceeds 64 KiB');
await writeFile(resultFile, json, { flag: 'wx', mode: 0o600 });
